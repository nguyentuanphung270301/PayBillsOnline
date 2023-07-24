import React, { useState } from 'react'
import '../style/ResetPassword.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faAt } from "@fortawesome/free-solid-svg-icons";
import { Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import authApis from '../api/modules/auth.api';
import userApis from '../api/modules/user.api';
import emailApis from '../api/modules/email.api';

const ResetPassword = () => {

    const [email, setEmail] = useState('')

    const generateRandomPassword = (length) => {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset.charAt(randomIndex);
        }
        return password;
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email) {
            toast.error('Vui lòng điền email')
        } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(email)) {
            toast.error('Email phải có tên miền "@gmail.com"');
        }
        else {
            const response = await userApis.getUserByEmail(email)
            if (response.success && response) {
                console.log(response)
                const randomPassword = generateRandomPassword(8);
                const data = {
                    email: email,
                    password: randomPassword
                }
                const res = await userApis.updatePassword(data)
                if (res.success && res) {
                    console.log('Random password:' + randomPassword)
                    const data = {
                        email: email,
                        message: randomPassword
                    }
                    const result = await emailApis.sendMailPasswords(data)
                    if (result.success && result) {
                        setEmail('')
                        toast.success(result.message)
                    } else {
                        toast.error(result.error)
                    }
                }
                else {
                    console.log(res)
                }
            }
            else {
                console.log(response)
                toast.error('Email của bạn chưa đăng ký tài khoản')
            }
        }
    }

    return (
        <div className='main-login'>
            <form className="form" onSubmit={handleSubmit}>
                <Typography
                    sx={{
                        position: 'relative',
                        textAlign: 'center',
                        fontSize: '25px',
                        fontWeight: 'bold',
                    }}>Quên Mật Khẩu</Typography>
                <div className="flex-column">
                    <label>Email</label>
                </div>
                <div className="inputForm">
                    <FontAwesomeIcon icon={faAt} className='input-icon' />
                    <input
                        placeholder="Nhập email của bạn"
                        className="input" type="text"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email || ''}
                    />
                </div>
                <button className="button-submit" type='submit'>Gửi</button>
            </form>
        </div>
    )
}

export default ResetPassword