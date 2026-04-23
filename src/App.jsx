import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Toaster } from 'react-hot-toast'

// Web Pages
import Home from './web/pages/Home'
import Login from './web/pages/Auth/Login'
import Products from './web/pages/Products'

// System Pages
import AdminDashboard from './system/pages/Dashboard/Dashboard'
import AdminProduct from './system/pages/Products/List'
import AddProduct from './system/pages/Products/AddProduct' 
import POSTerminal from './system/pages/POS/POS'
import AdminCategoryManagement from './system/pages/Categories/Categories'
import OrderList from './system/pages/Orders/OrderList'
import OrderForm from './system/pages/Orders/OrderForm'
import OrderDetails from './system/pages/Orders/OrderDetails'
import InventoryDashboard from './system/pages/Inventory/Inventory'
import AdminCustomerManagement from './system/pages/Customers/Customers'
import AdminSupplierManagement from './system/pages/Suppliers/AdminSupplierManagement'
import AdminSupplierAccounts from './system/pages/Suppliers/AdminSupplierAccounts'
import AdminFinancials from './system/pages/Financials/Financials'
import AdminStaffManagement from './system/pages/Staff/Staff'

// System Components
import AdminLayout from './system/components/Layout'

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
        <Route path='/orders/:id' element={<AdminLayout><OrderDetails /></AdminLayout>} />

        {/* Inventory Management */}
        <Route path="/inventory" element={<AdminLayout><InventoryDashboard /></AdminLayout>} />

        {/* Customer & Financials */}
        <Route path="/admin/customers" element={<AdminLayout><AdminCustomerManagement /></AdminLayout>} />
        <Route path="/admin/suppliers" element={<AdminLayout><AdminSupplierManagement /></AdminLayout>} />
        <Route path="/admin/suppliers/:id/accounts" element={<AdminLayout><AdminSupplierAccounts /></AdminLayout>} />
        <Route path="/admin/financials" element={<AdminLayout><AdminFinancials /></AdminLayout>} />
        <Route path="/staff" element={<AdminLayout><AdminStaffManagement /></AdminLayout>} />

      </Routes>
    </>
  )
}

export default App
