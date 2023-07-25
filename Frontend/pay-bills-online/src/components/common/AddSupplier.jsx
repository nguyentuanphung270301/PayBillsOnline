import React, { useState } from 'react'
import '../../style/AddSupplier.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import supplierApis from '../../api/modules/supplier.api'
import SupplierBankCardApis from '../../api/modules/supplierbankcard.api'

const AddSupplier = ({ onClose }) => {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Form validation checks
        if (!name || !phone || !email) {
            toast.error('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        if (!/((09|03|07|08|05)+([0-9]{8})\b)/g.test(phone)) {
            toast.error('Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam hợp lệ.');
            return;
        }

        if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
            toast.error('Email không hợp lệ. Vui lòng nhập email có tên miền @gmail.com.');
            return;
        }

        const data = {
            name: name,
            phone: phone,
            email: email
        }

        const res = await supplierApis.createSupplier(data)
        if (res.success && res) {
            console.log(res)
            const data = {
                balance: 0,
                supplier_id: res.data.id
            }
            const response = await SupplierBankCardApis.createSupplierBankCard(data)
            if (response.success && response) {
                console.log(response)
                setName('');
                setPhone('');
                setEmail('');
                toast.success('Thêm nhà cung cấp thành công')
                onClose()
            }
            else {
                console.log(res.error.sqlMessage)
                toast.error('Thêm nhà cung cấp thất bại')
            }
        }
        else {
            console.log(res)
            toast.error(res.error.sqlMessage)
        }

    }

    return (
        <div className='overlay'>
            <div className='main-add-supplier'>
                <FontAwesomeIcon icon={faXmark} onClick={onClose} className='icon-close-add-supplier' />
                <form className='form-add-supplier' onSubmit={handleSubmit}>
                    <div className='flex-column'>
                        <label>Tên nhà cung cấp</label>
                        <input
                            type='text'
                            placeholder='Tên nhà cung cấp'
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className='flex-column'>
                        <label>Email nhà cung cấp</label>
                        <input
                            type='text'
                            placeholder='Email nhà cung cấp'
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='flex-column'>
                        <label>Số điện thoại nhà cung cấp</label>
                        <input
                            type='text'
                            placeholder='Số điện thoại nhà cung cấp'
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <button className='btn-add-supplier' type='submit'>Lưu</button>
                </form>
            </div>
        </div>
    )
}

export default AddSupplier