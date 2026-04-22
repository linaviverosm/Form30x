'use client';
interface Props { value:number; onChange:(v:number)=>void; }
export default function NpsSelector({ value, onChange }: Props) {
  return (
    <div className="nps-wrap">
      {Array.from({length:11},(_,i)=>(
        <button key={i} className={`nps-btn${value===i?' active':''}`} onClick={()=>onChange(i)}>{i}</button>
      ))}
    </div>
  );
}
