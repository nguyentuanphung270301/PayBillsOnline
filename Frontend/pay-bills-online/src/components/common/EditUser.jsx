import React, { useEffect, useState } from 'react'
import '../../style/EditUser.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import userApis from '../../api/modules/user.api'
import { addDays, format } from 'date-fns'

const EditUser = ({ onClose, id }) => {

    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [dob, setDob] = useState('')
    const [gender, setGender] = useState('')

    useEffect(() => {
        const getUserInfo = async () => {
            const res = await userApis.getById(id)
            if (res.success && res) {
                setFirstname(res.data.firstname)
                setLastname(res.data.lastname)
                setEmail(res.data.email)
                setPhone(res.data.phone)
                setAddress(res.data.address)
                setDob(formatDate(res.data.dob))
                setGender(res.data.gender === 1 ? 'Nam' : 'Nữ')
                console.log(res)
            }
            else {
                console.log(res)
            }
        }
        getUserInfo()
    }, [id])

    const formatDate = (date) => {
        const increasedDate = addDays(new Date(date), 0);
        const formattedDate = format(increasedDate, 'yyyy-MM-dd');
        return formattedDate;
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!firstname || !lastname || !email || !phone || !address || !dob || !gender ) {
            toast.error('Vui lòng điền đầy đủ thông tin')
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

        const currentDate = new Date();
        const inputDate = new Date(dob);
        const ageDiff = currentDate - inputDate;
        const ageYear = Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365));

        if (ageYear < 18) {
            toast.error('Ngày sinh phải đủ 18 tuổi.');
            return;
        }

        const data = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            phone: phone,
            address: address,
            dob: dob,
            gender: gender === 'Nam' ? 1 : 0,
        }

        const res = await userApis.updateUser(id,data)
        if (res.success && res) {
            console.log(res)
            toast.success('Cập nhật người dùng thành công')
            setFirstname('');
            setLastname('');
            setEmail('');
            setPhone('');
            setAddress('');
            setDob('');
            setGender('');
            onClose()
        }
        else {
            console.log(res)
            toast.error('Cập nhật người dùng thất bại')
        }
    }

    return (
        <div className='overlay'>
            <div className='main-edit-user'>
                <FontAwesomeIcon icon={faXmark} onClick={onClose} className='icon-close-add-user' />
                <form className='form-add-user' onSubmit={handleSubmit}>
                    <div className='form-flex-column'>
                        <label>Họ tên</label>
                        <div>
                            <input
                                placeholder='Họ'
                                type='text'
                                onChange={(e) => setFirstname(e.target.value)}
                                value={firstname || ''}
                            />
                            <input
                                placeholder='Tên'
                                type='text'
                                onChange={(e) => setLastname(e.target.value)}
                                value={lastname || ''}
                            />
                        </div>
                    </div>
                    <div className='form-flex-column'>
                        <label>Email</label>
                        <input
                            placeholder='email'
                            type='text'
                            onChange={(e) => setEmail(e.target.value)}
                            value={email || ''}
                        />
                    </div>
                    <div className='form-flex-column'>
                        <label>Số điện thoại</label>
                        <input
                            placeholder='Số điện thoại'
                            type='text'
                            onChange={(e) => setPhone(e.target.value)}
                            value={phone || ''}
                        />
                    </div>
                    <div className='form-flex-column'>
                        <label>Địa chỉ</label>
                        <input
                            placeholder='Địa chỉ'
                            type='text'
                            onChange={(e) => setAddress(e.target.value)}
                            value={address || ''}
                        />
                    </div>
                    <div className='form-flex-column'>
                        <label>Ngày sinh</label>
                        <input
                            placeholder='Ngày sinh'
                            type='date'
                            onChange={(e) => setDob(e.target.value)}
                            value={dob || ''}
                        />
                    </div>
                    <div className='form-flex-column'>
                        <label>Giới tính</label>
                        <select onChange={(e) => setGender(e.target.value)} value={gender || ''}>
                            <option value=''>---Chọn giới tính---</option>
                            <option value='Nam'>Nam</option>
                            <option value='Nữ'>Nữ</option>
                        </select>
                    </div>
                    <button className='btn-add-user' type='submit'>Lưu</button>
                </form>
            </div>
        </div>
    )
}

export default EditUser