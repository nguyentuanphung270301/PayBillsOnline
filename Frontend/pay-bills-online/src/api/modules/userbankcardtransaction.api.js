import privateClient from '../axiosClient/privateClient';

const userBankCardTransactionEndpoint = {
    createBankCard: '/userbankcardtransaction/create',
    getById: (id) => `/userbankcardtransaction/${id}`,
}


const userBankCardTransactionApis = {

    createBankCard: async (data) => {
        try {
            const response = await privateClient.post(userBankCardTransactionEndpoint.createBankCard, data)
            return response
        }
        catch (error) {
            return error
        }
    },
    getById: async (id) => {
        try {
            const response = await privateClient.get(userBankCardTransactionEndpoint.getById(id))
            return response
        }
        catch (error) {
            return error
        }
    }
}

export default userBankCardTransactionApis