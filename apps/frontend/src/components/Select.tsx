import React from 'react';

type Opt = { id:number, category:string, value:string };

export function Select({label, value, onChange, options}:{label:string, value?:string, onChange:(v:string)=>void, options:Opt[]}){
  return (
    <label style={{display:'block', marginBottom:12}}>
      <div style={{fontSize:12, color:'#555'}}>{label}</div>
      <select value={value||''} onChange={e=>onChange(e.target.value)} style={{padding:8, width:'100%'}}>
        <option value=''>-- selecione --</option>
        {options.map(o => <option key={o.id} value={o.value}>{o.value}</option>)}
      </select>
    </label>
  )
}
