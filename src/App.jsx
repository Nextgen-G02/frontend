import { useState } from 'react'
import './App.css'
import{ BrowserRouter, Route, Routes } from "react-router-dom"
import Home from './pages/Home'
import Login from './pages/Login'
import Products from './pages/Products'
import AdminProduct from './pages/AdminProduct'
import AddProduct from './components/Products/Addproduct';
import AdminDashboard from './pages/AdminDashboard'


function App() {
  return (

    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/products" element={<Products />} />
      <Route path='/adminproduct' element={<AdminProduct />} />
      <Route path="/addproduct" element={<AddProduct />} />
    </Routes>
  )
}

export default App
