import React, { useState } from 'react'
import '../../style/AddUser.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import userApis from '../../api/modules/user.api'

const AddUser = ({ onClose }) => {
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [dob, setDob] = useState('')
    const [gender, setGender] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!firstname || !lastname || !email || !phone || !address || !dob || !gender || !username || !password) {
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
        if (username.length < 5 || username.length > 16) {
            toast.error('Tên đăng nhập phải từ 5 đến 16 kí tự.');
            return;
        }

        if (password.length < 8 || password.length > 20) {
            toast.error('Mật khẩu phải từ 8 đến 20 kí tự.');
            return;
        }

        const data = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            phone: phone,
            address: address,
            dob: dob ,
            gender: gender === 'Nam' ? 1 : 0,
            username: username,
            password: password,
            status: 1
        }

        const res = await userApis.createUser(data)
        if (res.success && res) {
            console.log(res)
            toast.success('Thêm người dùng thành công')
            setFirstname('');
            setLastname('');
            setEmail('');
            setPhone('');
            setAddress('');
            setDob('');
            setGender('');
            setUsername('');
            setPassword('');
            onClose()
        }
        else {
            console.log(res)
            toast.error('Thêm người dùng thất bại')
        }
    }

    return (
        <div className='overlay'>
            <div className='main-add-user'>
                <FontAwesomeIcon icon={faXmark} onClick={onClose} className='icon-close-add-user' />
                <form className='form-add-user' onSubmit={handleSubmit}>
                    <div className='form-flex-column'>
                        <label>Họ tên</label>
                        <div>
                            <input
                                placeholder='Họ'
                                type='text'
                                onChange={(e) => setFirstname(e.target.value)}
                            />
                            <input
                                placeholder='Tên'
                                type='text'
                                onChange={(e) => setLastname(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='form-flex-column'>
                        <label>Email</label>
                        <input
                            placeholder='email'
                            type='text'
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='form-flex-column'>
                        <label>Số điện thoại</label>
                        <input
                            placeholder='Số điện thoại'
                            type='text'
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div className='form-flex-column'>
                        <label>Địa chỉ</label>
                        <input
                            placeholder='Địa chỉ'
                            type='text'
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div className='form-flex-column'>
                        <label>Ngày sinh</label>
                        <input
                            placeholder='Ngày sinh'
                            type='date'
                            onChange={(e) => setDob(e.target.value)}
                        />
                    </div>
                    <div className='form-flex-column'>
                        <label>Giới tính</label>
                        <select onChange={(e) => setGender(e.target.value)}>
                            <option value=''>---Chọn giới tính---</option>
                            <option value='Nam'>Nam</option>
                            <option value='Nữ'>Nữ</option>
                        </select>
                    </div>
                    <div className='form-flex-column'>
                        <label>Tên đăng nhập</label>
                        <input
                            placeholder='Tên đăng nhập'
                            type='text'
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className='form-flex-column'>
                        <label>Mật khẩu</label>
                        <input
                            placeholder='Mật khẩu'
                            type='password'
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button className='btn-add-user' type='submit'>Lưu</button>
                </form>
            </div>
        </div>
    )
}

export default AddUser