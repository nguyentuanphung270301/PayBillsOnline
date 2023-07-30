import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import '../../style/AddRole.css'
import { toast } from 'react-toastify'
import roleApis from '../../api/modules/role.api'

const AddRole = ({ onClose }) => {
    const [rolecode, setRolecode] = useState('')
    const [name, setName] = useState('')
    const [info, setInfo] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!rolecode.trim()) {
            toast.error('Mã vai trò không được để trống')
            return
        }

        if (!name.trim()) {
            toast.error('Tên vai trò không được để trống')
            return
        }

        if (!info.trim()) {
            toast.error('Thông tin vai trò không được để trống')
            return
        }

        const data = {
            rolecode: rolecode.toUpperCase(),
            name: name,
            info: info,
        }


        const res = await roleApis.createRole(data)
        if (res.success && res) {
            toast.success('Thêm role mới thành công')
            onClose()
        }
        else {
            console.log(res)
            toast.error('Thêm role mới thất bại')
        }
    }
    return (
        <div className='overlay'>
            <div className='main-add-role'>
                <FontAwesomeIcon icon={faXmark} onClick={onClose} className='icon-close-add-role' />
                <form className='form-add-role' onSubmit={handleSubmit}>
                    <div className='form-flex'>
                        <label>Mã vai trò</label>
                        <input type='text'
                            placeholder='Mã vai trò'
                            onChange={(e) => setRolecode(e.target.value)}
                        />
                    </div>
                    <div className='form-flex'>
                        <label>Tên vai trò</label>
                        <input type='text'
                            placeholder='Tên vai trò'
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className='form-flex'>
                        <label>Thông tin vai trò</label>
                        <textarea
                            onChange={(e) => setInfo(e.target.value)}
                        />
                    </div>
                    <button className='btn-save-role' type='submit'>Lưu</button>
                </form>
            </div>
        </div>
    )
}

export default AddRole