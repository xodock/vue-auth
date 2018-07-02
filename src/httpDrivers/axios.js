const constructor = function (store, instance) {
    if (!instance)
        throw new Error("Please, provide a valid vue-resource instance!");
    return {
        patchInstance() {
            if (store.getters.accessToken)
                instance.defaults.headers.Authorization = "Bearer " + store.getters.accessToken;
            else
                delete instance.defaults.headers.Authorization;
            return instance;
        },

        responseData(response) {
            return response.data;
        },
        getInstance() {
            return instance;
        },
        methods: {
            post: instance.post,
            get: instance.get,
            delete: instance.delete
        }
    }
}
export default constructor