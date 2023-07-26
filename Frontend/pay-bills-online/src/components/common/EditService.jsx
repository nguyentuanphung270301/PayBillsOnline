import React, { useEffect, useState } from 'react'
import supplierApis from '../../api/modules/supplier.api'
import { toast } from 'react-toastify'
import serviceApis from '../../api/modules/service.api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

const EditService = ({ onClose, id }) => {
    const [supplierList, setSupplierList] = useState('')
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [supplierId, setSupplierId] = useState(0)

    useEffect(() => {
        const getSupplierList = async () => {
            const res = await supplierApis.getAll()
            if (res.success && res) {
                setSupplierList(res.data)
            }
            else {
                setSupplierList('')
                console.log(res)
            }
        }
        getSupplierList()
    }, [])

    useEffect(() => {
        const getServiceById = async () => {
            const res = await serviceApis.getById(id)
            if (res.success && res) {
                setName(res.data.name)
                setPrice(res.data.price)
                setSupplierId(res.data.supplier_id)
            }
            else {
                setName('')
                setPrice(0)
                setSupplierId(0)
            }
        }
        getServiceById()
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!name || !price || !supplierId) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }
        if (price < 0 || price > 100000000) {
            toast.error('Giá dịch vụ phải từ 0 đến 100.000.000đ');
            return;
        }

        const data = {
            name: name,
            price: parseFloat(price),
            supplier_id: parseInt(supplierId)
        }
        const res = await serviceApis.updateService(id, data)
        if (res.success && res) {
            console.log(res)
            toast.success('Cập nhật dịch vụ thành công');
            onClose()
        }
        else {
            console.log(res)
            toast.error('Cập nhật dịch vụ thất bại');
        }

    }
    return (
        <div className='overlay'>
            <div className='main-add-service'>
                <FontAwesomeIcon icon={faXmark} onClick={onClose} className='icon-close-add-service' />
                <form className='form-add-service' onSubmit={handleSubmit}>
                    <div className='flex-column'>
                        <label>Tên dịch vụ</label>
                        <input
                            type='text'
                            placeholder='Tên dịch vụ'
                            value={name || ''}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className='flex-column'>
                        <label>Giá dịch vụ</label>
                        <input
                            type='number'
                            placeholder='Giá dịch vụ'
                            value={price || ''}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                    <div className='flex-column'>
                        <label>Tên nhà cung cấp</label>
                        {supplierList && <select onChange={(e) => setSupplierId(e.target.value)} value={supplierId || ''}>
                            <option value=''>---Chọn---</option>
                            {supplierList.map((item, index) => {
                                return <option key={index} value={item.id}>{item.name}</option>
                            })}
                        </select>}
                    </div>
                    <button className='btn-add-service' type='submit'>Lưu</button>
                </form>
            </div>
        </div>
    )
}

export default EditService