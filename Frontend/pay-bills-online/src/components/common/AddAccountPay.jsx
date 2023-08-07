import React, { useEffect, useState } from 'react'
import '../../style/AddBankCard.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify'
import userApis from '../../api/modules/user.api'
import userBankCardApis from '../../api/modules/userbankcard.api';
import { format } from 'date-fns';

const AddAccountPay = ({ onClose, bankList }) => {
    const [cardNumber, setCardNumber] = useState("")
    const [expriyDate, setExpireDate] = useState("")
    const [userId, setUserId] = useState("")
    const [userList, setUserList] = useState('')


    useEffect(() => {
        const getListUsers = async () => {
            const res = await userApis.getAll()
            if(res.success) {
                setUserList(res.data)
            }
            else {
                console.log(res)
            }
        }
        getListUsers()
    })


    const handleValidation = () => {
        let isValid = true;
        // Validate cardNumber
        const cardNumberPattern = /^\d{9,14}$/;
        if (!cardNumberPattern.test(cardNumber.trim())) {
            toast.error("Số thẻ không hợp lệ (Số thẻ từ 9 đến 14 chữ số)")
            isValid = false;
        }



        return isValid;
    }

    useEffect(() => {
        const updateCurrentTime = () => {
            const now = new Date();
            const formattedTime = format(now, 'yyyy-MM-dd');
            setExpireDate(formattedTime);
        };

        // Gọi hàm updateCurrentTime mỗi giây
        const intervalId = setInterval(updateCurrentTime, 1000);

        // Hủy interval khi component unmount
        return () => clearInterval(intervalId);

        // Chỉ gọi lại useEffect khi giá trị của currentTime thay đổi
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (handleValidation()) {

            const existingBankCard = bankList && bankList.find(
                (account) =>
                    account.card_number === cardNumber
            );
            if (existingBankCard) {
                toast.error('Tài khoản thanh toán đã tồn tại');
            } else {
                const name = userList.filter( item => item.id === parseInt(userId) );
                const data = {
                    card_number: cardNumber.trim(),
                    create_date: expriyDate,
                    holder_name: (name[0].firstname + ' ' + name[0].lastname).toUpperCase(),
                    balance: 0,
                    user_id: parseInt(userId),
                }
                console.log(data)
                const response = await userBankCardApis.createBankCard(data)
                if (response.success && response) {
                    toast.success("Thêm tài khoản thành công")
                    onClose()
                } else {
                    toast.error("Thêm tài khoản thất bại");
                    console.log(response)
                }
            }

        }
    };

    return (
        <div className="overlay" >

            <div className='main-add-bank'>
                <FontAwesomeIcon icon={faXmark} className='icon-close' onClick={onClose} />
                <form className='form-add-bank' onSubmit={handleSubmit}>
                    <div className='header-add-bank'>
                        <div className='left-add-bank'>
                            <span>Số tài khoản</span>
                            <span>Ngày tạo tài khoản</span>
                            <span>Khách hàng</span>
                        </div>
                        <div className='right-add-bank'>
                            <input type="text" placeholder="Nhập số tài khoản" onChange={(e) => setCardNumber(e.target.value)} />
                            <input type="date" value={expriyDate} disabled={true} />
                            <select onChange={(e) => {setUserId(e.target.value)
                            }}>
                                <option>---Chọn---</option>
                                {userList && userList.map((item, index)=> {
                                    return <option value={item.id} key={index}>{item.id} - {item.firstname} {item.lastname}</option>
                                })}
                            </select>
                        </div>
                    </div>
                    <div className='footer-add-bank'>
                        <button type='submit'>Xác nhận thêm tài khoản</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddAccountPay