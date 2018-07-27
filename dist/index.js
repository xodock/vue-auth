'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _login = require('./stores/login');

var _login2 = _interopRequireDefault(_login);

var _vuex = require('vuex');

var _axios = require('./httpDrivers/axios');

var _axios2 = _interopRequireDefault(_axios);

var _passport = require('./apiDrivers/passport');

var _passport2 = _interopRequireDefault(_passport);

var _localStorage = require('./persistDrivers/localStorage');

var _localStorage2 = _interopRequireDefault(_localStorage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Login = {
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
    afterTokenChange: null,
    usernameField: null,
    passwordField: null,
    clientId: null,
    clientSecret: null,
    patchInstance: function patchInstance() {
        return this.httpInstance = this.httpDriver.patchInstance();
    },
    patchStore: function patchStore(store) {
        if (!store) throw new Error("Please, provide Vuex store");
        this.store = store;
        this.store.registerModule('login', _login2.default);
        if (this.persistDriver) this.persistDriver.patchStore(this.store, 'login');
        return this.store;
    },
    setURLs: function setURLs(_ref) {
        var loginURL = _ref.loginURL,
            refreshURL = _ref.refreshURL,
            logoutURL = _ref.logoutURL,
            profileFetchURL = _ref.profileFetchURL;

        this.loginURL = loginURL;
        this.logoutURL = logoutURL;
        this.refreshURL = refreshURL;
        this.profileFetchURL = profileFetchURL;
    },
    setFieldNames: function setFieldNames(_ref2) {
        var usernameField = _ref2.usernameField,
            passwordField = _ref2.passwordField;

        this.usernameField = usernameField || 'username';
        this.passwordField = passwordField || 'password';
    },
    setAPICredentials: function setAPICredentials(_ref3) {
        var client_id = _ref3.client_id,
            client_secret = _ref3.client_secret;

        // if (!client_id || !client_secret)
        //     throw new Error("You should provide client Id and client secret");
        this.clientId = client_id;
        this.clientSecret = client_secret;
    },

    requests: {
        login: function login(username, password, method) {
            return Login.apiDriver.login(username, password, Login.clientId, Login.clientSecret, Login.loginURL, method);
        },
        logout: function logout(accessToken, method) {
            if (!Login.logout) {
                return new Promise.resolve();
            }
            return Login.apiDriver.logout(accessToken, Login.logoutURL, method);
        },
        refresh: function refresh(refreshToken, method) {
            return Login.apiDriver.refresh(refreshToken, Login.clientId, Login.clientSecret, Login.refreshURL, method);
        },
        fetchProfile: function fetchProfile(method) {
            method = method ? String(method).toLowerCase() : 'get';
            return Login.httpDriver.getInstance()[method](Login.profileFetchURL);
        }
    },
    signIn: function signIn(username, password) {
        return Login.store.dispatch('login', { username: username, password: password });
    },
    signOut: function signOut() {
        return Login.store.dispatch('logout');
    },
    refresh: function refresh() {
        return Login.store.dispatch('authRefresh');
    },
    mapLoginGetters: function mapLoginGetters() {
        return (0, _vuex.mapGetters)(['profile', 'isLoggedIn', 'userId', 'tokenExpiresInFromNow']);
    },
    getAxiosInstance: function getAxiosInstance() {
        return Login.httpInstance;
    },
    setAuthInfo: function setAuthInfo(tokenResponse) {
        return Login.store.dispatch('setAuthInfo', Login.apiDriver.parseTokenResponse(Login.httpDriver.responseData(tokenResponse)));
    }
};
var Plugin = {
    install: function install(Vue, _ref4) {
        var store = _ref4.store,
            axios = _ref4.axios,
            http = _ref4.http,
            httpDriver = _ref4.httpDriver,
            client_id = _ref4.client_id,
            client_secret = _ref4.client_secret,
            loginURL = _ref4.loginURL,
            refreshURL = _ref4.refreshURL,
            logoutURL = _ref4.logoutURL,
            logout = _ref4.logout,
            profileFetchURL = _ref4.profileFetchURL,
            usernameField = _ref4.usernameField,
            passwordField = _ref4.passwordField,
            processProfileResponse = _ref4.processProfileResponse,
            afterTokenChange = _ref4.afterTokenChange,
            persist = _ref4.persist;

        Login.logout = !!(typeof logout === "undefined" ? true : logout);
        if (axios) {
            Login.httpInstance = axios;
            Login.httpDriver = (0, _axios2.default)(store, Login.httpInstance);
        } else if (http) {
            Login.httpInstance = http;
            if (!httpDriver) Login.httpDriver = (0, _axios2.default)(store, Login.httpInstance);else Login.httpDriver = httpDriver(store, Login.httpInstance);
        }
        if (typeof persist === "undefined" || persist === true) {
            //TODO:: implement driver definition logic
            Login.persistDriver = _localStorage2.default;
        }
        if (true) {
            //TODO:: implement driver definition logic
            Login.apiDriver = _passport2.default;
        }
        Login.processProfileResponse = typeof processProfileResponse !== 'undefined' ? processProfileResponse : function (response) {
            return Login.httpDriver.responseData(response).data;
        };
        Login.afterTokenChange = typeof afterTokenChange !== 'undefined' ? afterTokenChange : function () {};
        Login.patchStore(store);
        Login.patchInstance();
        Login.setURLs({ loginURL: loginURL, refreshURL: refreshURL, logoutURL: logoutURL, profileFetchURL: profileFetchURL });
        Login.setFieldNames({ usernameField: usernameField, passwordField: passwordField });
        Login.setAPICredentials({ client_id: client_id, client_secret: client_secret });
        Vue.prototype.$login = Vue.login = Login;
        // if (Vue.login.store.getters.isLoggedIn) {
        //     Login.refresh();
        // }
        Vue.mixin({
            computed: _extends({}, Login.mapLoginGetters())
        });
    }
};

exports.default = Plugin;