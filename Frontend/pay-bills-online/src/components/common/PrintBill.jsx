import { faEnvelope, faLocationDot, faPhone, faPrint } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import jsPDF from 'jspdf';
import React, { useEffect, useState } from 'react'
import '../../style/PrintBill.css'
import { useParams } from 'react-router-dom';
import billApis from '../../api/modules/bill.api';
import { addDays, format } from 'date-fns';
import userApis from '../../api/modules/user.api';
import { robotoNormal } from '../../assets/fonts/robotoNormal';
import { robotoItalic } from '../../assets/fonts/robotoItalic';
import { robotoBold } from '../../assets/fonts/robotoBold';
import { robotoBoldItalic } from '../../assets/fonts/robotoBoldItalic';
import emailApis from '../../api/modules/email.api';
import { toast } from 'react-toastify';

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

    const handlePrint = async () => {
        const doc = new jsPDF({
            unit: 'px',
            format: 'a4'
        });
        const element = document.querySelector('.form-print-bill');

        // Thêm font và tạo promise cho quá trình tạo và lưu PDF
        const savePromise = new Promise((resolve) => {
            doc.addFileToVFS('Roboto-Regular.tff', robotoNormal);
            doc.addFont('Roboto-Regular.tff', 'Roboto', 'normal');

            doc.addFileToVFS('Roboto-Italic.ttf', robotoItalic);
            doc.addFont('Roboto-Italic.ttf', 'Roboto', 'italic');

            doc.addFileToVFS('Roboto-Bold.ttf', robotoBold);
            doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');

            doc.addFileToVFS('Roboto-Bolditalic.ttf', robotoBoldItalic);
            doc.addFont('Roboto-Bolditalic.ttf', 'Roboto', 'bolditalic');

            doc.html(element, {
                html2canvas: {
                    scale: [0.45],
                },
                callback: async (pdf) => {
                    // Lưu tệp PDF và gọi hàm resolve() khi hoàn thành
                    const filename = `${billInfo.bill_id}_${billInfo.customer_name}`;
                    pdf.save(filename); // Không cần hỏi trước khi tải
                    resolve();
                },
            });
        });

        try {
            // Đợi cho tác vụ tạo và lưu PDF hoàn thành
            await savePromise;

            // Đợi khoảng 10 giây trước khi gửi email
            await new Promise((resolve) => setTimeout(resolve, 10000));

            const sendBillData = {
                email: userPayment.email,
                file_name: `${billInfo.bill_id}_${billInfo.customer_name}`
            };

            const res = await emailApis.sendBill(sendBillData);
            if (res.success) {
                toast.success('Hoá đơn được gửi đến email của bạn');
            } else {
                console.log(res);
            }
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div className='main-print-bill'>
            <button className='btn-print-bill' onClick={handlePrint}><FontAwesomeIcon icon={faPrint} />Xuất hoá đơn</button>
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
                                <label>Trạng thái:</label>
                                <span>{billInfo && billInfo.status}</span>
                            </div>
                        </div>
                        <div className='right-top-print-bill'>
                            <label>Thông tin khách hàng</label>
                            <div className='flex-group'>
                                <label>Mã khách hàng:</label>
                                <span>{billInfo && billInfo.customer_code}</span>
                            </div>
                            <div className='flex-group'>
                                <label>Họ tên khách hàng:</label>
                                <span>{billInfo && `${billInfo.customer_name}`}</span>
                            </div>
                            <div className='flex-group'>
                                <label>Số điện thoại:</label>
                                <span>{billInfo && billInfo.customer_phone}</span>
                            </div>
                            <div className='flex-group'>
                                <label>Địa chỉ:</label>
                                <span>{billInfo && billInfo.customer_address}</span>
                            </div>
                        </div>
                    </div>
                    <div className='body-bottom-print-bill'>
                        <label>Thông tin dịch vụ</label>
                        {check && <div className='flex-row-print-bill'>
                            <div className='flex-column-print-bill'>
                                <label>Nhà cung cấp</label>
                                <span>{billInfo && billInfo.supplier_name}</span>
                            </div>
                            <div className='flex-column-print-bill'>
                                <label>Dịch vụ</label>
                                <span>{billInfo && billInfo.service_name}</span>
                            </div>
                            <div className='flex-column-print-bill'>
                                <label>Chỉ số cũ - Ngày ghi</label>
                                <span>{billInfo && `${billInfo.meter_reading_old} - ${formatDate(billInfo.meter_date_old)}`}</span>
                            </div>
                            <div className='flex-column-print-bill'>
                                <label>Chỉ số mới - Ngày ghi</label>
                                <span>{billInfo && `${billInfo.meter_reading_new} - ${formatDate(billInfo.meter_date_new)}`}</span>
                            </div>
                            <div className='flex-column-print-bill'>
                                <label>Kỳ thanh toán</label>
                                <span>{billInfo && billInfo.payment_period}</span>
                            </div>
                            <div className='flex-column-print-bill'>
                                <label>Tiêu thụ</label>
                                <span>{billInfo && (billInfo.meter_reading_new - billInfo.meter_reading_old)}</span>
                            </div>
                            <div className='flex-column-print-bill'>
                                <label>Giá tiền</label>
                                <span>{billInfo && formattedPrice(billInfo.service_price)} đ</span>
                            </div>
                        </div>}
                        {!check && <div className='flex-row-print-bill'>
                            <div className='flex-column-print-bill-cab'>
                                <label>Nhà cung cấp</label>
                                <span>{billInfo && billInfo.supplier_name}</span>
                            </div>
                            <div className='flex-column-print-bill-cab'>
                                <label>Dịch vụ</label>
                                <span>{billInfo && billInfo.service_name}</span>
                            </div>
                            <div className='flex-column-print-bill-cab'>
                                <label>Tên gói</label>
                                <span>{billInfo && billInfo.package_name}</span>
                            </div>
                            <div className='flex-column-print-bill-cab'>
                                <label>Ngày bắt đầu</label>
                                <span>{billInfo && formatDate(billInfo.start_date)}</span>
                            </div>
                            <div className='flex-column-print-bill-cab'>
                                <label>Ngày kết thúc</label>
                                <span>{billInfo && formatDate(billInfo.end_date)}</span>
                            </div>
                            <div className='flex-column-print-bill-cab'>
                                <label>Giá gói</label>
                                <span>{billInfo && formattedPrice(billInfo.price)} đ</span>
                            </div>
                        </div>}
                        <div className='body-payment-print-bill' >
                            <label>Thanh toán</label>
                            <div className='flex-group'>
                                <label>Nhân viên thanh toán:</label>
                                <span>{userPayment && `${userPayment.id} - ${userPayment.firstname} ${userPayment.lastname}`}</span>
                            </div>
                            <div className='flex-group'>
                                <label>Ngày thanh toán:</label>
                                <span>{billInfo && formatDate(billInfo.payment_date)}</span>
                            </div>
                            <div className='flex-group'>
                                <label>Phương thức thanh toán:</label>
                                <span>{billInfo && billInfo.payment_method}</span>
                            </div>
                            {billInfo && billInfo.userbankcard_id !== null &&
                                <div className='flex-group'>
                                    <label>Tên chủ tài khoản:</label>
                                    <span>{billInfo && billInfo.holder_name}</span>
                                </div>}
                            {billInfo && billInfo.userbankcard_id !== null &&
                                <div className='flex-group'>
                                    <label>Số tài khoản:</label>
                                    <span>{billInfo && billInfo.card_number}</span>
                                </div>}
                            <div className='flex-group'>
                                <label>Mô tả thanh toán:</label>
                                <span>{billInfo && billInfo.description}</span>
                            </div>
                            <div className='flex-group'>
                                <label>Tổng tiền hoá đơn:</label>
                                <span className='amount'>{billInfo && formattedPrice(billInfo.amount)} đ</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='footer-print-bill'>
                    <div>
                        <label>Thông tin liên hệ</label>
                        <a href='https://www.facebook.com/ntp270301/'>Facebook: Nguyễn Tuấn Phụng </a>
                        <label> Email: nguyentuanphung270301@gmail.com</label>
                        <label>Số điện thoại: 0828532784</label>
                        <label>Địa chỉ: 97 Đ. Man Thiện, Hiệp Phú, Thành Phố Thủ Đức, Thành phố Hồ Chí Minh</label>
                    </div>
                    <label>THANK YOU</label>
                </div>
            </div>
        </div>
    )
}

export default PrintBill