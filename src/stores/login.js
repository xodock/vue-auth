import Vue from 'vue';

const auth = {
    state: {
        access_token: null,
        refresh_token: null,
        expires_in: null,
        issued_at: null,
        profile: {}
    },
    getters: {
        accessToken(state) {
            return state.access_token;
        },
        refreshToken(state) {
            return state.refresh_token;
        },
        tokenIssuedAt(state, getters) {
            return state.issued_at;
        },
        tokenLifeTime(state, getters) {
            return state.expires_in;
        },
        tokenExpiresAt(state, getters) {
            if (!getters.tokenIssuedAt || !getters.tokenLifeTime)
                return 0;
            return getters.tokenIssuedAt + getters.tokenLifeTime;
        },
        tokenExpiresInFromNow(state, getters) {
            if (!getters.tokenExpiresAt)
                return 0;
            return getters.tokenExpiresAt - (Math.floor(Date.now() / 1000));
        },
        isLoggedIn(state, getters) {
            let access_token = getters.accessToken;
            let notExpired = (getters.tokenExpiresInFromNow >= 60);
            return !!(access_token && notExpired);
        },
        profile(state) {
            return state.profile;
        },
        userId(state) {
            return state.profile.id
        }
    },
    mutations: {
        setAccessToken(state, access_token) {
            state.access_token = access_token;
            Vue.login.patchInstance();
            Vue.login.afterTokenChange();
        },
        setRefreshToken(state, refresh_token) {
            state.refresh_token = refresh_token;
        },
        setIssuedAt(state, issued_at) {
            state.issued_at = issued_at;
        },
        setExpiresIn(state, expires_in) {
            state.expires_in = expires_in;
        },
        setProfile(state, profile) {
            state.profile = profile;
        }
    },
    actions: {
        setAuthInfo({commit, dispatch}, {access_token, refresh_token, expires_in, issued_at}) {
            commit('setAccessToken', access_token);
            commit('setRefreshToken', refresh_token);
            commit('setExpiresIn', expires_in);
            commit('setIssuedAt', issued_at);
            return dispatch('fetchProfile')
        },
        clearAuthInfo({commit}) {
            commit('setAccessToken', null);
            commit('setRefreshToken', null);
            commit('setExpiresIn', null);
            commit('setIssuedAt', null);
            commit('setProfile', {});
            return Promise.resolve();
        },
        logout({commit, dispatch, getters}) {
            return Vue.login.requests.logout(getters.accessToken)
                .then(() => dispatch('clearAuthInfo'))
                .catch(() => dispatch('clearAuthInfo'))
        },
        login({commit, dispatch}, {username, password}) {
            return Vue.login.requests.login(username, password)
                .then(response => dispatch('setAuthInfo', Vue.login.apiDriver.parseTokenResponse(Vue.login.httpDriver.responseData(response))))
                .catch(error => {
                    dispatch('logout')
                        .then(() => {
                            throw error;
                        })
                        .catch(() => {
                            throw error;
                        });
                })
        },
        authRefresh({commit, dispatch, getters}) {
            return Vue.login.requests.refresh(getters.refreshToken)
                .then(response => dispatch('setAuthInfo', Vue.login.apiDriver.parseTokenResponse(Vue.login.httpDriver.responseData(response))))
                .catch(error => {
                    dispatch('logout')
                        .then(() => {
                            throw error;
                        })
                        .catch(() => {
                            throw error;
                        });
                })
        },
        fetchProfile({commit, dispatch}) {
            return Vue.login.requests.fetchProfile()
                .then(response => {
                    let profile = Vue.login.processProfileResponse(response);
                    if (profile) {
                        commit('setProfile', profile);
                        return Promise.resolve(profile);
                    } else {
                        throw new Error('Profile fetch failed. Response:' + JSON.stringify(response));
                    }
                })
                .catch(error => {
                    dispatch('logout')
                        .then(() => {
                            throw error;
                        })
                        .catch(() => {
                            throw error;
                        });
                })
        }
    }
};
export default auth;
