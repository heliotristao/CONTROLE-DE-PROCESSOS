import React, { useEffect, useState } from 'react';
import { getCatalog, createProcess } from '../api';
import { Select } from '../components/Select';

export default function ProcessForm({onCreated}:{onCreated:()=>void}){
  const [form, setForm] = useState<any>({ edocs:'', objeto:'', setor:'', responsavel:'', status:'' });
  const [statusOpts, setStatusOpts] = useState<any[]>([]);
  const [setorOpts, setSetorOpts] = useState<any[]>([]);

  useEffect(() => {
    getCatalog('status').then(setStatusOpts);
    getCatalog('setor').then(setSetorOpts);
  }, []);

  async function submit(e:React.FormEvent){
    e.preventDefault();
    if (!form.edocs || !form.objeto) { alert('Preencha eDocs e Objeto'); return; }
    const res = await createProcess(form);
    if (res.error) { alert(res.error); return; }
    onCreated();
  }

  return (
    <form onSubmit={submit} style={{border:'1px solid #ddd', padding:16, borderRadius:8}}>
      <h3>Novo Processo</h3>
      <label> Nº eDocs
        <input value={form.edocs} onChange={e=>setForm({...form, edocs:e.target.value})} style={{display:'block', width:'100%', padding:8}} />
      </label>
      <label> Objeto
        <textarea value={form.objeto} onChange={e=>setForm({...form, objeto:e.target.value})} style={{display:'block', width:'100%', padding:8, minHeight:80}} />
      </label>
      <Select label="Setor" value={form.setor} onChange={v=>setForm({...form, setor:v})} options={setorOpts} />
      <label> Responsável
        <input value={form.responsavel||''} onChange={e=>setForm({...form, responsavel:e.target.value})} style={{display:'block', width:'100%', padding:8}} />
      </label>
      <Select label="Status" value={form.status} onChange={v=>setForm({...form, status:v})} options={statusOpts} />
      <button type="submit" style={{marginTop:12}}>Salvar</button>
    </form>
  )
}
