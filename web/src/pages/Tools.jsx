import React, { useEffect, useState } from 'react'
import { api } from '../lib/api.js'

export default function Tools(){
  const [weights,setWeights]=useState([]), [q,setQ]=useState('')
  const [gvwr,setGvwr]=useState(14000), [curb,setCurb]=useState(8200), [pass,setPass]=useState(400), [fuel,setFuel]=useState(200), [gear,setGear]=useState(150)
  const [gcwr,setGcwr]=useState(24000), [truck,setTruck]=useState(0), [tongue,setTongue]=useState(12)

  useEffect(()=>{ api.weight.reference().then(setWeights).catch(()=>{}) },[])

  const payload = Math.max(0, gvwr - curb - pass - fuel - gear)
  const maxTrailer = Math.max(0, (gcwr - (truck || (curb + pass + fuel + gear))))
  const filtered = weights.filter(w => (w.name||'').toLowerCase().includes(q.toLowerCase()))

  return (
    <div>
      <h1>Tools</h1>
      <h2>Load Weight Calculator</h2>
      <div className="grid">
        <Num label="GVWR" v={gvwr} set={setGvwr}/>
        <Num label="Curb" v={curb} set={setCurb}/>
        <Num label="Passengers" v={pass} set={setPass}/>
        <Num label="Fuel (lb)" v={fuel} set={setFuel}/>
        <Num label="Gear (lb)" v={gear} set={setGear}/>
        <Num label="GCWR" v={gcwr} set={setGcwr}/>
        <Num label="Truck Actual (lb)" v={truck} set={setTruck}/>
        <Num label="Tongue % (10–15)" v={tongue} set={setTongue}/>
      </div>
      <div className="callout">
        Max Payload: <b>{payload.toLocaleString()} lb</b> • Est Max Trailer: <b>{maxTrailer.toLocaleString()} lb</b>
      </div>

      <h2>Reference Weights</h2>
      <input className="search" placeholder="Search (e.g., mini excavator, #57 stone, 5th wheel)" value={q} onChange={e=>setQ(e.target.value)} />
      <ul className="list">
        {filtered.slice(0,50).map((w,i)=><li key={i}>{w.name} — <i>{w.cat}</i> — {fmt(w)}</li>)}
      </ul>
      <p className="hint">Estimates only — verify manufacturer specs or scale tickets.</p>
    </div>
  )
}
function Num({label,v,set}){ return <label className="num"><span>{label}</span><input type="number" value={v} onChange={e=>set(+e.target.value||0)}/></label> }
function fmt(w){
  if(w.per_piece_lb) return `${w.per_piece_lb} lb/piece`
  if(w.dry_lb && w.gvwr_lb) return `dry ${w.dry_lb} lb, GVWR ${w.gvwr_lb} lb`
  if(w.typical_lb && w.range_lb) return `typ ${w.typical_lb} (range ${w.range_lb[0]}–${w.range_lb[1]}) lb`
  if(w.density_lb_ft3) return `${w.density_lb_ft3} lb/ft³`
  if(w.gvwr_lb) return `GVWR ${w.gvwr_lb} lb`
  if(w.typical_lb) return `${w.typical_lb} lb`
  return ''
}
