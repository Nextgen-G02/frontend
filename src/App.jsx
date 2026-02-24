import { useState } from 'react'
import './App.css'
import Products from "./components/Products"
import{ Route, Routes } from "react-router-dom"


function App() {
  return (
    <>
    <routes>
    <Products />
    {/* <Route path="/" element={<Products />} /> */}
      
    </routes>
    </>
  )
}

export default App
