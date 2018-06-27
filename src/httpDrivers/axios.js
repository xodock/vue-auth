export default {

  patchInstance(axios, accessToken) {
    if (!axios)
      throw new Error("Please, provide a valid axios instance!");
    if (accessToken)
      axios.defaults.headers.Authorization = "Bearer " + accessToken;
    else
      delete axios.defaults.headers.Authorization;
    return axios;
  },

  responseData(response) {
    return response.data;
  },

  methods: {
    post(axios) {
      return axios['post']
    },
    get(axios) {
      return axios['get']
    },
    delete(axios) {
      return axios['delete']
    }
  }

}
