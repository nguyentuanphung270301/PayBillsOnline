import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import billApis from '../../api/modules/bill.api'
import userApis from '../../api/modules/user.api'
import { addDays, format } from 'date-fns'
import meterApis from '../../api/modules/meterindex.api'
import cabApis from '../../api/modules/cab.api'

const EditBill = ({ id, onClose }) => {
    const [dueDate, setDueDate] = useState('')
    const [createId, setCreateId] = useState('')
    const [meterOrCbId, setMeterOrCabId] = useState('')
    const [price, setPrice] = useState(0)
    const [info, setInfo] = useState('')
    const username = localStorage.getItem('username')

    const [billList, setBillList] = useState('')

    const [checkService, setCheckService] = useState('')
    const [userList, setUserList] = useState('')
    const [serviceList, setServiceList] = useState('')
    const [serviceId, setServiceId] = useState('')

    const [cusName, setCusName] = useState('')
    const [cusPhone, setCusPhone] = useState('')
    const [cusAddress, setCusAddress] = useState('')
    const [cusCode, setCusCode] = useState('')

    const formattedPrice = (balance) => {
        const formattedBalance = balance.toLocaleString('vi-VN');

        return formattedBalance;
    }

    const formatDate = (date) => {
        const increasedDate = addDays(new Date(date), 0);
        const formattedDate = format(increasedDate, 'dd-MM-yyyy');
        return formattedDate;
    }
    const formatDated = (date) => {
        const increasedDate = addDays(new Date(date), 0);
        const formattedDate = format(increasedDate, 'yyyy-MM-dd');
        return formattedDate;
    }
    useEffect(() => {
        const getServiceList = async () => {
            if (checkService === 'true') {
                const res = await billApis.getService();
                if (res.success && res) {
                    setServiceList(res.data);
                } else {
                    setServiceList('')
                    console.log(res);
                    setPrice('')
                    setInfo('')
                }
            }
            else if (checkService === 'false') {
                const res = await billApis.getCableByUserId();
                if (res.success && res) {
                    setServiceList(res.data);
                } else {
                    setServiceList('')
                    console.log(res);
                    setPrice('')
                    setInfo('')
                }
            }
        };
        getServiceList();
    }, [checkService, billList]);

    useEffect(()=>{
        const getBillInfo = async () => {
            const res = await billApis.getById(id)
            if(res.success) {
                console.log(res)
                setPrice(res.data.amount)
                setDueDate(formatDated(res.data.due_date))
                setInfo(res.data.info)
                if(res.data.meter_id !== null) {
                    setCheckService('true')
                    const meterRes = await meterApis.getById(res.data.meter_id)
                    if(meterRes.success) {
                        console.log(meterRes)
                        setServiceId(meterRes.data.id)
                        setCusName(meterRes.data.customer_name)
                        setCusAddress(meterRes.data.customer_address)
                        setCusCode(meterRes.data.customer_code)
                        setCusPhone(meterRes.data.customer_phone)
                    }
                }
                if(res.data.cab_id !== null) {
                    setCheckService('true')
                    const cabRes = await cabApis.getById(res.data.cab_id)
                    if(cabRes.success) {
                        console.log(cabRes)
                        setServiceId(cabRes.data.id)
                        setCusName(cabRes.data.customer_name)
                        setCusAddress(cabRes.data.customer_address)
                        setCusCode(cabRes.data.customer_code)
                        setCusPhone(cabRes.data.customer_phone)
                    }
                }
            }
            else {
                console.log(res)
            }
        }
        getBillInfo()
    },[id])

    useEffect(() => {
        const getBillList = async () => {
            const res = await billApis.getAllBill()
            if (res.success && res) {
                console.log(res)
                setBillList(res.data)
            }
            else {
                setBillList([]);
                console.log(res)
            }
        }
        getBillList()
    }, [])

    useEffect(() => {
        const getCreateInfo = async () => {
            const res = await userApis.getUserByUsername(username)
            if (res.success && res) {
                setCreateId(res.data.id)
            }
            else {
                setCreateId(null)
                console.log(res)
            }
        }
        getCreateInfo()
    }, [username])

    useEffect(() => {
        const getUserList = async () => {
            const res = await userApis.getAll()
            if (res.success && res) {
                setUserList(res.data)
            }
            else {
                setUserList('')
                console.log(res)
            }
        }
        getUserList()
    }, [])



    const handleChangeOptions = (e) => {
        setMeterOrCabId(e.target.value)
        if (checkService === 'true') {
            const result = serviceList.find(service => service.id === parseInt(e.target.value));
            if (result) {
                const tempPrice = (result.price * (result.meter_reading_new - result.meter_reading_old))

                const textArea = `Kỳ thanh toán: ${formatDate(result.meter_date_old)} - ${formatDate(result.meter_date_new)}\nChỉ số cũ: ${result.meter_reading_old} - ghi ngày:  ${formatDate(result.meter_date_old)}\nChỉ số mới: ${result.meter_reading_new} - ghi ngày: ${formatDate(result.meter_date_new)}\n`
                setPrice(parseFloat(tempPrice))
                setInfo(textArea)
                setCusName(result.customer_name)
                setCusAddress(result.customer_address)
                setCusPhone(result.customer_phone)
                setCusCode(result.customer_code)
            }
            else {
                setPrice('')
                setInfo('')
            }
        }
        else if (checkService === 'false') {
            const result = serviceList.find(service => service.id === parseInt(e.target.value));
            if (result) {
                const textArea = `Ngày bắt đầu: ${formatDate(result.start_date)}\nNgày kết thúc: ${formatDate(result.end_date)}\n`
                setPrice(result.price)
                setInfo(textArea)
            }
            else {
                setPrice('')
                setInfo('')
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!price || !dueDate || !info || !createId || !serviceId) {
            toast.error('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        const selectedDueDate = new Date(dueDate);
        const currentDate = new Date();

        const timeDifference = selectedDueDate - currentDate;

        const differenceInDays = timeDifference / (1000 * 3600 * 24);

        if (differenceInDays < 7) {
            toast.error('Ngày hết hạn phải sau ít nhất 7 ngày từ ngày hiện tại.');
            return;
        }

        if (checkService === 'true') {
            const data = {
                due_date: dueDate,
                amount: parseFloat(price),
                status: "CHƯA DUYỆT",
                create_id: createId,
                approved_id: null,
                meter_id: parseInt(serviceId),
                cab_id: null,
                info: info
            }
            console.log(data)

            const res = await billApis.updateBill(id, data)
            if (res.success && res) {
                toast.success("Cập nhật hoá đơn thành công")
                onClose()
            }
            else {
                console.log(res)
                toast.error("Cập nhật hoá đơn thất bại")
            }
        }
        else {
            const data = {
                due_date: dueDate,
                amount: parseFloat(price),
                status: "CHƯA DUYỆT",
                create_id: createId,
                approved_id: null,
                meter_id: null,
                cab_id: parseInt(serviceId),
                info: info
            }
            console.log(data)

            const res = await billApis.updateBill(id, data)
            if (res.success && res) {
                toast.success("Cập nhật hoá đơn thành công")
                onClose()
            }
            else {
                console.log(res)
                toast.error("Cập nhật hoá đơn thất bại")
            }
        }
    }
    return (
        <div className='overlay'>
            <div className='main-create-bill'>
                <FontAwesomeIcon icon={faXmark} onClick={onClose} className='icon-close-create-bill' />
                <form className='form-create-bill' onSubmit={handleSubmit} >
                    <div className='bill-flex-column'>
                        <label>Loại dịch vụ</label>
                        <select onChange={(e) => setCheckService(e.target.value)} value={checkService}>
                            <option value=''>---Chọn---</option>
                            <option value='true'>Điện, nước</option>
                            <option value='false'>Truyền hình cáp</option>
                        </select>
                        <select onChange={handleChangeOptions} value={serviceId || ''} disabled={true}>
                            <option value=''>---Chọn---</option>
                            {serviceList && checkService === 'true' && serviceList.map((item, index) => {
                                const price = `${(item.meter_reading_new - item.meter_reading_old) * item.price}`
                                return <option value={item.id} key={index}>Nhà cung cấp: {item.supplier_name}, Dịch vụ: {item.service_name}, Kỳ thanh toán: {item.payment_period}, Giá: {formattedPrice(parseInt(price))} đ</option>
                            })}
                            {serviceList && checkService === 'false' && serviceList.map((item, index) => {
                                return <option value={item.id} key={index}>Nhà cung cấp: {item.supplier_name}, Dịch vụ: {item.service_name}, Tên gói: {item.package_name}, Giá: {formattedPrice(item.price)} đ</option>
                            })}
                        </select>
                    </div>
                    <div className='bill-flex-row'>
                        <div className='bill-flex-column'>
                            <label>Mã khách hàng</label>
                            <input type='text' placeholder='Mã khách hàng' value={cusCode || ''} disabled={true}/>
                        </div>
                        <div className='bill-flex-column'>
                            <label>Tên khách hàng</label>
                            <input type='text' placeholder='Tên khách hàng' value={cusName || ''} disabled={true} />
                        </div>
                    </div>
                    <div className='bill-flex-row'>
                        <div className='bill-flex-column'>
                            <label>Số điện thoại khách hàng</label>
                            <input type='text' placeholder='Số điện thoại khách hàng' value={cusPhone || ''} disabled={true} />
                        </div>
                        <div className='bill-flex-column'>
                            <label>Địa chỉ khách hàng</label>
                            <input type='text' placeholder='Địa chỉ khách hàng' value={cusAddress || ''} disabled={true} />
                        </div>
                    </div>
                    <div className='bill-flex-column'>
                        <label>Tổng tiền</label>
                        <input type='number' placeholder='Tổng tiền' value={price || ''} disabled={true} />
                    </div>
                    <div className='bill-flex-column'>
                        <label>Ngày hết hạn</label>
                        <input type='date' onChange={(e) => setDueDate(e.target.value)} value={dueDate || ''}/>
                    </div>
                    <div className='bill-flex-column'>
                        <label>Thông tin hoá đơn </label>
                        <textarea value={info || ''} onChange={(e) => setInfo(e.target.value)} />
                    </div>
                    <button className='btn-save-bill' type='submit'>Lưu</button>
                </form>
            </div>
        </div>
    )
}

export default EditBill