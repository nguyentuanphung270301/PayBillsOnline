import React from 'react'
import { BrowserRouter as Router, Route, Redirect, Routes } from 'react-router-dom';
import HomePage from '../../page/HomePage';
import Navbar from '../common/Navbar';
import ChangPassword from '../../page/ChangPassword';
import UserInfo from '../../page/UserInfo';
import BankAccount from '../../page/BankAccount';
import AdminUser from '../../page/AdminUser';
import AdminSupplier from '../../page/AdminSupplier';
import AdminService from '../../page/AdminService';
import MeterIndex from '../../page/MeterIndex';
import CabTV from '../../page/CabTV';
import Role from '../../page/Role';
import ScreenRole from '../../page/ScreenRole';
import UserAuth from '../../page/UserAuth';
import BillCreate from '../../page/BillCreate';
import BillApproved from '../../page/BillApproved';
import BillPaymentForCustomer from '../../page/BillPaymentForCustomer';
import PrintBill from '../common/PrintBill';
import PaymentOnline from '../../page/PaymentOnline';


const RouteLayout = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        {/* <Route path='/homepage' element={<HomePage />} /> */}
        <Route path='/changepassword' element={<ChangPassword />} />
        <Route path='/info' element={<UserInfo />} />
        <Route path='/bankaccount' element={<BankAccount/>} />
        <Route path='/admin/user' element={<AdminUser/>} />
        <Route path='/admin/supplier' element={<AdminSupplier/>} />
        <Route path='/admin/service' element={<AdminService/>} />
        <Route path='/meterindex' element={<MeterIndex/>} />
        <Route path='/cabtv' element={<CabTV/>} />
        <Route path='/bill-create' element={<BillCreate/>} />
        <Route path='/role' element={<Role/>} />
        <Route path='/screen-role' element={<ScreenRole/>} />
        <Route path='/user-auth' element={<UserAuth/>} />
        <Route path='/bill-approved' element={<BillApproved/>} />
        <Route path='/bill-payment-customer' element={<BillPaymentForCustomer/>} />
        <Route path='/print-bill/:id' element={<PrintBill/>} />
        <Route path='/payment-online' element={<PaymentOnline/>} />
      </Routes>
    </div>
  )
}

export default RouteLayout