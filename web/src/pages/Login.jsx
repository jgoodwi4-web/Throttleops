import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, setToken, setUser } from '../lib/api.js'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    try{
      const r = await api.login(email, password) // { user, token }
      setToken(r.token); setUser(r.user)
      nav('/')
    }catch(e){ setErr(e.message) }
  }

  return (
    <div className="center">
      <form onSubmit={submit} className="card">
        <h2>Sign in to ThrottleOps</h2>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <div className="error">{err}</div>}
        <button type="submit">Sign In</button>
        <p className="hint">Tip: run installer first; it seeds an admin by default.</p>
      </form>
    </div>
  )
}
