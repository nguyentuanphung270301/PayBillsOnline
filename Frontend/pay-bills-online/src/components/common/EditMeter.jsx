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
    const [serviceId, setServiceId] = useState(0)
    const [userId, setUserId] = useState(0)

    const [serviceList, setServiceList] = useState('')
    const [userList, setUserList] = useState('')

    const getSupplierInfoById = async (id) => {
        const res = await supplierApis.getById(id)
        if (res.success && res) {
            return res.data.name
        }
        else {
            return null
        }
    }

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

    const formatDate = (date) => {
        const increasedDate = addDays(new Date(date), 0);
        const formattedDate = format(increasedDate, 'yyyy-MM-dd');
        return formattedDate;
    }

    useEffect(() => {
        const getMeterById = async () => {
            const res = await meterApis.getById(id)
            if (res.success && res) {
                setOldMeter(res.data.meter_reading_old)
                setOldDate(formatDate(res.data.meter_date_old))
                setNewMeter(res.data.meter_reading_new)
                setNewDate(formatDate(res.data.meter_date_new))
                setServiceId(res.data.service_id)
                setUserId(res.data.user_id)
            }
            else {
                console.log(res)
            }
        }
        getMeterById()
    }, [])

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

    const handleSubmit = async (e) => {
        e.preventDefault()
        // Kiểm tra rỗng
        if (!oldMeter || !newMeter || !oldDate || !newDate || !serviceId || !userId) {
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

        // Kiểm tra ngày ghi số mới không lớn hơn thời gian hiện tại
        const currentDate = new Date();
        const newDateObj = new Date(newDate);
        if (newDateObj > currentDate) {
            toast.error('Ngày ghi số mới không được lớn hơn thời gian hiện tại.');
            return;
        }

        // Kiểm tra ngày ghi số mới đủ 30 ngày kể từ ngày ghi số cũ
        const oldDateObj = new Date(oldDate);
        const thirtyDaysAfterOldDate = new Date(oldDateObj.getTime());
        thirtyDaysAfterOldDate.setDate(thirtyDaysAfterOldDate.getDate() + 30);
        if (newDateObj < thirtyDaysAfterOldDate || newDateObj > thirtyDaysAfterOldDate) {
            toast.error('Ngày ghi số mới phải đủ 30 ngày kể từ ngày ghi số cũ.');
            return;
        }

        const data = {
            meter_reading_new: parseInt(newMeter),
            meter_date_new: newDate,
            meter_reading_old: parseInt(oldMeter),
            meter_date_old: oldDate,
            service_id: parseInt(serviceId),
            user_id: parseInt(userId),
        }
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

    return (
        <div className='overlay'>
            <div className='main-add-meter'>
                <FontAwesomeIcon icon={faXmark} onClick={onClose} className='icon-close-add-meter' />
                <form className='form-add-meter' onSubmit={handleSubmit}>
                    <div className='form-flex'>
                        <div className='form-flex-column'>
                            <label>Chỉ số cũ</label>
                            <input
                                className='input-flex'
                                type='number'
                                placeholder='Chỉ số cũ'
                                value={oldMeter || ''}
                                onChange={(e) => setOldMeter(e.target.value)}
                            />
                        </div>
                        <div className='form-flex-column'>
                            <label>Ngày ghi số cũ</label>
                            <input
                                className='input-flex'
                                type='date'
                                placeholder='Ngày ghi số cũ'
                                value={oldDate || ''}
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
                                placeholder='Chỉ số mới'
                                value={newMeter || ''}
                                onChange={(e) => setNewMeter(e.target.value)}
                            />
                        </div>
                        <div className='form-flex-column'>
                            <label>Ngày ghi số mới</label>
                            <input
                                className='input-flex'
                                type='date'
                                placeholder='Ngày ghi số mới'
                                value={newDate || ''}
                                onChange={(e) => setNewDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='form-flex-column'>
                        <label>Dịch vụ - Nhà cung cấp</label>
                        <select onChange={(e) => setServiceId(e.target.value)} value={serviceId || ''}>
                            <option value=''>---Chọn---</option>
                            {serviceList && serviceList.map((item, index) => {
                                return <option key={index} value={item.id}>{item.name} - {item.supplierName}</option>
                            })}
                        </select>
                    </div>
                    <div className='form-flex-column'>
                        <label>Mã khách hàng - Tên khách hàng</label>
                        <select onChange={(e) => setUserId(e.target.value)} value={userId || ''}>
                            <option value=''>---Chọn---</option>
                            {userList && userList.map((item, index) => {
                                return <option key={index} value={item.id}>{item.id} - {item.firstname} {item.lastname}</option>
                            })}
                        </select>
                    </div>
                    <button className='btn-save-meter' type='submit'>Lưu</button>
                </form>
            </div>
        </div>
    )
}

export default EditMeter