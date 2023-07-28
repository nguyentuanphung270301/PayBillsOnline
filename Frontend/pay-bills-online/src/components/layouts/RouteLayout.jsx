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
import Bill from '../../page/Bill';


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
        <Route path='/bill' element={<Bill/>} />
      </Routes>
    </div>
  )
}

export default RouteLayout