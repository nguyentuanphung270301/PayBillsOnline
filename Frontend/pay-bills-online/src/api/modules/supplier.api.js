import privateClient from '../axiosClient/privateClient';


const supplierEndpoints = {
    getAll: '/supplier/all',
    deleteById: (id) => `/supplier/delete/${id}`,
    createSupplier: '/supplier/create',
    getById: (id) => `/supplier/${id}`,
    updateSupplier: (id) => `/supplier/update/${id}`
}

const supplierApis = {
    getAll: async () => {
        try {
            const response = await privateClient.get(supplierEndpoints.getAll)
            return response
        }
        catch (error) {
            return error
        }
    },
    deleteById: async (id) => {
        try {
            const response = await privateClient.delete(supplierEndpoints.deleteById(id))
            return response
        }
        catch (error) {
            return error
        }
    },
    createSupplier: async (data) => {
        try {
            const response = await privateClient.post(supplierEndpoints.createSupplier, data)
            return response
        }
        catch (error) {
            return error
        }
    },
    getById: async (id) => {
        try {
            const response = await privateClient.get(supplierEndpoints.getById(id))
            return response
        }
        catch (error) {
            return error
        }
    },
    updateSupplier: async (id, data) => {
        try {
            const response = await privateClient.put(supplierEndpoints.updateSupplier(id), data)
            return response
        }
        catch (error) {
            return error
        }
    }
}

export default supplierApis