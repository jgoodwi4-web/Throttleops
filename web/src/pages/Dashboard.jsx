import React, { useEffect, useState } from 'react'
export default function Dashboard(){
  const [ok,setOk]=useState(false)
  useEffect(()=>{ fetch('/api/health').then(r=>r.json()).then(d=>setOk(!!d.ok)).catch(()=>{}) },[])
  return (
    <div>
      <h1>Dashboard</h1>
      <p>API Status: {ok ? 'Online ✅' : 'Checking…'}</p>
      <p>Welcome to ThrottleOps — dispatch, compliance & finance in one place.</p>
    </div>
  )
}
