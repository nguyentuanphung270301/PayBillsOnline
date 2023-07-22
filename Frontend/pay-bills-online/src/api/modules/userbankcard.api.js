import privateClient from '../axiosClient/privateClient';

const userBankCardEndpoint = {
    getByUserId: (userId) => `/userbankcard/userId/${userId}`,
    deleteById: (id) => `/userbankcard/delete/${id}`,
    createBankCard: '/userbankcard/create',
    getById: (id) => `/userbankcard/${id}`
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
    },
    createBankCard: async (data) => {
        try {
            const response = await privateClient.post(userBankCardEndpoint.createBankCard, data)
            return response
        }
        catch (error) {
            return error
        }
    },
    getById: async (id) => {
        try {
            const response = await privateClient.get(userBankCardEndpoint.getById(id))
            return response
        }
        catch (error) {
            return error
        }
    }
}

export default userBankCardApis