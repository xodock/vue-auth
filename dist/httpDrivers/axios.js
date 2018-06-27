"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  patchInstance: function patchInstance(axios, accessToken) {
    if (!axios) throw new Error("Please, provide a valid axios instance!");
    if (accessToken) axios.defaults.headers.Authorization = "Bearer " + accessToken;else delete axios.defaults.headers.Authorization;
    return axios;
  },
  responseData: function responseData(response) {
    return response.data;
  },


  methods: {
    post: function post(axios) {
      return axios['post'];
    },
    get: function get(axios) {
      return axios['get'];
    },
    delete: function _delete(axios) {
      return axios['delete'];
    }
  }

};