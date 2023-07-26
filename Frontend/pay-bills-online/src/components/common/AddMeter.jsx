import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import '../../style/AddMeter.css'
import serviceApis from '../../api/modules/service.api'
import userApis from '../../api/modules/user.api'
import { toast } from 'react-toastify'
import meterApis from '../../api/modules/meterindex.api'

const AddMeter = ({ onClose }) => {
    const [oldMeter, setOldMeter] = useState(0)
    const [newMeter, setNewMeter] = useState(0)
    const [oldDate, setOldDate] = useState('')
    const [newDate, setNewDate] = useState('')
    const [serviceId, setServiceId] = useState(0)
    const [userId, setUserId] = useState(0)

    const [serviceList, setServiceList] = useState('')
    const [userList, setUserList] = useState('')

    useEffect(() => {
        const getServiceList = async () => {
            const res = await serviceApis.getAll()
            if (res.success && res) {
                setServiceList(res.data)
            }
            else {
                setServiceList('')
                console.log(res)
            }
        }
        getServiceList()
    }, [])

    useEffect(() => {
        const getUserList = async () => {
            const res = await userApis.getAll()
            if (res.success && res) {
                setUserList(res.data.filter((user) => user.status === 1))
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
        const res = await meterApis.createMeter(data)
        if(res.success && res) {
            toast.success('Thêm dữ liệu thành công');
            onClose()
        }
        else {
            console.log(res)
            toast.error('Thêm dữ liệu thất bại');
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
                                onChange={(e) => setOldMeter(e.target.value)}
                            />
                        </div>
                        <div className='form-flex-column'>
                            <label>Ngày ghi số cũ</label>
                            <input
                                className='input-flex'
                                type='date'
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
                                placeholder='Chỉ số mới'
                                onChange={(e) => setNewMeter(e.target.value)}
                            />
                        </div>
                        <div className='form-flex-column'>
                            <label>Ngày ghi số mới</label>
                            <input
                                className='input-flex'
                                type='date'
                                placeholder='Ngày ghi số mới'
                                onChange={(e) => setNewDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='form-flex-column'>
                        <label>Dịch vụ</label>
                        <select onChange={(e) => setServiceId(e.target.value)}>
                            <option value=''>---Chọn---</option>
                            {serviceList && serviceList.map((item, index) => {
                                return <option key={index} value={item.id}>{item.name}</option>
                            })}
                        </select>
                    </div>
                    <div className='form-flex-column'>
                        <label>Khách hàng</label>
                        <select onChange={(e) => setUserId(e.target.value)}>
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

export default AddMeter