import privateClient from '../axiosClient/privateClient';

const serviceEndpoints = {
    getAll: '/service/all',
    deleteService:(id) => `/service/delete/${id}`,
    createService: '/service/create',
    getById: (id) => `/service/${id}`,
    updateService: (id) => `/service/update/${id}`
}

const serviceApis = {
    getAll: async () => {
        try {
            const response = await privateClient.get(serviceEndpoints.getAll);
            return response
        }
        catch (error) {
            return error
        }
    },
    deleteService: async (id) => {
        try {
            const response = await privateClient.delete(serviceEndpoints.deleteService(id));
            return response
        }
        catch (error) {
            return error
        }
    },
    createService: async (data) => {
        try {
            const response = await privateClient.post(serviceEndpoints.createService, data);
            return response
        }
        catch (error) {
            return error
        }
    },
    getById: async (id) => {
        try {
            const response = await privateClient.get(serviceEndpoints.getById(id));
            return response
        }
        catch (error) {
            return error
        }
    },
    updateService: async (id, data) => {
        try {
            const response = await privateClient.put(serviceEndpoints.updateService(id), data);
            return response
        }
        catch (error) {
            return error
        }
    }
}

export default serviceApis;