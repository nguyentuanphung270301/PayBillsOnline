import React, { useEffect, useState } from 'react'
import '../style/BankAccount.css'
import { Typography } from '@mui/material'
import userApis from '../api/modules/user.api'
import userBankCardApis from '../api/modules/userbankcard.api'
import ItemBankAccount from '../components/common/ItemBankAccount'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify'
import AddBankCard from '../components/common/AddBankCard'

const BankAccount = () => {

  const username = localStorage.getItem('username');
  const [listAccounts, setListAccounts] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [isShowAddCard, setIsShowAddCard] = useState(false)

  useEffect(() => {
    const getListBankCard = async () => {
      const response = await userApis.getUserByUsername(username);
      if (response.success && response) {
        const userId = response.data.id
        const res = await userBankCardApis.getByUserId(userId);
        if (res.success && res) {
          console.log(res)
          setListAccounts(res.data)
        }
        else {
          console.log(res)
        }
      }
      else {
        console.log(response)
      }
    }
    getListBankCard()
  }, [username, isLoading])

  const handleDelete = async (id) => {
    setSelectedCardId(id);
    setShowDeleteConfirmation(true);
  };


  const handleConfirmDelete = async () => {
    if (selectedCardId) {
      const res = await userBankCardApis.deleteById(selectedCardId);
      if (res.success && res) {
        console.log(res);
        toast.success('Xoá thẻ thành công');
        setIsLoading(!isLoading);
      } else {
        console.log(res);
        toast.error('Xoá thẻ thất bại');
      }
    }
    setShowDeleteConfirmation(false);
    setSelectedCardId(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setSelectedCardId(null);
  };
  return (
    <div className='main-bank-account'>
      <div className='left-bank-account'>
        <Typography variant='h4'
          textTransform='uppercase'
          fontSize='25px'
          fontWeight='600'
          color='#085edc'
          sx={{
            position: 'absolute',
            margin: '40px 0px 0px 0px'
          }}
        >Danh sách tài khoản thanh toán</Typography>
        <button className='btn-add-bank' onClick={() => setIsShowAddCard(true)}><FontAwesomeIcon icon={faPlus} /> Thêm tài khoản</button>
        <div className='table-bank-account'>
          {listAccounts &&
            listAccounts.map((item) => (
              <div className='item-table-account' key={item.id}>
                <ItemBankAccount data={item} />
                <button className='btn-delete-bank' onClick={() => handleDelete(item.id)}><FontAwesomeIcon icon={faTrash} /> Xoá thẻ</button>
              </div>
            ))}
        </div>
      </div>
      <div className='right-bank-account'></div>
      {/* Form xác nhận */}
      {showDeleteConfirmation && (
        <div className='delete-confirmation'>
        <Typography variant='h4' fontSize='20px' fontWeight='500' color='Highlight' marginBottom='20px'>Xác nhận</Typography>
          <Typography variant='h5' sx={{fontSize:'18px', fontWeight: '500', marginBottom: '10px' }}>
            Bạn có chắc chắn muốn xoá thẻ này?
          </Typography>
          <div className='delete-buttons'>
            <button onClick={handleConfirmDelete} className='btn-confirm'>Xác nhận</button>
            <button onClick={handleCancelDelete} className='btn-cancel'>Hủy</button>
          </div>
        </div>
      )}
      {isShowAddCard && <AddBankCard onClose={() => setIsShowAddCard(false)}/>}
    </div>
  )
}

export default BankAccount