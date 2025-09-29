import React, { useEffect, useState } from 'react'
import { api } from '../lib/api.js'

export default function Loads(){
  const [list,setList]=useState([]), [ref,setRef]=useState(''), [rate,setRate]=useState(0), [pickup,setPickup]=useState(''), [delivery,setDelivery]=useState(''), [msg,setMsg]=useState('')
  const load=()=>api.loads.list().then(setList).catch(e=>setMsg(e.message))
  useEffect(()=>{ load() },[])
  const add=async()=>{ setMsg(''); try{
    await api.loads.create({ ref, rateTotal:Number(rate)||0, pickupAddress:pickup, deliveryAddress:delivery })
    setRef(''); setRate(0); setPickup(''); setDelivery(''); load()
  }catch(e){ setMsg(e.message) } }

  const invoice=async(id)=>{ setMsg(''); try{ await api.invoices.fromLoad(id); load() }catch(e){ setMsg(e.message) } }

  return (
    <div>
      <h1>Loads</h1>
      <div className="grid">
        <input placeholder="Load Ref" value={ref} onChange={e=>setRef(e.target.value)} />
        <input placeholder="Rate Total" value={rate} onChange={e=>setRate(e.target.value)} />
        <input placeholder="Pickup" value={pickup} onChange={e=>setPickup(e.target.value)} />
        <input placeholder="Delivery" value={delivery} onChange={e=>setDelivery(e.target.value)} />
        <button onClick={add}>Create</button>
      </div>
      {msg && <div className="error">{msg}</div>}
      <table className="table">
        <thead><tr><th>Ref</th><th>Pickup</th><th>Delivery</th><th>Rate</th><th>Status</th><th>Invoice</th></tr></thead>
        <tbody>
          {list.map(l=>(
            <tr key={l._id}>
              <td>{l.ref}</td>
              <td>{l.pickupAddress||'-'}</td>
              <td>{l.deliveryAddress||'-'}</td>
              <td>${l.rateTotal||0}</td>
              <td>{l.status}</td>
              <td>
                {l.status!=='invoiced'
                  ? <button onClick={()=>invoice(l._id)}>Create Invoice</button>
                  : <span>Invoiced ✅</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
