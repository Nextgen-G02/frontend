import { useState } from 'react'
import './App.css'
import ProductP1 from './component/Productp1'
import { Routes, Route } from 'react-router-dom'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Routes>
      <Route path='/' element={<ProductP1/>}/>
      
    </Routes>
    
    </>
  )
}

export default App
