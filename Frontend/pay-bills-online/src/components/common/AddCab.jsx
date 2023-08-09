import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import '../../style/Addcab.css'
import userApis from '../../api/modules/user.api'
import serviceApis from '../../api/modules/service.api'
import supplierApis from '../../api/modules/supplier.api'
import { toast } from 'react-toastify'
import cabApis from '../../api/modules/cab.api'

const AddCab = ({ onClose }) => {

    const [packageName, setPackageName] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [price, setPrice] = useState(0)
    const [serviceId, setServiceId] = useState(0)
    const [cusName, setCusName] = useState('')
    const [cusPhone, setCusPhone] = useState('')
    const [cusAddress, setCusAddress] = useState('')
    const [cusCode, setCusCode] = useState('')

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
        const getUserList = async () => {
            const res = await cabApis.getAll()
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
                setServiceList('');
            }
        }
        getServiceList()
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
        // Kiểm tra rỗng và các giá trị
        if (!packageName || !startDate || !price || !serviceId || !cusName || !cusCode || !cusAddress || !cusPhone) {
            toast.error('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        // Chuyển đổi giá trị giá gói thành số nguyên
        const priceInt = parseInt(price);

        // Kiểm tra giá gói từ 0 đến 100000000
        if (priceInt < 0 || priceInt > 100000000) {
            toast.error('Giá gói phải nằm trong khoảng từ 0 đến 100.000.000.');
            return;
        }

        // Kiểm tra ngày bắt đầu nhỏ hơn ngày kết thúc
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        if (startDateObj >= endDateObj) {
            toast.error('Ngày bắt đầu phải nhỏ hơn ngày kết thúc.');
            return;
        }

        
        if (!/((09|03|07|08|05)+([0-9]{8})\b)/g.test(cusPhone)) {
            toast.error('Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam hợp lệ.');
            return;
        }


        const data = {
            package_name: packageName,
            start_date: startDate,
            end_date: endDate,
            price: parseFloat(price),
            customer_name: cusName.trim(),
            customer_phone: cusPhone.trim(),
            customer_address: cusAddress.trim(),
            customer_code: cusCode.trim().toUpperCase(),
            service_id: parseInt(serviceId),
        }
        const res = await cabApis.createCab(data)
        if (res.success && res) {
            toast.success('Thêm dữ liệu thành công')
            onClose()
        }
        else {
            console.log(res)
            toast.error(res.error.sqlMessage)
        }
    }

    const handleSelectCus = (id) => {
        if(id) {
         const filteredTemp = userList.filter(item =>  item.id === parseInt(id))
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
            <div className='main-add-cab'>
                <FontAwesomeIcon icon={faXmark} onClick={onClose} className='icon-close-add-cab' />
                <form className='form-add-cab' onSubmit={handleSubmit}>
                    <div className='form-flex-column-cab'>
                        <label>Dịch vụ - Nhà cung cấp</label>
                        <select onChange={(e) => setServiceId(e.target.value)}>
                            <option value=''>---Chọn---</option>
                            {serviceList && serviceList.map((item, index) => {
                                return <option value={item.id} key={index}>{item.name} - {item.supplierName}</option>;
                            })}
                        </select>
                    </div>
                    <div className='form-flex-column-cab'>
                        <label>Tên gói</label>
                        <input
                            type='text'
                            placeholder='Tên gói dịch vụ'
                            onChange={(e) => setPackageName(e.target.value)}
                        />
                    </div>
                    <div className='form-flex-cab'>
                        <div className='form-flex-column-cab'>
                            <label>Ngày bắt đầu</label>
                            <input
                                type='date'
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className='form-flex-column-cab'>
                            <label>Ngày kết thúc</label>
                            <input
                                type='date'
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='form-flex-column-cab'>
                        <label>Giá gói</label>
                        <input
                            type='number'
                            placeholder='Giá gói dịch vụ'
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                    <div className='form-flex-column-cab'>
                        <label>Khách hàng đã có trong hệ thống</label>
                        <select onChange={(e) => handleSelectCus(e.target.value)}>
                            <option value=''>---Chọn---</option>
                            {userList && userList.map((item, i) => {
                                return <option value={item.id} key={i}>{item.customer_code} - {item.customer_name}</option>
                            })}
                        </select>
                    </div>
                    <div className='form-flex-cab'>
                        <div className='form-flex-column-cab'>
                            <label>Mã khách hàng</label>
                            <input
                                type='text'
                                placeholder='Mã khách hàng'
                                value={ cusCode || ''}
                                onChange={(e) => setCusCode(e.target.value)}
                            />
                        </div>
                        <div className='form-flex-column-cab'>
                            <label>Tên khách hàng</label>
                            <input
                                type='text'
                                placeholder='Tên khách hàng'
                                value={ cusName || ''}
                                onChange={(e) => setCusName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='form-flex-cab'>
                    <div className='form-flex-column-cab'>
                            <label>Số điện thoại khách hàng</label>
                            <input
                                type='text'
                                placeholder='Số điện thoại khách hàng'
                                value={ cusPhone || ''}
                                onChange={(e) => setCusPhone(e.target.value)}
                            />
                        </div>
                        <div className='form-flex-column-cab'>
                            <label>Địa chỉ khách hàng</label>
                            <input
                                type='text'
                                placeholder='Địa chỉ khách hàng'
                                value={ cusAddress || ''}
                                onChange={(e) => setCusAddress(e.target.value)}
                            />
                        </div>
                    </div>
                    <button className='btn-save-cab' type='submit'>Lưu</button>
                </form>
            </div>
        </div>
    )
}

export default AddCab