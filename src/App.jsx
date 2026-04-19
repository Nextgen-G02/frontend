import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom"

import Home from './pages/Home'
import Login from './pages/Login'
import Products from './pages/Products'
import AdminProduct from './pages/AdminProduct'


import AddProduct from './components/Products/Addproduct';
import AdminDashboard from './pages/AdminDashboard'


import OrderList from './pages/orders/OrderList'
import OrderForm from './pages/orders/OrderForm'
import OrderDetails from './pages/orders/OrderDetails'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/products" element={<Products />} />
      <Route path='/adminproduct' element={<AdminProduct />} />

      {/* Add Product */}
      <Route path="/addproduct" element={<AddProduct />} />

      {/* Order Management */}
      <Route path='/orders' element={<OrderList />} />
      <Route path='/orders/new' element={<OrderForm />} />
      <Route path='/orders/edit/:id' element={<OrderForm />} />
      <Route path='/orders/:id' element={<OrderDetails />} />
    </Routes>
  )
}

export default App