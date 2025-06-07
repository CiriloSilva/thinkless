import { useState } from 'react';
export default function ManageList({ transactions, onDelete }){
  const [q,setQ]=useState('');
  const list=transactions.filter(t=>t.title.toLowerCase().includes(q.toLowerCase()));
  return(<>
    <input placeholder="buscar..." value={q} onChange={e=>setQ(e.target.value)}/>
    <ul style={{maxHeight:'50vh',overflow:'auto',padding:0,listStyle:'none'}}>
      {list.map(t=>(
        <li key={t.id} style={{display:'flex',justifyContent:'space-between',padding:'4px 0'}}>
          <span>{t.title} • R$ {t.amount.toFixed(2)}</span>
          <button style={{color:'red',background:'none',border:'none'}} onClick={()=>onDelete(t.id)}>X</button>
        </li>
      ))}
    </ul>
  </>);
}
