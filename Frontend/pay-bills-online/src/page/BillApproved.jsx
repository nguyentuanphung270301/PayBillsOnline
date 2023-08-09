import { faCheckToSlot, faClipboardCheck, faFileCirclePlus, faPenToSquare, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import '../style/BillCreate.css'
import PropTypes from 'prop-types';
import billApis from '../api/modules/bill.api'
import { addDays, format } from 'date-fns'
import CreateBill from '../components/common/CreateBill'
import { toast } from 'react-toastify'
import EditBill from '../components/common/EditBill'
import userApis from '../api/modules/user.api'


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
        label: 'Mã hoá đơn'
    },
    {
        id: 'service',
        numberic: false,
        disablePadding: true,
        label: 'Dịch vụ'
    },
    {
        id: 'supplier',
        numberic: false,
        disablePadding: true,
        label: 'Nhà cung cấp'
    },
    {
        id: 'nameUser',
        numberic: false,
        disablePadding: true,
        label: 'Tên khách hàng'
    },
    {
        id: 'amount',
        numberic: true,
        disablePadding: true,
        label: 'Tổng tiền'
    },
    {
        id: 'due_date',
        numberic: false,
        disablePadding: true,
        label: 'Ngày hết hạn'
    },
    {
        id: 'status',
        numberic: false,
        disablePadding: true,
        label: 'Trạng thái'
    },
    {
        id: 'action',
        numberic: false,
        disablePadding: true,
        label: 'Hành động'
    },
]

function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow sx={{ backgroundColor: '#54afff' }}>
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



