import React from 'react'
import {Routes, Route} from 'react-router-dom'
import './App.css'
import Add from './pages/Add/Add.jsx'
import Order from './pages/Orders/Order.jsx'
import List from './pages/List/List.jsx'
import Navbar from './components/Navbar/navbar.jsx'
import Sidebar from './components/Sidebar/sidebar.jsx' 
 import { ToastContainer} from 'react-toastify';
 import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  const URL="http://localhost:4000"
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <hr />
      {/* Wrap Sidebar and Routes in app-content */}
      <div className='app-content'>
        <Sidebar />
        <Routes>
          <Route path='/add' element={<Add  URL={URL}/>} />
          <Route path='/orders' element={<Order URL={URL}/>} />
          <Route path='/list' element={<List URL={URL}/>} />
        </Routes>
      </div>
    </div>
  )
}

export default App