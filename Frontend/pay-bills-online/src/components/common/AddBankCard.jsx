import React, { useEffect, useState } from 'react'
import '../../style/AddBankCard.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify'
import userApis from '../../api/modules/user.api'
import userBankCardApis from '../../api/modules/userbankcard.api';

const AddBankCard = ({ onClose }) => {
    const bankNames = [
        "Vietcombank", "Vietinbank", "BIDV", "Agribank", "VP Bank", "Sacombank", "ACB", "HSBC", "Đông Á Bank", "TP Bank", "EximBank",
        "VIB", "SHB", "Shinhan Bank", "Vietbank", "PG Bank", "SCB", "MSB", "AB Bank", "MB Bank", "LienVietPostBank", "SeABank", "Stadand Chartered",
        "PVcomBank", "UOB", "First Bank", "Woori Bank", "Nam Á Bank", "Saigon Bank", "Bắc Á Bank", "HD Bank", "Việt Capital Bank", "Việt Á Bank",
        "GP Bank", "NCB", "KienLong Bank", "OceanBank", "CBBank", "BAOVIET Bank", "VSSP", "VDB", "Public Bank Việt Nam", "Indovina Bank", "VRB",
        "HongLeong Bank", "OCB"
    ]
    const [bankName, setBankName] = useState("")
    const [cardNumber, setCardNumber] = useState("")
    const [cardHolderName, setCardHolderName] = useState("")
    const [expriyDate, setExpireDate] = useState("")
    const [cvv, setCvv] = useState("")
    const [balance, setBalance] = useState(null)
    const [userId, setUserId] = useState("")
    const username = localStorage.getItem("username")
    const [listBank, setListBank] = useState(null)

    useEffect(() => {
        const getUserId = async () => {
            const response = await userApis.getUserByUsername(username)
            if (response.success && response) {
                setUserId(response.data.id)
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


    const handleValidation = () => {
        let isValid = true;

        // Validate bankName
        if (bankName.trim() === "") {
            toast.error("Vui lòng chọn ngân hàng")
            isValid = false;
        }
        // Validate cardNumber
        const cardNumberPattern = /^\d{9,14}$/;
        if (!cardNumberPattern.test(cardNumber.trim())) {
            toast.error("Số thẻ không hợp lệ (Số thẻ từ 9 đến 14 chữ số)")
            isValid = false;
        }
        // Validate cardHolderName
        const cardHolderNamePattern = /^[A-Z\s]+$/;
        if (!cardHolderNamePattern.test(cardHolderName.trim())) {
            toast.error("Tên chủ thẻ viết hoa không dấu")
            isValid = false;
        }
        //Validate cvv
        const cvvPattern = /^\d{3}$/;
        if (!cvvPattern.test(cvv.trim())) {
            toast.error('CVV phải gồm 3 chữ số')
            isValid = false;
        }
        // Validate balance
        if (balance.trim() === null || balance.trim() < 0 || balance.trim() > 100000000) {
            toast.error("Số dư phải lớn hơn 0 và nhỏ hơn 100,000,000")
            isValid = false;
        }

        const currentDate = new Date();
        const selectedDate = new Date(expriyDate);
        if (selectedDate <= currentDate || selectedDate === "") {
            toast.error("Ngày hết hạn không hợp lệ")
            isValid = false;
        }

        return isValid;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (handleValidation()) {

                const existingBankCard = listBank && listBank.find(
                    (account) =>
                        account.bank_name.toLowerCase() === bankName.toLowerCase() ||
                        account.card_number === cardNumber
                );
            if (existingBankCard) {
                toast.error('Thẻ ngân hàng đã tồn tại');
            } else {
                const data = {
                    card_number: cardNumber.trim(),
                    bank_name: bankName,
                    expiry_date: expriyDate,
                    holder_name: cardHolderName.trim(),
                    cvv: cvv.trim(),
                    balance: balance.trim(),
                    user_id: userId,
                }
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
        <div className='main-add-bank'>
            <FontAwesomeIcon icon={faXmark} className='icon-close' onClick={onClose} />
            <form className='form-add-bank' onSubmit={handleSubmit}>
                <div className='header-add-bank'>
                    <div className='left-add-bank'>
                        <span>Ngân hàng</span>
                        <span>Số tài khoản</span>
                        <span>Ngày hết hạn</span>
                        <span>Tên chủ thẻ</span>
                        <span>CVV</span>
                        <span>Số dư</span>
                    </div>
                    <div className='right-add-bank'>
                        <select id="bankSelect" onChange={(e) => setBankName(e.target.value)}>
                            <option value="">--Chọn ngân hàng--</option>
                            {bankNames.map((bankName, index) => (
                                <option key={index} value={bankName}>
                                    {bankName}
                                </option>
                            ))}
                        </select>
                        <input type="text" placeholder="Nhập số tài khoản" onChange={(e) => setCardNumber(e.target.value)} />
                        <input type="date" onChange={(e) => setExpireDate(e.target.value)} />
                        <input type="text" placeholder="Tên chủ thẻ viết hoa không dấu" onChange={(e) => setCardHolderName(e.target.value)} />
                        <input type="text" placeholder="CVV" onChange={(e) => setCvv(e.target.value)} />
                        <input type="number" placeholder="Số dư" onChange={(e) => setBalance(e.target.value)} />
                    </div>
                </div>
                <div className='footer-add-bank'>
                    <button type='submit'>Xác nhận thêm thẻ</button>
                </div>
            </form>
        </div>
    )
}

export default AddBankCard