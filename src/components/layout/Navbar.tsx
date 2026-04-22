'use client';
interface NavbarProps { activePage: 'form'|'dash'; onNavigate:(p:'form'|'dash')=>void; }
export default function Navbar({ activePage, onNavigate }: NavbarProps) {
  return (
    <nav className="app-nav">
      <div className="nav-logo">30X</div>
      <div className="nav-tabs">
        <button className={`nav-tab${activePage==='form'?' active':''}`} onClick={()=>onNavigate('form')}>✦ Encuesta</button>
        <button className={`nav-tab${activePage==='dash'?' active':''}`} onClick={()=>onNavigate('dash')}>🔒 Resultados</button>
      </div>
    </nav>
  );
}
