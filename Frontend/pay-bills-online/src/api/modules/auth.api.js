import publicClient from '../axiosClient/publicClient'

const authEndpoints = {
    login: '/auth/login',
    register: '/auth/register',
}

const authApis = {
    login: async (data) => {
        try {
            const response = await publicClient.post(authEndpoints.login, data)
            console.log(response)
            return response
        }
        catch (error) {
            console.log(error)
            return error
        }
    },

    register: async (data) => {
        try {
            const response = await publicClient.post(authEndpoints.register, data)
            console.log(response)
            return response
        }
        catch (error) {
            console.log(error)
            return error
        }
    },
}

export default authApis