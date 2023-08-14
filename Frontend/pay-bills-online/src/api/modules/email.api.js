import publicClient from '../axiosClient/publicClient'

const emailEndpoint = {
    sendEmailContact: '/sendmailcontact',
    sendMailPasswords: '/sendmailpasswords',
    sendBill: '/sendbill',
    sendbankcard: '/sendbankcard',
}

const emailApis = {
    sendEmailContact: async (data) => {
        try {
            const response = await publicClient.post(emailEndpoint.sendEmailContact, data)
            return response
        }
        catch (error) {
            return error
        }
    },
    sendMailPasswords: async (data) => {
        try {
            const response = await publicClient.post(emailEndpoint.sendMailPasswords, data)
            return response
        }
        catch (error) {
            return error
        }
    },
    sendBill: async (data) => {
        try {
            const response = await publicClient.post(emailEndpoint.sendBill,data)
            return response
        }
        catch (error) {
            return error
        }
    },
    sendbankCard: async (data) => {
        try {
            const response = await publicClient.post(emailEndpoint.sendbankcard,data)
            return response
        }
        catch (error) {
            return error
        }
    }
}

export default emailApis