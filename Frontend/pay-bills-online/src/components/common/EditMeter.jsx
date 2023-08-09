import React, { useEffect, useState } from 'react'
import serviceApis from '../../api/modules/service.api'
import userApis from '../../api/modules/user.api'
import { toast } from 'react-toastify'
import meterApis from '../../api/modules/meterindex.api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import '../../style/AddMeter.css'
import { addDays, format } from 'date-fns'
import supplierApis from '../../api/modules/supplier.api'

const EditMeter = ({ id, onClose }) => {
    const [oldMeter, setOldMeter] = useState(0)
    const [newMeter, setNewMeter] = useState(0)
    const [oldDate, setOldDate] = useState('')
    const [newDate, setNewDate] = useState('')
    const [cusName, setCusName] = useState('')
    const [cusPhone, setCusPhone] = useState('')
    const [cusAddress, setCusAddress] = useState('')
    const [cusCode, setCusCode] = useState('')
    const [serviceId, setServiceId] = useState(0)
    const [userList, setUserList] = useState('')

    const [serviceList, setServiceList] = useState('')

    const getSupplierInfoById = async (id) => {
        const res = await supplierApis.getById(id)
        if (res.success && res) {
            return res.data.name
        }
        else {
            return null
        }
    }
    const formattedDate = (date) => {
        const increasedDate = addDays(new Date(date), 0);
        const formattedDate = format(increasedDate, 'yyyy-MM-dd');
        return formattedDate;
    }
    useEffect(() => {
        const getMeterInfo = async () => {
            const res = await meterApis.getById(id)
            if (res.success) {
                setOldMeter(res.data.meter_reading_old)
                setNewMeter(res.data.meter_reading_new)
                setOldDate(formattedDate(res.data.meter_date_old))
                setNewDate(formattedDate(res.data.meter_date_new))
                setCusName(res.data.customer_name)
                setCusAddress(res.data.customer_address)
                setCusPhone(res.data.customer_phone)
                setCusCode(res.data.customer_code)
                setServiceId(res.data.service_id)
            }
        }
        getMeterInfo()
    }, [id])

    useEffect(() => {
        const getUserList = async () => {
            const res = await meterApis.getAll()
            if (res.success && serviceId) {
                const uniqueData = [];
                const user = res.data.filter(user => user.service_id === parseInt(serviceId));
                if (user.length > 0) {
                    user.forEach(item => {
                        const existingItem = uniqueData.find(
                            entry =>
                                entry.service_id === item.service_id &&
                                entry.customer_name === item.customer_name &&
                                entry.customer_code === item.customer_code
                        );
                        if (!existingItem) {
                            uniqueData.push(item);
                            setUserList(uniqueData);
                        }
                    });
                }
                else {
                    setUserList('')
                }

            }
            else {
                console.log(res)
            }
        }
        getUserList()
    }, [serviceId])

    useEffect(() => {
        const getServiceList = async () => {
            try {
                const serviceRes = await serviceApis.getAll()
                if (serviceRes.success && serviceRes.data) {
                    const updatedServiceList = await Promise.all(
                        serviceRes.data.map(async (service) => {
                            const supplierName = await getSupplierInfoById(service.supplier_id);
                            return {
                                ...service,
                                supplierName: supplierName || 'N/A',
                            };
                        })
                    );
                    setServiceList(updatedServiceList);
                }
                else {
                    console.log(serviceRes);
                    setServiceList('');
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        getServiceList()
    }, [])



    const handleSubmit = async (e) => {
        e.preventDefault()
        // Kiểm tra rỗng
        if (!oldMeter || !newMeter || !oldDate || !newDate || !serviceId || !cusName || !cusCode || !cusAddress || !cusPhone) {
            toast.error('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        // Kiểm tra số chỉ số lớn hơn 0 và nhỏ hơn 1000000
        if (oldMeter < 0 || oldMeter >= 1000000 || newMeter < 0 || newMeter >= 1000000) {
            toast.error('Chỉ số phải lớn hơn 0 và nhỏ hơn 1000000.');
            return;
        }
        // Chuyển đổi các giá trị số chỉ số thành số nguyên
        const oldMeterInt = parseInt(oldMeter);
        const newMeterInt = parseInt(newMeter);

        // Kiểm tra chỉ số mới lớn hơn hoặc bằng chỉ số cũ
        if (newMeterInt < oldMeterInt) {
            toast.error('Chỉ số mới phải lớn hơn hoặc bằng chỉ số cũ.');
            return;
        }

        // Convert oldDate and newDate to Date objects
        const oldDateCheck = new Date(oldDate);
        const newDateCheck = new Date(newDate);

        // Check if oldDate is the first day of the month and newDate is the last day of the same month
        if (oldDateCheck.getDate() !== 1 || newDateCheck.getDate() !== new Date(newDateCheck.getFullYear(), newDateCheck.getMonth() + 1, 0).getDate()) {
            toast.error('Ngày ghi số cũ phải là ngày đầu tháng và ngày ghi số mới phải là ngày cuối tháng trong cùng một tháng.');
            return;
        }
        // Kiểm tra ngày ghi số mới không lớn hơn thời gian hiện tại
        const currentDate = new Date();
        const newDateObj = new Date(newDate);
        if (newDateObj > currentDate) {
            toast.error('Ngày ghi số mới không được lớn hơn thời gian hiện tại.');
            return;
        }


        if (!/((09|03|07|08|05)+([0-9]{8})\b)/g.test(cusPhone)) {
            toast.error('Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam hợp lệ.');
            return;
        }

        const newMonth = newDateObj.getMonth() + 1;
        const newYear = newDateObj.getFullYear();
        const paymentPeriod = `Kỳ ${newMonth}/${newYear}`
        const data = {
            meter_reading_new: parseInt(newMeter),
            meter_date_new: newDate,
            meter_reading_old: parseInt(oldMeter),
            meter_date_old: oldDate,
            payment_period: paymentPeriod,
            customer_name: cusName.trim(),
            customer_phone: cusPhone.trim(),
            customer_address: cusAddress.trim(),
            customer_code: cusCode.trim().toUpperCase(),
            service_id: parseInt(serviceId),
        }
        console.log(data)
        const res = await meterApis.updateMeter(id, data)
        if (res.success && res) {
            toast.success('Cập nhật dữ liệu thành công');
            onClose()
        }
        else {
            console.log(res)
            toast.error('Cập nhật dữ liệu thất bại');
        }
    }



    const handleSelectCus = (id) => {
        if (id) {
            const filteredTemp = userList.filter(item => item.id === parseInt(id))
            setCusName(filteredTemp[0].customer_name)
            setCusAddress(filteredTemp[0].customer_address)
            setCusCode(filteredTemp[0].customer_code)
            setCusPhone(filteredTemp[0].customer_phone)
        }
        else {
            setCusName('')
            setCusAddress('')
            setCusCode('')
            setCusPhone('')
        }
    }


    return (
        <div className='overlay'>
            <div className='main-add-meter'>
                <FontAwesomeIcon icon={faXmark} onClick={onClose} className='icon-close-add-meter' />
                <form className='form-add-meter' onSubmit={handleSubmit}>
                    <div className='form-flex-column'>
                        <label>Dịch vụ - Nhà cung cấp</label>
                        <select onChange={(e) => setServiceId(e.target.value)} value={serviceId || ''}>
                            <option value=''>---Chọn---</option>
                            {serviceList && serviceList.map((item, index) => {
                                return <option key={index} value={item.id}>{item.name} - {item.supplierName}</option>
                            })}
                        </select>
                    </div>


                    <div className='form-flex'>
                        <div className='form-flex-column'>
                            <label>Chỉ số cũ</label>
                            <input
                                className='input-flex'
                                type='number'
                                placeholder='Chỉ số cũ'
                                value={oldMeter}
                                onChange={(e) => setOldMeter(e.target.value)}
                            />
                        </div>
                        <div className='form-flex-column'>
                            <label>Ngày ghi số cũ</label>
                            <input
                                className='input-flex'
                                type='date'
                                value={oldDate}
                                placeholder='Ngày ghi số cũ'
                                onChange={(e) => setOldDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='form-flex'>
                        <div className='form-flex-column'>
                            <label>Chỉ số mới</label>
                            <input
                                className='input-flex'
                                type='number'
                                value={newMeter}
                                placeholder='Chỉ số mới'
                                onChange={(e) => setNewMeter(e.target.value)}
                            />
                        </div>
                        <div className='form-flex-column'>
                            <label>Ngày ghi số mới</label>
                            <input
                                className='input-flex'
                                type='date'
                                value={newDate}
                                placeholder='Ngày ghi số mới'
                                onChange={(e) => setNewDate(e.target.value)}
                            />
                        </div>
                    </div>


                    <div className='form-flex-column'>
                        <label>Khách hàng có trong hệ thống</label>
                        <select onChange={(e) => handleSelectCus(e.target.value)} >
                            <option value=''>---Chọn---</option>
                            {userList && userList.map((item, i) => {
                                return <option value={item.id} key={i}>{item.customer_code} - {item.customer_name}</option>
                            })}
                        </select>
                    </div>

                    <div className='form-flex'>
                        <div className='form-flex-column'>
                            <label>Mã khách hàng</label>
                            <input placeholder='Mã khách hàng' onChange={(e) => setCusCode(e.target.value)} value={cusCode || ''} />
                        </div>
                        <div className='form-flex-column'>
                            <label>Tên khách hàng</label>
                            <input placeholder='Tên khách hàng' onChange={(e) => setCusName(e.target.value)} value={cusName || ''} />
                        </div>
                    </div>
                    <div className='form-flex'>
                        <div className='form-flex-column'>
                            <label >Địa chỉ khách hàng</label>
                            <input placeholder='Địa chỉ khách hàng' onChange={(e) => setCusAddress(e.target.value)} value={cusAddress || ''} />
                        </div>
                        <div className='form-flex-column'>
                            <label >Số điện thoại khách hàng</label>
                            <input placeholder='Số điện thoại khách hàng' onChange={(e) => setCusPhone(e.target.value)} value={cusPhone || ''} />
                        </div>
                    </div>
                    <button className='btn-save-meter' type='submit'>Lưu</button>
                </form>
            </div>
        </div>
    )
}

export default EditMeter