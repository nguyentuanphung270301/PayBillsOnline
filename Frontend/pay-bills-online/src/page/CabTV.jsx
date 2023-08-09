import { faPenToSquare, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import '../style/Cabtv.css'
import serviceApis from '../api/modules/service.api';
import userApis from '../api/modules/user.api';
import cabApis from '../api/modules/cab.api';
import { addDays, format } from 'date-fns';
import supplierApis from '../api/modules/supplier.api';
import { toast } from 'react-toastify';
import AddCab from '../components/common/AddCab';
import EditCab from '../components/common/EditCab';

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
        label: 'Mã bản ghi'
    },
    {
        id: 'package_name',
        numberic: false,
        disablePadding: true,
        label: 'Tên gói'
    },
    {
        id: 'start_date',
        numberic: false,
        disablePadding: true,
        label: 'Ngày bắt đầu'
    },
    {
        id: 'end_date',
        numberic: false,
        disablePadding: true,
        label: 'Ngày kết thúc'
    },
    {
        id: 'price',
        numberic: true,
        disablePadding: true,
        label: 'Giá'
    },
    {
        id: 'service',
        numberic: false,
        disablePadding: true,
        label: 'Tên dịch vụ - Nhà cung cấp'
    },
    {
        id: 'user',
        numberic: false,
        disablePadding: true,
        label: 'Mã khách hàng - Tên khách hàng'
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


const CabTV = () => {
    const [cabList, setCabList] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [isRequest, setIsRequest] = useState(false)

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showAddCab, setShowAddCab] = useState(false);
    const [showEditCab, setShowEditCab] = useState(false);
    const [search, setSearch] = useState('')


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
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - cabList.length) : 0;

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
        setShowEditCab(true)
    }

    const getServiceNameById = async (id) => {
        try {
            const res = await serviceApis.getById(id);
            if (res.success && res.data) {
                const result = await supplierApis.getById(res.data.supplier_id);
                if (result.success && result) {
                    return res.data.name + ' - ' + result.data.name;
                }
                else {
                    return null
                }
            }
            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const getNameUserById = async (id) => {
        try {
            const res = await userApis.getById(id);
            if (res.success && res.data) {
                return res.data.firstname + ' ' + res.data.lastname;
            }
            return null;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cabRes = await cabApis.getAll();
                if (cabRes.success && cabRes.data) {
                    const updatedCabList = await Promise.all(
                        cabRes.data.map(async (service) => {
                            const serviceName = await getServiceNameById(service.service_id);
                            const nameUser = await getNameUserById(service.user_id);
                            return {
                                ...service,
                                serviceName: serviceName || 'N/A',
                                nameUser: nameUser || 'N/A'
                            };
                        })
                    );
                    if (!search) {
                        setCabList(updatedCabList);
                    setIsLoading(false);
                    }
                    else {
                        const searchText = search.toLowerCase()
                        const filteredUser = updatedCabList.filter(user => {
                            const fullName = user.customer_code.toLowerCase() + ' ' + user.customer_name.toLowerCase();
                            return fullName.includes(searchText)
                        })
                        setCabList(filteredUser)
                        setIsLoading(false)
                    }
                } else {
                    console.log(cabRes);
                    setCabList('');
                    setIsLoading(false);
                }
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        };
        fetchData();
    }, [isRequest, showEditCab, showAddCab, search]);

    const deleteCab = async (id) => {
        const res = await cabApis.deleteCab(id)
        if (res.success && res) {
            toast.success('Xoá dữ liệu thành công')
            setIsRequest(!isRequest)
            handleClose()
        }
        else {
            toast.error(res.error.sqlMessage)
            toast.error('Xoá dữ liệu thất bại');
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
        <div className='main-cabtv'>
            <Typography sx={{
                color: '#0057da',
                margin: '20px',
                fontSize: '25px',
                fontWeight: 'bold',
                textAlign: 'center',
            }}>Nhập liệu truyền hình cáp</Typography>
            <input className='input-search' placeholder='Tìm kiếm theo mã, tên khách hàng ....' onChange={(e) => setSearch(e.target.value)} />
            <button className='btn-add-cab' onClick={() => setShowAddCab(true)}><FontAwesomeIcon icon={faPlus} />Thêm</button>
            <div className='admin-cab-table'>
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
                                    rowCount={cabList.length}
                                />
                                {!cabList ? <Typography sx={{
                                    position: 'absolute',
                                    top: '200px',
                                    right: 'calc(100% / 2)',
                                }} >Không có dữ liệu</Typography> : <TableBody>
                                    {stableSort(cabList, getComparator(order, orderBy))
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
                                                    <TableCell >{row.package_name}</TableCell>
                                                    <TableCell >{formatDate(row.start_date)}</TableCell>
                                                    <TableCell >{formatDate(row.end_date)}</TableCell>
                                                    <TableCell >{formattedPrice(row.price)} đ</TableCell>
                                                    <TableCell >{row.serviceName}</TableCell>
                                                    <TableCell >{row.customer_code} - {row.customer_name}</TableCell>

                                                    <TableCell sx={{
                                                        display: 'flex',
                                                        justifyItems: 'center',
                                                    }}>
                                                        <Button
                                                            variant='contained'
                                                            sx={{
                                                                marginRight: '10px',
                                                                height: '40px'
                                                            }}
                                                            onClick={() => handleEidt(row.id)}
                                                        ><FontAwesomeIcon icon={faPenToSquare} /></Button>
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
                                                                <DialogTitle>Xoá Dữ Liệu</DialogTitle>
                                                                <DialogContent>
                                                                    <DialogContentText>
                                                                        Bạn có muốn xoá dữ liệu này không
                                                                    </DialogContentText>
                                                                </DialogContent>
                                                                <DialogActions>
                                                                    <Button onClick={handleClose}>Cancel</Button>
                                                                    <Button
                                                                        onClick={() => deleteCab(selectedId)}
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
                    count={cabList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
            {showAddCab && <AddCab onClose={() => setShowAddCab(false)} />}
            {showEditCab && <EditCab onClose={() => setShowEditCab(false)} id={selectedId}/>}
        </div>
    )
}

export default CabTV