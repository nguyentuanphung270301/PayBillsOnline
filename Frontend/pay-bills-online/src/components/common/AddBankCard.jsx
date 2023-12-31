import React, { useEffect, useState } from 'react'
import '../../style/AddBankCard.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify'
import userApis from '../../api/modules/user.api'
import userBankCardApis from '../../api/modules/userbankcard.api';
import { format } from 'date-fns';

const AddBankCard = ({ onClose }) => {
    const [cardNumber, setCardNumber] = useState("")
    const [cardHolderName, setCardHolderName] = useState("")
    const [userId, setUserId] = useState("")
    const username = localStorage.getItem("username")
    const [listBank, setListBank] = useState(null)
    const [currentTime,setCurrentTime] = useState("")

    useEffect(() => {
        const getUserId = async () => {
            const response = await userApis.getUserByUsername(username)
            if (response.success && response) {
                setUserId(response.data.id)
                setCardHolderName(response.data.firstname + ' ' + response.data.lastname)
                const responseBank = await userBankCardApis.getByUserId(response.data.id)
                if (responseBank.success && responseBank) {
                    setListBank(responseBank.data)
                }
                else {
                    console.log(responseBank)
                }
            }
            else {
                console.log(response)
            }
        }
        getUserId()
    }, [username])

    useEffect(() => {
        const updateCurrentTime = () => {
            const now = new Date();
            const formattedTime = format(now, 'yyyy-MM-dd');
            setCurrentTime(formattedTime);
        };

        // Gọi hàm updateCurrentTime mỗi giây
        const intervalId = setInterval(updateCurrentTime, 1000);

        // Hủy interval khi component unmount
        return () => clearInterval(intervalId);

        // Chỉ gọi lại useEffect khi giá trị của currentTime thay đổi
    }, [currentTime]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (handleValidation()) {

            const existingBankCard = listBank && listBank.find(
                (account) =>
                    account.card_number === cardNumber
            );
            if (existingBankCard) {
                toast.error('Tài khoản thanh toán đã tồn tại');
            } else {
                const data = {
                    card_number: cardNumber.trim(),
                    create_date: currentTime,
                    holder_name: cardHolderName.trim().toUpperCase(),
                    balance: 0,
                    user_id: userId,
                }
                console.log(data)
                const response = await userBankCardApis.createBankCard(data)
                if (response.success && response) {
                    toast.success("Thêm thẻ thành công")
                    onClose()
                } else {
                    toast.error("Thêm thẻ thất bại");
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
                            <span>Tên chủ tài khoản</span>
                        </div>
                        <div className='right-add-bank'>
                            <input type="text" placeholder="Nhập số tài khoản" onChange={(e) => setCardNumber(e.target.value)} />
                            <input type="date" value={currentTime} disabled={true} />
                            <input type="text" disabled={true} onChange={(e) => setCardHolderName(e.target.value)} value={cardHolderName.toUpperCase()}/>
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

export default AddBankCard