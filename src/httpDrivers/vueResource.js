const constructor = function (instance){
    if (!instance)
        throw new Error("Please, provide a valid vue-resource instance!");
    return {
        patchInstance(accessToken) {
            if (accessToken)
                instance.headers.common['Authorization'] = 'Bearer ' + accessToken;
            else
                delete instance.headers.common.Authorization;
            return instance;
        },

        responseData(response) {
            return response.body;
        },

        methods: {
            post: instance.post,
            get: instance.get,
            delete: instance.delete
        }
    }
}
export default constructor