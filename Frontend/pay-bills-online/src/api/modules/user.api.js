import privateClient from '../axiosClient/privateClient'
import publicClient from '../axiosClient/publicClient'

const userEndpoints = {
    getUserByUsername: (username) => `/user/username/${username}`,
    getUserByEmail: (email) => `/user/email/${email}`,
    updatePassword: '/user/updatepassword',
    changPassword: '/user/changepassword',
    updateUser: (id) => `/user/update/${id}`,
    getAll: '/user/all',
    updateStatus: (id) => `/user/updateStatus/${id}`,
    createUser: '/user/create',
    getById: (id) => `/user/${id}`,
    getUserAuthByUsername: (username) => `/user/userauth/${username}`,
    deleteById: (id) => `user/delete/${id}`
}

const userApis = {
    getUserByUsername: async (username) => {
        try {
            const response = await privateClient.get(userEndpoints.getUserByUsername(username))
            return response
        }
        catch (error) {
            return error
        }
    },
    getUserByEmail: async (email) => {
        try {
            const response = await publicClient.get(userEndpoints.getUserByEmail(email))
            return response
        }
        catch (error) {
            return error
        }
    },
    updatePassword: async (data) => {
        try {
            const response = await publicClient.put(userEndpoints.updatePassword, data)
            return response
        }
        catch (error) {
            return error
        }
    },
    changPassword: async (data) => {
        try {
            const response = await privateClient.put(userEndpoints.changPassword, data)
            return response
        }
        catch (error) {
            return error
        }
    },
    updateUser: async (id, data) => {
        try {
            const response = await privateClient.put(userEndpoints.updateUser(id), data)
            return response
        }
        catch (error) {
            return error
        }
    },
    getAll: async () => {
        try {
            const response = await privateClient.get(userEndpoints.getAll)
            return response
        }
        catch (error) {
            return error
        }
    },
    updateStatus: async (id) => {
        try {
            const response = await privateClient.put(userEndpoints.updateStatus(id))
            return response
        }
        catch (error) {
            return error
        }
    },
    createUser: async (data) => {
        try {
            const response = await privateClient.post(userEndpoints.createUser, data)
            return response
        }
        catch (error) {
            return error
        }
    },
    getById: async (id) => {
        try {
            const response = await privateClient.get(userEndpoints.getById(id))
            return response
        }
        catch (error) {
            return error
        }
    },
    getUserAuthByUsername: async (username) => {
        try {
            const response = await privateClient.get(userEndpoints.getUserAuthByUsername(username))
            return response
        }
        catch (error) {
            return error
        }
    },
    deleteById: async (id) => {
        try {
            const response = await privateClient.delete(userEndpoints.deleteById(id))
            return response
        }
        catch (error) {
            return error
        }
    }
}

export default userApis