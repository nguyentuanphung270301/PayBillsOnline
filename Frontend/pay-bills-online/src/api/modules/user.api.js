import privateClient from '../axiosClient/privateClient'
import publicClient from '../axiosClient/publicClient'

const userEndpoints = {
    getUserByUsername: (username) => `/user/username/${username}`,
    getUserByEmail: (email) => `/user/email/${email}`,
    updatePassword: '/user/updatepassword'
}

const userApis = {
    getUserByUsername: async (username) => {
        try {
            const response = await privateClient.get(userEndpoints.getUserByUsername(username))
            return response
        }
        catch (error) {
            return error
        }
    },
    getUserByEmail: async (email) => {
        try {
            const response = await publicClient.get(userEndpoints.getUserByEmail(email))
            return response
        }
        catch (error) {
            return error
        }
    },
    updatePassword: async (data) => {
        try {
            const response = await publicClient.put(userEndpoints.updatePassword, data)
            return response
        }
        catch (error) {
            return error
        }
    }
}

export default userApis