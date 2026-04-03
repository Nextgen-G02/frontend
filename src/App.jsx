import { useState } from 'react'
import './App.css'
import{ BrowserRouter, Route, Routes } from "react-router-dom"
import Home from './pages/Home'
import Login from './pages/Login'
import Products from './pages/Products'
import AdminProduct from './pages/AdminProduct'
import OrderList from './pages/orders/OrderList'
import OrderForm from './pages/orders/OrderForm'
import OrderDetails from './pages/orders/OrderDetails'


function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path="/products" element={<Products />} />
      <Route path='/adminproduct' element={<AdminProduct />} />
      
      {/* Order Management Routes */}
      <Route path='/orders' element={<OrderList />} />
      <Route path='/orders/new' element={<OrderForm />} />
      <Route path='/orders/edit/:id' element={<OrderForm />} />
      <Route path='/orders/:id' element={<OrderDetails />} />
    </Routes>
  )
}

export default App
