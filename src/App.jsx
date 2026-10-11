import React from 'react'
import LandingPage from './Pages/LandingPage.jsx'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import SignupEmp from './Pages/Signup1/SignupEmp.jsx'
import SignupCom from './Pages/Signup2/SignupCom.jsx'
import Login from './Pages/Login/Login.jsx'
import PostSignupEmp from './Pages/PostSignupEmp/PostSignupEmp.jsx'
import PostSignupEmp2 from './Pages/PostSignupEmp2/PostSignupEmp2.jsx'
import PostSignupCom from './Pages/PostSignupCom/PostSignupCom.jsx'
import HomeUser from './Pages/HomeUser/HomeUser.jsx'
import Jobs from './Pages/Jobs/Jobs.jsx'
import LoginCom from './Pages/LoginCom/LoginCom.jsx'
import HomeCom from './Pages/HomeCom/HomeCom.jsx'
import User from   './Pages/Users/User.jsx'
import Profile from './Pages/Profile/Profile.jsx'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />}></Route>
        <Route path='/signupEmp' element={<SignupEmp />}></Route>
        <Route path='/signupCom' element={<SignupCom />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/PostSignupEmp' element={<PostSignupEmp />}></Route>
        <Route path='/PostSignupEmp2' element={<PostSignupEmp2 />}></Route>
        <Route path='/PostSignupCom' element={<PostSignupCom />}></Route>
        <Route path='/HomeUser' element={<HomeUser />}></Route>
        <Route path='/Jobs' element={<Jobs />}></Route>
        <Route path='/loginCom' element={<LoginCom />}></Route>
        <Route path='/HomeCom' element={<HomeCom />}></Route>
        <Route path='/Users' element={<User />}></Route>
        <Route path='/Profile' element={<Profile />}></Route>
        <Route path='*' element={<Navigate to='/' replace />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App