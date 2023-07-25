import privateClient from '../axiosClient/privateClient';

const SupplierBankCardEndpoint = {
    createSupplierBankCard: '/supllierbankcard/create',
    deleteSupplierBankCardBySupplierId: (supplier_id) => `/supllierbankcard/deleteBySupplierId/${supplier_id}`
}

const SupplierBankCardApis = {
    createSupplierBankCard: async (data) => {
        try {
            const response = await privateClient.post(SupplierBankCardEndpoint.createSupplierBankCard, data);
            return response;
        }
        catch (error) {
            return error;
        }
    },
    deleteSupplierBankCardBySupplierId: async (supplier_id) => {
        try {
            const response = await privateClient.delete(SupplierBankCardEndpoint.deleteSupplierBankCardBySupplierId(supplier_id));
            return response;
        }
        catch (error) {
            return error;
        }
    }
}

export default SupplierBankCardApis;