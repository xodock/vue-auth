'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var auth = {
  state: {
    access_token: null,
    refresh_token: null,
    expires_in: null,
    issued_at: null,
    profile: {}
  },
  getters: {
    accessToken: function accessToken(state) {
      return state.access_token;
    },
    refreshToken: function refreshToken(state) {
      return state.refresh_token;
    },
    tokenIssuedAt: function tokenIssuedAt(state, getters) {
      return state.issued_at;
    },
    tokenLifeTime: function tokenLifeTime(state, getters) {
      return state.expires_in;
    },
    tokenExpiresAt: function tokenExpiresAt(state, getters) {
      if (!getters.tokenIssuedAt || !getters.tokenLifeTime) return 0;
      return getters.tokenIssuedAt + getters.tokenLifeTime;
    },
    tokenExpiresInFromNow: function tokenExpiresInFromNow(state, getters) {
      if (!getters.tokenExpiresAt) return 0;
      return getters.tokenExpiresAt - Math.floor(Date.now() / 1000);
    },
    isLoggedIn: function isLoggedIn(state, getters) {
      var access_token = getters.accessToken;
      var notExpired = getters.tokenExpiresInFromNow >= 60;
      return !!(access_token && notExpired);
    },
    profile: function profile(state) {
      return state.profile;
    },
    userId: function userId(state) {
      return state.profile.id;
    }
  },
  mutations: {
    setAccessToken: function setAccessToken(state, access_token) {
      state.access_token = access_token;
      _vue2.default.login.patchInstance(access_token);
    },
    setRefreshToken: function setRefreshToken(state, refresh_token) {
      state.refresh_token = refresh_token;
    },
    setIssuedAt: function setIssuedAt(state, issued_at) {
      state.issued_at = issued_at;
    },
    setExpiresIn: function setExpiresIn(state, expires_in) {
      state.expires_in = expires_in;
    },
    setProfile: function setProfile(state, profile) {
      state.profile = profile;
    }
  },
  actions: {
    setAuthInfo: function setAuthInfo(_ref, _ref2) {
      var commit = _ref.commit;
      var access_token = _ref2.access_token,
          refresh_token = _ref2.refresh_token,
          expires_in = _ref2.expires_in,
          issued_at = _ref2.issued_at;

      return new Promise(function (resolve, reject) {
        commit('setAccessToken', access_token);
        commit('setRefreshToken', refresh_token);
        commit('setExpiresIn', expires_in);
        commit('setIssuedAt', issued_at);
        resolve();
      });
    },
    clearAuthInfo: function clearAuthInfo(_ref3) {
      var commit = _ref3.commit;

      return new Promise(function (resolve, reject) {
        commit('setAccessToken', null);
        commit('setRefreshToken', null);
        commit('setExpiresIn', null);
        commit('setIssuedAt', null);
        commit('setProfile', {});
        resolve();
      });
    },
    logout: function logout(_ref4) {
      var commit = _ref4.commit,
          dispatch = _ref4.dispatch,
          getters = _ref4.getters;

      return new Promise(function (resolve, reject) {
        _vue2.default.login.requests.logout(getters.accessToken).then(function () {
          dispatch('clearAuthInfo').then(function () {
            resolve();
          });
        });
      });
    },
    login: function login(_ref5, _ref6) {
      var commit = _ref5.commit,
          dispatch = _ref5.dispatch;
      var username = _ref6.username,
          password = _ref6.password;

      return new Promise(function (resolve, reject) {
        _vue2.default.login.requests.login(username, password).then(function (response) {
          dispatch('setAuthInfo', _vue2.default.login.apiDriver.parseTokenResponse(_vue2.default.login.httpDriver.responseData(response))).then(function () {
            dispatch('fetchProfile').then(function () {
              resolve();
            }).catch(function () {
              reject();
            });
          }).catch(function (error) {
            console.log(error);
            dispatch('logout').then(function () {
              reject(error);
            });
          });
        }).catch(function (error) {
          console.log(error);
          dispatch('logout').then(function () {
            reject(error);
          });
        });
      });
    },
    authRefresh: function authRefresh(_ref7) {
      var commit = _ref7.commit,
          dispatch = _ref7.dispatch,
          getters = _ref7.getters;

      return new Promise(function (resolve, reject) {
        _vue2.default.login.requests.refresh(getters.refreshToken).then(function (response) {
          dispatch('setAuthInfo', _vue2.default.login.apiDriver.parseTokenResponse(_vue2.default.login.httpDriver.responseData(response))).then(function () {
            dispatch('fetchProfile').then(function () {
              resolve();
            }).catch(function () {
              reject();
            });
          }).catch(function (error) {
            console.warn(error);
            dispatch('logout').then(function () {
              reject(error);
            });
          });
        }).catch(function (error) {
          console.warn(error);
          dispatch('logout').then(function () {
            reject(error);
          });
        });
      });
    },
    fetchProfile: function fetchProfile(_ref8) {
      var commit = _ref8.commit,
          dispatch = _ref8.dispatch;

      return new Promise(function (resolve, reject) {
        _vue2.default.login.requests.fetchProfile().then(function (response) {
          var profile = _vue2.default.login.processProfileResponse(response);
          if (profile) {
            commit('setProfile', profile);
            resolve(profile);
          } else {
            reject(response);
          }
        }).catch(function (error) {
          console.warn(error);
          dispatch('logout').then(function () {
            reject(error);
          });
        });
      });
    }
  }
};
exports.default = auth;