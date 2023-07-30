import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import '../../style/AddScreen.css'
import screenApis from '../../api/modules/screen.api'
import roleApis from '../../api/modules/role.api'
import { toast } from 'react-toastify'
import Select from 'react-select';


const AddScreen = ({ onClose }) => {

    const [screen, setScreen] = useState('')
    const [roleId, setRoleId] = useState('')
    const [screenIds, setScreenIds] = useState('');

    const [screenList, setScreenList] = useState([])
    const [roleList, setRoleList] = useState([])
    const [roleScreenList, setRoleScreenList] = useState([])
    const [isRequest, setIsRequest] = useState(false)

    useEffect(() => {
        const getRoleList = async () => {
            const res = await roleApis.getAll();
            if (res.success && res) {
                setRoleList(res.data);
            } else {
                console.log(res);
            }
        };
        getRoleList();
    }, []);

    useEffect(() => {
        const getScreenList = async () => {
            const res = await screenApis.getAllScreen();
            if (res.success && res) {
                console.log(res);
                if (Array.isArray(roleScreenList) && roleScreenList.length > 0) {
                    console.log(roleScreenList[0])
                    const filteredScreen = res.data.filter((item) => !roleScreenList[0].some((roleScreenItem) => roleScreenItem.screen_id === item.id));
                    console.log(filteredScreen);
                    setScreenList(
                        filteredScreen.map((item) => ({
                            value: item.id,
                            label: `${item.screencode}: ${item.name}`,
                        }))
                    );
                } else {
                    setScreenList(
                        res.data.map((item) => ({
                            value: item.id,
                            label: `${item.screencode}: ${item.name}`,
                        }))
                    );
                }
            } else {
                console.log(res);
            }
        };
        getScreenList();
    }, [isRequest]);

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!roleId) {
            toast.error("Vui lòng chọn Role");
            return;
        }
        if (screenIds.length === 0) {
            alert("Vui lòng chọn ít nhất một Quyền");
            return;
        }

        // for (var i = 0; i < screenIds.length; i++) {
        //     const data = {
        //         role_id: parseInt(roleId),
        //         screen_id: parseInt(screenIds[i])
        //     }
        //     const res = await screenApis.createScreen(data)
        //     if (res.success && res) {
        //         toast.success('Cấp quyền cho role thành công')
        //         onClose()
        //     }
        //     else {
        //         console.log(res)
        //         toast.error('Cấp quyền cho role thất bại')
        //     }
        // }
        const promises = screenIds.map(async (screenId) => {
            const data = {
                role_id: parseInt(roleId),
                screen_id: parseInt(screenId)
            };
            return await screenApis.createScreen(data);
        });

        const results = await Promise.all(promises);

        let success = true;
        results.forEach((res) => {
            if (!res.success || !res) {
                console.log(res);
                success = false;
            }
        });

        if (success) {
            toast.success('Cấp quyền cho role thành công');
            onClose();
        } else {
            toast.error('Cấp quyền cho role thất bại');
        }

    }

    const handleChangeRole = async (e) => {
        setRoleId(e.target.value);
        const res = await screenApis.getByRoleId(e.target.value);
        if (res.success && res) {
            console.log(res);
            const dataArray = [res.data]; // Đưa đối tượng vào trong một mảng duy nhất
            setRoleScreenList(dataArray);
            // setRoleScreenList(res.data);
            setIsRequest(!isRequest)
        } else {
            setRoleScreenList([]);
            setIsRequest(!isRequest)
        }
    };

    const handleChange = (selected) => {
        setScreen(selected);
        const filter = selected.map((item) => item.value)
        setScreenIds(filter)
        console.log(filter)
    }
    return (
        <div className='overlay'>
            <div className='main-add-screen'>
                <FontAwesomeIcon icon={faXmark} onClick={onClose} className='icon-close-add-screen' />
                <form className='form-add-screen' onSubmit={handleSubmit}>
                    <div className='form-flex'>
                        <label>Role</label>
                        <select onChange={handleChangeRole}>
                            <option>---Chọn---</option>
                            {roleList && roleList.map((item, i) => {
                                return <option value={item.id} key={i}>{item.rolecode}: {item.name}</option>;
                            })}
                        </select>
                    </div>
                    <div className='form-flex'>
                        <label>Quyền</label>
                        <Select
                            options={screenList}
                            placeholder="-- Chọn --"
                            isMulti={true}
                            value={screen}
                            onChange={handleChange}
                            className='dropdown-screenlist'
                        />
                    </div>
                    <button className='btn-save-screen' type='submit'>Lưu</button>
                </form>
            </div>
        </div>
    )
}

export default AddScreen