import React from 'react'
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Drivers from './pages/Drivers.jsx'
import Loads from './pages/Loads.jsx'
import Logs from './pages/Logs.jsx'
import Tools from './pages/Tools.jsx'
import Vehicles from './pages/Vehicles.jsx'
import Register from './pages/Register.jsx'
import { getToken, logout, getUser } from './lib/api.js'

function Shell({children}){
  const nav = useNavigate()
  const me = getUser()
  const isAdmin = me && me.role === 'admin'
  const onLogout = ()=>{ logout(); nav('/login') }
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>ThrottleOps</h2>
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/drivers">Drivers</Link>
          <Link to="/vehicles">Vehicles</Link>
          <Link to="/loads">Loads</Link>
          <Link to="/logs">Logs</Link>
          <Link to="/tools">Tools</Link>
          {isAdmin && <Link to="/register">Register</Link>}
        </nav>
        <button onClick={onLogout} className="logout">Log out</button>
      </aside>
      <main className="content">{children}</main>
    </div>
  )
}

const Private = ({children}) => getToken() ? children : <Navigate to="/login" replace />

export default function App(){
  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/" element={<Private><Shell><Dashboard/></Shell></Private>} />
      <Route path="/drivers" element={<Private><Shell><Drivers/></Shell></Private>} />
      <Route path="/vehicles" element={<Private><Shell><Vehicles/></Shell></Private>} />
      <Route path="/loads" element={<Private><Shell><Loads/></Shell></Private>} />
      <Route path="/logs" element={<Private><Shell><Logs/></Shell></Private>} />
      <Route path="/tools" element={<Private><Shell><Tools/></Shell></Private>} />
      <Route path="/register" element={<Private><Shell><Register/></Shell></Private>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
