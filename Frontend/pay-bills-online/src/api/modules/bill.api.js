import privateClient from '../axiosClient/privateClient';

const billEndpoints = {
    getAll: '/bill/all',
    getById: (id) => `/bill/${id}`,
    getAllBill: '/bill/allbill',
    getService: `/bill/get/meter`,
    getCable: `/bill/get/cable`,
    deleteBill: (id) => `/bill/delete/${id}`,
    createBill: '/bill/create',
    updateBill: (id) => `/bill/update/${id}`,
    updatestatus: (id) => `/bill/updatestatus/${id}`,
    getBillMeterById: (id) => `/bill/getBillMeterById/${id}`,
    getBillCabById: (id) => `/bill/getBillCabById/${id}`,
    updateStatusBillPayment: (id) => `/bill/updatestatuspayment/${id}`,
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
    getService: async () => {
        try {
            const response = await privateClient.get(billEndpoints.getService)
            return response
        }
        catch (error) {
            return error
        }
    },
    getCableByUserId: async () => {
        try {
            const response = await privateClient.get(billEndpoints.getCable)
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
    updateBill: async (id, data) => {
        try {
            const response = await privateClient.put(billEndpoints.updateBill(id), data)
            return response
        }
        catch (error) {
            return error
        }
    },
    updateStatusBill: async (id, data) => {
        try {
            const response = await privateClient.put(billEndpoints.updatestatus(id), data)
            return response
        }
        catch (error) {
            return error
        }
    },
    getBillMeterById: async (id) => {
        try {
            const response = await privateClient.get(billEndpoints.getBillMeterById(id))
            return response
        }
        catch (error) {
            return error
        }
    },
    getBillCabById: async (id) => {
        try {
            const response = await privateClient.get(billEndpoints.getBillCabById(id))
            return response
        }
        catch (error) {
            return error
        }
    },
    updateStatusBillPayment: async (id, data) => {
        try {
            const response = await privateClient.put(billEndpoints.updateStatusBillPayment(id), data)
            return response
        }
        catch (error) {
            return error
        }
    }
}

export default billApis;