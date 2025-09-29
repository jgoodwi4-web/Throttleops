import React, { useEffect, useState } from 'react'
import { api, getUser } from '../lib/api.js'

const pct = (ms)=> Math.max(0, Math.min(100, (ms/(24*60*60*1000))*100))

export default function Logs(){
  const me = getUser()
  const today = new Date().toISOString().slice(0,10)
  const [driverId,setDriverId]=useState(me?.id||'')
  const [logDate,setLogDate]=useState(today)
  const [list,setList]=useState([]), [msg,setMsg]=useState('')

  const load=()=>api.logs.list(driverId||undefined).then(setList).catch(e=>setMsg(e.message))
  useEffect(()=>{ load() },[driverId])

  const upsert=async()=>{ setMsg(''); try{
    await api.logs.upsert({
      driverId: driverId || me?.id || 'me',
      logDate: new Date(logDate),
      segments: [
        { status:'driving', start:new Date(logDate+'T08:00:00'), end:new Date(logDate+'T12:00:00') },
        { status:'on',      start:new Date(logDate+'T12:00:00'), end:new Date(logDate+'T14:00:00') },
        { status:'off',     start:new Date(logDate+'T14:00:00'), end:new Date(logDate+'T24:00:00') }
      ]
    })
    load()
  }catch(e){ setMsg(e.message) } }

  const sign=async(id)=>{
    const signedBy = prompt('Type your name to sign this log:')
    if(!signedBy) return
    try{ await api.logs.sign(id, signedBy); load() }catch(e){ alert(e.message) }
  }

  return (
    <div>
      <h1>Driver Logs</h1>
      <div className="row">
        <input placeholder="Driver ID (optional)" value={driverId} onChange={e=>setDriverId(e.target.value)} />
        <input type="date" value={logDate} onChange={e=>setLogDate(e.target.value)} />
        <button onClick={upsert}>Save Example Log</button>
      </div>
      {msg && <div className="error">{msg}</div>}

      <ul style={{listStyle:'none',padding:0}}>
        {list.map(l=>{
          const dayStart = new Date(new Date(l.logDate).toDateString()).getTime()
          const segments = (l.segments||[]).map(s=>{
            const start = Math.max(0, new Date(s.start).getTime()-dayStart)
            const end   = Math.max(0, new Date(s.end).getTime()-dayStart)
            const width = pct(end-start)
            const left  = pct(start)
            const color = s.status==='driving' ? '#ef4444' : s.status==='on' ? '#f59e0b' : s.status==='sleeper' ? '#22c55e' : '#64748b'
            return <div key={`${start}-${end}`} style={{position:'absolute',left:left+'%',width:width+'%',top:0,bottom:0,background:color,opacity:.85}} title={`${s.status} ${(end-start)/3600000}h`}/>
          })
          return (
            <li key={l._id} style={{margin:'12px 0', padding:'8px', border:'1px solid #e5e7eb', borderRadius:8}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <b>{new Date(l.logDate).toDateString()}</b>
                <div>{l.signedBy ? `Signed by ${l.signedBy}` : <button onClick={()=>sign(l._id)}>Sign</button>}</div>
              </div>
              <div style={{position:'relative', height:22, marginTop:8, background:'#f1f5f9', borderRadius:6, overflow:'hidden', border:'1px solid #e2e8f0'}}>
                {segments}
                {[...Array(25)].map((_,i)=>(<div key={i} style={{position:'absolute',left:(i/24*100)+'%',top:0,bottom:0,width:1,background:'#e2e8f0'}}/>))}
              </div>
              <div style={{fontSize:12,opacity:.7,marginTop:6}}>Statuses: red=driving, amber=on-duty, green=sleeper, gray=off</div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
