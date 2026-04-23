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
import ProtectedRoute from './shared/components/ProtectedRoute'

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path="/products" element={<Products />} />

        {/* Global Admin Wrapper */}
        <Route element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} path="/admin" />
        
        {/* Protected Admin Routes with Layout */}
        <Route path="/adminproduct" element={<ProtectedRoute><AdminLayout><AdminProduct /></AdminLayout></ProtectedRoute>} />
        <Route path="/addproduct" element={<ProtectedRoute><AdminLayout><AddProduct /></AdminLayout></ProtectedRoute>} />
        <Route path="/pos" element={<ProtectedRoute><AdminLayout><POSTerminal /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute><AdminLayout><AdminCategoryManagement /></AdminLayout></ProtectedRoute>} />
        
        {/* Order Management */}
        <Route path='/orders' element={<ProtectedRoute><AdminLayout><OrderList /></AdminLayout></ProtectedRoute>} />
        <Route path='/orders/new' element={<ProtectedRoute><AdminLayout><OrderForm /></AdminLayout></ProtectedRoute>} />
        <Route path='/orders/edit/:id' element={<ProtectedRoute><AdminLayout><OrderForm /></AdminLayout></ProtectedRoute>} />
        <Route path='/orders/:id' element={<ProtectedRoute><AdminLayout><OrderDetails /></AdminLayout></ProtectedRoute>} />

        {/* Inventory Management */}
        <Route path="/inventory" element={<ProtectedRoute><AdminLayout><InventoryDashboard /></AdminLayout></ProtectedRoute>} />

        {/* Customer & Financials */}
        <Route path="/admin/customers" element={<ProtectedRoute><AdminLayout><AdminCustomerManagement /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/suppliers" element={<ProtectedRoute><AdminLayout><AdminSupplierManagement /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/suppliers/:id/accounts" element={<ProtectedRoute><AdminLayout><AdminSupplierAccounts /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/financials" element={<ProtectedRoute><AdminLayout><AdminFinancials /></AdminLayout></ProtectedRoute>} />
        <Route path="/staff" element={<ProtectedRoute><AdminLayout><AdminStaffManagement /></AdminLayout></ProtectedRoute>} />

      </Routes>
    </>
  )
}

export default App