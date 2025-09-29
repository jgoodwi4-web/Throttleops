import React, { useState, useMemo } from 'react'
import { api, getUser } from '../lib/api.js'

export default function Register(){
  const me = getUser()
  const isAdmin = useMemo(()=> me && me.role === 'admin', [me])
  const [name,setName]=useState(''), [email,setEmail]=useState(''), [password,setPassword]=useState('ChangeMe!123'), [role,setRole]=useState('driver')
  const [msg,setMsg]=useState('')

  const createUser = async () => {
    setMsg('')
    try{
      await api.register(name,email,password,role)
      setMsg(`Created ${role}: ${name}`)
      setName(''); setEmail('')
    }catch(e){ setMsg(e.message) }
  }

  if(!isAdmin) return <div><h1>Register</h1><p>You must be an admin to register users.</p></div>

  return (
    <div>
      <h1>Register User</h1>
      <div className="grid">
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Temp Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <select value={role} onChange={e=>setRole(e.target.value)}>
          <option value="driver">driver</option>
          <option value="dispatcher">dispatcher</option>
          <option value="admin">admin</option>
        </select>
        <button onClick={createUser}>Create</button>
      </div>
      {msg && <div className="callout">{msg}</div>}
      <p className="hint">New users can change their password after first login.</p>
    </div>
  )
}
