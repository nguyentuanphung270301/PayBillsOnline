import { faPenToSquare, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import '../style/UserAuth.css'
import PropTypes from 'prop-types';
import userAuthApis from '../api/modules/user_auth.api'
import AddAuth from '../components/common/AddAuth'
import { toast } from 'react-toastify'


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
        label: 'Mã người dùng'
    },
    {
        id: 'name',
        numberic: false,
        disablePadding: true,
        label: 'Tên người dùng'
    },
    {
        id: 'username',
        numberic: false,
        disablePadding: true,
        label: 'Tên đăng nhập'
    },
    {
        id: 'rolecode',
        numberic: false,
        disablePadding: true,
        label: 'Mã vai trò'
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

const UserAuth = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [authList, setAuthList] = useState('')
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [isRequest, setIsRequest] = useState(false)

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showAddAuth, setShowAddAuth] = useState(false);
    const [showEditAuth, setShowEditAuth] = useState(false);

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
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - authList.length) : 0;

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
        setShowEditAuth(true)
    }

    useEffect(() => {
        const getAuthList = async () => {
            const res = await userAuthApis.getAllAuth()
            if (res.success && res) {
                setAuthList(res.data)
                setIsLoading(false)
            }
            else {
                setAuthList('')
                setIsLoading(false)
            }
        }
        getAuthList()
    }, [isRequest, showAddAuth, showEditAuth])

    const deleteAuth = async (id) => {
        const res = await userAuthApis.deleteAuth(id)
        if(res.success && res) {
            toast.success('Xoá quyền tài khoản thành công')
            setIsRequest(!isRequest)
            handleClose()
        }
        else{
            toast.error('Xoá quyền tài khoản thất bại')
            handleClose()
        }
    }

    return (
        <div className='main-user-auth'>
            <Typography sx={{
                color: '#0057da',
                margin: '20px',
                fontSize: '25px',
                fontWeight: 'bold',
                textAlign: 'center',
            }}>Cấp role cho tài khoản</Typography>
            <button className='btn-user-auth' onClick={() => setShowAddAuth(true)} ><FontAwesomeIcon icon={faPlus} />Phân quyền</button>
            <div className='user-auth-table'>
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
                                    rowCount={authList.length}
                                />
                                {!authList ? <Typography sx={{
                                    position: 'absolute',
                                    top: '200px',
                                    right: 'calc(100% / 2)',
                                }} >Không có dữ liệu</Typography> : <TableBody>
                                    {stableSort(authList, getComparator(order, orderBy))
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
                                                        {row.user_id}
                                                    </TableCell>
                                                    <TableCell >{row.firstname} {row.lastname}</TableCell>
                                                    <TableCell >{row.username}</TableCell>
                                                    <TableCell >{row.rolecode}</TableCell>
                                                    <TableCell >
                                                        <Typography sx={{
                                                            height: '40px',
                                                            width: '150px',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            borderRadius: '10px',
                                                            color: 'white',
                                                            backgroundColor: `${row.status === 1 ? 'green' : 'red'}`
                                                        }}>
                                                            {row.status === 1 ? 'ĐANG HOẠT ĐỘNG' : 'VÔ HIỆU HOÁ'}
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
                                                                <DialogTitle>Xoá Vai Trò</DialogTitle>
                                                                <DialogContent>
                                                                    <DialogContentText>
                                                                        Bạn có muốn xoá vai trò này không
                                                                    </DialogContentText>
                                                                </DialogContent>
                                                                <DialogActions>
                                                                    <Button onClick={handleClose}>Cancel</Button>
                                                                    <Button
                                                                        onClick={() => deleteAuth(selectedId)}
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
                    count={authList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
            {showAddAuth && <AddAuth onClose={() => setShowAddAuth(false)} />}
        </div>
    )
}

export default UserAuth