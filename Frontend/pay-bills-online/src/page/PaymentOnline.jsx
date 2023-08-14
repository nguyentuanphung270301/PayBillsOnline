import React, { useEffect, useState } from 'react'
import '../style/PaymentOnline.css'
import meterApis from '../api/modules/meterindex.api'
import cabApis from '../api/modules/cab.api'
import { addDays, format } from 'date-fns'
import billApis from '../api/modules/bill.api'
import userApis from '../api/modules/user.api'
import { toast } from 'react-toastify'
import userBankCardApis from '../api/modules/userbankcard.api'
import { Avatar, CircularProgress, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarcode, faBuildingColumns, faCalendarXmark, faCreditCard, faDollarSign, faUser } from '@fortawesome/free-solid-svg-icons'
import paymentApis from '../api/modules/payment.api'
import userBankCardTransactionApis from '../api/modules/userbankcardtransaction.api'
import SupplierBankCardApis from '../api/modules/supplierbankcard.api'
import emailApis from '../api/modules/email.api'

const PaymentOnline = () => {

    const [check, setCheck] = useState('')
    const [userId, setUserId] = useState(0)
    const [billInfo, setBillInfo] = useState('')
    const [billList, setBillList] = useState('')
    const [selectedInfo, setSelectedInfo] = useState('')
    const [userBankList, setUserBankList] = useState('')
    const [checkBill, setCheckBill] = useState(false)
    const [cusName, setCusName] = useState('')
    const [cusEmail, setCusEmail] = useState('')
    const [selectedBank, setSelectedBank] = useState('')
    const [currentTime, setCurrentTime] = useState('')
    const [cusCode, setCusCode] = useState('')
    const [description, setDescription] = useState('')

    const [isLoading, setIsLoading] = useState(false)

    var billId = null

    const [currentUserId, setCurrentUserId] = useState('')

    const username = localStorage.getItem('username')

    useEffect(() => {
        const getCurrentUSer = async () => {
            const res = await userApis.getUserByUsername(username)
            if (res.success && res) {
                setCurrentUserId(res.data.id)
                setUserId(res.data.id)
                setCusName(res.data.firstname + ' ' + res.data.lastname)
                setCusEmail(res.data.email)
            }
        }
        getCurrentUSer()
    }, [username])

    useEffect(() => {
        const getUserBankList = async () => {
            if (currentUserId) {
                const res = await userBankCardApis.getByUserId(currentUserId)
                if (res.success && res) {
                    console.log(res)
                    setUserBankList(res.data)
                }
            }
        }
        getUserBankList()
    }, [currentUserId])


    const formatDate = (date) => {
        const increasedDate = addDays(new Date(date), 0);
        const formattedDate = format(increasedDate, 'dd-MM-yyyy');
        return formattedDate;
    }
    const formattedPrice = (balance) => {
        const formattedBalance = balance.toLocaleString('vi-VN');
        return formattedBalance;
    }

    const handleSelect = (id) => {
        const filteredTemp = billInfo.filter(filter => filter.id === parseInt(id));
        setSelectedInfo(filteredTemp[0]);
    }

    const handChangeBankCard = async (id) => {
        const res = await userBankCardApis.getById(id)
        if (res.success) {
            setSelectedBank(res.data)
        }
        else {
            setSelectedBank('')
        }
    }

    const handleChangeOptions = (value) => {
        setBillInfo('')
        setSelectedInfo('')
        setSelectedBank('')
        setCheck(value)
    }

    const handleSubmit = async () => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 7);

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // Tháng trong JavaScript đếm từ 0
        const day = currentDate.getDate();
        const formattedDate = `${year}-${month}-${day}`;

        console.log(formattedDate);

        if (check === 'true' && selectedInfo) {
            const amount = selectedInfo.price * (selectedInfo.meter_reading_new - selectedInfo.meter_reading_old)
            const textArea = `Kỳ thanh toán: ${formatDate(selectedInfo.meter_date_old)} - ${formatDate(selectedInfo.meter_date_new)}\nChỉ số cũ: ${selectedInfo.meter_reading_old} - ghi ngày:  ${formatDate(selectedInfo.meter_date_old)}\nChỉ số mới: ${selectedInfo.meter_reading_new} - ghi ngày: ${formatDate(selectedInfo.meter_date_new)}\n`

            const data = {
                due_date: formattedDate,
                amount: amount,
                status: 'CHỜ THANH TOÁN',
                create_id: parseInt(userId),
                approved_id: parseInt(userId),
                meter_id: selectedInfo.id,
                cab_id: null,
                info: textArea
            }
            const res = await billApis.createBill(data)
            if (res.success && res) {
                billId = res.data.id
                setIsLoading(true)
                console.log(res)
                setCheckBill(true)
                return true
            }
            else {
                console.log(res)
                return false
            }
        }
        else if (check === 'false' && selectedInfo) {
            const textArea = `Ngày bắt đầu: ${formatDate(selectedInfo.start_date)}\nNgày kết thúc: ${formatDate(selectedInfo.end_date)}\n`


            const data = {
                due_date: formattedDate,
                amount: selectedInfo.price,
                status: 'CHỜ THANH TOÁN',
                create_id: parseInt(userId),
                approved_id: parseInt(userId),
                meter_id: null,
                cab_id: selectedInfo.id,
                info: textArea
            }
            const res = await billApis.createBill(data)
            if (res.success && res) {
                billId = res.data.id
                setIsLoading(true)
                console.log(res)
                setCheckBill(true)
                return true

            }
            else {
                console.log(res)
                return false
            }
        }
    }

    useEffect(() => {
        const getBillList = async () => {
            const res = await billApis.getAllBill()
            if (res.success && res) {
                console.log(res)
                setBillList(res.data)
            }
            else {
                setBillList('');
                console.log(res)
            }
        }
        getBillList()
    }, [isLoading])



    useEffect(() => {
        const getBillInfo = async () => {
            if (check === 'true' && billList && cusCode) {
                const res = await meterApis.getAll()
                if (res.success && res) {
                    const filteredTemp = res.data.filter(item => item.customer_code === cusCode.toUpperCase() && !billList.some(bill => bill.meter_id === item.id)
                    );
                    console.log(filteredTemp)
                    setBillInfo(filteredTemp)
                }
                else {
                    console.log(res)
                    toast.error("Bạn không có hoá đơn nào")
                    setBillInfo('')
                }
            }
            else if (check === 'false' && billList && cusCode) {
                const res = await cabApis.getAll()
                if (res.success && res) {
                    const filteredTemp = res.data.filter(item => item.customer_code === cusCode.toUpperCase() && !billList.some(bill => bill.cab_id === item.id)
                    );
                    console.log(res)
                    console.log(filteredTemp)
                    setBillInfo(filteredTemp)
                }
                else {
                    toast.error("Bạn không có hoá đơn nào")
                    console.log(res)
                    setBillInfo('')
                }
            }
            else {
                setBillInfo('')
            }
        }
        getBillInfo()
    }, [billList, check, cusCode, userId]);

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


    const handlePaymentOnline = async () => {

        var isSubmitSuccessful = false

        var newBalance = 0

        var amount = 0
        if (check === 'true') {
            amount = selectedInfo.price * (selectedInfo.meter_reading_new - selectedInfo.meter_reading_old)
            newBalance = selectedBank.balance - amount
            if (newBalance < 0) {
                toast.error('Tài khoản của bạn không đủ số dư')
                return;
            }
            else {
                isSubmitSuccessful = await handleSubmit();
            }
        }
        else {
            amount = selectedInfo.price
            newBalance = selectedBank.balance - amount
            if (newBalance < 0) {
                toast.error('Tài khoản của bạn không đủ số dư')
                return;
            }
            else {
                isSubmitSuccessful = await handleSubmit();
            }
        }
        if (isSubmitSuccessful && billId !== null) {
            const billData = {
                done_id: userId,
                status: 'ĐÃ THANH TOÁN'
            }



            const paymentData = {
                payment_date: currentTime,
                payment_method: 'Thanh toán online',
                description: description,
                bill_id: billId,
                userbankcard_id: selectedBank.id
            }

            const bankCardData = {
                balance: newBalance,
            }

            const bankCardTransactionData = {
                transaction_type: 'Ghi nợ (Debit)',
                amount: amount,
                transaction_date: currentTime,
                description: description,
                usercardbank_id: selectedBank.id
            }


            const emailData = {
                send_to: cusEmail,
                card_number: selectedBank.card_number,
                customer_name: cusName,
                transaction_type: 'Ghi nợ (Debit)',
                amount: `${formattedPrice(parseInt(amount))}đ`,
                transaction_date: currentTime,
                transaction_info: description
            }

            const cardRes = await userBankCardApis.updateBankCard(selectedBank.id, bankCardData)
            if (cardRes.success && cardRes) {
                console.log(cardRes)
                const getSupplierById = await SupplierBankCardApis.getById(selectedInfo.supplier_id)
                if (getSupplierById.success && getSupplierById) {
                    const newSupplierBalance = getSupplierById.data.balance + amount
                    const supplierData = {
                        balance: newSupplierBalance
                    }
                    console.log(supplierData)
                    const supplierCardRes = await SupplierBankCardApis.updateSupplierBankCard(selectedInfo.supplier_id, supplierData)
                    if (supplierCardRes.success && supplierCardRes) {
                        const transactionRes = await userBankCardTransactionApis.createBankCard(bankCardTransactionData)
                        if (transactionRes.success) {
                            const paymentRes = await paymentApis.createPayment(paymentData)
                            if (paymentRes.success && paymentRes) {
                                const billRes = await billApis.updateStatusBillPayment(billId, billData)
                                if (billRes.success && billRes) {
                                    toast.success('Thanh toán hoá đơn thành công')
                                    setSelectedInfo('')
                                    setUserId('')
                                    setCheck('')
                                    setCusCode('')
                                    setSelectedBank('')
                                    setIsLoading(false)
                                    const emailRes = await emailApis.sendbankCard(emailData)
                                    if (emailRes.success) {
                                        console.log(emailRes)
                                    }
                                    else {
                                        console.log(emailRes)
                                    }
                                }
                                else {
                                    console.log(billRes)
                                    toast.error('Thanh toán hoá đơn thất bại')
                                }
                            }
                            else {
                                console.log(paymentRes)
                            }

                        }
                        else {
                            console.log(transactionRes)
                        }
                    }
                    else {
                        console.log(supplierCardRes)
                    }
                }
                else {
                    console.log(getSupplierById)
                }
            }
            else {
                console.log(cardRes)
            }
        }
    }

    return (
        <div className='main-payment-online'>
            <div className='left-payment-online'>
                <div className='top-left-payment-online'>
                    <div className='flex-row-group'>
                        <label>Dịch vụ</label>
                        <select onChange={(e) => handleChangeOptions(e.target.value)} value={check || ''}>
                            <option value=''>---Chọn---</option>
                            <option value='true'>Điện, nước</option>
                            <option value='false'>Truyền hình cáp</option>
                        </select>
                    </div>
                    <div className='flex-row-group'>
                        <label>Mã khách hàng</label>
                        <input type='text' placeholder='Nhập mã khách hàng' onChange={(e) => setCusCode(e.target.value)} value={cusCode || ''} />
                    </div>
                    <div className='flex-row-group'>
                        <label>Hoá đơn của bạn</label>
                        <select onChange={(e) => handleSelect(e.target.value)} >
                            <option value=''>---Chọn---</option>
                            {billInfo.length > 0 && check === 'true' && billInfo.map((item, index) => {
                                const price = `${(item.meter_reading_new - item.meter_reading_old) * item.price}`
                                return <option value={item.id} key={index}>Nhà cung cấp: {item.supplier_name}, Dịch vụ: {item.service_name}, Chỉ số: {item.meter_reading_old} - {item.meter_reading_new}, Kỳ thanh toán: {item.payment_period}, Giá: {formattedPrice(parseInt(price))} đ</option>
                            })}
                            {billInfo.length > 0 && check === 'false' && billInfo.map((item, index) => {
                                return <option value={item.id} key={index}>Nhà cung cấp: {item.supplier_name}, Dịch vụ: {item.service_name}, Tên gói: {item.package_name}, Giá: {formattedPrice(item.price)} đ</option>
                            })}
                        </select>
                    </div>
                </div>
                <div className='bottom-left-payment-online'>
                    <form className='form-payment-online'>
                        {selectedInfo && check === 'true' && <><div className='flex-group-payment-online'>
                            <label>Tên khách hàng:</label>
                            <span>{selectedInfo && selectedInfo.customer_name}</span>
                        </div>
                            <div className='flex-group-payment-online'>
                                <label>Nhà cung cấp:</label>
                                <span>{selectedInfo && selectedInfo.supplier_name}</span>
                            </div>
                            <div className='flex-group-payment-online'>
                                <label>Dịch vụ:</label>
                                <span>{selectedInfo && selectedInfo.service_name}</span>
                            </div>
                            <div className='flex-group-payment-online'>
                                <label>Chỉ số cũ - ngày ghi:</label>
                                <span>{selectedInfo && `${selectedInfo.meter_reading_old} - ${formatDate(selectedInfo.meter_date_old)}`}</span>
                            </div>
                            <div className='flex-group-payment-online'>
                                <label>Chỉ số mới - ngày ghi:</label>
                                <span>{selectedInfo && `${selectedInfo.meter_reading_new} - ${formatDate(selectedInfo.meter_date_new)}`}</span>
                            </div>
                            <div className='flex-group-payment-online'>
                                <label>Kỳ thanh toán:</label>
                                <span>{selectedInfo && selectedInfo.payment_period}</span>
                            </div>
                            <div className='flex-group-payment-online'>
                                <label>Tiêu thụ:</label>
                                <span>{selectedInfo && (selectedInfo.meter_reading_new - selectedInfo.meter_reading_old)}</span>
                            </div>
                            <div className='flex-group-payment-online'>
                                <label>Giá 1 đơn vị:</label>
                                <span>{selectedInfo && formattedPrice(selectedInfo.price) + ' đ'} </span>
                            </div>
                            <div className='flex-group-payment-online'>
                                <label>Tổng tiền:</label>
                                <span>{selectedInfo && formattedPrice(selectedInfo.price * (selectedInfo.meter_reading_new - selectedInfo.meter_reading_old)) + ' đ'}</span>
                            </div></>}

                        {selectedInfo && check === 'false' && <><div className='flex-group-payment-online'>
                            <label>Tên khách hàng:</label>
                            <span>{selectedInfo && selectedInfo.customer_name}</span>
                        </div>
                            <div className='flex-group-payment-online'>
                                <label>Nhà cung cấp:</label>
                                <span>{selectedInfo && selectedInfo.supplier_name}</span>
                            </div>
                            <div className='flex-group-payment-online'>
                                <label>Dịch vụ:</label>
                                <span>{selectedInfo && selectedInfo.service_name}</span>
                            </div>
                            <div className='flex-group-payment-online'>
                                <label>Tên gói:</label>
                                <span>{selectedInfo && selectedInfo.package_name}</span>
                            </div>
                            <div className='flex-group-payment-online'>
                                <label>Ngày bắt đầu:</label>
                                <span>{selectedInfo && formatDate(selectedInfo.start_date)}</span>
                            </div>
                            <div className='flex-group-payment-online'>
                                <label>Ngày kết thúc:</label>
                                <span>{selectedInfo && formatDate(selectedInfo.end_date)}</span>
                            </div>
                            <div className='flex-group-payment-online'>
                                <label>Giá gói:</label>
                                <span>{selectedInfo && formattedPrice(selectedInfo.price) + ' đ'} </span>
                            </div>
                            <div className='flex-group-payment-online'>
                                <label>Tổng tiền:</label>
                                <span>{selectedInfo && formattedPrice(selectedInfo.price) + ' đ'}</span>
                            </div></>}
                        {!selectedInfo && <label>Chưa có dữ liệu</label>}
                    </form>
                </div>
            </div>
            <div className='right-payment-online'>
                <div className='top-right-payment-onlline'>
                    <div className='flex-row-top-right'>
                        <label>Chọn tài khoản thanh toán</label>
                        <select onChange={(e) => handChangeBankCard(e.target.value)} disabled={selectedInfo ? false : true} >
                            <option value=''>---Chọn---</option>
                            {userBankList && userBankList.map((item, index) => {
                                return <option value={item.id} key={index}>Số tài khoản: {item.card_number}</option>;
                            })}
                        </select>
                    </div>
                    <div className='flex-row-left-top-right'>
                        {selectedBank ? (<>
                            <Avatar src={require('../images/atm-card.png')} sx={{ width: '64px', height: '64px', border: '1px solid #ccc' }} />
                            <label>{selectedBank.holder_name}</label>
                            <div>
                                <FontAwesomeIcon icon={faDollarSign} style={{ marginRight: '10px' }} />
                                <span style={{ fontSize: '18px', fontWeight: '500' }}>Số dư khả dụng</span>
                            </div>
                            <span style={{ fontSize: '22px', fontWeight: '700' }} >{formattedPrice(selectedBank.balance)} đ</span>
                        </>) : <label>Chưa có dữ liệu</label>}
                    </div>
                </div>
                <div className='bottom-right-payment-onlline'>
                    {selectedBank && <>
                        <div>
                            <label>Ngày thanh toán: </label>
                            <label>{currentTime}</label>
                        </div>
                        <div>
                            <label>Hình thức thanh toán: </label>
                            <select disabled={true}>
                                <option>Thanh toán online</option>
                            </select>
                        </div>
                        <div>
                            <label>Loại giao dịch: </label>
                            <select disabled={true}>
                                <option>Ghi nợ (Debit)</option>
                            </select>
                        </div>
                        <textarea onChange={(e) => setDescription(e.target.value)} placeholder='Mô tả' />
                        {isLoading ? <CircularProgress />
                            : <button className='btn-payment-online' type='submit' onClick={handlePaymentOnline}>THANH TOÁN</button>}
                    </>}
                </div>
            </div>
        </div>
    )
}

export default PaymentOnline    