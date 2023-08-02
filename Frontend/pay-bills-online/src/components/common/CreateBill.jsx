import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import '../../style/CreateBill.css'
import userApis from '../../api/modules/user.api'
import billApis from '../../api/modules/bill.api'
import { addDays, format } from 'date-fns'
import { toast } from 'react-toastify'

const CreateBill = ({ onClose }) => {
    const [userId, setUserId] = useState('')
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

    const formattedPrice = (balance) => {
        const formattedBalance = balance.toLocaleString('vi-VN');

        return formattedBalance;
    }

    const formatDate = (date) => {
        const increasedDate = addDays(new Date(date), 0);
        const formattedDate = format(increasedDate, 'dd-MM-yyyy');
        return formattedDate;
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

    useEffect(() => {
        const getServiceList = async () => {
            if (checkService === 'true' && userId) {
                const id = parseInt(userId);
                const res = await billApis.getService(id);
                if (res.success && res) {
                    const filteredTemp = res.data.filter(item => {
                        return !billList.some(bill => bill.meter_id === item.id);
                    });
                    console.log(res);
                    setServiceList(filteredTemp);
                } else {
                    setServiceList('')
                    console.log(res);
                    setPrice('')
                    setInfo('')
                }
            }
            else if (checkService === 'false' && userId) {
                const id = parseInt(userId);
                const res = await billApis.getCableByUserId(id);
                if (res.success && res) {
                    const filteredTemp = res.data.filter(item => {
                        return !billList.some(bill => bill.cab_id === item.id);
                    });
                    console.log(res);
                    setServiceList(filteredTemp);
                } else {
                    setServiceList([])
                    console.log(res);
                    setPrice('')
                    setInfo('')
                }
            }
        };
        getServiceList();
    }, [checkService, userId, billList]);


    const handleChangeOptions = (e) => {
        setMeterOrCabId(e.target.value)
        if (checkService === 'true') {
            const result = serviceList.find(service => service.id === parseInt(e.target.value));
            if (result) {
                const tempPrice = (result.price * (result.meter_reading_new - result.meter_reading_old))

                const textArea = `Kỳ thanh toán: ${formatDate(result.meter_date_old)} - ${formatDate(result.meter_date_new)}\nChỉ số cũ: ${result.meter_reading_old} - ghi ngày:  ${formatDate(result.meter_date_old)}\nChỉ số mới: ${result.meter_reading_new} - ghi ngày: ${formatDate(result.meter_date_new)}\n`
                setPrice(parseFloat(tempPrice))
                setInfo(textArea)
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

        if (!userId || !price || !dueDate || !info || !createId || !meterOrCbId) {
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
                user_id: parseInt(userId),
                create_id: createId,
                approved_id: null,
                meter_id: parseInt(meterOrCbId),
                cab_id: null,
                info: info
            }
            console.log(data)

            const res = await billApis.createBill(data)
            if (res.success && res) {
                toast.success("Tạo hoá đơn thành công")
                onClose()
            }
            else {
                console.log(res)
                toast.error("Tạo hoá đơn thất bại")
            }
        }
        else {
            const data = {
                due_date: dueDate,
                amount: parseFloat(price),
                status: "CHƯA DUYỆT",
                user_id: parseInt(userId),
                create_id: createId,
                approved_id: null,
                meter_id: null,
                cab_id: parseInt(meterOrCbId),
                info: info
            }
            console.log(data)

            const res = await billApis.createBill(data)
            if (res.success && res) {
                toast.success("Tạo hoá đơn thành công")
                onClose()
            }
            else {
                console.log(res)
                toast.error("Tạo hoá đơn thất bại")
            }
        }
    }
    return (
        <div className='overlay'>
            <div className='main-create-bill'>
                <FontAwesomeIcon icon={faXmark} onClick={onClose} className='icon-close-create-bill' />
                <form className='form-create-bill' onSubmit={handleSubmit} >
                    <div className='bill-flex-column'>
                        <label>Khách hàng</label>
                        <select onChange={(e) => setUserId(e.target.value)}>
                            <option value=''>---Chọn---</option>
                            {userList && userList.map((item, index) => {
                                return <option value={item.id} key={index}>{item.id} - {item.firstname} {item.lastname}</option>
                            })}
                        </select>
                    </div>
                    <div className='bill-flex-column'>
                        <label>Loại dịch vụ</label>
                        <select onChange={(e) => setCheckService(e.target.value)}>
                            <option value=''>---Chọn---</option>
                            <option value='true'>Điện, nước</option>
                            <option value='false'>Truyền hình cáp</option>
                        </select>
                        <select onChange={handleChangeOptions}>
                            <option value=''>---Chọn---</option>
                            {serviceList && checkService === 'true' && serviceList.map((item, index) => {
                                const price = `${(item.meter_reading_new - item.meter_reading_old) * item.price}`
                                return <option value={item.id} key={index}>Nhà cung cấp: {item.supplier_name}, Dịch vụ: {item.service_name}, Chỉ số: {item.meter_reading_old} - {item.meter_reading_new}, Giá: {formattedPrice(parseInt(price))} đ</option>
                            })}
                            {serviceList && checkService === 'false' && serviceList.map((item, index) => {
                                return <option value={item.id} key={index}>Nhà cung cấp: {item.supplier_name}, Dịch vụ: {item.service_name}, Tên gói: {item.package_name}, Giá: {formattedPrice(item.price)} đ</option>
                            })}
                        </select>
                    </div>
                    <div className='bill-flex-column'>
                        <label>Tổng tiền</label>
                        <input type='number' placeholder='Tổng tiền' value={price || ''} disabled={true} />
                    </div>
                    <div className='bill-flex-column'>
                        <label>Ngày hết hạn</label>
                        <input type='date' onChange={(e) => setDueDate(e.target.value)} />
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

export default CreateBill