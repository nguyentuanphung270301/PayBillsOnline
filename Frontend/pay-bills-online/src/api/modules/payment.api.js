import privateClient from '../axiosClient/privateClient';

const paymentEndpoints = {
    createPayment: '/payment/create',
}

const paymentApis = {
    createPayment: async (data) => {
        try {
            const response = await privateClient.post(paymentEndpoints.createPayment, data)
            return response
        }
        catch (error) {
            return error
        }
    },
}

export default paymentApis