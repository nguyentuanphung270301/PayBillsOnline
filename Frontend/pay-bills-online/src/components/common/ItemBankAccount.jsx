import React, { useEffect, useState } from 'react'
import '../../style/ItemBankAccount.css'
import { Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCardClip, faSimCard } from "@fortawesome/free-solid-svg-icons";
import { format, addDays } from 'date-fns';


const ItemBankAccount = ({ data }) => {

    const [expiryDate, setExpiryDate] = useState('');
    useEffect(() => {
        const getDate = () => {
            // const formattedExpiryDate = new Date(data.expiry_date).toISOString().split('T')[0]
            // const dateObject = new Date(formattedExpiryDate);
            // dateObject.setDate(dateObject.getDate() + 1);
            // const newExpiryDate = `${dateObject.getMonth() + 1}/${dateObject.getDate()}`;
            const increasedDate = addDays(new Date(data.create_date), 0);
            const formattedDate = format(increasedDate, 'MM/yy');
            setExpiryDate(formattedDate);
        }
        getDate()
    }, [data])


    return (
        <div className='main-item-bank'>
        <FontAwesomeIcon icon={faIdCardClip} style={{height:'50px', marginRight:'20px'}}/>
            <div>
                <label>Số tài khoản</label>
                <label>**** **** {data.card_number.substr(-4)}</label>
            </div>
            <div>
                <label>Ngày tạo</label>
                <label>{expiryDate}</label>
            </div>
        </div>
    )
}

export default ItemBankAccount