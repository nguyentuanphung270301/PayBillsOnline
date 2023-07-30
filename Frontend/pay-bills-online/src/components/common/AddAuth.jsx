import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import '../../style/AddAuth.css'
import userApis from '../../api/modules/user.api'
import roleApis from '../../api/modules/role.api'
import { toast } from 'react-toastify'
import userAuthApis from '../../api/modules/user_auth.api'

const AddAuth = ({ onClose }) => {

    const [userId, setUserId] = useState('')
    const [roleId, setRoleId] = useState('')

    const [userList, setUserList] = useState('')
    const [roleList, setRoleList] = useState('')

    useEffect(() => {
        const getUserList = async () => {
            const res = await userApis.getAll()
            if (res.success && res) {
                setUserList(res.data.filter(user => user.status === 1))
            }
            else {
                setUserList('')
            }
        }
        getUserList()
    }, [])
    useEffect(() => {
        const getRoleList = async () => {
            const res = await roleApis.getAll()
            if (res.success && res) {
                setRoleList(res.data)
            }
            else {
                setRoleList('')
            }
        }
        getRoleList()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!userId) {
            toast.error('Vui lòng chọn người dùng')
            return;
        }
        if (!roleId) {
            toast.error('Vui lòng chọn vai trò')
            return;
        }

        const data = {
            user_id: parseInt(userId),
            role_id: parseInt(roleId),
            status: 1
        }
        const res = await userAuthApis.createAuth(data)
        if (res.success && res) {
            toast.success('Cấp quyền cho tài khoản thành công')
            onClose()
        }
        else if (res.error && res.error.sqlMessage === "Duplicate entry '1-2' for key 'user_authorization.unique_user_authorization'") {
            toast.error('Tài khoản đã được cấp quyền này')
        }
        else {
            console.log(res)
            toast.error('Cấp quyền cho tài khoản thất bại')
        }
    }
    return (
        <div className='overlay'>
            <div className='main-add-auth'>
                <FontAwesomeIcon icon={faXmark} onClick={onClose} className='icon-close-add-auth' />
                <form className='form-add-auth' onSubmit={handleSubmit} >
                    <div className='auth-form-flex'>
                        <label>Người dùng</label>
                        <select onChange={(e) => setUserId(e.target.value)}>
                            <option>---Chọn----</option>
                            {userList && userList.map((item, i) => {
                                return <option value={item.id} key={i}>{item.id}: {item.firstname} {item.lastname} - {item.username}</option>
                            })}
                        </select>
                    </div>
                    <div className='auth-form-flex'>
                        <label>Role</label>
                        <select onChange={(e) => setRoleId(e.target.value)}>
                            <option>---Chọn----</option>
                            {roleList && roleList.map((item, i) => {
                                return <option value={item.id} key={i}>{item.rolecode} - {item.name}</option>
                            })}
                        </select>
                    </div>
                    <button className='btn-save-auth' type='submit'>Lưu</button>
                </form>
            </div>
        </div>
    )
}

export default AddAuth