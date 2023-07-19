import React, { useEffect, useState } from 'react'
import '../style/StartPage.css'
import { Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faAt, faPhone, faArrowRightFromBracket, faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import emailApis from '../api/modules/email.api';
import { toast } from 'react-toastify'
import userApis from '../api/modules/user.api';



const StartPage = () => {

  const [isHomeVisible, setIsHomeVisible] = useState(true);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [isContactVisible, setIsContactVisible] = useState(false);
  const [userInfo, setUserInfo] = useState('')
  const username = localStorage.getItem('username');
  const navigate = useNavigate()
  const [openLogout, setOpenLogout] = useState(false)
  const [checkUser, setCheckUser] = useState(false)

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleHomeClick = () => {
    setIsHomeVisible(true);
    setIsAboutVisible(false);
    setIsContactVisible(false);
  };

  const handleAboutClick = () => {
    setIsHomeVisible(false);
    setIsAboutVisible(true);
    setIsContactVisible(false);
  };

  const handleContactClick = () => {
    setIsHomeVisible(false);
    setIsAboutVisible(false);
    setIsContactVisible(true);
  };

  useEffect(() => {
    const getUserByUsername = async () => {
      const response = await userApis.getUserByUsername(username);
      if (response.success && response) {
        console.log(response)
        setUserInfo(response.data)
        setCheckUser(true)
      }
      else {
        console.log(response)
        setCheckUser(false)
      }
    }
    getUserByUsername();
  }, [username])


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Vui lòng điền đầy đủ thông tin vào form!')
    }
    else {
      try {
        const data = {
          name: name,
          email: email,
          message: message
        };

        const response = await emailApis.sendEmailContact(data);
        if (response && response.success) {
          toast.success('Email đã được gửi thành công');
          setName('');
          setEmail('');
          setMessage('');
        } else {
          toast.error(`Lỗi khi gửi email: ${response.error}`);
        }
      } catch (error) {
        toast.error(`Lỗi khi gửi email: ${error}`);
      }
    };
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setOpenLogout(false);
    setCheckUser(false);
    toast.success("Đăng xuất thành công!")
  }

  const handleStart = () => {
    if (checkUser){
      navigate('/mainpage/homepage')
    }
    else {
          toast.error('Vui lòng đăng nhập để vào trang web')
        }
  }

  return (
    <div className='main-start-page'>
      <header className='header'>
        <img className='header-logo' src={require('../images/logo.png')} alt='Logo' />
        <nav>
          <ul className='header-ul'>
            <li><Typography
              sx={{
                fontSize: '18px',
                fontWeight: '500',
                color: '#085edc',
                ":hover": {
                  color: '#e74c3c'
                }
              }}
              onClick={handleHomeClick}
            >TRANG CHỦ</Typography></li>
            <li><Typography sx={{
              fontSize: '18px',
              fontWeight: '500',
              color: '#085edc',
              ":hover": {
                color: '#e74c3c'
              }
            }}
              onClick={handleAboutClick}
            >GIỚI THIỆU</Typography></li>
            <li><Typography sx={{
              fontSize: '18px',
              fontWeight: '500',
              color: '#085edc',
              ":hover": {
                color: '#e74c3c'
              }
            }}
              onClick={handleContactClick}
            >LIÊN HỆ</Typography></li>
            <li>
              {!checkUser ? (<Link style={{ textDecoration: 'none' }} to='/login'>
                <button className='login-btn'>
                  <span className='login-text'>ĐĂNG NHẬP</span>
                </button>
              </Link>) : (
                <button className='login-btn' onClick={() => setOpenLogout(!openLogout)}>
                  <span className='login-text'>{userInfo.username}</span>
                </button>
              )
              }
            </li>
          </ul>
        </nav>
      </header>

      {openLogout && <div className='logout-form'>
        <button className='btn-logout' onClick={handleLogout}>
          <FontAwesomeIcon icon={faArrowRightFromBracket} className='sign' />
          <div className='text'>Đăng xuất</div>
        </button>
      </div>}

      <div className='main-home' style={{ display: isHomeVisible ? 'flex' : 'none' }}>
        <div className='home-text'>
          <Typography sx={{
            fontSize: '50px',
            fontWeight: '700',
            color: '#fff',
            textShadow: '0px 0px 10px #085edc, 0px 0px 20px #085edc, 0px 0px 30px #085edc, 0px 0px 40px #085edc, 0px 0px 70px #085edc, 0px 0px 80px #085edc, 0px 0px 100px #085edc, 0px 0px 150px #085edc',
          }}>BILLS</Typography>
          <Typography sx={{
            fontSize: '40px',
            fontWeight: '500',
            color: '#085edc',
            marginBottom: '20px',
          }}>PAYMENT ONLINE</Typography>
          <Typography sx={{
            fontSize: '18px',
            fontWeight: '400',
          }} >Efficiency at Your Fingertips: Experience the Power of our Web-Based Bill Payment Service for a Stress-Free Financial Life.</Typography>
          <button className="btn-start" onClick={handleStart}>
            <span className="hover-underline-animation">
              Bắt đầu
            </span>
            <FontAwesomeIcon icon={faArrowRightLong} className='icon-start'/>
          </button>
        </div>
        <img className='image-home' src={require('../images/image-home.png')} alt='Ảnh' />
      </div>

      <div className='main-about' style={{ display: isAboutVisible ? 'flex' : 'none' }}>
        <div className='about-text'>
          <Typography
            variant="h1"
            sx={{
              marginBottom: '40px',
              fontSize: '50px',
              fontWeight: '700',
              color: '#085edc',
              position: 'relative',
              display: 'inline-block',
              '::before': {
                content: '""',
                position: 'absolute',
                width: '100%',
                height: '5px',
                bottom: '-10px',
                left: '0',
                backgroundColor: '#085edc',
                transform: 'scaleX(0)',
                transition: 'transform 0.3s ease-in-out',
              },
              ':hover::before': {
                transform: 'scaleX(1)',
              },
            }}
          >ABOUT US</Typography>
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: '400',
              lineHeight: '1.5',
              color: '#333',
              textAlign: 'justify',
            }}
          >Welcome to my service
            we are dedicated to revolutionizing the way you manage and pay your bills.
            We understand that bill payments can often be time-consuming and cumbersome,
            involving manual processes, paper statements, and long queues.
            That's why we've created a seamless online platform that empowers you to take control of your finances with ease and convenience.
            With our user-friendly interface and secure payment system, you can say goodbye to the hassle of writing checks,
            mailing bills, or visiting multiple websites to pay your various bills. We've streamlined the entire process,
            allowing you to make payments for a wide range of services all in one place. Whether it's your utilities, credit cards,
            loans, subscriptions, or any other bills, we've got you covered.</Typography>
        </div>
        <img className='image-about' src={require('../images/about-image.png')} alt='Ảnh' />
      </div>
      <div className='main-contact' style={{ display: isContactVisible ? 'flex' : 'none' }}>
        <div className='contact-form'>
          <Typography
            variant="h1"
            sx={{
              marginBottom: '20px',
              fontSize: '50px',
              fontWeight: '700',
              color: '#085edc',
              position: 'relative',
              display: 'inline-block',
              '::before': {
                content: '""',
                position: 'absolute',
                width: '100%',
                height: '5px',
                bottom: '-10px',
                left: '0',
                backgroundColor: '#085edc',
                transform: 'scaleX(0)',
                transition: 'transform 0.3s ease-in-out',
              },
              ':hover::before': {
                transform: 'scaleX(1)',
              },
            }}
          >CONTACT US</Typography>
          <Typography sx={{
            fontSize: '18px',
            fontWeight: '400',
            lineHeight: '1.5',
            color: '#333',
            textAlign: 'justify',
          }}><FontAwesomeIcon icon={faLocationDot} /> Address: 97 Đ. Man Thiện, Hiệp Phú, TP Thủ Đức, Thành phố Hồ Chí Minh</Typography>
          <Typography sx={{
            fontSize: '18px',
            fontWeight: '400',
            lineHeight: '1.5',
            color: '#333',
            textAlign: 'justify',
          }}><FontAwesomeIcon icon={faAt} /> Email: nguyentuanphung270301@gmail.com</Typography>
          <Typography sx={{
            fontSize: '18px',
            fontWeight: '400',
            lineHeight: '1.5',
            color: '#333',
            textAlign: 'justify',
          }}><FontAwesomeIcon icon={faPhone} /> Phone: +84 828532784</Typography>
          <a href='https://www.facebook.com/ntp270301/' style={{ textDecoration: 'none', color: 'inherit' }}><Typography sx={{
            fontSize: '18px',
            fontWeight: '400',
            lineHeight: '1.5',
            color: '#333',
            textAlign: 'justify',
            marginBottom: '10px'
          }} ><FontAwesomeIcon icon={faFacebook} /> Facebook: Nguyễn Tuấn Phụng</Typography></a>
          <form className='form-contact' onSubmit={handleSubmit}>
            <input
              placeholder='Nhập tên của bạn'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                fontSize: '16px'
              }}
            />
            <input
              placeholder='Nhập địa chỉ email của bạn'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                fontSize: '16px'
              }}
            />
            <textarea
              placeholder='Nhập lời nhắn của bạn'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                fontSize: '16px'
              }}
            />
            <button type='submit'
              style={{
                fontSize: '16px'
              }}
            >Send</button>
          </form>
        </div>
        <img className='image-contact' src={require('../images/image-contact.png')} alt='Ảnh' />
      </div>
    </div>
  )
}

export default StartPage