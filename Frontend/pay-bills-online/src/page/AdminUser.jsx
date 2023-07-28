import React, { useEffect, useState } from 'react'
import '../style/AdminUser.css'
import PropTypes from 'prop-types';
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import userApis from '../api/modules/user.api';
import { addDays, format } from 'date-fns';
import { toast } from 'react-toastify';
import authApis from '../api/modules/auth.api';
import userAuthApis from '../api/modules/user_auth.api';
import AddUser from '../components/common/AddUser';
import EditUser from '../components/common/EditUser';

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
        label: 'Mã User'
    },
    {
        id: 'name',
        numberic: false,
        disablePadding: true,
        label: 'Tên người dùng'
    },
    {
        id: 'email',
        numberic: false,
        disablePadding: true,
        label: 'Email'
    },
    {
        id: 'phone',
        numberic: false,
        disablePadding: true,
        label: 'Số điện thoại'
    },
    {
        id: 'dob',
        numberic: false,
        disablePadding: true,
        label: 'Ngày sinh'
    },
    {
        id: 'gender',
        numberic: false,
        disablePadding: true,
        label: 'Giới tính'
    },
    {
        id: 'address',
        numberic: false,
        disablePadding: true,
        label: 'Địa chỉ'
    },
    {
        id: 'status',
        numberic: true,
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


const AdminUser = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [userList, setUserList] = useState('')
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [isRequest, setIsRequest] = useState(false)


    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showAddUser, setShowAddUser] = useState(false);
    const [showEditUser, setShowEditUser] = useState(false);

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
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

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
        setShowEditUser(true)
    }
    useEffect(() => {
        const getAllUser = async () => {
            const res = await userApis.getAll()
            if (res.success && res) {
                console.log(res)
                setUserList(res.data)
                setIsLoading(false)
            }
            else {
                console.log(res)
                setIsLoading(false)
            }
        }
        getAllUser()
    }, [isRequest, showAddUser, showEditUser])

    const formatDate = (date) => {
        const increasedDate = addDays(new Date(date), 0);
        const formattedDate = format(increasedDate, 'dd-MM-yyyy');
        return formattedDate;
    }

    const deleteUser = async (userId) => {
        const res = await userApis.updateStatus(userId)
        if (res.success && res) {
            const response = await userAuthApis.updateStatus(userId)
            if (response.success && response) {
                console.log(response)
                toast.success("Xoá người dùng thành công!")
                setIsRequest(!isRequest)
                setOpen(false)
            }
            else {
                console.log(response)
                toast.error("Xoá người dùng thất bại!")
                setIsRequest(!isRequest)
                setOpen(false)
            }
        }
        else {
            console.log(res)
        }
    }

    return (
        <div className='main-admin-user'>
            <Typography sx={{
                color: '#0057da',
                margin: '20px',
                fontSize: '25px',
                fontWeight: 'bold',
                textAlign: 'center',
            }}>Quản trị người dùng</Typography>
            <button className='btn-admin-add' onClick={() => setShowAddUser(true)}><FontAwesomeIcon icon={faPlus} />Thêm người dùng</button>
            <div className='admin-user-table'>
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
                                    rowCount={userList.length}
                                />
                                {!userList ? <Typography sx={{
                                    position: 'absolute',
                                    top: '200px',
                                    right: 'calc(100% / 2)',
                                }} >Không có dữ liệu</Typography> : <TableBody>
                                    {stableSort(userList, getComparator(order, orderBy))
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
                                                    <TableCell >{`${row.firstname} ${row.lastname}`}</TableCell>
                                                    <TableCell >{row.email}</TableCell>
                                                    <TableCell >{row.phone}</TableCell>
                                                    <TableCell>{row.dob && formatDate(row.dob)}</TableCell>
                                                    <TableCell>{(row.gender === 1 && 'Nam') || (row.gender === 0 && 'Nữ')}</TableCell>
                                                    <TableCell>{row.address}</TableCell>
                                                    <TableCell>
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
                                                            backgroundColor: `${row.status === 1 ? '#00da2d' : '#da3600'}`,
                                                            fontSize: '15px',
                                                        }}>
                                                            {row.status === 1 ? 'đang hoạt động' : 'đã xoá'}
                                                        </Typography>
                                                    </TableCell>
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
                                                            disabled={row.status === 0}
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
                                                                disabled={row.status === 0}
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </Button>
                                                            <Dialog
                                                                open={open}
                                                                onClose={handleClose}
                                                            >
                                                                <DialogTitle>Xoá Người Dùng</DialogTitle>
                                                                <DialogContent>
                                                                    <DialogContentText>
                                                                        Bạn có muốn xoá người dùng này không
                                                                    </DialogContentText>
                                                                </DialogContent>
                                                                <DialogActions>
                                                                    <Button onClick={handleClose}>Cancel</Button>
                                                                    <Button
                                                                        onClick={() => deleteUser(selectedId)}
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
                    count={userList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
            {showAddUser && <AddUser onClose={() => setShowAddUser(false)} />}
            {showEditUser && <EditUser onClose={() => setShowEditUser(false)} id={selectedId} />}
        </div>
    )
}

export default AdminUser