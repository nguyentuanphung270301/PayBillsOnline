import privateClient from '../axiosClient/privateClient';

const roleEndpoints = {
    getById: (id) => `/role/${id}`
}

const roleApis = {
    getById: async (id) => {
        try {
            const response = await privateClient.get(roleEndpoints.getById(id))
            return response
        }
        catch (error) {
            return error
        }
    },
}

export default roleApis