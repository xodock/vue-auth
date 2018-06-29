import VueLoginStoreModule from './stores/login'
import {mapGetters} from 'vuex';
import axiosHttpDriver from './httpDrivers/axios'
import passportApiDriver from './apiDrivers/passport'
import localStoragePersistDriver from './persistDrivers/localStorage'

const Login = {
    persistDriver: null,
    apiDriver: null,
    httpDriver: null,
    httpInstance: null,
    store: null,
    loginURL: null,
    refreshURL: null,
    logoutURL: null,
    profileFetchURL: null,
    processProfileResponse: null,
    usernameField: null,
    passwordField: null,
    clientId: null,
    clientSecret: null,
    patchInstance(accessToken) {
        return this.httpInstance = this.httpDriver.patchInstance(this.httpInstance, Login.store.getters.accessToken);
    },
    patchStore(store) {
        if (!store)
            throw new Error("Please, provide Vuex store");
        this.store = store;
        this.store.registerModule('login', VueLoginStoreModule);
        this.persistDriver.patchStore(this.store, 'login');
        return this.store;
    },
    setURLs({loginURL, refreshURL, logoutURL, profileFetchURL}) {
        this.loginURL = loginURL;
        this.logoutURL = logoutURL;
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
            return Login.apiDriver.login(username, password, Login.clientId, Login.clientSecret, Login.loginURL, method)
        },
        logout(accessToken, method) {
            return Login.apiDriver.logout(accessToken, Login.logoutURL, method)
        },
        refresh(refreshToken, method) {
            return Login.apiDriver.refresh(refreshToken, Login.clientId, Login.clientSecret, Login.refreshURL, method)
        },
        fetchProfile(method) {
            method = method ? String(method).toLowerCase() : 'get';
            return Login.httpDriver.methods[method](Login.httpInstance)(Login.profileFetchURL)
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
        return mapGetters(['profile', 'isLoggedIn', 'userId', 'tokenExpiresInFromNow'])
    },
    getAxiosInstance() {
        return Login.httpInstance;
    }
};
let Plugin = {
    install(Vue, {store, axios, http, httpDriver, client_id, client_secret, loginURL, refreshURL, logoutURL, profileFetchURL, usernameField, passwordField, processProfileResponse}) {
        if (axios) {
            Login.httpInstance = axios;
            Login.httpDriver = axiosHttpDriver;
        } else if (http) {
            Login.httpInstance = http;
        }
        if (!httpDriver)
            Login.httpDriver = axiosHttpDriver;
        else
            Login.httpDriver = httpDriver;
        if (true) {//TODO:: implement driver definition logic
            Login.persistDriver = localStoragePersistDriver;
        }
        if (true) {//TODO:: implement driver definition logic
            Login.apiDriver = passportApiDriver;
        }
        Login.processProfileResponse = (typeof processProfileResponse !== 'undefined') ? processProfileResponse : ((response) => Login.httpDriver.responseData(response).data);
        Login.patchStore(store);
        Login.patchInstance();
        Login.setURLs({loginURL, refreshURL, logoutURL, profileFetchURL});
        Login.setFieldNames({usernameField, passwordField});
        Login.setAPICredentials({client_id, client_secret});
        Vue.prototype.$login = Vue.login = Login;
        if (Vue.login.store.getters.isLoggedIn) {
            Login.refresh();
        }
        Vue.mixin({
            computed: {
                ...Login.mapLoginGetters()
            }
        });
    }
};

export default Plugin;
