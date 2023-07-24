import privateClient from '../axiosClient/privateClient';

const userAuthEndpoints = {
    getByUserId: (userId) => `/authorization/userId/${userId}`,
    updateStatus: (userId) => `/authorization/updateStatus/${userId}`,
}

const userAuthApis = {
    getUserByUserId: async (userId) => {
        try {
            const response = await privateClient.get(userAuthEndpoints.getByUserId(userId))
            return response
        }
        catch (error) {
            return error
        }
    },
    updateStatus: async (userId) => {
        try {
            const response = await privateClient.put(userAuthEndpoints.updateStatus(userId))
            return response
        }
        catch (error) {
            return error
        }
    }
}

export default userAuthApis