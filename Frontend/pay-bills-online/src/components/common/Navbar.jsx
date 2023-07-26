import React, { useEffect, useState } from 'react'
import '../../style/Navbar.css'
import { Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretLeft, faClipboardUser, faLock, faArrowRightToBracket, faChevronLeft, faChevronRight, faHouse, faMoneyCheckDollar, faFileInvoice, faServer, faWrench, faUser, faBuilding, faMicrochip, faKeyboard, faBolt, faTv } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import userApis from '../../api/modules/user.api';
import userAuthApis from '../../api/modules/user_auth.api';
import roleApis from '../../api/modules/role.api'


const Navbar = () => {

    const navigate = useNavigate()
    const username = localStorage.getItem('username')
    const [openForm, setOpenForm] = useState(false)
    const [openMenu, setOpenMenu] = useState(false)
    const [userInfo, setUserInfo] = useState([])
    const [listRoleUsers, setListRoleUsers] = useState([])
    const [isOpenAdmin, setIsOpenAdmin] = useState(false)
    const [isOpenWrite, setIsOpenWrite] = useState(false)


    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        toast.success("Đăng xuất thành công!")
        navigate('/')

    }
    useEffect(() => {
        const getInfo = async () => {
            const res = await userApis.getUserByUsername(username)
            if (res.success && res) {
                const result = await userAuthApis.getUserByUserId(res.data.id)
                if (result.success && result) {
                    const rolesPromises = result.data.map(async (item) => {
                        const role = await roleApis.getById(item.role_id)
                        if (role.success && role) {
                            return role.data
                        }
                        else {
                            console.log(role)
                        }
                    })
                    Promise.all(rolesPromises).then((roles) => {
                        // Lọc ra các giá trị role hợp lệ (không phải null) và cập nhật vào mảng trạng thái
                        const validRoles = roles.filter((role) => role !== null);
                        setUserInfo(validRoles);
                    });
                    Promise.all(rolesPromises).then((roles) => {
                        const roleCodesArray = roles.map((role) => role.rolecode);
                        setListRoleUsers(roleCodesArray);
                    });

                }
                else {
                    console.log(result)
                }
            }
            else {
                console.log(res)
            }
        }
        getInfo()
    }, [username])


    const openMenuClick = () => {
        setOpenMenu(!openMenu)
        if (openMenu) {
            document.documentElement.style.setProperty('--width-menu', '300px');
        }
        else {
            document.documentElement.style.setProperty('--width-menu', '60px');
            setIsOpenAdmin(false)
            setIsOpenWrite(false)
        }
    }

    return (
        <div className='main-nav'>
            <div className='header-nav'>
                {!openMenu ? <FontAwesomeIcon icon={faChevronLeft} style={{ color: 'white', fontSize: '20px', fontWeight: '500', marginLeft: '10px' }} onClick={openMenuClick} /> :
                    <FontAwesomeIcon icon={faChevronRight} style={{ color: 'white', fontSize: '20px', fontWeight: '500', marginLeft: '10px' }} onClick={openMenuClick} />}
                <Typography variant='h4'
                    sx={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        position: 'absolute',
                        left: '50px',
                        color: 'white'
                    }}>Vai trò: {userInfo && userInfo.map((item, index) => {
                        return <span style={{ marginRight: '10px' }} key={index}>{item.name} |</span>
                    })}  </Typography>
                <div className='header-user' onClick={() => setOpenForm(!openForm)}>
                    <Typography variant='h4'
                        sx={{
                            fontSize: '18px',
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
                <div className='menu-logo'>
                    <img src={require('../../images/Logo_PTIT_University.png')} alt='logo' className='logo-menu'/>
                </div>
                <div className='list-menu'>
                    <ul className={`${openMenu ? 'close' : ''}`}>
                        {(listRoleUsers.includes('ROLE_ADMIN') || listRoleUsers.includes('ROLE_CUSTOMER')) && (
                            <li className={`li-menu ${openMenu ? 'close' : ''}`}>
                                <FontAwesomeIcon icon={faHouse} className={`${openMenu ? '' : 'icon-close'}`} />
                                {!openMenu ? <span style={{ marginLeft: '10px' }}>Trang chủ</span> : <span></span>}
                            </li>
                        )}
                        {listRoleUsers.includes('ROLE_ADMIN') && <li className={`admin-menu ${openMenu ? 'close' : `ul ${isOpenAdmin ? 'open' : ''}`}`}>
                            <div>
                                <div onClick={() => setIsOpenAdmin(!isOpenAdmin)}>
                                    <FontAwesomeIcon icon={faServer} className={`${openMenu ? '' : 'icon-close'}`} />
                                    {!openMenu ? <span style={{ marginLeft: '10px' }}>Quản trị</span> : <span></span>}
                                </div>
                                {!openMenu && <ul className={`${isOpenAdmin ? 'open' : ''}`}>
                                    <Link to='/mainpage/admin/user' style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <li className='admin-li'>
                                            <FontAwesomeIcon icon={faUser} style={{ margin: '0px 20px 0px 50px' }} />
                                            <span>Quản trị người dùng</span>
                                        </li>
                                    </Link>
                                    <Link to='/mainpage/admin/supplier' style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <li className='admin-li'>
                                            <FontAwesomeIcon icon={faBuilding} style={{ margin: '0px 20px 0px 50px' }} />
                                            <span>Quản trị nhà cung cấp</span>
                                        </li>
                                    </Link>
                                    <Link to='/mainpage/admin/service' style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <li className='admin-li'>
                                            <FontAwesomeIcon icon={faMicrochip} style={{ margin: '0px 20px 0px 50px' }} />
                                            <span>Quản trị dịch vụ</span>
                                        </li>
                                    </Link>
                                </ul>}
                            </div>
                        </li>}
                        {listRoleUsers.includes('ROLE_ADMIN') && <li className={`li-menu ${openMenu ? 'close' : ''}`}>
                            <FontAwesomeIcon icon={faWrench} className={`${openMenu ? '' : 'icon-close'}`} />
                            {!openMenu ? <span style={{ marginLeft: '10px' }}>Phân quyền</span> : <span></span>}
                        </li>}
                        {listRoleUsers.includes('ROLE_ADMIN') && <li className={`write-menu ${openMenu ? 'close' : `ul ${isOpenWrite ? 'open' : ''}`}`}>
                            <div>
                                <div onClick={() => setIsOpenWrite(!isOpenWrite)}>
                                    <FontAwesomeIcon icon={faKeyboard} className={`${openMenu ? '' : 'icon-close'}`} />
                                    {!openMenu ? <span style={{ marginLeft: '10px' }}>Nhập liệu</span> : <span></span>}
                                </div>
                                {!openMenu && <ul className={`${isOpenWrite ? 'open' : ''}`}>
                                    <Link to='/mainpage/meterindex' style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <li className='admin-li'>
                                            <FontAwesomeIcon icon={faBolt} style={{ margin: '0px 20px 0px 50px' }} />
                                            <span>Nhập liệu điện nước</span>
                                        </li>
                                    </Link>
                                    <Link to='' style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <li className='admin-li'>
                                            <FontAwesomeIcon icon={faTv} style={{ margin: '0px 20px 0px 50px' }} />
                                            <span>Nhập liệu truyền hình cab</span>
                                        </li>
                                    </Link>
                                </ul>}
                            </div>
                        </li>}
                        {(listRoleUsers.includes('ROLE_ADMIN') || listRoleUsers.includes('ROLE_CUSTOMER')) && <Link to='/mainpage/bankaccount' style={{ textDecoration: 'none', color: 'white' }}>
                            <li className={`li-menu ${openMenu ? 'close' : ''}`}>
                                <FontAwesomeIcon icon={faMoneyCheckDollar} className={`${openMenu ? '' : 'icon-close'}`} />
                                {!openMenu ? <span style={{ marginLeft: '10px' }}>Tài khoản ngân hàng</span> : <span></span>}
                            </li>
                        </Link>}
                        {(listRoleUsers.includes('ROLE_ADMIN') || listRoleUsers.includes('ROLE_CUSTOMER')) && <li className={`li-menu ${openMenu ? 'close' : ''}`}>
                            <FontAwesomeIcon icon={faFileInvoice} className={`${openMenu ? '' : 'icon-close'}`} />
                            {!openMenu ? <span style={{ marginLeft: '10px' }}>Hoá đơn</span> : <span></span>}
                        </li>}

                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Navbar