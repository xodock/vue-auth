'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  parseTokenResponse: function parseTokenResponse(responseData) {
    var access_token = responseData.access_token;
    var refresh_token = responseData.refresh_token;
    var expires_in = responseData.expires_in;
    var issued_at = Math.floor(Date.now() / 1000);
    return { access_token: access_token, refresh_token: refresh_token, expires_in: expires_in, issued_at: issued_at };
  },
  login: function login(username, password, client_id, client_secret, url, method) {
    url = url ? url : '/oauth/token';
    method = method ? String(method).toLowerCase() : 'post';

    var body = {
      'grant_type': 'password',
      'client_id': client_id,
      'client_secret': client_secret,
      'scope': '*'
    };

    body['username'] = username;
    body['password'] = password;

    return _vue2.default.login.httpDriver.methods[method](_vue2.default.login.httpInstance)(url, body);
  },
  refresh: function refresh(refresh_token, client_id, client_secret, url, method) {
    url = url ? url : '/oauth/token';
    method = method ? String(method).toLowerCase() : 'post';

    var body = {
      'grant_type': 'refresh_token',
      'client_id': client_id,
      'client_secret': client_secret,
      'refresh_token': refresh_token,
      'scope': '*'
    };

    return _vue2.default.login.httpDriver.methods[method](_vue2.default.login.httpInstance)(url, body);
  },
  logout: function logout(access_token, url, method) {
    var jti = parseJwt(access_token).jti;
    if (!jti) {
      return Promise.reject();
    }
    url = url ? url : '/oauth/tokens/' + jti;
    method = method ? String(method).toLowerCase() : 'delete';

    return _vue2.default.login.httpDriver.methods[method](_vue2.default.login.httpInstance)(url);
  }
};

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}