import privateClient from '../axiosClient/privateClient';

const paymentEndpoints = {
    createPayment: '/payment/create',
    getReportCab: '/payment/getReport/Cab',
    getReportMeter: '/payment/getReport/Meter',
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
    getReportMeter: async (data) => {
        try {
            console.log(data)
            const response = await privateClient.get(paymentEndpoints.getReportMeter, { params: data });
            return response
        }
        catch (error) {
            return error
        }
    },
    getReportCab: async (data) => {
        try {
            const response = await privateClient.get(paymentEndpoints.getReportCab, { params: data })
            return response
        }
        catch (error) {
            return error
        }
    },
}

export default paymentApis