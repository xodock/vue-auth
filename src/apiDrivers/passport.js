import Vue from 'vue';

export default {
  parseTokenResponse(responseData) {
    let access_token = responseData.access_token;
    let refresh_token = responseData.refresh_token;
    let expires_in = responseData.expires_in;
    let issued_at = Math.floor(Date.now() / 1000);
    return {access_token, refresh_token, expires_in, issued_at}
  },

  login(username, password, client_id, client_secret, url, method) {
    url = url ? url : 'oauth/token';
    method = method ? String(method).toLowerCase() : 'post';

    let body = {
      'grant_type': 'password',
      'client_id': client_id,
      'client_secret': client_secret,
      'scope': '*'
    };

    body['username'] = username;
    body['password'] = password;

    return (Vue.login.httpDriver.methods[method])(url, body);
  },
  refresh(refresh_token, client_id, client_secret, url, method) {
    url = url ? url : 'oauth/token';
    method = method ? String(method).toLowerCase() : 'post';

    let body = {
      'grant_type': 'refresh_token',
      'client_id': client_id,
      'client_secret': client_secret,
      'refresh_token': refresh_token,
      'scope': '*'
    };

    return (Vue.login.httpDriver.methods[method])(url, body);
  },
  logout(access_token, url, method) {
    let jti = parseJwt(access_token).jti;
    if (!jti) {
      return Promise.reject()
    }
    url = url ? url : 'oauth/tokens/' + jti;
    method = method ? String(method).toLowerCase() : 'delete';

    return (Vue.login.httpDriver.methods[method])(url);
  }
}
function parseJwt (token) {
  let base64Url = token.split('.')[1];
  let base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}
