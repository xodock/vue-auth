"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var constructor = function constructor(store, instance) {
    if (!instance) throw new Error("Please, provide a valid vue-resource instance!");
    return {
        patchInstance: function patchInstance() {
            if (store.getters.accessToken) instance.defaults.headers.Authorization = "Bearer " + store.getters.accessToken;else delete instance.defaults.headers.Authorization;
            return instance;
        },
        responseData: function responseData(response) {
            return response.data;
        },
        getInstance: function getInstance() {
            return instance;
        },

        methods: {
            post: instance.post,
            get: instance.get,
            delete: instance.delete
        }
    };
};
exports.default = constructor;