import { faEnvelope, faPrint } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

import React, { useEffect, useState } from 'react'
import '../../style/PrintBill.css'
import { useParams } from 'react-router-dom';
import billApis from '../../api/modules/bill.api';
import { addDays, format } from 'date-fns';
import userApis from '../../api/modules/user.api';

const PrintBill = () => {
    const [billInfo, setBillInfo] = useState('')
    const [userCreate, setUserCreate] = useState('')
    const [userApproved, setUserApproved] = useState('')
    const [userPayment, setUserPayment] = useState('')
    const { id } = useParams();
    const [check, setCheck] = useState(false)

    const formatDate = (date) => {
        const increasedDate = addDays(new Date(date), 0);
        const formattedDate = format(increasedDate, 'dd/MM/yyyy');
        return formattedDate;
    }
    const formattedPrice = (balance) => {
        const formattedBalance = balance.toLocaleString('vi-VN');

        return formattedBalance;
    }

    useEffect(() => {
        const getBillInfo = async () => {
            const meterRes = await billApis.getBillMeterById(id)
            if (meterRes.success && meterRes) {
                console.log(meterRes)
                setCheck(true)
                setBillInfo(meterRes.data)
                const createRes = await userApis.getById(meterRes.data.create_id)
                if (createRes.success && createRes) {
                    setUserCreate(createRes.data)
                }
                const approvedRes = await userApis.getById(meterRes.data.approved_id)
                if (approvedRes.success && approvedRes) {
                    setUserApproved(approvedRes.data)
                }
                const paymentUser = await userApis.getById(meterRes.data.done_id)
                if (paymentUser.success && paymentUser) {
                    setUserPayment(paymentUser.data)
                }
            }
            else {
                console.log(meterRes)
                const cabRes = await billApis.getBillCabById(id)
                if (cabRes.success && cabRes) {
                    setCheck(false)
                    setBillInfo(cabRes.data)
                    console.log(cabRes)
                    const createRes = await userApis.getById(cabRes.data.create_id)
                    if (createRes.success && createRes) {
                        setUserCreate(createRes.data)
                    }
                    const approvedRes = await userApis.getById(cabRes.data.approved_id)
                    if (approvedRes.success && approvedRes) {
                        setUserApproved(approvedRes.data)
                    }
                    const paymentUser = await userApis.getById(cabRes.data.done_id)
                    if (paymentUser.success && paymentUser) {
                        setUserPayment(paymentUser.data)
                    }
                }
                else {
                    console.log(cabRes)
                }
            }
        }
        getBillInfo()
    }, [])

    return (
        <div className='main-print-bill'>
            <button className='btn-print-bill'><FontAwesomeIcon icon={faPrint} />Xuất hoá đơn</button>
            <div className='form-print-bill'>
                <div className='header-print-bill'>
                    <label>PTIT</label>
                </div>
                <div className='body-print-bill'>
                    <div className='body-top-print-bill'>
                        <div className='left-top-print-bill'>
                            <label>Thông tin hoá đơn</label>
                            <div className='flex-group'>
                                <label>Mã hoá đơn:</label>
                                <span>{billInfo && billInfo.bill_id}</span>
                            </div>
                            <div className='flex-group'>
                                <label>Ngày hết hạn:</label>
                                <span>{billInfo && formatDate(billInfo.due_date)}</span>
                            </div>
                            <div className='flex-group'>
                                <label>Nhân viên tạo hoá đơn:</label>
                                <span>{userCreate && `${userCreate.id} - ${userCreate.firstname} ${userCreate.lastname}`}</span>
                            </div>
                            <div className='flex-group'>
                                <label>Nhân viên duyệt hoá đơn:</label>
                                <span>{userApproved && `${userApproved.id} - ${userApproved.firstname} ${userApproved.lastname}`}</span>
                            </div>
                            <div className='flex-group'>
                                <label>Nhân viên thanh toán hoá đơn:</label>
                                <span>{userPayment && `${userPayment.id} - ${userPayment.firstname} ${userPayment.lastname}`}</span>
                            </div>
                            <div className='flex-group'>
                                <label>Trạng thái:</label>
                                <span>{billInfo && billInfo.status}</span>
                            </div>
                        </div>
                        <div className='right-top-print-bill'>
                            <label>Thông tin khách hàng</label>
                            <div className='flex-group'>
                                <label>Mã khách hàng:</label>
                                <span>{billInfo && billInfo.user_id}</span>
                            </div>
                            <div className='flex-group'>
                                <label>Họ tên khách hàng:</label>
                                <span>{billInfo && `${billInfo.firstname} ${billInfo.lastname}`}</span>
                            </div>
                            <div className='flex-group'>
                                <label>Số điện thoại:</label>
                                <span>{billInfo && billInfo.phone}</span>
                            </div>
                            <div className='flex-group'>
                                <label>Email:</label>
                                <span>{billInfo && billInfo.email}</span>
                            </div>
                            <div className='flex-group'>
                                <label>Địa chỉ:</label>
                                <span>{billInfo && billInfo.address}</span>
                            </div>
                        </div>
                    </div>
                    <div className='body-bottom-print-bill'>
                    <label>Thông tin dịch vụ</label>
                        {check && <div className='flex-row'>
                            <div className='flex-column'>
                                <label>Nhà cung cấp</label>
                                <span>{billInfo && billInfo.supplier_name}</span>
                            </div>
                            <div className='flex-column'>
                                <label>Dịch vụ</label>
                                <span>{billInfo && billInfo.service_name}</span>
                            </div>
                            <div className='flex-column'>
                                <label>Chỉ số cũ - Ngày ghi</label>
                                <span>{billInfo && `${billInfo.meter_reading_old} - ${formatDate(billInfo.meter_date_old)}`}</span>
                            </div>
                            <div className='flex-column'>
                                <label>Chỉ số mới - Ngày ghi</label>
                                <span>{billInfo && `${billInfo.meter_reading_new} - ${formatDate(billInfo.meter_date_new)}`}</span>
                            </div>
                            <div className='flex-column'>
                                <label>Kỳ thanh toán</label>
                                <span>{billInfo && `${formatDate(billInfo.meter_date_old)} - ${formatDate(billInfo.meter_date_new)}`}</span>
                            </div>
                            <div className='flex-column'>
                                <label>Tiêu thụ</label>
                                <span>{billInfo && (billInfo.meter_reading_new - billInfo.meter_reading_old)}</span>
                            </div>
                            <div className='flex-column'>
                                <label>Giá tiền</label>
                                <span>{billInfo && formattedPrice(billInfo.service_price)} đ</span>
                            </div>
                        </div>}
                    </div>
                </div>
                <div className='footer-print-bill'>
                    <div>
                        <label>Thông tin liên hệ</label>
                        <a href='https://www.facebook.com/ntp270301/'><FontAwesomeIcon icon={faFacebook} /> Facebook: Nguyễn Tuấn Phụng </a>
                        <label><FontAwesomeIcon icon={faEnvelope} /> Email: nguyentuanphung270301@gmail.com</label>
                    </div>
                    <label>THANK YOU</label>
                </div>
            </div>
        </div>
    )
}

export default PrintBill