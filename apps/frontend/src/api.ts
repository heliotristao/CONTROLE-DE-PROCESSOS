const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function listProcesses(q:string='') {
  const url = new URL('/api/processes', API);
  if (q) url.searchParams.set('q', q);
  const r = await fetch(url);
  return r.json();
}

export async function getCatalog(category?:string) {
  const url = new URL('/api/catalogs', API);
  if (category) url.searchParams.set('category', category);
  const r = await fetch(url);
  return r.json();
}

export async function createProcess(data:any){
  const r = await fetch(`${API}/api/processes`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
  return r.json();
}

export async function updateProcess(id:number, data:any){
  const r = await fetch(`${API}/api/processes/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
  return r.json();
}
