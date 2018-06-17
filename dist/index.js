'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _login = require('./stores/login');

var _login2 = _interopRequireDefault(_login);

var _vuexPersist = require('vuex-persist');

var _vuexPersist2 = _interopRequireDefault(_vuexPersist);

var _vuex = require('vuex');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Login = {
  instance: null,
  store: null,
  loginURL: null,
  refreshURL: null,
  profileFetchURL: null,
  usernameField: null,
  passwordField: null,
  clientId: null,
  clientSecret: null,
  patchInstance: function patchInstance(instance) {
    if (!instance) throw new Error("Please, provide an axios instance!");
    this.instance = instance;
    if (Login.store && Login.store.getters.accessToken) this.instance.defaults.headers.Authorization = "Bearer " + Login.store.getters.accessToken;else delete this.instance.defaults.headers.Authorization;
    return this.instance;
  },
  patchStore: function patchStore(store) {
    if (!store) throw new Error("Please, provide Vuex store");
    this.store = store;
    this.store.registerModule('login', _login2.default);
    var vuexLocal = new _vuexPersist2.default({
      key: 'VueLoginStore',
      storage: window.localStorage,
      modules: ['login']
    });
    vuexLocal.plugin(this.store);
    return this.store;
  },
  setURLs: function setURLs(_ref) {
    var loginURL = _ref.loginURL,
        refreshURL = _ref.refreshURL,
        profileFetchURL = _ref.profileFetchURL;

    if (!loginURL || !refreshURL || !profileFetchURL) throw new Error("You should provide URLs to login, refresh token and fetch profile (relative to baseURL)");
    this.loginURL = loginURL;
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

    if (!client_id || !client_secret) throw new Error("You should provide client Id and client secret");
    this.clientId = client_id;
    this.clientSecret = client_secret;
  },

  requests: {
    login: function login(username, password, method) {
      method = method ? String(method).toLowerCase() : 'post';
      var body = {
        'grant_type': 'password',
        'client_id': Login.clientId,
        'client_secret': Login.clientSecret,
        'scope': '*'
      };
      body[Login.usernameField] = username;
      body[Login.passwordField] = password;
      return Login.instance[method](Login.loginURL, body);
    },
    refresh: function refresh(refreshToken, method) {
      method = method ? String(method).toLowerCase() : 'post';
      var body = {
        'grant_type': 'refresh_token',
        'client_id': Login.clientId,
        'client_secret': Login.clientSecret,
        'refresh_token': refreshToken,
        'scope': '*'
      };
      return Login.instance[method](Login.refreshURL, body);
    },
    fetchProfile: function fetchProfile(method) {
      method = method ? String(method).toLowerCase() : 'get';
      return Login.instance[method](Login.profileFetchURL);
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
    return Login.instance;
  }
};
var Plugin = {
  install: function install(Vue, _ref4) {
    var store = _ref4.store,
        axios = _ref4.axios,
        client_id = _ref4.client_id,
        client_secret = _ref4.client_secret,
        loginURL = _ref4.loginURL,
        refreshURL = _ref4.refreshURL,
        profileFetchURL = _ref4.profileFetchURL,
        usernameField = _ref4.usernameField,
        passwordField = _ref4.passwordField;

    Login.patchStore(store);
    Login.patchInstance(axios);
    Login.setURLs({ loginURL: loginURL, refreshURL: refreshURL, profileFetchURL: profileFetchURL });
    Login.setFieldNames({ usernameField: usernameField, passwordField: passwordField });
    Login.setAPICredentials({ client_id: client_id, client_secret: client_secret });
    Vue.prototype.$login = Vue.login = Login;
    Vue.mixin({
      computed: _extends({}, Login.mapLoginGetters())
    });
  }
};

exports.default = Plugin;