import React, { useEffect, useState } from 'react'
import '../../style/Navbar.css'
import { Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretLeft, faClipboardUser, faLock, faArrowRightToBracket, faChevronLeft, faChevronRight, faHouse, faMoneyCheckDollar, faFileInvoice, faServer, faWrench, faUser, faBuilding, faMicrochip, faKeyboard, faBolt, faTv, faShieldHalved, faUsers, faUnlockKeyhole, faFileMedical, faFileCircleCheck, faCashRegister, faCreditCard, faListCheck, faChartPie } from "@fortawesome/free-solid-svg-icons";
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
    const [isOpenAuth, setIsOpenAuth] = useState(false)
    const [isOpenBill, setIsOpenBill] = useState(false)
    const [isOpenPaymentBill, setIsOpenPaymentBill] = useState(false)


    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        toast.success("Đăng xuất thành công!")
        navigate('/')

    }

    useEffect(() => {
        const getInfo = async () => {
            const res = await userApis.getUserAuthByUsername(username);
            if (res.success && res) {
                console.log(res);
                const rolecodes = new Set();
                const filteredData = res.data.filter((item) => {
                    if (!rolecodes.has(item.rolecode)) {
                        rolecodes.add(item.rolecode);
                        return true;
                    }
                    return false;
                });
                setUserInfo(filteredData);

                // Tạo một mảng để lưu trữ các giá trị screencode
                const screencodes = [];

                // Lặp qua mỗi đối tượng trong res.data và kiểm tra xem có thêm screencode mới hay không
                res.data.forEach((item) => {
                    const { screencode } = item;
                    if (!screencodes.includes(screencode)) {
                        screencodes.push(screencode);
                    }
                });
                // Lưu mảng screencodes vào state
                setListRoleUsers(screencodes);

            } else {
                console.log(res);
            }
        };
        getInfo();
    }, [username]);


    const openMenuClick = () => {
        setOpenMenu(!openMenu)
        if (openMenu) {
            document.documentElement.style.setProperty('--width-menu', '300px');
        }
        else {
            document.documentElement.style.setProperty('--width-menu', '60px');
            setIsOpenAdmin(false)
            setIsOpenWrite(false)
            setIsOpenAuth(false)
            setIsOpenBill(false)
            setIsOpenPaymentBill(false)
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
                    <img src={require('../../images/Logo_PTIT_University.png')} alt='logo' className='logo-menu' />
                </div>
                <div className='list-menu'>
                    <ul className={`${openMenu ? 'close' : ''}`}>
                        <Link to='/mainpage/home' style={{ textDecoration: 'none', color: 'inherit' }}>
                            <li className={`li-menu ${openMenu ? 'close' : ''}`}>
                                <FontAwesomeIcon icon={faHouse} className={`${openMenu ? '' : 'icon-close'}`} />
                                {!openMenu ? <span style={{ marginLeft: '10px' }}>Trang chủ</span> : <span></span>}
                            </li>
                        </Link>
                        {(listRoleUsers.includes('Full_Admin') || listRoleUsers.includes('Admin_User') || listRoleUsers.includes('Admin_Supplier') || listRoleUsers.includes('Admin_Service')) && <li className={`admin-menu ${openMenu ? 'close' : `ul ${isOpenAdmin ? 'open' : ''}`}`}>
                            <div>
                                <div onClick={() => setIsOpenAdmin(!isOpenAdmin)}>
                                    <FontAwesomeIcon icon={faServer} className={`${openMenu ? '' : 'icon-close'}`} />
                                    {!openMenu ? <span style={{ marginLeft: '10px' }}>Quản trị</span> : <span></span>}
                                </div>
                                {!openMenu && <ul className={`${isOpenAdmin ? 'open' : ''}`}>
                                    {(listRoleUsers.includes('Full_Admin') || listRoleUsers.includes('Admin_User')) && <Link to='/mainpage/admin/user' style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <li className='admin-li'>
                                            <FontAwesomeIcon icon={faUser} style={{ margin: '0px 20px 0px 50px' }} />
                                            <span>Quản trị người dùng</span>
                                        </li>
                                    </Link>}
                                    {(listRoleUsers.includes('Full_Admin') || listRoleUsers.includes('Admin_Supplier')) && <Link to='/mainpage/admin/supplier' style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <li className='admin-li'>
                                            <FontAwesomeIcon icon={faBuilding} style={{ margin: '0px 20px 0px 50px' }} />
                                            <span>Quản trị nhà cung cấp</span>
                                        </li>
                                    </Link>}
                                    {(listRoleUsers.includes('Full_Admin') || listRoleUsers.includes('Admin_Service')) && <Link to='/mainpage/admin/service' style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <li className='admin-li'>
                                            <FontAwesomeIcon icon={faMicrochip} style={{ margin: '0px 20px 0px 50px' }} />
                                            <span>Quản trị dịch vụ</span>
                                        </li>
                                    </Link>}
                                    <Link to='/mainpage/admin/accountpay' style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <li className='admin-li'>
                                            <FontAwesomeIcon icon={faUser} style={{ margin: '0px 20px 0px 50px' }} />
                                            <span>Quản trị tài khoản thanh toán người dùng</span>
                                        </li></Link>
                                </ul>}
                            </div>
                        </li>}
                        {(listRoleUsers.includes('Full_Admin') || listRoleUsers.includes('Full_Writing') || listRoleUsers.includes('Writing_Meter') || listRoleUsers.includes('Writing_Cab')) && <li className={`write-menu ${openMenu ? 'close' : `ul ${isOpenWrite ? 'open' : ''}`}`}>
                            <div>
                                <div onClick={() => setIsOpenWrite(!isOpenWrite)}>
                                    <FontAwesomeIcon icon={faKeyboard} className={`${openMenu ? '' : 'icon-close'}`} />
                                    {!openMenu ? <span style={{ marginLeft: '10px' }}>Nhập liệu</span> : <span></span>}
                                </div>
                                {!openMenu && <ul className={`${isOpenWrite ? 'open' : ''}`}>
                                    {(listRoleUsers.includes('Full_Admin') || listRoleUsers.includes('Full_Writing') || listRoleUsers.includes('Writing_Meter')) && <Link to='/mainpage/meterindex' style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <li className='admin-li'>
                                            <FontAwesomeIcon icon={faBolt} style={{ margin: '0px 20px 0px 50px' }} />
                                            <span>Nhập liệu điện nước</span>
                                        </li>
                                    </Link>}
                                    {(listRoleUsers.includes('Full_Admin') || listRoleUsers.includes('Full_Writing') || listRoleUsers.includes('Writing_Cab')) && <Link to='/mainpage/cabtv' style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <li className='admin-li'>
                                            <FontAwesomeIcon icon={faTv} style={{ margin: '0px 20px 0px 50px' }} />
                                            <span>Nhập liệu truyền hình cab</span>
                                        </li>
                                    </Link>}
                                </ul>}
                            </div>
                        </li>}
                        {(listRoleUsers.includes('Full_Admin') || listRoleUsers.includes('Admin_Role') || listRoleUsers.includes('Role_Screen') || listRoleUsers.includes('User_Role')) && <li className={`admin-menu ${openMenu ? 'close' : `ul ${isOpenAuth ? 'open' : ''}`}`}>
                            <div>
                                <div onClick={() => setIsOpenAuth(!isOpenAuth)}>
                                    <FontAwesomeIcon icon={faWrench} className={`${openMenu ? '' : 'icon-close'}`} />
                                    {!openMenu ? <span style={{ marginLeft: '10px' }}>Phân quyền</span> : <span></span>}
                                </div>
                                {!openMenu && <ul className={`${isOpenAuth ? 'open' : ''}`}>
                                    {(listRoleUsers.includes('Full_Admin') || listRoleUsers.includes('Admin_Role')) && <Link to='/mainpage/role' style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <li className='admin-li'>
                                            <FontAwesomeIcon icon={faUsers} style={{ margin: '0px 20px 0px 50px' }} />
                                            <span>Quản trị role</span>
                                        </li>
                                    </Link>}
                                    {(listRoleUsers.includes('Full_Admin') || listRoleUsers.includes('Role_Screen')) && <Link to='/mainpage/screen-role' style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <li className='admin-li'>
                                            <FontAwesomeIcon icon={faUnlockKeyhole} style={{ margin: '0px 20px 0px 50px' }} />
                                            <span>Cấp quyền cho role</span>
                                        </li>
                                    </Link>}
                                    {(listRoleUsers.includes('Full_Admin') || listRoleUsers.includes('User_Role')) && <Link to='/mainpage/user-auth' style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <li className='admin-li'>
                                            <FontAwesomeIcon icon={faShieldHalved} style={{ margin: '0px 20px 0px 50px' }} />
                                            <span>Cấp role cho tài khoản</span>
                                        </li>
                                    </Link>}
                                </ul>}
                            </div>
                        </li>}
                        {listRoleUsers.includes('BankCard') && <Link to='/mainpage/bankaccount' style={{ textDecoration: 'none', color: 'white' }}>
                            <li className={`li-menu ${openMenu ? 'close' : ''}`}>
                                <FontAwesomeIcon icon={faMoneyCheckDollar} className={`${openMenu ? '' : 'icon-close'}`} />
                                {!openMenu ? <span style={{ marginLeft: '10px' }}>Tài khoản thanh toán</span> : <span></span>}
                            </li>
                        </Link>}

                        {(listRoleUsers.includes('Full_Admin') || listRoleUsers.includes('Full_Bill') || listRoleUsers.includes('Bill_Create') || listRoleUsers.includes('Bill_Approved') || listRoleUsers.includes('User_Payment')) && <li className={`write-menu ${openMenu ? 'close' : `ul ${isOpenBill ? 'open' : ''}`}`}>
                            <div>
                                <div onClick={() => setIsOpenBill(!isOpenBill)}>
                                    <FontAwesomeIcon icon={faFileInvoice} className={`${openMenu ? '' : 'icon-close'}`} />
                                    {!openMenu ? <span style={{ marginLeft: '10px' }}>Quản lý hoá đơn</span> : <span></span>}
                                </div>
                                {!openMenu && <ul className={`${isOpenBill ? 'open' : ''}`}>
                                    {(listRoleUsers.includes('Full_Admin') || listRoleUsers.includes('Full_Bill') || listRoleUsers.includes('Bill_Create')) && <Link to='/mainpage/bill-create' style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <li className='admin-li'>
                                            <FontAwesomeIcon icon={faFileMedical} style={{ margin: '0px 20px 0px 50px' }} />
                                            <span>Tạo hoá đơn</span>
                                        </li>
                                    </Link>}
                                    {(listRoleUsers.includes('Full_Admin') || listRoleUsers.includes('Full_Bill') || listRoleUsers.includes('Bill_Approved')) && <Link to='/mainpage/bill-approved' style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <li className='admin-li'>
                                            <FontAwesomeIcon icon={faFileCircleCheck} style={{ margin: '0px 20px 0px 50px' }} />
                                            <span>Duyệt hoá đơn</span>
                                        </li>
                                    </Link>}
                                    {(listRoleUsers.includes('Full_Admin') || listRoleUsers.includes('Full_Bill') || listRoleUsers.includes('User_Payment')) && <Link to='/mainpage/bill-payment-customer' style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <li className='admin-li'>
                                            <FontAwesomeIcon icon={faCashRegister} style={{ margin: '0px 20px 0px 50px' }} />
                                            <span>Thanh toán hoá đơn khách hàng</span>
                                        </li>
                                    </Link>}
                                </ul>}
                            </div>
                        </li>}
                        {(listRoleUsers.includes('Full_Admin') || listRoleUsers.includes('Bill_Customer') || listRoleUsers.includes('Payment_Bill') || listRoleUsers.includes('Bill_List')) && <li className={`write-menu ${openMenu ? 'close' : `ul ${isOpenPaymentBill ? 'open' : ''}`}`}>
                            <div>
                                <div onClick={() => setIsOpenPaymentBill(!isOpenPaymentBill)}>
                                    <FontAwesomeIcon icon={faFileInvoice} className={`${openMenu ? '' : 'icon-close'}`} />
                                    {!openMenu ? <span style={{ marginLeft: '10px' }}>Hoá đơn</span> : <span></span>}
                                </div>
                                {!openMenu && <ul className={`${isOpenPaymentBill ? 'open' : ''}`}>
                                    {(listRoleUsers.includes('Full_Admin') || listRoleUsers.includes('Payment_Bill') || listRoleUsers.includes('Bill_Customer')) && <Link to='/mainpage/payment-online' style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <li className='admin-li'>
                                            <FontAwesomeIcon icon={faCreditCard} style={{ margin: '0px 20px 0px 50px' }} />
                                            <span>Thanh toán hoá đơn</span>
                                        </li>
                                    </Link>}
                                    {(listRoleUsers.includes('Full_Admin') || listRoleUsers.includes('Bill_List') || listRoleUsers.includes('Bill_Customer')) && <Link to='/mainpage/my-bill' style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <li className='admin-li'>
                                            <FontAwesomeIcon icon={faListCheck} style={{ margin: '0px 20px 0px 50px' }} />
                                            <span>Hoá đơn của tôi</span>
                                        </li>
                                    </Link>}
                                </ul>}
                            </div>
                        </li>}
                        {listRoleUsers.includes('Full_Admin') && <Link to='/mainpage/report' style={{ textDecoration: 'none', color: 'white' }}>
                            <li className={`li-menu ${openMenu ? 'close' : ''}`}>
                                <FontAwesomeIcon icon={faChartPie} className={`${openMenu ? '' : 'icon-close'}`} />
                                {!openMenu ? <span style={{ marginLeft: '10px' }}>Báo cáo & Thống kê</span> : <span></span>}
                            </li>
                        </Link>}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Navbar