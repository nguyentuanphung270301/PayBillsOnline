import React from 'react'
import { BrowserRouter as Router, Route, Redirect, Routes } from 'react-router-dom';
import HomePage from '../../page/HomePage';


const RouteLayout = () => {
  return (
    <div>
      <Routes>
        <Route path='/homepage' element={<HomePage/>}/>
      </Routes>
    </div>
  )
}

export default RouteLayout