import React, { useEffect, useState } from 'react'
import '../../style/ItemBankAccount.css'
import { Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSimCard } from "@fortawesome/free-solid-svg-icons";
import { format, addDays } from 'date-fns';


const ItemBankAccount = ({ data }) => {

    const [expiryDate, setExpiryDate] = useState('');
    useEffect(() => {
        const getDate = () => {
            // const formattedExpiryDate = new Date(data.expiry_date).toISOString().split('T')[0]
            // const dateObject = new Date(formattedExpiryDate);
            // dateObject.setDate(dateObject.getDate() + 1);
            // const newExpiryDate = `${dateObject.getMonth() + 1}/${dateObject.getDate()}`;
            const increasedDate = addDays(new Date(data.expiry_date), 0);
            const formattedDate = format(increasedDate, 'MM/yy');
            setExpiryDate(formattedDate);
        }
        getDate()
    }, [data])


    return (
        <div className='main-item-bank' >
            <div className='item-bank-header'>
                <div className='item-bank-header-1'>
                    <Typography sx={{
                        margin: '20px 30px 0 20px',
                        fontSize: '20px',
                        fontWeight: '600'
                    }}>{data.bank_name}</Typography>
                    <FontAwesomeIcon icon={faSimCard} style={{ fontSize: '40px', margin: '20px 30px 0 0' }} />
                </div>
                <div className='item-bank-header-2'>
                    <Typography sx={{
                        marginLeft: '20px',
                        fontSize: '18px',
                        fontWeight: '500'
                    }}>{data.holder_name}</Typography>
                    <Typography sx={{
                        marginRight: '20px',
                        fontSize: '18px',
                        fontWeight: '600'
                    }}>**** **** {data.card_number.substr(-4)}</Typography>
                </div>
            </div>
            <div className='item-bank-footer'>
                {expiryDate && <Typography sx={{
                    marginLeft: '20px',
                    fontSize: '18px',
                    fontWeight: '500'
                }}>EXP {expiryDate}</Typography>}
                <div>
                    <img src={require('../../images/visa.png')} alt='logo' className='logo-visa' />
                </div>
            </div>

        </div>
    )
}

export default ItemBankAccount