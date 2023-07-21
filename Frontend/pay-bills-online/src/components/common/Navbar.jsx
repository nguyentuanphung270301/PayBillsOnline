import React, { useState } from 'react'
import '../../style/Navbar.css'
import { Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretLeft, faClipboardUser, faLock, faArrowRightToBracket, faChevronLeft, faChevronRight, faHouse, faMoneyCheckDollar, faFileInvoice } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const Navbar = () => {

    const navigate = useNavigate()
    const username = localStorage.getItem('username')
    const [openForm, setOpenForm] = useState(false)
    const [openMenu, setOpenMenu] = useState(false)

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        toast.success("Đăng xuất thành công!")
        navigate('/')

    }

    const openMenuClick = () => {
        setOpenMenu(!openMenu)
        if (openMenu) {
            document.documentElement.style.setProperty('--width-menu', '300px');
        }
        else {
            document.documentElement.style.setProperty('--width-menu', '60px');
        }
    }

    return (
        <div className='main-nav'>
            <div className='header-nav'>
                {!openMenu ? <FontAwesomeIcon icon={faChevronLeft} style={{ color: 'white', fontSize: '20px', fontWeight: '500', marginLeft: '10px' }} onClick={openMenuClick} /> :
                    <FontAwesomeIcon icon={faChevronRight} style={{ color: 'white', fontSize: '20px', fontWeight: '500', marginLeft: '10px' }} onClick={openMenuClick} />}
                <div className='header-user' onClick={() => setOpenForm(!openForm)}>
                    <Typography variant='h4'
                        sx={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: 'white'
                        }}
                    >Xin chào, {username}</Typography>
                    {openForm ? (<FontAwesomeIcon icon={faCaretDown}
                        style={{
                            color: 'white',
                            fontSize: '20px',
                            marginLeft: '10px',
                        }} />) : (<FontAwesomeIcon icon={faCaretLeft}
                            style={{
                                color: 'white',
                                fontSize: '20px',
                                marginLeft: '10px',
                            }} />)}
                </div>
                <div className={`form-logout ${openForm ? 'show' : ''}`}>
                    <Link to='/mainpage/info' style={{ textDecoration: 'none' }}>
                        <div className='form-item-1'>
                            <FontAwesomeIcon icon={faClipboardUser} style={{
                                color: 'white',
                                fontSize: '20px',
                                margin: '0px 10px 0px 10px',
                            }} />
                            <Typography sx={{
                                fontSize: '16px',
                                fontWeight: '500',
                                color: 'white'
                            }}>Thông tin cá nhân</Typography>
                        </div>
                    </Link>
                    <Link to='/mainpage/changepassword' style={{ textDecoration: 'none' }}>
                        <div className='form-item-2'>
                            <FontAwesomeIcon icon={faLock} style={{
                                color: 'white',
                                fontSize: '20px',
                                margin: '0px 10px 0px 10px',
                            }} />
                            <Typography sx={{
                                fontSize: '16px',
                                fontWeight: '500',
                                color: 'white'
                            }}>Đổi mật khẩu</Typography>
                        </div>
                    </Link>
                    <div className='form-item-3' onClick={handleLogout}>
                        <FontAwesomeIcon icon={faArrowRightToBracket} style={{
                            color: 'white',
                            fontSize: '20px',
                            margin: '0px 10px 0px 10px',
                        }} />
                        <Typography sx={{
                            fontSize: '16px',
                            fontWeight: '500',
                            color: 'white'
                        }}>Đăng xuất</Typography>
                    </div>
                </div>
            </div>

            <div className='menu-nav' style={{ alignItems: `${!openMenu ? '' : 'center'}` }}>
                <div className='menu-title'>
                    {!openMenu && <span>BILL PAYMENT SYSTEM</span>}
                </div>
                <div className='list-menu'>
                    <ul className={`${openMenu ? 'close' : ''}`}>
                        <li className={`li-menu ${openMenu ? 'close' : ''}`}>
                            <FontAwesomeIcon icon={faHouse} className={`${openMenu ? '' : 'icon-close'}`} />
                            {!openMenu ? <span style={{ marginLeft: '10px' }}>Trang chủ</span> : <span></span>}
                        </li>
                        <Link to='/mainpage/bankaccount' style={{ textDecoration: 'none', color: 'white' }}>
                            <li className={`li-menu ${openMenu ? 'close' : ''}`}>
                                <FontAwesomeIcon icon={faMoneyCheckDollar} className={`${openMenu ? '' : 'icon-close'}`} />
                                {!openMenu ? <span style={{ marginLeft: '10px' }}>Tài khoản ngân hàng</span> : <span></span>}
                            </li>
                        </Link>
                        <li className={`li-menu ${openMenu ? 'close' : ''}`}>
                            <FontAwesomeIcon icon={faFileInvoice} className={`${openMenu ? '' : 'icon-close'}`} />
                            {!openMenu ? <span style={{ marginLeft: '10px' }}>Hoá đơn</span> : <span></span>}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Navbar