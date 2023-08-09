import { faPenToSquare, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import '../style/ScreenRole.css'
import PropTypes from 'prop-types';
import screenApis from '../api/modules/screen.api'
import AddScreen from '../components/common/AddScreen'
import { toast } from 'react-toastify'
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
        label: 'Id role'
    },
    {
        id: 'rolecode',
        numberic: false,
        disablePadding: true,
        label: 'Mã role'
    },
    {
        id: 'name',
        numberic: false,
        disablePadding: true,
        label: 'Tên role'
    },
    {
        id: 'screen_codes',
        numberic: false,
        disablePadding: true,
        label: 'Mã màn hình'
    },
    {
        id: 'screen_names',
        numberic: false,
        disablePadding: true,
        label: 'Tên màn hình'
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

const ScreenRole = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [screenList, setScreenList] = useState('')
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [isRequest, setIsRequest] = useState(false)

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showAddScreen, setShowAddScreen] = useState(false);
    const [showEditScreen, setShowEditScreen] = useState(false);
    const [listRoleUsers, setListRoleUsers] = useState([])
    const [search, setSearch] = useState('')


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

    useEffect(() => {
        const getInfo = async () => {
            const res = await userApis.getUserAuthByUsername(username);
            if (res.success && res) {
                console.log(res);
                // Tạo một mảng để lưu trữ các giá trị screencode
                const screencodes = [];
                // Lặp qua mỗi đối tượng trong res.data và kiểm tra xem có thêm screencode mới hay không
                res.data.forEach((item) => {
                    const { screencode } = item;
                    if (!screencodes.includes(screencode)) {
                        screencodes.push(screencode);
                    }
                });
                // Lưu mảng screencodes vào state
                setListRoleUsers(screencodes);

            } else {
                console.log(res);
            }
        };
        getInfo();
    }, [username]);

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
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - screenList.length) : 0;

    const handleClickOpen = (id) => {
        setSelectedId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setSelectedId(null);
        setOpen(false);
    };

    useEffect(() => {
        const getScreenList = async () => {
            const res = await screenApis.getAll()
            if (res.success && res) {
                console.log(res)
                if (!search) {
                    setScreenList(res.data)
                    setIsLoading(false)
                }
                else {
                    const searchText = search.toLowerCase()
                    const filteredUser = res.data.filter(user => {
                        const fullName = user.name.toLowerCase() + ' ' + user.rolecode.toLowerCase();
                        return fullName.includes(searchText)
                    })
                    setScreenList(filteredUser)
                    setIsLoading(false)
                }
            }
            else {
                console.log(res)
                setScreenList('')
                setIsLoading(false)
            }
        }
        getScreenList()
    }, [isRequest, search, showAddScreen, showEditScreen])

    const deleteScreen = async (id) => {
        const res = await screenApis.deleteScreen(id)
        if (res.success) {
            toast.success('Xoá quyền thành công')
            setIsRequest(!isRequest)
            handleClose()
        }
        else {
            console.log(res)
            toast.error('Xoá quyền thất bại')
            handleClose()
        }
    }

    return (
        <div className='main-screen-role'>
            <Typography sx={{
                color: '#0057da',
                margin: '20px',
                fontSize: '25px',
                fontWeight: 'bold',
                textAlign: 'center',
            }}>Cấp quyền cho role</Typography>
            <input className='input-search' placeholder='Tìm kiếm theo mã, tên vai trò ....' onChange={(e) => setSearch(e.target.value)} />
            <button className='btn-add-screen' onClick={() => setShowAddScreen(true)}><FontAwesomeIcon icon={faPlus} />Thêm</button>
            <div className='admin-screen-table'>
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
                                    rowCount={screenList.length}
                                />
                                {!screenList ? <Typography sx={{
                                    position: 'absolute',
                                    top: '200px',
                                    right: 'calc(100% / 2)',
                                }} >Không có dữ liệu</Typography> : <TableBody>
                                    {stableSort(screenList, getComparator(order, orderBy))
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
                                                        {row.role_id}
                                                    </TableCell>
                                                    <TableCell >{row.rolecode}</TableCell>
                                                    <TableCell >{row.name}</TableCell>
                                                    <TableCell >{row.screencode}</TableCell>
                                                    <TableCell >{row.screen_name}</TableCell>
                                                    <TableCell sx={{
                                                        display: 'flex',
                                                        justifyItems: 'center',
                                                    }}>
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
                                                                disabled={listRoleUsers.includes(row.screencode) ? true : false}
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </Button>
                                                            <Dialog
                                                                open={open}
                                                                onClose={handleClose}
                                                            >
                                                                <DialogTitle>Xoá Quyền</DialogTitle>
                                                                <DialogContent>
                                                                    <DialogContentText>
                                                                        Bạn có muốn xoá quyền này không
                                                                    </DialogContentText>
                                                                </DialogContent>
                                                                <DialogActions>
                                                                    <Button onClick={handleClose}>Cancel</Button>
                                                                    <Button
                                                                        onClick={() => deleteScreen(selectedId)}
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
                    count={screenList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
            {showAddScreen && <AddScreen onClose={() => setShowAddScreen(false)} />}
        </div>
    )
}

export default ScreenRole