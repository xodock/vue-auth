const constructor = function (instance) {
    if (!instance)
        throw new Error("Please, provide a valid vue-resource instance!");
    return {
        patchInstance(accessToken) {
            if (accessToken)
                instance.defaults.headers.Authorization = "Bearer " + accessToken;
            else
                delete instance.defaults.headers.Authorization;
            return instance;
        },

        responseData(response) {
            return response.data;
        },

        methods: {
            post: () => {
                return instance.post
            },
            get: () => {
                return instance.post
            },
            delete: () => {
                return instance.delete
            }
        }
    }
}
export default constructor