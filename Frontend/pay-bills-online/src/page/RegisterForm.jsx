import React, { useState } from 'react'
import '../style/RegisterForm.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faPen, faAt, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authApis from '../api/modules/auth.api';

const RegisterForm = () => {

    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!firstname || !lastname || !email || !phone || !username || !password) {
            toast.error("Vui lòng điền đầy đủ thông tin")
        }
        else if (!/^[0-9]{10,11}$/.test(phone)) {
            toast.error('Số điện thoại không hợp lệ');
        } else if (username.length < 5 || username.length > 16) {
            toast.error('Tên đăng nhập phải từ 5 đến 16 kí tự');
        } else if (password.length < 8 || password.length > 20) {
            toast.error('Mật khẩu phải từ 8 đến 20 kí tự');
        } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(email)) {
            toast.error("Email phải có tên miền '@gmail.com'");
        }
        else {
            const data = {
                firstname: firstname,
                lastname: lastname,
                email: email,
                phone: phone,
                username: username,
                password: password
            }
            const response = await authApis.register(data)
            if (response.success && response) {
                toast.success("Đăng ký thành công")
                setFirstname('')
                setLastname('')
                setEmail('')
                setPhone('')
                setUsername('')
                setPassword('')
                navigate('/login')
            }
            else {
                toast.error(response.error.sqlMessage)
            }
        }
    }

    return (
        <div>
            <div className='main-login'>
                <form className="form" onSubmit={handleSubmit}>
                    <Typography
                        sx={{
                            position: 'relative',
                            textAlign: 'center',
                            fontSize: '25px',
                            fontWeight: 'bold',
                        }}>Đăng ký</Typography>
                    <div className="flex-column">
                        <label>Họ Tên</label>
                    </div>
                    <div className='flex-row'>
                        <div className="inputForm">
                            <FontAwesomeIcon icon={faPen} className='input-icon' />
                            <input
                                placeholder="Nhập họ tên lót"
                                className="input"
                                type="text"
                                onChange={(e) => setFirstname(e.target.value)}
                            />
                        </div>
                        <div className="inputForm">
                            <FontAwesomeIcon icon={faPen} className='input-icon' />
                            <input
                                placeholder="Nhập tên"
                                className="input"
                                type="text"
                                onChange={(e) => setLastname(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex-column">
                        <label>Email</label></div>
                    <div className="inputForm">
                        <FontAwesomeIcon icon={faAt} className='input-icon' />
                        <input
                            placeholder="Nhập email của bạn"
                            className="input"
                            type="text"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="flex-column">
                        <label>Số điện thoại</label></div>
                    <div className="inputForm">
                        <FontAwesomeIcon icon={faAt} className='input-icon' />
                        <input
                            placeholder="Nhập số điện thoại của bạn"
                            className="input"
                            type="text"
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div className="flex-column">
                        <label>Tên đăng nhập</label></div>
                    <div className="inputForm">
                        <FontAwesomeIcon icon={faUser} className='input-icon' />
                        <input
                            placeholder="Nhập tên đăng nhập"
                            className="input"
                            type="text"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="flex-column">
                        <label>Mật khẩu</label></div>
                    <div className="inputForm">
                        <FontAwesomeIcon icon={faLock} className='input-icon' />
                        <input
                            placeholder="Nhập mật khẩu của bạn"
                            className="input"
                            type={showPassword ? 'text':'password'}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {password && (!showPassword ? <FontAwesomeIcon icon={faEye} onClick={() => setShowPassword(true)} /> :
                            <FontAwesomeIcon icon={faEyeSlash} onClick={() => setShowPassword(false)} />)}
                    </div>
                    <button className="button-submit" type='submit'>Đăng ký</button>
                    <p className="p">Bạn đã có tài khoản ?
                        <Link to='/login' style={{ textDecoration: 'none' }}><span className="span">Đăng nhập</span></Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default RegisterForm