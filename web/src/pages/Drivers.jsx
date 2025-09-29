import React, { useEffect, useState } from 'react'
import { api } from '../lib/api.js'

export default function Drivers(){
  const [list,setList]=useState([]), [name,setName]=useState(''), [email,setEmail]=useState(''), [msg,setMsg]=useState('')
  const load=()=>api.drivers.list().then(setList).catch(e=>setMsg(e.message))
  useEffect(()=>{ load() },[])
  const add=async()=>{ setMsg(''); try{ await api.drivers.create({name,email}); setName(''); setEmail(''); load() }catch(e){ setMsg(e.message) } }

  return (
    <div>
      <h1>Drivers</h1>
      <div className="row">
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <button onClick={add}>Add</button>
      </div>
      {msg && <div className="error">{msg}</div>}
      <ul>{list.map(d=><li key={d._id}>{d.name} — {d.email}</li>)}</ul>
    </div>
  )
}
