"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var constructor = function constructor(instance) {
    if (!instance) throw new Error("Please, provide a valid vue-resource instance!");
    return {
        patchInstance: function patchInstance(accessToken) {
            if (accessToken) instance.defaults.headers.Authorization = "Bearer " + accessToken;else delete instance.defaults.headers.Authorization;
            return instance;
        },
        responseData: function responseData(response) {
            return response.data;
        },


        methods: {
            post: function post() {
                return instance.post;
            },
            get: function get() {
                return instance.post;
            },
            delete: function _delete() {
                return instance.delete;
            }
        }
    };
};
exports.default = constructor;