import privateClient from '../axiosClient/privateClient';

const screenEndpoints = {
    getAll: '/screen/all',
    getAllScreen: '/screen/allscreen',
    getById: (id) => `/screen/${id}`,
    getByRoleId: (id) => `/screen/role/${id}`,
    createScreen: '/screen/create',
    deleteScreen: (id) => `/screen/delete/${id}`,
    updateScreen: (id) => `/screen/update/${id}`
}

const screenApis = {
    getAll: async () => {
        try {
            const response = await privateClient.get(screenEndpoints.getAll)
            return response
        }
        catch (error) {
            return error
        }
    },
    getAllScreen: async () => {
        try {
            const response = await privateClient.get(screenEndpoints.getAllScreen)
            return response
        }
        catch (error) {
            return error
        }
    },
    getById: async (id) => {
        try {
            const response = await privateClient.get(screenEndpoints.getById(id))
            return response
        }
        catch (error) {
            return error
        }
    },
    getByRoleId: async (id) => {
        try {
            const response = await privateClient.get(screenEndpoints.getByRoleId(id));
            return response
        }
        catch (error) {
            return error
        }
    },
    createScreen: async (data) => {
        try {
            const response = await privateClient.post(screenEndpoints.createScreen, data)
            return response
        }
        catch (error) {
            return error
        }
    },
    deleteScreen: async (id) => {
        try {
            const response = await privateClient.delete(screenEndpoints.deleteScreen(id))
            return response
        }
        catch (error) {
            return error
        }
    },
    updateScreen: async (id, data) => {
        try {
            const response = await privateClient.put(screenEndpoints.updateScreen(id), data)
            return response
        }
        catch (error) {
            return error
        }
    }
}
export default screenApis