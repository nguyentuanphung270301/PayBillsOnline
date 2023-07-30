import privateClient from '../axiosClient/privateClient';

const roleEndpoints = {
    getById: (id) => `/role/${id}`,
    getAll: '/role/all',
    createRole: '/role/create',
    deleteRole: (id) => `/role/delete/${id}`,
    updateRole: (id) => `/role/update/${id}`,
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
    getAll: async () => {
        try {
            const response = await privateClient.get(roleEndpoints.getAll)
            return response
        }
        catch (error) {
            return error
        }
    },
    createRole: async (data) => {
        try {
            const response = await privateClient.post(roleEndpoints.createRole, data)
            return response
        }
        catch (error) {
            return error
        }
    },
    deleteRole: async (id) => {
        try {
            const response = await privateClient.delete(roleEndpoints.deleteRole(id));
            return response
        }
        catch (error) {
            return error
        }
    },
    updateRole: async (id,data) => {
        try {
            const response = await privateClient.put(roleEndpoints.updateRole(id),data);
            return response
        }
        catch (error) {
            return error
        }
    }
}

export default roleApis