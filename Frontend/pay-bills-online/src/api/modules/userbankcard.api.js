import privateClient from '../axiosClient/privateClient';

const userBankCardEndpoint = {
    getByUserId: (userId) => `/userbankcard/userId/${userId}`,
    deleteById: (id) => `/userbankcard/delete/${id}`
}

const userBankCardApis = {
    getByUserId: async (userId) => {
        try {
            const response = await privateClient.get(userBankCardEndpoint.getByUserId(userId))
            return response
        }
        catch (error) {
            return error
        }
    },
    deleteById: async (id) => {
        try {
            const response = await privateClient.delete(userBankCardEndpoint.deleteById(id))
            return response
        }
        catch (error) {
            return error
        }
    }
}

export default userBankCardApis