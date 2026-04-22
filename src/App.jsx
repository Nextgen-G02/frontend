import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Toaster } from 'react-hot-toast'

import Home from './pages/Home'
import Login from './pages/Login'
import Products from './pages/Products'
import AdminProduct from './pages/AdminProduct'
import AddProduct from './components/Products/Addproduct';
import AdminDashboard from './pages/AdminDashboard'
import OrderList from './pages/orders/OrderList'
import OrderForm from './pages/orders/OrderForm'
import AdminCategoryManagement from './pages/AdminCategoryManagement'
import InventoryDashboard from './pages/InventoryDashboard'
import AdminCustomerManagement from './pages/AdminCustomerManagement'
import AdminFinancials from './pages/AdminFinancials'
import AdminStaffManagement from './pages/AdminStaffManagement'
import AdminSupplierManagement from './pages/AdminSupplierManagement'
import POSTerminal from './pages/POSTerminal'
import AdminLayout from './components/AdminLayout'

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path="/products" element={<Products />} />

        {/* Global Admin Wrapper */}
        <Route element={<AdminLayout><AdminDashboard /></AdminLayout>} path="/admin" />
        
        {/* Protected Admin Routes with Layout */}
        <Route path="/adminproduct" element={<AdminLayout><AdminProduct /></AdminLayout>} />
        <Route path="/addproduct" element={<AdminLayout><AddProduct /></AdminLayout>} />
        <Route path="/pos" element={<AdminLayout><POSTerminal /></AdminLayout>} />
        <Route path="/admin/categories" element={<AdminLayout><AdminCategoryManagement /></AdminLayout>} />
        
        {/* Order Management */}
        <Route path='/orders' element={<AdminLayout><OrderList /></AdminLayout>} />
        <Route path='/orders/new' element={<AdminLayout><OrderForm /></AdminLayout>} />
        <Route path='/orders/edit/:id' element={<AdminLayout><OrderForm /></AdminLayout>} />

        {/* Inventory Management */}
        <Route path="/inventory" element={<AdminLayout><InventoryDashboard /></AdminLayout>} />

        {/* Customer & Financials */}
        <Route path="/admin/customers" element={<AdminLayout><AdminCustomerManagement /></AdminLayout>} />
        <Route path="/admin/suppliers" element={<AdminLayout><AdminSupplierManagement /></AdminLayout>} />
        <Route path="/admin/financials" element={<AdminLayout><AdminFinancials /></AdminLayout>} />
        <Route path="/staff" element={<AdminLayout><AdminStaffManagement /></AdminLayout>} />

      </Routes>
    </>
  )
}

export default App