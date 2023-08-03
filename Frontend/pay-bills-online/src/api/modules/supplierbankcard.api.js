import privateClient from '../axiosClient/privateClient';

const SupplierBankCardEndpoint = {
    createSupplierBankCard: '/supllierbankcard/create',
    deleteSupplierBankCardBySupplierId: (supplier_id) => `/supllierbankcard/deleteBySupplierId/${supplier_id}`,
    updateSupplierBankCard: (supplier_id) => `/supllierbankcard/update/${supplier_id}`,
    getById: (id) => `/supllierbankcard/${id}`,
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
    },
    updateSupplierBankCard: async (id, data) => {
        try {
            const response = await privateClient.put(SupplierBankCardEndpoint.updateSupplierBankCard(id), data)
            return response
        }
        catch (error) {
            return error;
        }
    },
    getById: async (id) => {
        try {
            const response = await privateClient.get(SupplierBankCardEndpoint.getById(id));
            return response
        }
        catch (error) {
            return error
        }
    }
}

export default SupplierBankCardApis;