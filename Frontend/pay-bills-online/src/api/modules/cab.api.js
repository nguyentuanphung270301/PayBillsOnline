import privateClient from '../axiosClient/privateClient';

const cabEndpoints = {
    getAll: '/cabletv/all',
    deleteById: (id) => `/cabletv/delete/${id}`,
    getById: (id) => `/cabletv/${id}`,
    getByServiceId: (userId) => `/cabletv/getserviceid/${userId}`,
    createCab: '/cabletv/create',
    updateCab: (id) => `/cabletv/update/${id}`,
}

const cabApis = {
    getAll: async () => {
        try {
            const response = await privateClient.get(cabEndpoints.getAll)
            return response
        }
        catch (error) {
            return error
        }
    },
    deleteCab: async (id) => {
        try {
            const response = await privateClient.delete(cabEndpoints.deleteById(id))
            return response
        }
        catch (error) {
            return error
        }
    },
    getById: async (id) => {
        try {
            const response = await privateClient.get(cabEndpoints.getById(id))
            return response
        }
        catch (error) {
            return error
        }
    },
    getByServiceId: async (userId) => {
        try {
            const response = await privateClient.get(cabEndpoints.getByServiceId(userId))
            return response
        }
        catch (error) {
            return error
        }
    },
    createCab: async (data) => {
        try {
            const response = await privateClient.post(cabEndpoints.createCab, data)
            return response
        }
        catch (error) {
            return error
        }
    },
    updateCab: async (id, data) => {
        try {
            const response = await privateClient.put(cabEndpoints.updateCab(id), data)
            return response
        }
        catch (error) {
            return error
        }
    }
}

export default cabApis;