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