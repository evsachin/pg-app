import { useState } from 'react'
import './App.css'
import PGManagementApp from './components/PGManagementApp'
import { Route, Routes } from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'

function App() {
 return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PGManagementApp />} />
      </Routes>
    </div>
  );
}

export default App
