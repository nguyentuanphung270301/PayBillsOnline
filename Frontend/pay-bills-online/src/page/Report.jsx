import { Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import '../style/Report.css'
import supplierApis from '../api/modules/supplier.api'
import serviceApis from '../api/modules/service.api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlassChart } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import paymentApis from '../api/modules/payment.api'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { addDays, format } from 'date-fns'
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Report = () => {

    const [supplierList, setSupplierList] = useState('')
    const [serviceList, setServiceList] = useState('')

    const [supplierId, setSupplierId] = useState(null)
    const [serviceId, setServiceId] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const [reportData, setReportData] = useState('')
    const [reportInfo, setReportInfo] = useState('')

    useEffect(() => {
        const getSupplierList = async () => {
            const res = await supplierApis.getAll()
            if (res.success) {
                setSupplierList(res.data)
            }
            else {
                console.log(res)
            }
        }
        getSupplierList()
    }, [])

    useEffect(() => {
        const getServiceList = async () => {
            const res = await serviceApis.getAll()
            if (res.success) {
                const filteredService = res.data.filter(service => service.supplier_id === parseInt(supplierId))
                setServiceList(filteredService)
            }
            else {
                console.log(res)
            }
        }
        getServiceList()
    }, [supplierId])

    const formatDate = (date) => {
        const increasedDate = addDays(new Date(date), 0);
        const formattedDate = format(increasedDate, 'dd-MM-yyyy');
        return formattedDate;
    }
    const formattedPrice = (balance) => {
        const formattedBalance = balance.toLocaleString('vi-VN');

        return formattedBalance;
    }


    useEffect(() => {
        const getReport = async () => {
            if (!serviceId) {
                const data = {
                    interval: 'day',
                    start_date: startDate,
                    end_date: endDate,
                    service_id: null,
                    supplier_id: parseInt(supplierId)
                }
                setReportData(data)
                console.log(data)
            }
            else if (serviceId) {
                const data = {
                    interval: 'day',
                    start_date: startDate,
                    end_date: endDate,
                    service_id: parseInt(serviceId),
                    supplier_id: parseInt(supplierId)
                }
                setReportData(data)
                console.log(data)
            }
        }
        getReport()
    }, [endDate, serviceId, startDate, supplierId])

    const handleSubmit = async () => {

        if (!supplierId) {
            toast.error('Vui lòng chọn nhà cung cấp')
            return;
        }

        if (!(startDate || endDate)) {
            toast.error('Vui lòng chọn ngày bắt đầu , ngày kết thúc')
            return;
        }
        if ((startDate > endDate)) {
            toast.error('Ngày bắt đầu phải nhỏ hơn ngày kết thúc')
            return;
        }

        if (reportData) {
            const meterRes = await paymentApis.getReportMeter(reportData);
            if (meterRes.success && meterRes) {
                console.log(meterRes)
                setReportInfo(meterRes.data)
            }
            else {
                const cabRes = await paymentApis.getReportCab(reportData)
                if (cabRes.success && cabRes) {
                    console.log(cabRes)
                    setReportInfo(cabRes.data)
                }
                else {
                    console.log(cabRes)
                    toast.error("Không tìm thấy dữ liệu")
                }
                console.log(meterRes)
            }
        }
    }

    var data = null
    var options = null
    if (reportInfo) {
        // const labels = reportInfo.map(item => formatDate(item.date))
        // const datasets = [
        //     {
        //         label: 'Doanh thu',
        //         data: reportInfo.map(item => item.total_revenue),
        //         backgroundColor: 'rgba(75,192,192,0.2)',
        //         borderColor: 'rgba(75,192,192,1)',
        //         borderWidth: 1,
        //     },
        // ];

        // // Tạo biểu đồ sử dụng react-chartjs-2
        // data = {
        //     labels: labels,
        //     datasets: datasets,
        // };  
        reportInfo.sort((a, b) => new Date(a.date) - new Date(b.date));
        const colors = [
            'rgba(75,192,192,1)',
            'rgba(255,99,132,1)',
            'rgba(54,162,235,1)',
            // ... thêm các màu sắc khác tùy ý
        ];
        const uniqueDates = Array.from(new Set(reportInfo.map(item => formatDate(item.date))));
        const uniqueServices = Array.from(new Set(reportInfo.map(item => item.service_name)));

        const datasets = uniqueServices.map((service, index) => {
            const data = uniqueDates.map(date => {
                const matchingData = reportInfo.find(item => formatDate(item.date) === date && item.service_name === service);
                return matchingData ? matchingData.total_revenue : 0;
            });

            const totalRevenue = data.reduce((total, revenue) => total + revenue, 0);

            return {
                label: `${service} - Total: ${formattedPrice(totalRevenue)} đ`,
                data: data,
                backgroundColor: colors[index % colors.length],
                borderColor: colors[index % colors.length],
                borderWidth: 1,
            };
        });

        const labels = uniqueDates;

        data = {
            labels: labels,
            datasets: datasets,
        };
    }
    return (
        <div className='main-report'>
            <Typography sx={{
                color: '#0057da',
                margin: '20px 0 10px 0',
                fontSize: '25px',
                fontWeight: 'bold',
                textAlign: 'center',
            }}>Báo cáo thống kê</Typography>
            <div className='select-group'>
                <div className='select-flex-group'>
                    <label>Nhà cung cấp</label>
                    <select onChange={(e) => setSupplierId(e.target.value)}>
                        <option value=''>---Chọn---</option>
                        {supplierList && supplierList.map((item, index) => {
                            return <option value={item.id} key={index}>{item.id} - {item.name}</option>
                        })}
                    </select>
                </div>
                <div className='select-flex-group'>
                    <label>Dịch vụ</label>
                    <select onChange={(e) => setServiceId(e.target.value)} disabled={supplierId ? false : true}>
                        <option value=''>---Chọn---</option>
                        {serviceList && serviceList.map((item, index) => {
                            return <option value={item.id} key={index}>{item.id} - {item.name}</option>
                        })}
                    </select>
                </div>
                <div className='select-flex-group'>
                    <label>Chọn thời gian bắt đầu</label>
                    <input type='date' onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className='select-flex-group'>
                    <label>Chọn thời gian kết thúc</label>
                    <input type='date' onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <button className='btn-report' onClick={handleSubmit}><FontAwesomeIcon icon={faMagnifyingGlassChart} /></button>
            </div>
            <div className='chart-report'>
                {data !== null && <Chart type='line' data={data} />}
            </div>
        </div>
    )
}

export default Report