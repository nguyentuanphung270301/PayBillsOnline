import privateClient from '../axiosClient/privateClient';

const serviceEndpoints = {
    getAll: '/service/all',
    deleteService:(id) => `/service/delete/${id}`
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
    }
}

export default serviceApis;