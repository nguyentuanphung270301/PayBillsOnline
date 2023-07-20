import React, { useState } from 'react'
import '../style/ChangePassword.css'
import { Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify'
import userApis from '../api/modules/user.api';

const ChangPassword = () => {

    const username = localStorage.getItem('username');
    const [isSeen, setIsSeen] = useState(false)
    const [isSeen1, setIsSeen1] = useState(false)
    const [isSeen2, setIsSeen2] = useState(false)
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.error('Vui lòng điền đầy đủ thông tin')
        }
        else if(oldPassword === newPassword) {
            toast.error('Mật khẩu mới không được trùng mật khẩu cũ')
        }
        else if (newPassword.length < 8 || newPassword.length > 16) {
            toast.error('Mật khẩu phải từ 8 đến 16 ký tự')
        }
        else if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu mới và xác nhận mật khẩu mới không khớp")
        } else {
            const data = {
                username: username,
                password: oldPassword,
                newPassword: newPassword
            }
            const response = await userApis.changPassword(data)
            if (response.success && response) {
                console.log(response)
                toast.success('Đổi mật khẩu thành công')
                setIsSeen(false)
                setIsSeen1(false)
                setIsSeen2(false)
                setOldPassword('')
                setNewPassword('')
                setConfirmPassword('')
            }
            else {
                console.log(response)
                toast.error(response.error)
            }
        }
    }

    return (
        <div className='main-change-pass'>
            <form className='form-change-pass' onSubmit={handleSubmit}>
                <Typography variant='h4' sx={{
                    fontSize: '25px',
                    fontWeight: 'bold',
                    color: '#000000',
                    textTransform: 'uppercase',
                }}>Đổi mật khẩu</Typography>
                <div className='item-change-pass'>
                    <Typography sx={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginBottom: '5px'
                    }}>Mật khẩu hiện tại</Typography>
                    <div className='input-group'>
                        <input className='input-change-pass'
                            type={isSeen ? 'text' : 'password'}
                            placeholder='Nhập mật khẩu hiện tại'
                            value={oldPassword || ''}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                        {oldPassword && (isSeen ? (<FontAwesomeIcon icon={faEyeSlash} style={{
                            marginLeft: '10px',
                            left: '205px',
                            top: '128px',
                            position: 'absolute'
                        }}
                            onClick={() => setIsSeen(false)}
                        />) : (<FontAwesomeIcon icon={faEye} style={{
                            marginLeft: '10px',
                            left: '205px',
                            top: '128px',
                            position: 'absolute'
                        }}
                            onClick={() => setIsSeen(true)}
                        />))}
                    </div>
                </div>
                <div className='item-change-pass'>
                    <Typography sx={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginBottom: '5px'
                    }}>Mật khẩu mới</Typography>
                    <input className='input-change-pass'
                        type={isSeen1 ? 'text' : 'password'}
                        placeholder='Nhập mật khẩu mới'
                        value={newPassword || ''}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    {newPassword && (isSeen1 ? (<FontAwesomeIcon icon={faEyeSlash} style={{
                        marginLeft: '10px',
                        left: '205px',
                        top: '231px',
                        position: 'absolute'
                    }}
                        onClick={() => setIsSeen1(false)}
                    />) : (<FontAwesomeIcon icon={faEye} style={{
                        marginLeft: '10px',
                        left: '205px',
                        top: '231px',
                        position: 'absolute'
                    }}
                        onClick={() => setIsSeen1(true)}
                    />))}
                </div>
                <div className='item-change-pass'>
                    <Typography sx={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginBottom: '5px'
                    }}>Xác nhận mật khẩu mới</Typography>
                    <input className='input-change-pass'
                        type={isSeen2 ? 'text' : 'password'}
                        placeholder='Nhập lại mật khẩu mới'
                        value={confirmPassword || ''}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {confirmPassword && (isSeen2 ? (<FontAwesomeIcon icon={faEyeSlash} style={{
                        marginLeft: '10px',
                        left: '205px',
                        top: '334px',
                        position: 'absolute'
                    }}
                        onClick={() => setIsSeen2(false)}
                    />) : (<FontAwesomeIcon icon={faEye} style={{
                        marginLeft: '10px',
                        left: '205px',
                        top: '334px',
                        position: 'absolute'
                    }}
                        onClick={() => setIsSeen2(true)}
                    />))}
                </div>
                <button className='btn-change-pass' type='submit'>XÁC NHẬN</button>
            </form>
        </div>
    )
}

export default ChangPassword