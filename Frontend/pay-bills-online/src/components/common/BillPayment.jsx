import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import '../../style/BillPayment.css'
import billApis from '../../api/modules/bill.api'
import { Typography } from '@mui/material'
import { addDays, format } from 'date-fns'
import userApis from '../../api/modules/user.api'
import { toast } from 'react-toastify'
import paymentApis from '../../api/modules/payment.api'
import SupplierBankCardApis from '../../api/modules/supplierbankcard.api'

const BillPayment = ({ id, onClose, check }) => {

    const [billInfo, setBillInfo] = useState('')
    const [userCreate, setUserCreate] = useState('')
    const [userApproved, setUserApproved] = useState('')
    const [currentTime, setCurrentTime] = useState('')
    const [description, setDescription] = useState('')

    const [doneId, setDoneId] = useState('')

    const username = localStorage.getItem('username')

    useEffect(() => {
        const getUserInfo = async () => {
            const res = await userApis.getUserByUsername(username)
            if (res.success && res) {
                setDoneId(res.data.id)
            }
            else {
                console.log(res)
            }
        }
        getUserInfo()
    }, [])

    useEffect(() => {
        const updateCurrentTime = () => {
            const now = new Date();
            const formattedTime = format(now, 'yyyy-MM-dd HH:mm:ss');
            setCurrentTime(formattedTime);
        };

        // Gọi hàm updateCurrentTime mỗi giây
        const intervalId = setInterval(updateCurrentTime, 1000);

        // Hủy interval khi component unmount
        return () => clearInterval(intervalId);

        // Chỉ gọi lại useEffect khi giá trị của currentTime thay đổi
    }, [currentTime]);

    useEffect(() => {
        const getBillInfo = async () => {
            if (check) {
                const res = await billApis.getBillMeterById(id)
                if (res.success && res) {
                    const createRes = await userApis.getById(res.data.create_id)
                    if (createRes.success && createRes) {
                        setUserCreate(createRes.data)
                    }
                    const approvedRes = await userApis.getById(res.data.approved_id)
                    if (approvedRes.success && approvedRes) {
                        setUserApproved(approvedRes.data)
                    }
                    console.log(res)
                    setBillInfo(res.data)
                }
                else {
                    console.log(res)
                }
            }
            else {
                const res = await billApis.getBillCabById(id)
                if (res.success && res) {
                    const createRes = await userApis.getById(res.data.create_id)
                    if (createRes.success && createRes) {
                        setUserCreate(createRes.data)
                    }
                    const approvedRes = await userApis.getById(res.data.approved_id)
                    if (approvedRes.success && approvedRes) {
                        setUserApproved(approvedRes.data)
                    }
                    console.log(res)
                    setBillInfo(res.data)
                }
                else {
                    console.log(res)
                }
            }
        }
        getBillInfo()
    }, [])

    const formatDate = (date) => {
        const increasedDate = addDays(new Date(date), 0);
        const formattedDate = format(increasedDate, 'dd/MM/yyyy');
        return formattedDate;
    }
    const formattedPrice = (balance) => {
        const formattedBalance = balance.toLocaleString('vi-VN');

        return formattedBalance;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const billData = {
            done_id: doneId,
            status: 'ĐÃ THANH TOÁN'
        }

        const paymentData = {
            payment_date: currentTime,
            payment_method: 'Giao dịch tại quầy',
            description: description,
            bill_id: id,
            userbankcard_id: null
        }

        const supplierRes = await SupplierBankCardApis.getById(billInfo.supplier_id)
        if (supplierRes.success) {
            const newSupplierBalance = supplierRes.data.balance + billInfo.amount
            const supplierData = {
                balance: newSupplierBalance
            }
            const res = await SupplierBankCardApis.updateSupplierBankCard(billInfo.supplier_id, supplierData)
            if (res.success) {
                const billRes = await billApis.updateStatusBillPayment(id, billData)
                if (billRes.success && billRes) {
                    const paymentRes = await paymentApis.createPayment(paymentData)
                    if (paymentRes.success && paymentRes) {
                        toast.success('Thanh toán hoá đơn thành công')
                        onClose()
                    }
                    else {
                        toast.error('Thanh toán hoá đơn thất bại')
                        console.log(paymentRes)
                        onClose()
                    }
                }
                else {
                    console.log(billRes)
                }
            }
            else {
                console.log(res)
            }
        }
        else {
            console.log(supplierRes)
        }
    }

    return (
        <div className='overlay'>
            <div className='main-bill-payment'>
                <FontAwesomeIcon icon={faXmark} onClick={onClose} className='icon-close-bill-payment' />
                <div className='body-bill-payment'>
                    <div className='bill-payment-info'>
                        <div className='flex-info'>
                            <label>Mã hoá đơn: </label>
                            <label className='label-info'>{billInfo && billInfo.bill_id}</label>
                        </div>
                        <div className='flex-info'>
                            <label>Ngày hết hạn: </label>
                            <label className='label-info'>{billInfo && formatDate(billInfo.due_date)}</label>
                        </div>
                        <div className='flex-info'>
                            <label>Người tạo hoá đơn: </label>
                            <label className='label-info'>{userCreate && `${userCreate.id} - ${userCreate.firstname} ${userCreate.lastname}`}</label>
                        </div>
                        <div className='flex-info'>
                            <label>Người duyệt hoá đơn: </label>
                            <label className='label-info'>{userApproved && `${userApproved.id} - ${userApproved.firstname} ${userApproved.lastname}`}</label>
                        </div>
                        <div className='flex-info'>
                            <label>Trạng thái: </label>
                            <label className='label-info'>{billInfo && billInfo.status}</label>
                        </div>
                    </div>
                    <div className='bill-payment-customer'>
                        <div className='flex-info'>
                            <label>Mã khách hàng: </label>
                            <label className='label-info'>{billInfo && billInfo.customer_code}</label>
                        </div>
                        <div className='flex-info'>
                            <label>Tên khách hàng: </label>
                            <label className='label-info'>{billInfo && `${billInfo.customer_name}`}</label>
                        </div>
                        <div className='flex-info'>
                            <label>Số điện thoại: </label>
                            <label className='label-info'>{billInfo && billInfo.customer_phone}</label>
                        </div>
                        <div className='flex-info'>
                            <label>Địa chỉ: </label>
                            <label className='label-info'>{billInfo && billInfo.customer_address}</label>
                        </div>
                    </div>
                    <div className='bill-payment-service'>
                        {check && <><div className='flex-info'>
                            <label>Nhà cung cấp: </label>
                            <label className='label-info'>{billInfo && billInfo.supplier_name}</label>
                        </div>
                            <div className='flex-info'>
                                <label>Dịch vụ: </label>
                                <label className='label-info'>{billInfo && billInfo.service_name}</label>
                            </div>
                            <div className='flex-info'>
                                <label>Giá 1 đơn vị (Kwh hoặc khối): </label>
                                <label className='label-info'>{billInfo && formattedPrice(billInfo.service_price)} đ</label>
                            </div>
                            <div className='flex-info'>
                                <label>Chỉ số cũ - ngày ghi: </label>
                                <label className='label-info'>{billInfo && `${billInfo.meter_reading_old} - ${formatDate(billInfo.meter_date_old)}`}</label>
                            </div>
                            <div className='flex-info'>
                                <label>Chỉ số mới - ngày ghi: </label>
                                <label className='label-info'>{billInfo && `${billInfo.meter_reading_new} - ${formatDate(billInfo.meter_date_new)}`}</label>
                            </div>
                            <div className='flex-info'>
                                <label>Kỳ thanh toán: </label>
                                <label className='label-info'>{billInfo && billInfo.payment_period}</label>
                            </div></>}
                        {!check && <>
                            <div className='flex-info'>
                                <label>Nhà cung cấp: </label>
                                <label className='label-info'>{billInfo && billInfo.supplier_name}</label>
                            </div>
                            <div className='flex-info'>
                                <label>Dịch vụ: </label>
                                <label className='label-info'>{billInfo && billInfo.service_name}</label>
                            </div>
                            <div className='flex-info'>
                                <label>Tên gói: </label>
                                <label className='label-info'>{billInfo && billInfo.package_name}</label>
                            </div>
                            <div className='flex-info'>
                                <label>Ngày bắt đầu: </label>
                                <label className='label-info'>{billInfo && `${formatDate(billInfo.start_date)}`}</label>
                            </div>
                            <div className='flex-info'>
                                <label>Ngày kết thúc: </label>
                                <label className='label-info'>{billInfo && `${formatDate(billInfo.end_date)}`}</label>
                            </div>
                            <div className='flex-info'>
                                <label>Giá gói: </label>
                                <label className='label-info'>{billInfo && formattedPrice(billInfo.price)} đ</label>
                            </div>
                        </>}
                    </div>
                    <form className='form-bill-payment' onSubmit={handleSubmit}>
                        <div className='flex-info'>
                            <label>Ngày thanh toán: </label>
                            <label className='label-info'>{currentTime}</label>
                        </div>
                        <div className='flex-info'>
                            <label>Hình thức thanh toán: </label>
                            <select disabled={true}>
                                <option>Giao dịch tại quầy</option>
                            </select>
                        </div>
                        {check && <><div className='flex-info'>
                            <label>Tiêu thụ: </label>
                            <label className='label-info'>{billInfo && (billInfo.meter_reading_new - billInfo.meter_reading_old)}</label>
                        </div>
                            <div className='flex-info'>
                                <label>Giá 1 đơn vị: </label>
                                <label className='label-info'>{billInfo && formattedPrice(billInfo.service_price)} đ</label>
                            </div></>}
                        <div className='flex-info'>
                            <label>Tồng tiền hoá đơn: </label>
                            <label className='label-info'>{billInfo && formattedPrice(billInfo.amount)} đ</label>
                        </div>
                        <textarea onChange={(e) => setDescription(e.target.value)} placeholder='Mô tả' />
                        <button className='btn-bill-payment' type='submit'>THANH TOÁN</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default BillPayment