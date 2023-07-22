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
        <div className='main-item-bank'>
            <div className='item-bank-header'>
                <div className='item-bank-header-1'>
                    <img src={require('../../images/chip.png')} alt='logo' className='logo-header' />
                    <img src={require('../../images/contactless.png')} alt='logo' className='logo-header' />
                </div>
                <div className='item-bank-header-2'>
                    <div>
                        <Typography sx={{
                            marginLeft: '20px',
                            fontSize: '15px',
                            fontWeight: '400',
                            color: 'white',
                        }}>Name</Typography>
                        <Typography sx={{
                            marginLeft: '20px',
                            fontSize: '16px',
                            fontWeight: '500',
                            color: 'white',
                        }}>{data.holder_name}</Typography>
                    </div>
                    <div>
                        <Typography sx={{
                            marginLeft: '50px',
                            fontSize: '15px',
                            fontWeight: '400',
                            color: 'white',
                        }}>Number</Typography>
                        <Typography sx={{
                            marginRight: '20px',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'white',
                        }}>**** **** {data.card_number.substr(-4)}</Typography>
                    </div>
                </div>
            </div>
            <div className='item-bank-footer'>
                <div>
                    {expiryDate && <Typography sx={{
                        marginLeft: '20px',
                        fontSize: '16px',
                        fontWeight: '500',
                        color: 'white',
                    }}>{expiryDate}</Typography>}
                    <Typography sx={{
                        marginLeft: '20px',
                        fontSize: '15px',
                        fontWeight: '400',
                        color: 'white',
                    }}>Expiry date</Typography>
                </div>
                <div>
                    <img src={require('../../images/visa.png')} alt='logo' className='logo-visa' />
                </div>
            </div>

        </div>
    )
}

export default ItemBankAccount