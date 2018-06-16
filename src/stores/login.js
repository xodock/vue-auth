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
    tokenExpiresIn(state, getters) {
      return state.expires_in;
    },
    tokenExpiresInFromNow(state, getters) {
      let whenExpires = getters.tokenIssuedAt + getters.tokenExpiresIn;
      return whenExpires - (Math.floor(Date.now() / 1000));
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
    setAuthInfo({commit}, {access_token, refresh_token, expires_in}) {
      return new Promise((resolve, reject) => {
        commit('setAccessToken', access_token);
        commit('setRefreshToken', refresh_token);
        commit('setExpiresIn', expires_in);
        commit('setIssuedAt', (Date.now() / 1000));
        resolve()
      })
    },
    clearAuthInfo({commit}) {
      return new Promise((resolve, reject) => {
        commit('setAccessToken', null);
        commit('setRefreshToken', null);
        commit('setExpiresIn', null);
        commit('setIssuedAt', null);
        commit('setProfile', {});
        resolve();
      })
    },
    logout({commit, dispatch}) {
      return new Promise((resolve, reject) => {
        dispatch('clearAuthInfo').then(() => {
          resolve();
        });
      });
    },
    login({commit, dispatch}, {username, password}) {
      return new Promise((resolve, reject) => {
        Vue.login.requests.login(username, password)
          .then((data) => {
            dispatch('setAuthInfo', data.body)
              .then(() => {
                dispatch('fetchProfile')
                  .then(() => {
                    resolve();
                  })
                  .catch(() => {
                    reject();
                  });
              })
              .catch(error => {
                console.log(error);
                dispatch('logout').then(() => {
                  reject(error)
                });
              });
          })
          .catch(error => {
            console.log(error);
            dispatch('logout').then(() => {
              reject(error)
            });
          });
      });
    },
    authRefresh({commit, dispatch, getters}) {
      return new Promise((resolve, reject) => {
        Vue.login.requests.refresh(getters.refreshToken)
          .then((data) => {
            dispatch('setAuthInfo', data.body)
              .then(() => {
                dispatch('fetchProfile')
                  .then(() => {
                    resolve()
                  })
                  .catch(() => {
                    reject();
                  });
              })
              .catch(error => {
                console.warn(error);
                dispatch('logout').then(() => {
                  reject(error)
                });
              });
          })
          .catch(error => {
            console.warn(error);
            dispatch('logout').then(() => {
              reject(error)
            });
          });
      });
    },
    fetchProfile({commit, dispatch}) {
      return new Promise((resolve, reject) => {
        Vue.login.requests.fetchProfile()
          .then(response => {
            let profile = response.body.data;
            if (profile) {
              commit('setProfile', response.body.data);
              resolve(response.body.data);
            } else {
              reject(response)
            }
          })
          .catch(error => {
            console.warn(error);
            dispatch('logout').then(() => {
              reject(error)
            });
          });
      });
    }
  }
};
export default auth;
