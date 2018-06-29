export default {

    patchInstance(http, accessToken) {
        if (!http)
            throw new Error("Please, provide a valid vue-resource instance!");
        if (accessToken)
            http.headers.common['Authorization'] = 'Bearer ' + accessToken;
        else
            delete http.headers.common.Authorization;
        return http;
    },

    responseData(response) {
        return response.body;
    },

    methods: {
        post(http) {
            return http.post
        },
        get(http) {
            return http.post
        },
        delete(http) {
            return http.delete
        }
    }

}
