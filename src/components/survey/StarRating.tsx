'use client';
import { useState } from 'react';
import { SurveyRatings } from '@/types/survey';
interface Props { label:string; ratingKey:keyof SurveyRatings; value:number; onChange:(k:keyof SurveyRatings,v:number)=>void; }
export default function StarRating({ label, ratingKey, value, onChange }: Props) {
  const [hovered, setHovered] = useState(0);
  const display = hovered > 0 ? hovered : value;
  return (
    <div className="star-row">
      <span className="star-label">{label}</span>
      <div className="stars">
        {[1,2,3,4,5].map(i => (
          <span key={i} className={`star${display>=i?' active':''}`}
            onClick={()=>onChange(ratingKey,i)}
            onMouseEnter={()=>setHovered(i)}
            onMouseLeave={()=>setHovered(0)}>★</span>
        ))}
      </div>
      <span className="star-val">{value>0?`${value}/5`:'–'}</span>
    </div>
  );
}
