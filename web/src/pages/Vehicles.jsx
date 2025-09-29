import React, { useEffect, useState } from 'react'
import { api } from '../lib/api.js'

export default function Vehicles(){
  const [list,setList]=useState([]), [unitNumber,setUnit]=useState(''), [vin,setVin]=useState(''), [gvwr,setGvwr]=useState(14000)
  const [drivers,setDrivers]=useState([]), [assignMap,setAssignMap]=useState({})
  const [msg,setMsg]=useState('')

  const load=async()=>{
    setMsg('')
    try{
      const [v, d] = await Promise.all([api.vehicles.list(), api.drivers.list()])
      setList(v); setDrivers(d)
    }catch(e){ setMsg(e.message) }
  }
  useEffect(()=>{ load() },[])

  const add=async()=>{
    setMsg('')
    try{
      await api.vehicles.create({ unitNumber, vin, gvwrLb:Number(gvwr)||0 })
      setUnit(''); setVin(''); setGvwr(14000); load()
    }catch(e){ setMsg(e.message) }
  }

  const assign=async(id)=>{
    setMsg('')
    try{
      const driverId = assignMap[id]||null
      await api.vehicles.update(id, { assignedDriverId: driverId || null })
      load()
    }catch(e){ setMsg(e.message) }
  }

  return (
    <div>
      <h1>Vehicles</h1>
      <div className="grid">
        <input placeholder="Unit #" value={unitNumber} onChange={e=>setUnit(e.target.value)} />
        <input placeholder="VIN" value={vin} onChange={e=>setVin(e.target.value)} />
        <input placeholder="GVWR (lb)" value={gvwr} onChange={e=>setGvwr(e.target.value)} />
        <button onClick={add}>Add Vehicle</button>
      </div>
      {msg && <div className="error">{msg}</div>}
      <table className="table">
        <thead><tr><th>Unit</th><th>VIN</th><th>GVWR</th><th>Assigned Driver</th><th>Action</th></tr></thead>
        <tbody>
          {list.map(v=>{
            const val = assignMap[v._id] ?? (v.assignedDriverId? v.assignedDriverId.toString() : '')
            return (
              <tr key={v._id}>
                <td>{v.unitNumber||'-'}</td>
                <td>{v.vin||'-'}</td>
                <td>{v.gvwrLb||'-'}</td>
                <td>
                  <select value={val} onChange={e=>setAssignMap(m=>({...m,[v._id]:e.target.value}))}>
                    <option value="">— none —</option>
                    {drivers.map(d=><option key={d._id} value={d._id}>{d.name}</option>)}
                  </select>
                </td>
                <td><button onClick={()=>assign(v._id)}>Assign</button></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
