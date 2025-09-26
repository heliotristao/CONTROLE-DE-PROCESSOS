import React, { useEffect, useState } from 'react';
import { listProcesses } from '../api';

export default function ProcessList({ refreshKey }:{ refreshKey:number }){
  const [q, setQ] = useState('');
  const [items, setItems] = useState<any[]>([]);

  async function load(){
    const data = await listProcesses(q);
    setItems(data);
  }

  useEffect(()=>{ load(); }, [q, refreshKey]);

  return (
    <div>
      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <input placeholder="Buscar por eDocs, Objeto, Setor, Status..." value={q} onChange={e=>setQ(e.target.value)} style={{flex:1, padding:8}} />
        <button onClick={load}>Buscar</button>
      </div>
      <table width="100%" cellPadding={8} style={{borderCollapse:'collapse'}}>
        <thead>
          <tr style={{background:'#f3f3f3'}}>
            <th align="left">eDocs</th>
            <th align="left">Objeto</th>
            <th align="left">Setor</th>
            <th align="left">Responsável</th>
            <th align="left">Status</th>
            <th align="left">Atualizado</th>
          </tr>
        </thead>
        <tbody>
          {items.map(it => (
            <tr key={it.id} style={{borderTop:'1px solid #eee'}}>
              <td>{it.edocs}</td>
              <td>{it.objeto}</td>
              <td>{it.setor||'-'}</td>
              <td>{it.responsavel||'-'}</td>
              <td>{it.status||'-'}</td>
              <td>{new Date(it.updatedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
