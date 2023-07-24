import React, { useEffect, useState } from 'react'
import '../style/BankAccount.css'
import { Avatar, Typography } from '@mui/material'
import userApis from '../api/modules/user.api'
import userBankCardApis from '../api/modules/userbankcard.api'
import ItemBankAccount from '../components/common/ItemBankAccount'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faCircleInfo, faBuildingColumns, faCreditCard, faBarcode, faCalendarXmark, faUser, faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify'
import AddBankCard from '../components/common/AddBankCard'
import { addDays, format } from 'date-fns'

const BankAccount = () => {

  const username = localStorage.getItem('username');
  const [listAccounts, setListAccounts] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [isShowAddCard, setIsShowAddCard] = useState(false)
  const [isOpenForm, setIsOpenForm] = useState({});
  const [bankInfo, setBankInfo] = useState('')
  const [showBlurOverlay, setShowBlurOverlay] = useState(false);

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
          setListAccounts('')
        }
      }
      else {
        console.log(response)
      }
    }
    getListBankCard()
  }, [username, isLoading, isShowAddCard])

  const handleDelete = async (id) => {
    setSelectedCardId(id);
    setShowDeleteConfirmation(true);
    setShowBlurOverlay(true);
  };


  const showDetailBank = async (id) => {
    const response = await userBankCardApis.getById(id)
    if (response.success && response) {
      setBankInfo(response.data)
      console.log(response)
    }
    else {
      console.log(response)
    }

  }

  const formattedDate = (date) => {
    const increasedDate = addDays(new Date(date), 0);
    const formattedDate = format(increasedDate, 'dd/MM/yyyy');
    return formattedDate;
  }
  const formattedBalance = (balance) => {
    const formattedBalance = balance.toLocaleString('vi-VN');

    return formattedBalance;
  }

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
    setShowBlurOverlay(false);

  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setSelectedCardId(null);
    setShowBlurOverlay(false);
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
        >Danh sách tài khoản</Typography>
        <button className='btn-add-bank' onClick={() =>
          setIsShowAddCard(true)
        }><FontAwesomeIcon icon={faPlus} /> Thêm tài khoản</button>
        <div className='table-bank-account'>
          {listAccounts &&
            listAccounts.map((item) => (
              <div className='item-table-account' key={item.id} onClick={() => setIsOpenForm({ ...isOpenForm, [item.id]: !isOpenForm[item.id] })}>
                <ItemBankAccount data={item} />
                {isOpenForm[item.id] && <div className='form-delete-show'>
                  <button className='btn-delete-bank' onClick={() => handleDelete(item.id)}><FontAwesomeIcon icon={faTrash} /> Xoá thẻ</button>
                  <button className='btn-detail-bank' onClick={() => showDetailBank(item.id)} ><FontAwesomeIcon icon={faCircleInfo} /> Chi tiết</button>
                </div>}
              </div>
            ))}
        </div>
      </div>
      <div className='right-bank-account'>
        <div className='right-top-bank-account'>
          {bankInfo ? (<>
            <div className='left-detail-bank'>
              <Typography sx={{
                fontSize: '25px',
                fontWeight: '600',
                margin: '10px 0px 30px 20px'
              }}
              >Thông tin thẻ</Typography>
              <div>
                <FontAwesomeIcon icon={faBuildingColumns} />
                <span>Ngân hàng</span>
                <span className='span-data'>{bankInfo.bank_name}</span>
              </div>
              <div>
                <FontAwesomeIcon icon={faUser} />
                <span>Tên chủ thẻ</span>
                <span className='span-data'>{bankInfo.holder_name}</span>
              </div>
              <div>
                <FontAwesomeIcon icon={faCreditCard} />
                <span>Số tài khoản</span>
                <span className='span-data'>{bankInfo.card_number}</span>
              </div>
              <div>
                <FontAwesomeIcon icon={faBarcode} />
                <span>CVV</span>
                <span className='span-data'>{bankInfo.cvv}</span>
              </div>
              <div>
                <FontAwesomeIcon icon={faCalendarXmark} />
                <span>Expiry date</span>
                <span className='span-data'>{formattedDate(bankInfo.expiry_date)}</span>
              </div>
            </div>
            <div className='right-detail-bank'>
              <Avatar src={require('../images/atm-card.png')} sx={{ width: '120px', height: '120px', margin: '40px 0px 20px 0px', border: '1px solid #ccc' }} />
              <div>
                <FontAwesomeIcon icon={faDollarSign} style={{ marginRight: '10px' }} />
                <span style={{ fontSize: '18px', fontWeight: '500' }}>Số dư khả dụng</span>
              </div>
              <span style={{ fontSize: '22px', fontWeight: '700', marginTop: '10px' }} >{formattedBalance(bankInfo.balance)} đ</span>
            </div>
          </>) : <Typography sx={{
            fontSize: '25px',
            fontWeight: '600',
            position: 'relative',
            top: '120px',
            left: '280px',
          }}>Chưa có dữ liệu</Typography>}
        </div>

        <div className='right-bottom-bank-account'>

        </div>
      </div>
      {showBlurOverlay && <div className='blur-overlay'></div>}
      {/* Form xác nhận */}
      {showDeleteConfirmation && (
        <div className='delete-confirmation'>
          <Typography variant='h4' fontSize='20px' fontWeight='500' color='Highlight' marginBottom='20px'>Xác nhận</Typography>
          <Typography variant='h5' sx={{ fontSize: '18px', fontWeight: '500', marginBottom: '10px' }}>
            Bạn có chắc chắn muốn xoá thẻ này?
          </Typography>
          <div className='delete-buttons'>
            <button onClick={handleConfirmDelete} className='btn-confirm'>Xác nhận</button>
            <button onClick={handleCancelDelete} className='btn-cancel'>Hủy</button>
          </div>
        </div>
      )}
      {isShowAddCard && <AddBankCard onClose={() => setIsShowAddCard(false)} />}
    </div>
  )
}

export default BankAccount