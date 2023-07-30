import privateClient from '../axiosClient/privateClient';

const userAuthEndpoints = {
    getByUserId: (userId) => `/authorization/userId/${userId}`,
    updateStatus: (userId) => `/authorization/updateStatus/${userId}`,
    getAllAuth: '/authorization/allauth',
    createAuth: '/authorization/create',
    deleteAuth:(id) => `/authorization/delete/${id}`,
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
    },
    getAllAuth: async () => {
        try {
            const response = await privateClient.get(userAuthEndpoints.getAllAuth)
            return response
        }
        catch (error) {
            return error
        }
    },
    createAuth: async (data) => {
        try{
            const response = await privateClient.post(userAuthEndpoints.createAuth,data)
            return response
        }
        catch (error) {
            return error
        }
    },
    deleteAuth: async (id) => {
        try {
            const response = await privateClient.delete(userAuthEndpoints.deleteAuth(id))
            return response
        }
        catch (error) {
            return error
        }
    }
}

export default userAuthApis