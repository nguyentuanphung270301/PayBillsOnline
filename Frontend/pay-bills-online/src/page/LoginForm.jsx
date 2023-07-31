import React, { useEffect, useState } from 'react'
import '../style/LoginForm.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import authApis from '../api/modules/auth.api';
import userApis from '../api/modules/user.api';
import userAuthApis from '../api/modules/user_auth.api';


const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('username')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !password) {
      toast.error('Vui lòng điền đầy đủ thông tin')
    }
    else {
      const data = {
        username: username,
        password: password
      }
      const response = await authApis.login(data)
      if (response.success) {
        localStorage.setItem('token', response.accessToken)
        const res = await userApis.getUserByUsername(username)
        if (res.success && res.data.status === 1) {
          const results = await userAuthApis.getUserByUserId(res.data.id)
          if (results.success && results) {
            localStorage.setItem('username', username)
            toast.success('Đăng nhập thành công')
            navigate('/')
          }
          else {
            localStorage.removeItem('token')
            toast.error('Tài khoản chưa được cấp role')
            console.log(results)
          }
        }
        else if (res.success && res.data.status === 0) {
          localStorage.removeItem('token')
          toast.error('Người dùng đã bị vô hiệu hoá')
        }
        else {
          console.log(res)
        }
      }
      else {
        toast.error(response.message)
      }
    }
  }

  useEffect(() => {
    const checkLogin = () => {
      if (user && token) {
        navigate('/')
      }
    }
    checkLogin()
  }, [user, token])


  return (
    <div className='main-login'>
      <form className="form" onSubmit={handleSubmit}>
        <Typography
          sx={{
            position: 'relative',
            textAlign: 'center',
            fontSize: '25px',
            fontWeight: 'bold',
          }}>Đăng nhập</Typography>
        <div className="flex-column">
          <label>Tên đăng nhập</label>
        </div>
        <div className="inputForm">
          <FontAwesomeIcon icon={faUser} className='input-icon' />
          <input
            placeholder="Nhập tên đăng nhập"
            className="input" type="text"
            onChange={(e) => setUsername(e.target.value)
            }
          />
        </div>
        <div className="flex-column">
          <label>Mật khẩu</label>
        </div>
        <div className="inputForm">
          <FontAwesomeIcon icon={faLock} className='input-icon' />
          <input
            placeholder="Nhập mật khẩu của bạn"
            className="input" type={showPassword ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)
            } />
          {password && (showPassword ?
            (<FontAwesomeIcon icon={faEyeSlash} onClick={() => setShowPassword(!showPassword)}
              style={{
                margin: '0 10px',
              }}
            />) :
            (<FontAwesomeIcon icon={faEye} onClick={() => setShowPassword(!showPassword)}
              style={{
                margin: '0 10px',
              }}
            />)
          )}
        </div>

        <div className="flex-row">
          <Link to='/resetpassword' style={{ textDecoration: 'none' }}>
            <span className="span">Quên mật khẩu ?</span>
          </Link>
        </div>
        <button className="button-submit" type='submit'>Đăng nhập</button>
        <p className="p">Bạn chưa có tài khoản ?
          <Link to='/register' style={{ textDecoration: 'none' }}><span className="span">Đăng ký</span></Link>
        </p>
      </form>
    </div>
  )
}

export default LoginForm