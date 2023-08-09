import privateClient from '../axiosClient/privateClient';

const meterEndpoints = {
    getAll: '/meterindex/all',
    deleteMeter: (id) => `/meterindex/delete/${id}`,
    getById: (id) => `/meterindex/${id}`,
    getBySeviceId: (userId) => `/meterindex/getbyserviceid/${userId}`,
    createMeter: '/meterindex/create',
    updateMeter: (id) => `/meterindex/update/${id}`
}

const meterApis = {
    getAll: async () => {
        try {
            const response = await privateClient.get(meterEndpoints.getAll);
            return response;
        }
        catch (error) {
            return error;
        }
    },
    deleteMeter: async (id) => {
        try {
            const response = await privateClient.delete(meterEndpoints.deleteMeter(id));
            return response;
        }
        catch (error) {
            return error;
        }
    },
    getById: async (id) => {
        try {
            const response = await privateClient.get(meterEndpoints.getById(id));
            return response;
        }
        catch (error) {
            return error;
        }
    },
    getBySeviceId: async (userId) => {
        try {
            const response = await privateClient.get(meterEndpoints.getBySeviceId(userId))
            return response
        }
        catch (error) {
            return error;
        }
    },
    createMeter: async (data) => {
        try {
            const response = await privateClient.post(meterEndpoints.createMeter, data);
            return response;
        }
        catch (error) {
            return error;
        }
    },
    updateMeter: async (id, data) => {
        try {
            const response = await privateClient.put(meterEndpoints.updateMeter(id), data);
            return response;
        }
        catch (error) {
            return error;
        }
    }
}

export default meterApis;