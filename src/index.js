import VueLoginStoreModule from './stores/login'
import VuexPersistence from 'vuex-persist';
import {mapGetters} from 'vuex';

const Login = {
    instance: null,
    store: null,
    loginURL: null,
    refreshURL: null,
    profileFetchURL: null,
    usernameField: null,
    passwordField: null,
    clientId: null,
    clientSecret: null,
    patchInstance({baseURL}, instance) {
        if (!instance)
            throw new Error("Please, provide an axios instance!");
        this.instance = instance;
        if (baseURL)
            this.instance.defaults.baseURL = baseURL;
        if (Login.store.getters.accessToken)
            this.instance.defaults.headers.authorization = "Bearer " + Login.store.getters.accessToken;
        else
            delete this.instance.defaults.headers.authorization;
        return this.instance;
    },
    patchStore(store) {
        if (!store)
            throw new Error("Please, provide Vuex store");
        this.store = store;
        this.store.registerModule('login', VueLoginStoreModule);
        const vuexLocal = new VuexPersistence({
            storage: window.localStorage,
            modules: ['login']
        });
        vuexLocal.plugin(this.store);
        return this.store;
    },
    setURLs({loginURL, refreshURL, profileFetchURL}) {
        if (!loginURL || !refreshURL || !profileFetchURL)
            throw new Error("You should provide URLs to login, refresh token and fetch profile (relative to baseURL)");
        this.loginURL = loginURL;
        this.refreshURL = refreshURL;
        this.profileFetchURL = profileFetchURL;
    },
    setFieldNames({usernameField, passwordField}) {
        this.usernameField = usernameField || 'username';
        this.passwordField = passwordField || 'password';
    },
    setAPICredentials({client_id, client_secret}) {
        if (!client_id || !client_secret)
            throw new Error("You should provide client Id and client secret");
        this.clientId = client_id;
        this.clientSecret = client_secret;
    },
    requests: {
        login(username, password, method) {
            method = method ? String(method).toLowerCase() : 'post';
            let body = {
                'grant_type': 'password',
                'client_id': Login.clientId,
                'client_secret': Login.clientSecret,
                'scope': '*'
            };
            body[Login.usernameField] = username;
            body[Login.passwordField] = password;
            return Login.instance[method](Login.loginURL, body)
        },
        refresh(refreshToken, method) {
            method = method ? String(method).toLowerCase() : 'post';
            let body = {
                'grant_type': 'refresh_token',
                'client_id': Login.clientId,
                'client_secret': Login.clientSecret,
                'refresh_token': refreshToken,
                'scope': '*'
            };
            return Login.instance[method](Login.refreshURL, body)
        },
        fetchProfile(method) {
            method = method ? String(method).toLowerCase() : 'get';
            return Login.instance[method](Login.profileFetchURL)
        },
    },
    signIn(username, password) {
        return Login.store.dispatch('login', {username, password});
    },
    signOut() {
        return Login.store.dispatch('logout');
    },
    refresh() {
        return Login.store.dispatch('authRefresh');
    },
    mapLoginGetters() {
        return mapGetters(['profile', 'isLoggedIn', 'userId', 'expiresInFromNow'])
    },
    getAxiosInstance() {
        return Login.instance;
    }
};
let Plugin = {
    install(Vue, {store, axios, baseURL, client_id, client_secret, loginURL, refreshURL, profileFetchURL, usernameField, passwordField}) {
        Login.patchInstance({baseURL}, axios);
        Login.setURLs({loginURL, refreshURL, profileFetchURL});
        Login.setFieldNames({usernameField, passwordField});
        Login.setAPICredentials({client_id, client_secret});
        Login.patchStore(store);
        Vue.prototype.$login = Vue.login = Login;
    }
};

export default Plugin;