const constructor = function (store, instance) {
    if (!instance)
        throw new Error("Please, provide a valid vue-resource instance!");
    return {
        patchInstance() {
            instance.interceptors.push(function (request) {
                if (store.getters.accessToken)
                    request.headers.set('Authorization', 'Bearer ' + store.getters.accessToken);
            });
            return instance;
        },

        responseData(response) {
            return response.body;
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