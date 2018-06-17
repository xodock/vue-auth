**Vue.js plugin to manage authentication in your app.**

WIP

Now you can use it only with Laravel Passport as API auth backend, and axios as http client.

To initialize plugin, you should create an axios instance (with your api base url) and vuex store
```
import vueLogin from 'vue-login';

const store = new Vuex.Store({
    ...
});

const http = axios.create({
  baseURL: 'https://api.example.com'
});

Vue.use(vueLogin, {
  store,
  axios: http,
  client_id: 1,
  client_secret: 'somesecret',
  loginURL: '/oauth/token',
  refreshURL: '/oauth/token',
  profileFetchURL: '/user/auth/profile'
});
```
Remember: you should use this `http` instance to make requests in future, because it will contain an auth headers, after user signed in;

Then just use it in any components:

```
this.$login.signIn(this.username, this.password).then(
    () => {
        console.log(this.profile);
    });
```

It brings into all your components a computeds:
`profile`, `isLoggedIn`, `userId`, `tokenExpiresInFromNow`
so feel free to use it.

Thats it. And your auth is persistant with localStorage.

Other methods:

`this.$login.signOut()` - just clears auth data

`this.$login.refresh()` - uses refresh_token to refresh access_token

