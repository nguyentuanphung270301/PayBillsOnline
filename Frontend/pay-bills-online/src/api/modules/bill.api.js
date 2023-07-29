import privateClient from '../axiosClient/privateClient';

const billEndpoints = {
    getAll: '/bill/all',
    getById: (id) => `/bill/${id}`,
    getAllBill: '/bill/allbill',
    getService: (userId) => `/bill/getByUserId/${userId}`,
    getCable: (userId) => `/bill/getCableByUserId/${userId}`,
    deleteBill: (id) => `/bill/delete/${id}`,
    createBill: '/bill/create',
    updateBill: (id) => `/bill/update/${id}`,
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
    getById: async (id) => {
        try {
            const response = await privateClient.get(billEndpoints.getById(id))
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
    getCableByUserId: async (userId) => {
        try {
            const response = await privateClient.get(billEndpoints.getCable(userId))
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
    },
    updateBill: async (id,data) => {
        try {
            const response = await privateClient.put(billEndpoints.updateBill(id), data)
            return response
        }
        catch (error) {
            return error
        }
    }
}

export default billApis;