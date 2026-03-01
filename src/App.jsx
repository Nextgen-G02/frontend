import { useState } from 'react'
import './App.css'
import{ BrowserRouter, Route, Routes } from "react-router-dom"
import Products from './pages/Products.jsx'
import Home from './pages/Home'
import Login from './pages/Login'


function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path="/products" element={<Products />} />
    </Routes>
  )
}

export default App