const BillApproved = () => {
    const [billList, setBillList] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [isRequest, setIsRequest] = useState(false)
    const [filterBill, setFilterBill] = useState('')
    const [userId, setUserId] = useState('')

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const username = localStorage.getItem('username');

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
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - billList.length) : 0;

    const handleClickOpen = (id) => {
        setSelectedId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setSelectedId(null);
        setOpen(false);
    };

    useEffect(() => {
        const getUserId = async () => {
            const res = await userApis.getUserByUsername(username);
            if(res.success && res ){
                setUserId(res.data.id);
            }
        }
        getUserId()
    },[username])


    useEffect(() => {
        const getBillList = async () => {
            const res = await billApis.getAll()
            if (res.success && res) {
                if (filterBill === '') {
                    console.log(res)
                    setBillList(res.data)
                    setIsLoading(false)
                }
                else if (filterBill === 'Đã duyệt') {
                    setBillList(res.data.filter(item => item.status === 'CHỜ THANH TOÁN'))
                }
                else if (filterBill === 'Chưa duyệt') {
                    setBillList(res.data.filter(item => item.status === 'CHƯA DUYỆT'))
                }
                else if (filterBill === 'Đã thanh toán') {
                    setBillList(res.data.filter(item => item.status === 'ĐÃ THANH TOÁN'))
                }
            }
            else {
                console.log(res)
                setIsLoading(false)
                setBillList('')
            }
        }
        getBillList()
    }, [isRequest, filterBill])


    const approvedBill = async (id) => {

        const data = {
            status: 'CHỜ THANH TOÁN',
            approved_id: userId
        }

        const res = await billApis.updateStatusBill(id, data)
        if (res.success && res) {
            toast.success("Duyệt hoá đơn thành công")
            setIsRequest(!isRequest)
            handleClose()
        }
        else {
            toast.error("Duyệt hoá đơn thất bại")
            console.log(res)
            handleClose()
        }
    }

    const formatDate = (date) => {
        const increasedDate = addDays(new Date(date), 0);
        const formattedDate = format(increasedDate, 'dd-MM-yyyy');
        return formattedDate;
    }
    const formattedPrice = (balance) => {
        const formattedBalance = balance.toLocaleString('vi-VN');

        return formattedBalance;
    }

    return (
        <div className='main-bill'>
            <Typography sx={{
                color: '#0057da',
                margin: '20px',
                fontSize: '25px',
                fontWeight: 'bold',
                textAlign: 'center',
            }}>Duyệt hoá đơn</Typography>
            <div className='filter-bill'>
                <label>Lọc</label>
                <select onChange={(e) => setFilterBill(e.target.value)}>
                <option value=''>----Chọn---</option>
                    <option value='Đã duyệt'>Đã duyệt</option>
                    <option value='Chưa duyệt'>Chưa duyệt</option>
                    <option value='Đã thanh toán'>Đã thanh toán</option>
                </select>
            </div>
            <div className='bill-create-table'>
                {isLoading && <CircularProgress sx={{
                    position: 'absolute',
                    top: '200px',
                    right: 'calc(100% / 2)'
                }} />}
                {!isLoading && (
                    <>
                        <TableContainer component={Paper} sx={{ height: '480px', }}>
                            <Table sx={{ minWidth: 650 }} aria-labelledby="tableTitle"
                            >
                                <EnhancedTableHead
                                    numSelected={selected.length}
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={handleRequestSort}
                                    rowCount={billList.length}
                                />
                                {!billList ? <Typography sx={{
                                    position: 'absolute',
                                    top: '200px',
                                    right: 'calc(100% / 2)',
                                }} >Không có dữ liệu</Typography> : <TableBody>
                                    {stableSort(billList, getComparator(order, orderBy))
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
                                                    <TableCell >{row.service_name}</TableCell>
                                                    <TableCell >{row.supplier_name}</TableCell>
                                                    <TableCell >{row.customer_name}</TableCell>
                                                    <TableCell >{formattedPrice(row.amount)} đ</TableCell>
                                                    <TableCell >{formatDate(row.due_date)}</TableCell>
                                                    <TableCell >
                                                        <Typography sx={{
                                                            textTransform: 'uppercase',
                                                            border: '1px solid #ccc',
                                                            height: '40px',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            borderRadius: '5px',
                                                            fontweight: '700',
                                                            color: 'white',
                                                            backgroundColor: row.status === 'CHƯA DUYỆT' ? 'red' : row.status === 'CHỜ THANH TOÁN' ? '#ffa900' : row.status === 'ĐÃ THANH TOÁN' ? '#22dc00' : '',
                                                            fontSize: '15px',
                                                        }}>
                                                            {row.status}
                                                        </Typography>
                                                    </TableCell>

                                                    <TableCell sx={{
                                                        display: 'flex',
                                                        justifyItems: 'center',
                                                    }}>
                                                        <Box>
                                                            <Button
                                                                variant='contained'
                                                                sx={{
                                                                    backgroundColor: '#00d842',
                                                                    height: '40px',
                                                                    width: '100px',
                                                                    ":hover": {
                                                                        backgroundColor: '#5bff00',
                                                                        opacity: 0.8
                                                                    }
                                                                }}
                                                                disabled={row.status === 'CHƯA DUYỆT' ? false : true}
                                                                onClick={() => handleClickOpen(row.id)}
                                                            >
                                                                <FontAwesomeIcon icon={faCheckToSlot} />
                                                            </Button>
                                                            <Dialog
                                                                open={open}
                                                                onClose={handleClose}
                                                            >
                                                                <DialogTitle>Duyệt Hoá Đơn</DialogTitle>
                                                                <DialogContent>
                                                                    <DialogContentText>
                                                                        Bạn có muốn duyệt hoá đơn này không
                                                                    </DialogContentText>
                                                                </DialogContent>
                                                                <DialogActions>
                                                                    <Button onClick={handleClose}>huỷ</Button>
                                                                    <Button
                                                                        onClick={() => approvedBill(selectedId)}
                                                                        sx={{
                                                                            backgroundColor: 'white',
                                                                            ":hover": {
                                                                                backgroundColor: '#00d842',
                                                                                opacity: 0.8,
                                                                                color: 'white'
                                                                            }
                                                                        }}
                                                                    >
                                                                        Duyệt
                                                                    </Button>
                                                                </DialogActions>
                                                            </Dialog>
                                                        </Box>
                                                    </TableCell>
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
                    count={billList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
        </div>
    )
}

export default BillApproved