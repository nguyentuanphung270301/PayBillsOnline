import privateClient from '../axiosClient/privateClient';

const billEndpoints = {
    getAll: '/bill/all',
    getAllBill: '/bill/allbill',
    getService: (userId) => `/bill/getByUserId/${userId}`,
    deleteBill: (id) => `/bill/delete/${id}`,
    createBill: '/bill/create',
}
const billApis = {
    getAll: async () => {
        try {
            const response = await privateClient.get(billEndpoints.getAll);
            return response
        }
        catch (error) {
            return error
        }
    },
    getAllBill: async () => {
        try {
            const response = await privateClient.get(billEndpoints.getAllBill)
            return response
        }
        catch (error) {
            return error
        }
    },
    getService: async (userId) => {
        try {
            const response = await privateClient.get(billEndpoints.getService(userId))
            return response
        }
        catch (error) {
            return error
        }
    },
    deleteBill: async (id) => {
        try {
            const response = await privateClient.delete(billEndpoints.deleteBill(id))
            return response
        }
        catch (error) {
            return error
        }
    },
    createBill: async (data) => {
        try {
            const response = await privateClient.post(billEndpoints.createBill, data);
            return response
        }
        catch (error) {
            return error
        }
    }
}

export default billApis;