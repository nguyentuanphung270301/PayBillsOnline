import React, { useEffect, useState } from 'react'
import '../style/AccountPay.css'
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillTransfer, faPenToSquare, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import AddAccountPay from '../components/common/AddAccountPay';
import userBankCardApis from '../api/modules/userbankcard.api';
import { addDays, format } from 'date-fns';
import TransAccount from '../components/common/TransAccount';
import { toast } from 'react-toastify';




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
        label: 'Mã tài khoản'
    },
    {
        id: 'cardNumber',
        numberic: false,
        disablePadding: true,
        label: 'Số tài khoản'
    },
    {
        id: 'usernames',
        numberic: false,
        dispatchEvent: true,
        label: 'Tên khách hàng'
    },
    {
        id: 'balance',
        numberic: true,
        disablePadding: true,
        label: 'Số dư'
    },
    {
        id: 'createDate',
        numberic: false,
        disablePadding: true,
        label: 'Ngày tạo'
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





const AccountPay = () => {

    const [isLoading, setIsLoading] = useState(true)
    const [serviceList, setServiceList] = useState('')
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [isRequest, setIsRequest] = useState(false)

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showAddService, setShowAddService] = useState(false);
    const [showEditService, setShowEditService] = useState(false);

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
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - serviceList.length) : 0;

    const handleClickOpen = (id) => {
        setSelectedId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setSelectedId(null);
        setOpen(false);
    };
    const handleEidt = (id) => {
        setSelectedId(id)
        setShowEditService(true)
    }

    // useEffect(() => {
    //     const getServiceList = async () => {
    //         const res = await serviceApis.getAll()
    //         if (res.success && res) {
    //             console.log(res)
    //             setServiceList(res.data)
    //             setIsLoading(false)
    //         }
    //         else {
    //             console.log(res)
    //             setIsLoading(false)
    //         }
    //     }
    //     getServiceList()
    // }, [isRequest, showEditService, showAddService]);

    // const getSupplierNameById = async (id) => {
    //     try {
    //         const res = await supplierApis.getById(id);
    //         if (res.success && res.data) {
    //             return res.data.name;
    //         }
    //         return null;
    //     } catch (error) {
    //         console.log(error);
    //         return null;
    //     }
    // };

    useEffect(() => {
        const fetchData = async () => {
            const res = await userBankCardApis.getAll()
            if (res.success) {
                setServiceList(res.data)
                setIsLoading(false)
            }
            else {
                setServiceList('')
                setIsLoading(false)
            }
        };
        fetchData();
    }, [isRequest, showEditService, showAddService]);

    const deleteBank = async (id) => {
        const res = await userBankCardApis.deleteById(id);
        if (res.success && res.data) {
            console.log(res);
            setIsRequest(!isRequest);
            toast.success('Xoá tài khoản thanh toán thành công')
            handleClose();
        }
        else {
            console.log(res);
            toast.error(res.error.sqlMessage)
            handleClose();
        }
    }

    const formattedBalance = (balance) => {
        const formattedBalance = balance.toLocaleString('vi-VN');

        return formattedBalance;
    }

    const formatDate = (date) => {
        const increasedDate = addDays(new Date(date), 0);
        const formattedDate = format(increasedDate, 'dd-MM-yyyy');
        return formattedDate;
    }
    return (
        <div className='main-admin-account'>
            <Typography sx={{
                color: '#0057da',
                margin: '20px',
                fontSize: '25px',
                fontWeight: 'bold',
                textAlign: 'center',
            }}>Quản trị tài khoản khách hàng</Typography>
            <button className='btn-admin-add' onClick={() => setShowAddService(true)} ><FontAwesomeIcon icon={faPlus} />Thêm tài khoản</button>
            <div className='admin-account-table'>
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
                                    rowCount={serviceList.length}
                                />
                                {!serviceList ? <Typography sx={{
                                    position: 'absolute',
                                    top: '200px',
                                    right: 'calc(100% / 2)',
                                }} >Không có dữ liệu</Typography> : <TableBody>
                                    {stableSort(serviceList, getComparator(order, orderBy))
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
                                                    <TableCell >{row.card_number}</TableCell>
                                                    <TableCell >{row.firstname} {row.lastname}</TableCell>
                                                    <TableCell >{formattedBalance(row.balance)} đ</TableCell>
                                                    <TableCell >{formatDate(row.create_date)}</TableCell>
                                                    <TableCell sx={{
                                                        display: 'flex',
                                                        justifyItems: 'center',
                                                    }}>
                                                        <Button
                                                            variant='contained'
                                                            sx={{
                                                                marginRight: '10px',
                                                                height: '40px',
                                                                backgroundColor: '#45eb37',
                                                                ":hover": {
                                                                    backgroundColor: '#45eb37',
                                                                    opacity: '0.8'
                                                                }
                                                            }}
                                                            onClick={() => handleEidt(row.id)}
                                                        ><FontAwesomeIcon icon={faMoneyBillTransfer} /></Button>
                                                        <Box>
                                                            <Button
                                                                variant='contained'
                                                                sx={{
                                                                    backgroundColor: 'red',
                                                                    height: '40px',
                                                                    ":hover": {
                                                                        backgroundColor: 'red',
                                                                        opacity: 0.8
                                                                    }
                                                                }}
                                                                onClick={() => handleClickOpen(row.id)}
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </Button>
                                                            <Dialog
                                                                open={open}
                                                                onClose={handleClose}
                                                            >
                                                                <DialogTitle>Xoá Tài Khoản</DialogTitle>
                                                                <DialogContent>
                                                                    <DialogContentText>
                                                                        Bạn có muốn xoá tài khoản này không
                                                                    </DialogContentText>
                                                                </DialogContent>
                                                                <DialogActions>
                                                                    <Button onClick={handleClose}>Cancel</Button>
                                                                    <Button
                                                                        onClick={() => deleteBank(selectedId)}
                                                                        sx={{
                                                                            backgroundColor: 'white',
                                                                            ":hover": {
                                                                                backgroundColor: 'red',
                                                                                opacity: 0.8,
                                                                                color: 'white'
                                                                            }
                                                                        }}
                                                                    >
                                                                        Xoá
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
                    count={serviceList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
            {showAddService && <AddAccountPay onClose={() => setShowAddService(false)} bankList={serviceList}/>}
            {showEditService && <TransAccount onClose={() => setShowEditService(false)} id={selectedId} />}
        </div>
    )
}

export default AccountPay