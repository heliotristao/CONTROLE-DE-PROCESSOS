import React, { useState } from 'react';
import ProcessList from './pages/ProcessList';
import ProcessForm from './pages/ProcessForm';

export default function App(){
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <div style={{maxWidth:1000, margin:'24px auto', padding:'0 16px'}}>
      <h1>Controle de Processos — HPM</h1>
      <p>Cadastre e acompanhe os processos (eDocs + Objeto), com filtros e opções padronizadas vindas da planilha.</p>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
        <ProcessForm onCreated={()=>setRefreshKey(x=>x+1)} />
        <div>
          <h3>Lista</h3>
          <ProcessList refreshKey={refreshKey}/>
        </div>
      </div>
    </div>
  )
}
