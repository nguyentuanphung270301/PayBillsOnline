import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import roleApis from '../../api/modules/role.api'
import userApis from '../../api/modules/user.api'
import userBankCardApis from '../../api/modules/userbankcard.api'
import { format } from 'date-fns'
import userBankCardTransactionApis from '../../api/modules/userbankcardtransaction.api'

const TransAccount = ({ id, onClose }) => {
    const [rolecode, setRolecode] = useState('')
    const [amount, setAmount] = useState('')
    const [info, setInfo] = useState('')
    const [userId, setUserId] = useState('')
    const [currentTime, setCurrentTime] = useState('')
    const [description, setDescription] = useState('')
    useEffect(() => {
        const getRoleById = async () => {
                const now = new Date();
                const formattedTime = format(now, 'yyyy-MM-dd HH:mm:ss');
                setCurrentTime(formattedTime);
            const bankRes = await userBankCardApis.getById(id)
            if (bankRes.success) {
                setInfo(bankRes.data.balance)
                const res = await userApis.getById(bankRes.data.user_id)
                if (res) {
                    setRolecode(res.data.firstname + " " + res.data.lastname)
                    setUserId(res.data.id)
                }
                else {
                    console.log(res)
                }
            }

        }
        getRoleById()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const balance = parseInt(info) + parseInt(amount)
        const data = {
            balance: balance,
        }

        if(amount < 10000) {
            toast.error('Số tiền giao dịch phải lớn hơn 10.000đ')
            return ;
        }

        const bankCardTransactionData = {
            transaction_type: 'Ghi có (Credit)',
            amount: parseInt(amount),
            transaction_date: currentTime,
            description: description,
            usercardbank_id: id
        }

        console.log(data)
         const res = await userBankCardApis.updateBankCard(id, data)
         if(res.success) { 
            const transactionRes = await userBankCardTransactionApis.createBankCard(bankCardTransactionData)
            if (transactionRes.success) {
                toast.success('Giao dịch thành công')
                onClose()
            }
            else {
                console.log(transactionRes.error)
            }
         } 

    }
    return (
        <div className='overlay'>
            <div className='main-add-role'>
                <FontAwesomeIcon icon={faXmark} onClick={onClose} className='icon-close-add-role' />
                <form className='form-add-role' onSubmit={handleSubmit}>
                    <div className='form-flex'>
                        <label>Tên khách hàng</label>
                        <input type='text'
                            placeholder='Mã vai trò'
                            value={rolecode || ''}
                            onChange={(e) => setRolecode(e.target.value)}
                            disabled={true}
                        />
                    </div>
                    <div className='form-flex'>
                        <label>Số tiền nạp</label>
                        <input type='number'
                            placeholder='Số tiền giao dịch'
                            value={amount || ''}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <div className='form-flex'>
                        <label>Mô tả</label>
                        <textarea onChange={(e) => setDescription(e.target.value)}/>
                    </div>
                    <button className='btn-save-role' type='submit'>Lưu</button>
                </form>
            </div>
        </div>
    )
}

export default TransAccount