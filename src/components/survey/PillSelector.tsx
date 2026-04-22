'use client';
interface Props { options:string[]; selected:string[]; onToggle:(v:string)=>void; }
export default function PillSelector({ options, selected, onToggle }: Props) {
  return (
    <div className="pills-wrap">
      {options.map(o=>(
        <button key={o} className={`pill${selected.includes(o)?' active':''}`} onClick={()=>onToggle(o)}>{o}</button>
      ))}
    </div>
  );
}
