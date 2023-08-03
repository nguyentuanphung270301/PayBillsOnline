import React, { useEffect, useState } from 'react'
import '../style/BankAccount.css'
import { Avatar, Box, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Typography } from '@mui/material'
import userApis from '../api/modules/user.api'
import userBankCardApis from '../api/modules/userbankcard.api'
import ItemBankAccount from '../components/common/ItemBankAccount'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faCircleInfo, faBuildingColumns, faCreditCard, faBarcode, faCalendarXmark, faUser, faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify'
import AddBankCard from '../components/common/AddBankCard'
import { addDays, format } from 'date-fns'
import PropTypes from 'prop-types';
import userBankCardTransactionApis from '../api/modules/userbankcardtransaction.api'


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'id',
    numberic: true,
    disablePadding: true,
    label: 'Mã Giao Dịch'
  },
  {
    id: 'transaction_type',
    numberic: false,
    disablePadding: true,
    label: 'Loại giao dịch'
  },
  {
    id: 'amount',
    numberic: false,
    disablePadding: true,
    label: 'Số tiền giao dịch'
  },
  {
    id: 'transaction_date',
    numberic: false,
    disablePadding: true,
    label: 'Ngày giao dịch'
  },
  {
    id: 'description',
    numberic: false,
    disablePadding: true,
    label: 'Nội dung giao dịch'
  }
]

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow sx={{ backgroundColor: '#54afff'}}>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              fontSize: '16px',
               
              fontweight: '600'
            }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span">
                  {order === 'desc' ? '' : ''}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

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
  const [transactionList, setTransactionList] = useState('')

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);


  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - transactionList.length) : 0;

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
      const transactionRes = await userBankCardTransactionApis.getAll()
      if (transactionRes.success && transactionRes) {
        console.log(transactionRes)
        setTransactionList(transactionRes.data.filter(transaction => transaction.usercardbank_id === id))
      }
      else {
        console.log(transactionRes)
      }
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
  const formattedDateTrans = (date) => {
    const increasedDate = addDays(new Date(date), 0);
    const formattedDate = format(increasedDate, 'dd-MM-yyyy HH:mm:ss');
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
        toast.error(res.error.sqlMessage);
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
          <div className='table-transaction'>
            {isLoading && <CircularProgress sx={{
              position: 'absolute',
              top: '200px',
              right: 'calc(100% / 2)'
            }} />}
            {!isLoading && (
              <>
                <TableContainer component={Paper} sx={{ height: '300px', }}>
                  <Table aria-labelledby="tableTitle">
                    <EnhancedTableHead
                      numSelected={selected.length}
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}
                      rowCount={transactionList.length}
                    />
                    {!transactionList ? <Typography sx={{
                      position: 'absolute',
                      top: '200px',
                      left: '20%',
                    }} >Không có dữ liệu</Typography> : <TableBody>
                      {stableSort(transactionList, getComparator(order, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => {
                          return (
                            <TableRow
                              hover
                              onClick={(event) => handleClick(event, row.id)}
                              tabIndex={-1}
                              key={row.id}
                            >
                              <TableCell
                              >
                                {row.id}
                              </TableCell>
                              <TableCell >{row.transaction_type}</TableCell>
                              <TableCell >{formattedBalance(row.amount)} đ</TableCell>
                              <TableCell >{formattedDateTrans(row.transaction_date)}</TableCell>
                              <TableCell>{row.description}</TableCell>
                            </TableRow>
                          );
                        })}
                      {emptyRows > 0 && (
                        <TableRow
                        >
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>}
                  </Table>
                </TableContainer>
              </>
            )}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={transactionList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
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