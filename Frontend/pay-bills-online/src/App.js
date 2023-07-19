import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import StartPage from './page/StartPage'
import LoginForm from './page/LoginForm'
import RegisterForm from './page/RegisterForm'
import ResetPassword from './page/ResetPassword'
import RouteLayout from './components/layouts/RouteLayout'

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<StartPage />} />
        <Route path='/login' element={<LoginForm/>} />
        <Route path='/register' element={<RegisterForm />} />
        <Route path='/resetpassword' element={<ResetPassword />} />
        <Route path='/mainpage/*' element={<RouteLayout />} />
      </Routes>
      <ToastContainer />
    </Router>
  )
}

export default App;