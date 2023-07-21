import React, { useEffect, useState } from 'react'
import '../style/UserInfo.css'
import { Typography } from '@mui/material'
import userApis from '../api/modules/user.api'
import {toast} from 'react-toastify'
import { format, addDays } from 'date-fns';

const UserInfo = () => {
    const username = localStorage.getItem('username');
    const [id, setId] = useState('')
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [dob, setDob] = useState('')
    const [gender, setGender] = useState(0)
    const [isEdit, setIsEdit] = useState(false)

    useEffect(() => {
        const getUserInfo = async () => {
            const response = await userApis.getUserByUsername(username)
            if (response.success && response) {
                console.log(response)
                const increasedDate = addDays(new Date(response.data.dob), 0);
                const formattedDate = format(increasedDate, 'yyyy-MM-dd');
                setId(response.data.id)
                setFirstname(response.data.firstname)
                setLastname(response.data.lastname)
                setEmail(response.data.email)
                setPhone(response.data.phone)
                setAddress(response.data.address)
                setDob(formattedDate)
                if (response.data.gender === 1) {
                    setGender("Nam")
                }
                else if (response.data.gender === 0) {
                    setGender("Nữ")
                }
                else {
                    setGender("")
                }
            }
            else {
                console.log(response)
            }
        }
        getUserInfo()
    }, [username])

    const handlesubmit = async (e) => {
        e.preventDefault()
        var gen = null
        if (gender === "Nam") {
            gen = 1
        }
        else if (gender === "Nữ") {
            gen = 0
        }
        else {
            gen = null
        }
        const data = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            phone: phone,
            address: address,
            dob: dob,
            gender: gen
        }
        const response = await userApis.updateUser(id, data)
        if(response.success && response) {
            console.log(response)
            setIsEdit(false)
            toast.success('Cập nhật thông tin thành công!')
        }
        else {
            console.log(response)
            toast.error('Cập nhật thông tin thất bại!')
        }
    }

    const handleEdit = (e) => {
        e.preventDefault()
        setIsEdit(!isEdit)
    }

    return (
        <div className='main-user-info'>
            <form className='form-user-info' onSubmit={handlesubmit}>
                <Typography variant='h4' fontWeight='600' marginBottom='20px' color='#085edc'>THÔNG TIN CÁ NHÂN</Typography>
                <div className='item-group'>
                    <div className='input-group' style={{ marginRight: '10px' }}>
                        <label>Họ</label>
                        <input
                            type='text'
                            placeholder='Họ'
                            disabled={isEdit ? false : true}
                            value={firstname || ''}
                            onChange={(e) => setFirstname(e.target.value)}
                        />
                    </div>
                    <div className='input-group'>
                        <label>Tên</label>
                        <input
                            type='text'
                            placeholder='Tên'
                            disabled={isEdit ? false : true}
                            value={lastname || ''}
                            onChange={(e) => setLastname(e.target.value)}
                        />
                    </div>
                </div>
                <div className='input-group'>
                    <label>Email</label>
                    <input
                        type='email'
                        placeholder='Email'
                        disabled={isEdit ? false : true}
                        value={email || ''}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className='input-group'>
                    <label>Số điện thoại</label>
                    <input
                        type='text'
                        placeholder='Số điện thoại'
                        disabled={isEdit ? false : true}
                        value={phone || ''}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <div className='input-group'>
                    <label>Địa chỉ</label>
                    <input
                        type='text'
                        placeholder='Địa chỉ'
                        disabled={isEdit ? false : true}
                        value={address || ''}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                <div className='input-group'>
                    <label>Ngày sinh</label>
                    <input
                        type='date'
                        value={dob || ''}
                        disabled={isEdit ? false : true}
                        onChange={(e) => setDob(e.target.value)}
                    />
                </div>
                <div className='input-group'>
                    <label>Giới tính</label>
                    <select className='select-gender'
                        disabled={isEdit ? false : true}
                        value={gender || ''}
                        onChange={(e) => setGender(e.target.value)}
                    >
                        <option value=''>--Chọn---</option>
                        <option value='Nam'>Nam</option>
                        <option value='Nữ'>Nữ</option>
                    </select>
                </div>
                <div className='btn-group'>
                    <button className='btn-edit-info' onClick={handleEdit}>{isEdit ? 'Thoát' : 'Chỉnh sửa'}</button>
                    <button
                        className={`btn-save-info ${!isEdit ? 'disable' : ''}`}
                        disabled={isEdit ? false : true}
                        type='submit'
                    >Lưu</button>
                </div>
            </form >
        </div >
    )
}

export default UserInfo