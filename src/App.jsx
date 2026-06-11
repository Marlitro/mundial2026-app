import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import TouristGuide from "./components/TouristGuide.jsx";
import PricingModal from "./components/PricingModal.jsx";
import PremiumBadge from "./components/PremiumBadge.jsx";
import { checkPremium, canUseIa, recordIaUse, getIaUsage } from "./utils/premium.js";

// ── GOAL CELEBRATION ANIMATION ────────────────────────────────────────────────
const KOFI_CSS = `
@keyframes kofiSlideIn {
  0%   { transform: translateY(120px); opacity:0; }
  100% { transform: translateY(0);     opacity:1; }
}
@keyframes kofiPulse {
  0%,100% { box-shadow: 0 4px 20px rgba(201,168,76,.35); }
  50%      { box-shadow: 0 4px 28px rgba(201,168,76,.65); }
}
`;

const GOAL_CSS = `
@keyframes goalBallDrop {
  0%   { transform: translateY(-120px) scale(.6) rotate(-20deg); opacity:0; }
  60%  { transform: translateY(10px)   scale(1.15) rotate(8deg);  opacity:1; }
  80%  { transform: translateY(-18px)  scale(.95) rotate(-4deg); }
  100% { transform: translateY(0)      scale(1)   rotate(0deg);  opacity:1; }
}
@keyframes goalTextPop {
  0%   { transform: scale(0) rotate(-8deg); opacity:0; }
  65%  { transform: scale(1.12) rotate(2deg); opacity:1; }
  100% { transform: scale(1) rotate(0deg); opacity:1; }
}
@keyframes goalFadeOut {
  0%   { opacity:1; }
  100% { opacity:0; pointer-events:none; }
}
@keyframes confettiFall {
  0%   { transform: translateY(-10px) rotate(0deg);   opacity:1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity:0; }
}
@keyframes goalRipple {
  0%   { transform: scale(0); opacity:.6; }
  100% { transform: scale(4); opacity:0; }
}
@keyframes goalSlideUp {
  0%   { transform: translateY(30px); opacity:0; }
  100% { transform: translateY(0);    opacity:1; }
}
`;

const CONFETTI_COLORS = ["#ffd700","#c9a84c","#ffffff","#ff4444","#44aaff","#44ff88","#ff88ff"];

function KofiButton() {
  const [dismissed, setDismissed] = useState(false);
  const [minimized, setMinimized] = useState(false);

  if (dismissed) return null;

  return (
    <>
      <style>{KOFI_CSS}</style>
      <div style={{
        position:"fixed",
        bottom: minimized ? 30 : 16,
        right:  minimized ? 74 : 16,
        zIndex:999,
        animation:"kofiSlideIn .55s cubic-bezier(.22,1,.36,1) both",
        fontFamily:"'Segoe UI',Arial,sans-serif",
        transition:"bottom .25s,right .25s",
      }}>
        {minimized ? (
          /* Mini pill — se coloca a la izquierda del botón ↑ */
          <button
            onClick={()=>setMinimized(false)}
            title="Apoya el app"
            style={{
              display:"flex",alignItems:"center",gap:6,
              background:"linear-gradient(135deg,#0a1f40,#1a3a6b)",
              border:"1.5px solid #c9a84c",borderRadius:50,
              padding:"8px 14px",cursor:"pointer",color:"#ffd700",
              fontSize:13,fontWeight:700,
              animation:"kofiPulse 2.8s ease-in-out infinite",
              boxShadow:"0 4px 20px rgba(201,168,76,.35)",
            }}>
            ☕ <span>Apoya</span>
          </button>
        ) : (
          /* Full card */
          <div style={{
            background:"linear-gradient(145deg,#0a1f40 0%,#112244 100%)",
            border:"1.5px solid #c9a84c",borderRadius:16,
            padding:"14px 16px",width:220,
            boxShadow:"0 8px 32px rgba(0,0,0,.55)",
            animation:"kofiPulse 3s ease-in-out infinite",
          }}>
            {/* Header row */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <span style={{color:"#ffd700",fontWeight:800,fontSize:13,letterSpacing:".04em"}}>
                ☕ Apoya el app
              </span>
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>setMinimized(true)} title="Minimizar"
                  style={{background:"none",border:"none",color:"#888",fontSize:14,cursor:"pointer",lineHeight:1,padding:"0 2px"}}>−</button>
                <button onClick={()=>setDismissed(true)} title="Cerrar"
                  style={{background:"none",border:"none",color:"#888",fontSize:14,cursor:"pointer",lineHeight:1,padding:"0 2px"}}>×</button>
              </div>
            </div>

            <p style={{margin:"0 0 10px",fontSize:11.5,color:"#b0bcd4",lineHeight:1.45}}>
              Esta app es gratuita y sin anuncios.<br/>
              Tu apoyo la mantiene viva ⚽
            </p>

            {/* Amount chips */}
            <div style={{display:"flex",gap:6,marginBottom:10}}>
              {["$3","$5"].map(amt=>(
                <a key={amt}
                  href={`https://ko-fi.com/mundial2026`}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    flex:1,textAlign:"center",padding:"5px 0",
                    background:"rgba(201,168,76,.12)",
                    border:"1px solid #c9a84c",borderRadius:8,
                    color:"#ffd700",fontWeight:700,fontSize:13,
                    textDecoration:"none",transition:"background .2s",
                  }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(201,168,76,.28)"}
                  onMouseLeave={e=>e.currentTarget.style.background="rgba(201,168,76,.12)"}
                >
                  {amt}
                </a>
              ))}
            </div>

            {/* Main CTA */}
            <a
              href="https://ko-fi.com/mundial2026"
              target="_blank" rel="noopener noreferrer"
              style={{
                display:"block",textAlign:"center",
                background:"linear-gradient(135deg,#c9a84c,#ffd700)",
                color:"#0a1f40",fontWeight:800,fontSize:13,
                padding:"8px 0",borderRadius:10,
                textDecoration:"none",letterSpacing:".04em",
                transition:"filter .2s",
              }}
              onMouseEnter={e=>e.currentTarget.style.filter="brightness(1.1)"}
              onMouseLeave={e=>e.currentTarget.style.filter="brightness(1)"}
            >
              Apoyar en Ko-fi ☕
            </a>
          </div>
        )}
      </div>
    </>
  );
}

function GoalCelebration({ event, onDone }) {
  const [phase, setPhase] = useState("in"); // in → stay → out
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("out"), 4200);
    const t2 = setTimeout(() => onDone(), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  const pieces = useMemo(() => Array.from({length:38}, (_,i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: `${Math.random()*100}%`,
    delay: `${Math.random()*1.2}s`,
    dur:   `${1.8 + Math.random()*1.6}s`,
    size:  `${7 + Math.random()*10}px`,
    shape: Math.random()>.5 ? "50%" : "2px",
  })), []);

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:9999,
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      background:"rgba(0,0,0,.72)",
      backdropFilter:"blur(4px)",
      animation: phase==="out" ? "goalFadeOut .8s ease forwards" : "none",
      pointerEvents: phase==="out" ? "none" : "auto",
    }}>
      {/* Confetti */}
      {pieces.map(p=>(
        <div key={p.id} style={{
          position:"absolute", top:"-10px", left:p.left,
          width:p.size, height:p.size,
          background:p.color,
          borderRadius:p.shape,
          animation:`confettiFall ${p.dur} ${p.delay} ease-in forwards`,
          pointerEvents:"none",
        }}/>
      ))}

      {/* Ripple ring */}
      <div style={{
        position:"absolute", width:260, height:260,
        borderRadius:"50%", border:"4px solid #ffd70066",
        animation:"goalRipple 1s ease-out forwards",
        pointerEvents:"none",
      }}/>

      {/* Card */}
      <div style={{
        background:"linear-gradient(145deg,#0a1f40,#162b4f)",
        border:"2px solid #c9a84c",
        borderRadius:24, padding:"28px 36px",
        textAlign:"center", maxWidth:340, width:"90%",
        boxShadow:"0 0 60px #c9a84c44, 0 20px 60px rgba(0,0,0,.8)",
        animation:"goalTextPop .5s cubic-bezier(.34,1.56,.64,1) forwards",
        position:"relative", overflow:"hidden",
      }}>
        {/* Glow top bar */}
        <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,transparent,#c9a84c,#ffd700,#c9a84c,transparent)"}}/>

        {/* Ball */}
        <div style={{fontSize:56, animation:"goalBallDrop .7s cubic-bezier(.34,1.56,.64,1) forwards", display:"block", lineHeight:1, marginBottom:8}}>⚽</div>

        {/* GOOOL text */}
        <div style={{
          fontSize:42, fontWeight:900, letterSpacing:".12em",
          background:"linear-gradient(135deg,#ffd700,#c9a84c,#fff8dc)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          textShadow:"none", lineHeight:1, marginBottom:12,
          animation:"goalTextPop .5s .15s cubic-bezier(.34,1.56,.64,1) both",
        }}>¡GOOOL!</div>

        {/* Match info */}
        <div style={{animation:"goalSlideUp .4s .35s ease both"}}>
          <div style={{fontSize:18, fontWeight:700, color:"#fff", marginBottom:6}}>
            {event.home} <span style={{color:"#ffd700"}}>{event.homeScore}</span>
            <span style={{color:"#556", margin:"0 8px"}}>–</span>
            <span style={{color:"#ffd700"}}>{event.awayScore}</span> {event.away}
          </div>
          {event.scorer&&(
            <div style={{fontSize:14, color:"#c9a84c", fontWeight:600}}>
              ⚽ {event.scorer} {event.minute&&`${event.minute}'`}
            </div>
          )}
          {event.team&&(
            <div style={{fontSize:13, color:"#666", marginTop:4}}>
              Gol de {event.team}
            </div>
          )}
        </div>

        {/* Tap to dismiss */}
        <div style={{fontSize:11, color:"#333", marginTop:16, letterSpacing:".08em"}}>
          TOCA PARA CERRAR
        </div>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:3,background:"linear-gradient(90deg,transparent,#c9a84c,#ffd700,#c9a84c,transparent)"}}/>
      </div>
    </div>
  );
}


// ── TEAM META & FLAGS ─────────────────────────────────────────────────────────
const TEAM_META = {
  "México":{code:"mx",grp:"A"},"Sudáfrica":{code:"za",grp:"A"},"Corea del Sur":{code:"kr",grp:"A"},"Chequia":{code:"cz",grp:"A"},
  "Canadá":{code:"ca",grp:"B"},"Bosnia y Herz.":{code:"ba",grp:"B"},"Qatar":{code:"qa",grp:"B"},"Suiza":{code:"ch",grp:"B"},
  "Brasil":{code:"br",grp:"C"},"Marruecos":{code:"ma",grp:"C"},"Haití":{code:"ht",grp:"C"},"Escocia":{code:"gb-sct",grp:"C"},
  "EE.UU.":{code:"us",grp:"D"},"Paraguay":{code:"py",grp:"D"},"Australia":{code:"au",grp:"D"},"Turquía":{code:"tr",grp:"D"},
  "Alemania":{code:"de",grp:"E"},"Curazao":{code:"cw",grp:"E"},"Costa de Marfil":{code:"ci",grp:"E"},"Ecuador":{code:"ec",grp:"E"},
  "Países Bajos":{code:"nl",grp:"F"},"Japón":{code:"jp",grp:"F"},"Túnez":{code:"tn",grp:"F"},"Suecia":{code:"se",grp:"F"},
  "Bélgica":{code:"be",grp:"G"},"Egipto":{code:"eg",grp:"G"},"Irán":{code:"ir",grp:"G"},"Nueva Zelanda":{code:"nz",grp:"G"},
  "España":{code:"es",grp:"H"},"Cabo Verde":{code:"cv",grp:"H"},"Arabia Saudita":{code:"sa",grp:"H"},"Uruguay":{code:"uy",grp:"H"},
  "Francia":{code:"fr",grp:"I"},"Senegal":{code:"sn",grp:"I"},"Irak":{code:"iq",grp:"I"},"Noruega":{code:"no",grp:"I"},
  "Argentina":{code:"ar",grp:"J"},"Argelia":{code:"dz",grp:"J"},"Austria":{code:"at",grp:"J"},"Jordania":{code:"jo",grp:"J"},
  "Portugal":{code:"pt",grp:"K"},"Congo DR":{code:"cd",grp:"K"},"Uzbekistán":{code:"uz",grp:"K"},"Colombia":{code:"co",grp:"K"},
  "Inglaterra":{code:"gb-eng",grp:"L"},"Croacia":{code:"hr",grp:"L"},"Ghana":{code:"gh",grp:"L"},"Panamá":{code:"pa",grp:"L"},
};

// Todas las banderas usan flagcdn.com — imágenes oficiales con escudos completos
const FLAG_CDN = {
  "mx":"mx","za":"za","kr":"kr","cz":"cz","ca":"ca","ba":"ba","qa":"qa","ch":"ch",
  "br":"br","ma":"ma","ht":"ht","gb-sct":"gb-sct","us":"us","py":"py","au":"au",
  "tr":"tr","de":"de","cw":"cw","ci":"ci","ec":"ec","nl":"nl","jp":"jp","tn":"tn",
  "se":"se","be":"be","eg":"eg","ir":"ir","nz":"nz","es":"es","cv":"cv","sa":"sa",
  "uy":"uy","fr":"fr","sn":"sn","iq":"iq","no":"no","ar":"ar","dz":"dz","at":"at",
  "jo":"jo","pt":"pt","cd":"cd","uz":"uz","co":"co","gb-eng":"gb-eng","hr":"hr",
  "gh":"gh","pa":"pa",
};

const Flag = ({team, size=44}) => {
  const meta = TEAM_META[team];
  if (!meta) return <div style={{width:size,height:Math.round(size*0.67),background:"#1a2a3a",borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#555"}}>?</div>;

  const h = Math.round(size*0.67);
  const code = meta.code;
  const cdnCode = FLAG_CDN[code] || code;
  const w = Math.max(size*2, 80);

  return (
    <div style={{width:size,height:h,borderRadius:3,overflow:"hidden",boxShadow:"0 2px 5px rgba(0,0,0,.5)",flexShrink:0}}>
      <img
        src={`https://flagcdn.com/w${w}/${cdnCode}.png`}
        alt={team}
        width={size}
        height={h}
        style={{display:"block",width:size,height:h,objectFit:"cover"}}
        onError={e=>{e.target.style.display="none";}}
      />
    </div>
  );
};

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const PHASE_STYLES = {
  "Grupos":     {bg:"rgba(8,40,80,0.88)",  border:"#1a6eb5",badge:"#1a6eb5"},
  "Ronda de 32":{bg:"rgba(0,55,25,0.88)",  border:"#00a651",badge:"#00a651"},
  "Cuartos":    {bg:"rgba(100,40,0,0.88)", border:"#ff7a00",badge:"#ff7a00"},
  "Semifinal":  {bg:"rgba(100,0,0,0.88)",  border:"#cc0000",badge:"#cc0000"},
  "3er Lugar":  {bg:"rgba(60,50,0,0.88)",  border:"#c9a84c",badge:"#c9a84c"},
  "Final":      {bg:"rgba(80,60,0,0.95)",  border:"#ffd700",badge:"#ffd700"},
};
const PHASE_LABEL = {"Grupos":"GRUPOS","Ronda de 32":"R32","Cuartos":"CUARTOS","Semifinal":"SEMIS","3er Lugar":"3er LUG","Final":"⭐ FINAL"};
const HOST_FILTERS = [{key:"US",label:"🇺🇸 EE.UU.",color:"#3a6fc4"},{key:"MX",label:"🇲🇽 México",color:"#006847"},{key:"CA",label:"🇨🇦 Canadá",color:"#d52b1e"}];
const MONTHS = [{key:"2026-06",label:"JUNIO 2026"},{key:"2026-07",label:"JULIO 2026"}];
const TIMEZONES = [{key:"et",label:"ET",full:"Eastern"},{key:"ct",label:"CT",full:"Central"},{key:"mt",label:"MT",full:"Mountain"},{key:"pt",label:"PT",full:"Pacific"}];
const CH_COLOR = {FOX:"#003da5",FS1:"#c00","FOX/Tubi":"#003da5",Telemundo:"#d4001a","Telemundo/Universo":"#9b1a6e"};
const OFFICIAL_48 = ["Alemania","Argelia","Argentina","Arabia Saudita","Australia","Austria","Bélgica","Bosnia y Herz.","Brasil","Cabo Verde","Canadá","Chequia","Corea del Sur","Colombia","Congo DR","Costa de Marfil","Croacia","Curazao","Ecuador","Egipto","Escocia","España","EE.UU.","Francia","Ghana","Haití","Inglaterra","Irán","Irak","Japón","Jordania","Marruecos","México","Noruega","Nueva Zelanda","Países Bajos","Panamá","Paraguay","Portugal","Qatar","Senegal","Sudáfrica","Suecia","Suiza","Túnez","Turquía","Uruguay","Uzbekistán"].sort();

// ── MATCHES ───────────────────────────────────────────────────────────────────
const MATCHES = [
  {id:1,  date:"2026-06-11",et:"3:00 PM", ct:"2:00 PM", mt:"1:00 PM", pt:"12:00 PM",home:"México",       away:"Sudáfrica",     group:"A",venue:"Estadio Azteca",        city:"Ciudad de México",   phase:"Grupos",    esCanal:"Telemundo/Universo",enCanal:"FOX/Tubi",host:"MX"},
  {id:2,  date:"2026-06-11",et:"10:00 PM",ct:"9:00 PM", mt:"8:00 PM", pt:"7:00 PM", home:"Corea del Sur",away:"Chequia",       group:"A",venue:"Akron Stadium",          city:"Zapopan, México",    phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FS1",     host:"MX"},
  {id:3,  date:"2026-06-12",et:"3:00 PM", ct:"2:00 PM", mt:"1:00 PM", pt:"12:00 PM",home:"Canadá",       away:"Bosnia y Herz.",group:"B",venue:"BMO Field",              city:"Toronto",            phase:"Grupos",    esCanal:"Telemundo/Universo",enCanal:"FOX",     host:"CA"},
  {id:4,  date:"2026-06-12",et:"9:00 PM", ct:"8:00 PM", mt:"7:00 PM", pt:"6:00 PM", home:"EE.UU.",       away:"Paraguay",      group:"D",venue:"SoFi Stadium",           city:"Los Ángeles, CA",    phase:"Grupos",    esCanal:"Telemundo/Universo",enCanal:"FOX/Tubi",host:"US"},
  {id:5,  date:"2026-06-13",et:"3:00 PM", ct:"2:00 PM", mt:"1:00 PM", pt:"12:00 PM",home:"Qatar",        away:"Suiza",         group:"B",venue:"Levi's Stadium",         city:"Santa Clara, CA",    phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:6,  date:"2026-06-13",et:"6:00 PM", ct:"5:00 PM", mt:"4:00 PM", pt:"3:00 PM", home:"Brasil",       away:"Marruecos",     group:"C",venue:"MetLife Stadium",        city:"East Rutherford, NJ",phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:7,  date:"2026-06-13",et:"9:00 PM", ct:"8:00 PM", mt:"7:00 PM", pt:"6:00 PM", home:"Haití",        away:"Escocia",       group:"C",venue:"Gillette Stadium",       city:"Foxborough, MA",     phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:8,  date:"2026-06-13",et:"12:00 AM†",ct:"11:00 PM",mt:"10:00 PM",pt:"9:00 PM",home:"Australia",    away:"Turquía",       group:"D",venue:"BC Place",               city:"Vancouver",          phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"CA"},
  {id:9,  date:"2026-06-14",et:"1:00 PM", ct:"12:00 PM",mt:"11:00 AM",pt:"10:00 AM",home:"Alemania",     away:"Curazao",       group:"E",venue:"NRG Stadium",            city:"Houston",            phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:10, date:"2026-06-14",et:"4:00 PM", ct:"3:00 PM", mt:"2:00 PM", pt:"1:00 PM", home:"Países Bajos", away:"Japón",         group:"F",venue:"AT&T Stadium",           city:"Arlington, TX",      phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:11, date:"2026-06-14",et:"7:00 PM", ct:"6:00 PM", mt:"5:00 PM", pt:"4:00 PM", home:"Costa de Marfil",away:"Ecuador",     group:"E",venue:"Lincoln Financial Field",city:"Philadelphia",       phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FS1",     host:"US"},
  {id:12, date:"2026-06-14",et:"10:00 PM",ct:"9:00 PM", mt:"8:00 PM", pt:"7:00 PM", home:"Túnez",        away:"Suecia",        group:"F",venue:"Estadio BBVA",           city:"Monterrey, México",  phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FS1",     host:"MX"},
  {id:13, date:"2026-06-15",et:"12:00 PM",ct:"11:00 AM",mt:"10:00 AM",pt:"9:00 AM", home:"España",       away:"Cabo Verde",    group:"H",venue:"Mercedes-Benz Stadium",  city:"Atlanta",            phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:14, date:"2026-06-15",et:"3:00 PM", ct:"2:00 PM", mt:"1:00 PM", pt:"12:00 PM",home:"Bélgica",      away:"Egipto",        group:"G",venue:"Lumen Field",            city:"Seattle",            phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:15, date:"2026-06-15",et:"6:00 PM", ct:"5:00 PM", mt:"4:00 PM", pt:"3:00 PM", home:"Arabia Saudita",away:"Uruguay",      group:"H",venue:"Hard Rock Stadium",      city:"Miami",              phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FS1",     host:"US"},
  {id:16, date:"2026-06-15",et:"9:00 PM", ct:"8:00 PM", mt:"7:00 PM", pt:"6:00 PM", home:"Irán",         away:"Nueva Zelanda", group:"G",venue:"SoFi Stadium",           city:"Los Ángeles, CA",    phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FS1",     host:"US"},
  {id:17, date:"2026-06-16",et:"3:00 PM", ct:"2:00 PM", mt:"1:00 PM", pt:"12:00 PM",home:"Francia",      away:"Senegal",       group:"I",venue:"MetLife Stadium",        city:"East Rutherford, NJ",phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:18, date:"2026-06-16",et:"6:00 PM", ct:"5:00 PM", mt:"4:00 PM", pt:"3:00 PM", home:"Irak",         away:"Noruega",       group:"I",venue:"Gillette Stadium",       city:"Foxborough, MA",     phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:19, date:"2026-06-16",et:"9:00 PM", ct:"8:00 PM", mt:"7:00 PM", pt:"6:00 PM", home:"Argentina",    away:"Argelia",       group:"J",venue:"Arrowhead Stadium",      city:"Kansas City",        phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:20, date:"2026-06-16",et:"12:00 AM†",ct:"11:00 PM",mt:"10:00 PM",pt:"9:00 PM",home:"Austria",      away:"Jordania",      group:"J",venue:"Levi's Stadium",         city:"Santa Clara, CA",    phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FS1",     host:"US"},
  {id:21, date:"2026-06-17",et:"1:00 PM", ct:"12:00 PM",mt:"11:00 AM",pt:"10:00 AM",home:"Portugal",     away:"Congo DR",      group:"K",venue:"NRG Stadium",            city:"Houston",            phase:"Grupos",    esCanal:"Telemundo/Universo",enCanal:"FOX",     host:"US"},
  {id:22, date:"2026-06-17",et:"4:00 PM", ct:"3:00 PM", mt:"2:00 PM", pt:"1:00 PM", home:"Inglaterra",   away:"Croacia",       group:"L",venue:"AT&T Stadium",           city:"Arlington, TX",      phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:23, date:"2026-06-17",et:"7:00 PM", ct:"6:00 PM", mt:"5:00 PM", pt:"4:00 PM", home:"Ghana",        away:"Panamá",        group:"L",venue:"BMO Field",              city:"Toronto",            phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FS1",     host:"CA"},
  {id:24, date:"2026-06-17",et:"10:00 PM",ct:"9:00 PM", mt:"8:00 PM", pt:"7:00 PM", home:"Uzbekistán",   away:"Colombia",      group:"K",venue:"Estadio Azteca",         city:"Ciudad de México",   phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FS1",     host:"MX"},
  {id:25, date:"2026-06-18",et:"12:00 PM",ct:"11:00 AM",mt:"10:00 AM",pt:"9:00 AM", home:"Chequia",      away:"Sudáfrica",     group:"A",venue:"Mercedes-Benz Stadium",  city:"Atlanta",            phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:26, date:"2026-06-18",et:"3:00 PM", ct:"2:00 PM", mt:"1:00 PM", pt:"12:00 PM",home:"Suiza",        away:"Bosnia y Herz.",group:"B",venue:"SoFi Stadium",           city:"Los Ángeles, CA",    phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:27, date:"2026-06-18",et:"6:00 PM", ct:"5:00 PM", mt:"4:00 PM", pt:"3:00 PM", home:"Canadá",       away:"Qatar",         group:"B",venue:"BC Place",               city:"Vancouver",          phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FS1",     host:"CA"},
  {id:28, date:"2026-06-18",et:"9:00 PM", ct:"8:00 PM", mt:"7:00 PM", pt:"6:00 PM", home:"México",       away:"Corea del Sur", group:"A",venue:"Akron Stadium",          city:"Zapopan, México",    phase:"Grupos",    esCanal:"Telemundo/Universo",enCanal:"FOX",     host:"MX"},
  {id:29, date:"2026-06-19",et:"3:00 PM", ct:"2:00 PM", mt:"1:00 PM", pt:"12:00 PM",home:"EE.UU.",       away:"Australia",     group:"D",venue:"Lumen Field",            city:"Seattle",            phase:"Grupos",    esCanal:"Telemundo/Universo",enCanal:"FOX",     host:"US"},
  {id:30, date:"2026-06-19",et:"6:00 PM", ct:"5:00 PM", mt:"4:00 PM", pt:"3:00 PM", home:"Escocia",      away:"Marruecos",     group:"C",venue:"Gillette Stadium",       city:"Foxborough, MA",     phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:31, date:"2026-06-19",et:"8:30 PM", ct:"7:30 PM", mt:"6:30 PM", pt:"5:30 PM", home:"Brasil",       away:"Haití",         group:"C",venue:"Lincoln Financial Field",city:"Philadelphia",       phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:32, date:"2026-06-19",et:"11:00 PM",ct:"10:00 PM",mt:"9:00 PM", pt:"8:00 PM", home:"Turquía",      away:"Paraguay",      group:"D",venue:"Levi's Stadium",         city:"Santa Clara, CA",    phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FS1",     host:"US"},
  {id:33, date:"2026-06-20",et:"1:00 PM", ct:"12:00 PM",mt:"11:00 AM",pt:"10:00 AM",home:"Países Bajos", away:"Suecia",        group:"F",venue:"NRG Stadium",            city:"Houston",            phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:34, date:"2026-06-20",et:"4:00 PM", ct:"3:00 PM", mt:"2:00 PM", pt:"1:00 PM", home:"Alemania",     away:"Costa de Marfil",group:"E",venue:"BMO Field",             city:"Toronto",            phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"CA"},
  {id:35, date:"2026-06-20",et:"8:00 PM", ct:"7:00 PM", mt:"6:00 PM", pt:"5:00 PM", home:"Ecuador",      away:"Curazao",       group:"E",venue:"Arrowhead Stadium",      city:"Kansas City",        phase:"Grupos",    esCanal:"Telemundo/Universo",enCanal:"FS1",     host:"US"},
  {id:36, date:"2026-06-20",et:"12:00 AM†",ct:"11:00 PM",mt:"10:00 PM",pt:"9:00 PM",home:"Túnez",        away:"Japón",         group:"F",venue:"Estadio BBVA",           city:"Monterrey, México",  phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FS1",     host:"MX"},
  {id:37, date:"2026-06-21",et:"12:00 PM",ct:"11:00 AM",mt:"10:00 AM",pt:"9:00 AM", home:"España",       away:"Arabia Saudita",group:"H",venue:"Mercedes-Benz Stadium",  city:"Atlanta",            phase:"Grupos",    esCanal:"Telemundo/Universo",enCanal:"FOX",     host:"US"},
  {id:38, date:"2026-06-21",et:"3:00 PM", ct:"2:00 PM", mt:"1:00 PM", pt:"12:00 PM",home:"Bélgica",      away:"Irán",          group:"G",venue:"SoFi Stadium",           city:"Los Ángeles, CA",    phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FS1",     host:"US"},
  {id:39, date:"2026-06-21",et:"6:00 PM", ct:"5:00 PM", mt:"4:00 PM", pt:"3:00 PM", home:"Uruguay",      away:"Cabo Verde",    group:"H",venue:"Hard Rock Stadium",      city:"Miami",              phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FS1",     host:"US"},
  {id:40, date:"2026-06-21",et:"9:00 PM", ct:"8:00 PM", mt:"7:00 PM", pt:"6:00 PM", home:"Nueva Zelanda",away:"Egipto",        group:"G",venue:"BC Place",               city:"Vancouver",          phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FS1",     host:"CA"},
  {id:41, date:"2026-06-22",et:"1:00 PM", ct:"12:00 PM",mt:"11:00 AM",pt:"10:00 AM",home:"Argentina",    away:"Austria",       group:"J",venue:"AT&T Stadium",           city:"Arlington, TX",      phase:"Grupos",    esCanal:"Telemundo/Universo",enCanal:"FOX",     host:"US"},
  {id:42, date:"2026-06-22",et:"5:00 PM", ct:"4:00 PM", mt:"3:00 PM", pt:"2:00 PM", home:"Francia",      away:"Irak",          group:"I",venue:"MetLife Stadium",        city:"East Rutherford, NJ",phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:43, date:"2026-06-22",et:"8:00 PM", ct:"7:00 PM", mt:"6:00 PM", pt:"5:00 PM", home:"Noruega",      away:"Senegal",       group:"I",venue:"Lumen Field",            city:"Seattle",            phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:44, date:"2026-06-22",et:"11:00 PM",ct:"10:00 PM",mt:"9:00 PM", pt:"8:00 PM", home:"Jordania",     away:"Argelia",       group:"J",venue:"Levi's Stadium",         city:"Santa Clara, CA",    phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FS1",     host:"US"},
  {id:45, date:"2026-06-23",et:"1:00 PM", ct:"12:00 PM",mt:"11:00 AM",pt:"10:00 AM",home:"Portugal",     away:"Uzbekistán",    group:"K",venue:"Mercedes-Benz Stadium",  city:"Atlanta",            phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:46, date:"2026-06-23",et:"4:00 PM", ct:"3:00 PM", mt:"2:00 PM", pt:"1:00 PM", home:"Inglaterra",   away:"Ghana",         group:"L",venue:"NRG Stadium",            city:"Houston",            phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:47, date:"2026-06-23",et:"7:00 PM", ct:"6:00 PM", mt:"5:00 PM", pt:"4:00 PM", home:"Panamá",       away:"Croacia",       group:"L",venue:"Arrowhead Stadium",      city:"Kansas City",        phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:48, date:"2026-06-23",et:"10:00 PM",ct:"9:00 PM", mt:"8:00 PM", pt:"7:00 PM", home:"Colombia",     away:"Congo DR",      group:"K",venue:"Hard Rock Stadium",      city:"Miami",              phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FS1",     host:"US"},
  {id:49, date:"2026-06-24",et:"3:00 PM", ct:"2:00 PM", mt:"1:00 PM", pt:"12:00 PM",home:"Suiza",        away:"Canadá",        group:"B",venue:"AT&T Stadium",           city:"Arlington, TX",      phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:50, date:"2026-06-24",et:"3:00 PM", ct:"2:00 PM", mt:"1:00 PM", pt:"12:00 PM",home:"Bosnia y Herz.",away:"Qatar",        group:"B",venue:"Levi's Stadium",         city:"Santa Clara, CA",    phase:"Grupos",    esCanal:"Telemundo/Universo",enCanal:"FS1",     host:"US"},
  {id:51, date:"2026-06-24",et:"6:00 PM", ct:"5:00 PM", mt:"4:00 PM", pt:"3:00 PM", home:"Escocia",      away:"Brasil",        group:"C",venue:"SoFi Stadium",           city:"Los Ángeles, CA",    phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:52, date:"2026-06-24",et:"6:00 PM", ct:"5:00 PM", mt:"4:00 PM", pt:"3:00 PM", home:"Marruecos",    away:"Haití",         group:"C",venue:"Lincoln Financial Field",city:"Philadelphia",       phase:"Grupos",    esCanal:"Telemundo/Universo",enCanal:"FS1",     host:"US"},
  {id:53, date:"2026-06-24",et:"9:00 PM", ct:"8:00 PM", mt:"7:00 PM", pt:"6:00 PM", home:"Chequia",      away:"México",        group:"A",venue:"Mercedes-Benz Stadium",  city:"Atlanta",            phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:54, date:"2026-06-24",et:"9:00 PM", ct:"8:00 PM", mt:"7:00 PM", pt:"6:00 PM", home:"Sudáfrica",    away:"Corea del Sur", group:"A",venue:"Hard Rock Stadium",      city:"Miami",              phase:"Grupos",    esCanal:"Telemundo/Universo",enCanal:"FS1",     host:"US"},
  {id:55, date:"2026-06-25",et:"4:00 PM", ct:"3:00 PM", mt:"2:00 PM", pt:"1:00 PM", home:"Ecuador",      away:"Alemania",      group:"E",venue:"BMO Field",              city:"Toronto",            phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"CA"},
  {id:56, date:"2026-06-25",et:"4:00 PM", ct:"3:00 PM", mt:"2:00 PM", pt:"1:00 PM", home:"Curazao",      away:"Costa de Marfil",group:"E",venue:"Gillette Stadium",      city:"Foxborough, MA",     phase:"Grupos",    esCanal:"Telemundo/Universo",enCanal:"FS1",     host:"US"},
  {id:57, date:"2026-06-25",et:"7:00 PM", ct:"6:00 PM", mt:"5:00 PM", pt:"4:00 PM", home:"Túnez",        away:"Países Bajos",  group:"F",venue:"Arrowhead Stadium",      city:"Kansas City",        phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:58, date:"2026-06-25",et:"7:00 PM", ct:"6:00 PM", mt:"5:00 PM", pt:"4:00 PM", home:"Japón",        away:"Suecia",        group:"F",venue:"NRG Stadium",            city:"Houston",            phase:"Grupos",    esCanal:"Telemundo/Universo",enCanal:"FS1",     host:"US"},
  {id:59, date:"2026-06-25",et:"10:00 PM",ct:"9:00 PM", mt:"8:00 PM", pt:"7:00 PM", home:"Turquía",      away:"EE.UU.",        group:"D",venue:"AT&T Stadium",           city:"Arlington, TX",      phase:"Grupos",    esCanal:"Telemundo/Universo",enCanal:"FOX",     host:"US"},
  {id:60, date:"2026-06-25",et:"10:00 PM",ct:"9:00 PM", mt:"8:00 PM", pt:"7:00 PM", home:"Paraguay",     away:"Australia",     group:"D",venue:"Lumen Field",            city:"Seattle",            phase:"Grupos",    esCanal:"Telemundo/Universo",enCanal:"FS1",     host:"US"},
  {id:61, date:"2026-06-26",et:"3:00 PM", ct:"2:00 PM", mt:"1:00 PM", pt:"12:00 PM",home:"Noruega",      away:"Francia",       group:"I",venue:"MetLife Stadium",        city:"East Rutherford, NJ",phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:62, date:"2026-06-26",et:"3:00 PM", ct:"2:00 PM", mt:"1:00 PM", pt:"12:00 PM",home:"Senegal",      away:"Irak",          group:"I",venue:"Mercedes-Benz Stadium",  city:"Atlanta",            phase:"Grupos",    esCanal:"Telemundo/Universo",enCanal:"FS1",     host:"US"},
  {id:63, date:"2026-06-26",et:"8:00 PM", ct:"7:00 PM", mt:"6:00 PM", pt:"5:00 PM", home:"Uruguay",      away:"España",        group:"H",venue:"Hard Rock Stadium",      city:"Miami",              phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:64, date:"2026-06-26",et:"8:00 PM", ct:"7:00 PM", mt:"6:00 PM", pt:"5:00 PM", home:"Cabo Verde",   away:"Arabia Saudita",group:"H",venue:"SoFi Stadium",           city:"Los Ángeles, CA",    phase:"Grupos",    esCanal:"Telemundo/Universo",enCanal:"FS1",     host:"US"},
  {id:65, date:"2026-06-26",et:"11:00 PM",ct:"10:00 PM",mt:"9:00 PM", pt:"8:00 PM", home:"Nueva Zelanda",away:"Bélgica",       group:"G",venue:"Levi's Stadium",         city:"Santa Clara, CA",    phase:"Grupos",    esCanal:"Telemundo/Universo",enCanal:"FOX",     host:"US"},
  {id:66, date:"2026-06-26",et:"11:00 PM",ct:"10:00 PM",mt:"9:00 PM", pt:"8:00 PM", home:"Egipto",       away:"Irán",          group:"G",venue:"Arrowhead Stadium",      city:"Kansas City",        phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:67, date:"2026-06-27",et:"5:00 PM", ct:"4:00 PM", mt:"3:00 PM", pt:"2:00 PM", home:"Panamá",       away:"Inglaterra",    group:"L",venue:"BC Place",               city:"Vancouver",          phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"CA"},
  {id:68, date:"2026-06-27",et:"5:00 PM", ct:"4:00 PM", mt:"3:00 PM", pt:"2:00 PM", home:"Croacia",      away:"Ghana",         group:"L",venue:"BMO Field",              city:"Toronto",            phase:"Grupos",    esCanal:"Telemundo/Universo",enCanal:"FS1",     host:"CA"},
  {id:69, date:"2026-06-27",et:"7:30 PM", ct:"6:30 PM", mt:"5:30 PM", pt:"4:30 PM", home:"Colombia",     away:"Portugal",      group:"K",venue:"NRG Stadium",            city:"Houston",            phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:70, date:"2026-06-27",et:"7:30 PM", ct:"6:30 PM", mt:"5:30 PM", pt:"4:30 PM", home:"Congo DR",     away:"Uzbekistán",    group:"K",venue:"Mercedes-Benz Stadium",  city:"Atlanta",            phase:"Grupos",    esCanal:"Telemundo/Universo",enCanal:"FS1",     host:"US"},
  {id:71, date:"2026-06-27",et:"10:00 PM",ct:"9:00 PM", mt:"8:00 PM", pt:"7:00 PM", home:"Jordania",     away:"Argentina",     group:"J",venue:"AT&T Stadium",           city:"Arlington, TX",      phase:"Grupos",    esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:72, date:"2026-06-27",et:"10:00 PM",ct:"9:00 PM", mt:"8:00 PM", pt:"7:00 PM", home:"Argelia",      away:"Austria",       group:"J",venue:"Lumen Field",            city:"Seattle",            phase:"Grupos",    esCanal:"Telemundo/Universo",enCanal:"FS1",     host:"US"},
  {id:80, date:"2026-07-01",et:"12:00 PM",ct:"11:00 AM",mt:"10:00 AM",pt:"9:00 AM", home:"1° Grp L",     away:"3° lugar",      group:"", venue:"Mercedes-Benz Stadium",  city:"Atlanta",            phase:"Ronda de 32",esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:81, date:"2026-07-01",et:"4:00 PM", ct:"3:00 PM", mt:"2:00 PM", pt:"1:00 PM", home:"1° Grp G",     away:"3° lugar",      group:"", venue:"Lumen Field",            city:"Seattle",            phase:"Ronda de 32",esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:82, date:"2026-07-01",et:"8:00 PM", ct:"7:00 PM", mt:"6:00 PM", pt:"5:00 PM", home:"1° Grp D",     away:"3° lugar",      group:"", venue:"Levi's Stadium",         city:"Santa Clara, CA",    phase:"Ronda de 32",esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:83, date:"2026-07-02",et:"3:00 PM", ct:"2:00 PM", mt:"1:00 PM", pt:"12:00 PM",home:"1° Grp H",     away:"2° Grp J",      group:"", venue:"SoFi Stadium",           city:"Los Ángeles, CA",    phase:"Ronda de 32",esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:84, date:"2026-07-02",et:"7:00 PM", ct:"6:00 PM", mt:"5:00 PM", pt:"4:00 PM", home:"2° Grp K",     away:"2° Grp L",      group:"", venue:"BMO Field",              city:"Toronto",            phase:"Ronda de 32",esCanal:"Telemundo",         enCanal:"FOX",     host:"CA"},
  {id:85, date:"2026-07-02",et:"11:00 PM",ct:"10:00 PM",mt:"9:00 PM", pt:"8:00 PM", home:"1° Grp B",     away:"3° lugar",      group:"", venue:"BC Place",               city:"Vancouver",          phase:"Ronda de 32",esCanal:"Telemundo",         enCanal:"FOX",     host:"CA"},
  {id:86, date:"2026-07-03",et:"2:00 PM", ct:"1:00 PM", mt:"12:00 PM",pt:"11:00 AM",home:"2° Grp D",     away:"2° Grp G",      group:"", venue:"AT&T Stadium",           city:"Arlington, TX",      phase:"Ronda de 32",esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:87, date:"2026-07-03",et:"6:00 PM", ct:"5:00 PM", mt:"4:00 PM", pt:"3:00 PM", home:"1° Grp J",     away:"2° Grp H",      group:"", venue:"Hard Rock Stadium",      city:"Miami",              phase:"Ronda de 32",esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:88, date:"2026-07-03",et:"9:30 PM", ct:"8:30 PM", mt:"7:30 PM", pt:"6:30 PM", home:"1° Grp K",     away:"3° lugar",      group:"", venue:"Arrowhead Stadium",      city:"Kansas City",        phase:"Ronda de 32",esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:90, date:"2026-07-07",et:"6:00 PM", ct:"5:00 PM", mt:"4:00 PM", pt:"3:00 PM", home:"TBD",          away:"TBD",           group:"", venue:"MetLife Stadium",        city:"East Rutherford, NJ",phase:"Cuartos",   esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:91, date:"2026-07-08",et:"3:00 PM", ct:"2:00 PM", mt:"1:00 PM", pt:"12:00 PM",home:"TBD",          away:"TBD",           group:"", venue:"SoFi Stadium",           city:"Los Ángeles, CA",    phase:"Cuartos",   esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:92, date:"2026-07-09",et:"6:00 PM", ct:"5:00 PM", mt:"4:00 PM", pt:"3:00 PM", home:"TBD",          away:"TBD",           group:"", venue:"AT&T Stadium",           city:"Arlington, TX",      phase:"Cuartos",   esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:93, date:"2026-07-10",et:"3:00 PM", ct:"2:00 PM", mt:"1:00 PM", pt:"12:00 PM",home:"TBD",          away:"TBD",           group:"", venue:"Hard Rock Stadium",      city:"Miami",              phase:"Cuartos",   esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:95, date:"2026-07-14",et:"6:00 PM", ct:"5:00 PM", mt:"4:00 PM", pt:"3:00 PM", home:"TBD",          away:"TBD",           group:"", venue:"MetLife Stadium",        city:"East Rutherford, NJ",phase:"Semifinal", esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:96, date:"2026-07-15",et:"6:00 PM", ct:"5:00 PM", mt:"4:00 PM", pt:"3:00 PM", home:"TBD",          away:"TBD",           group:"", venue:"AT&T Stadium",           city:"Arlington, TX",      phase:"Semifinal", esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:98, date:"2026-07-18",et:"3:00 PM", ct:"2:00 PM", mt:"1:00 PM", pt:"12:00 PM",home:"TBD",          away:"TBD",           group:"", venue:"Hard Rock Stadium",      city:"Miami",              phase:"3er Lugar", esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
  {id:99, date:"2026-07-19",et:"3:00 PM", ct:"2:00 PM", mt:"1:00 PM", pt:"12:00 PM",home:"TBD",          away:"TBD",           group:"", venue:"MetLife Stadium",        city:"East Rutherford, NJ",phase:"Final",     esCanal:"Telemundo",         enCanal:"FOX",     host:"US"},
];

const INIT_STANDINGS = {
  A:[{t:"México",code:"mx"},{t:"Corea del Sur",code:"kr"},{t:"Chequia",code:"cz"},{t:"Sudáfrica",code:"za"}],
  B:[{t:"Canadá",code:"ca"},{t:"Suiza",code:"ch"},{t:"Qatar",code:"qa"},{t:"Bosnia y Herz.",code:"ba"}],
  C:[{t:"Brasil",code:"br"},{t:"Marruecos",code:"ma"},{t:"Escocia",code:"gb-sct"},{t:"Haití",code:"ht"}],
  D:[{t:"EE.UU.",code:"us"},{t:"Turquía",code:"tr"},{t:"Australia",code:"au"},{t:"Paraguay",code:"py"}],
  E:[{t:"Alemania",code:"de"},{t:"Ecuador",code:"ec"},{t:"Costa de Marfil",code:"ci"},{t:"Curazao",code:"cw"}],
  F:[{t:"Países Bajos",code:"nl"},{t:"Japón",code:"jp"},{t:"Suecia",code:"se"},{t:"Túnez",code:"tn"}],
  G:[{t:"Bélgica",code:"be"},{t:"Irán",code:"ir"},{t:"Egipto",code:"eg"},{t:"Nueva Zelanda",code:"nz"}],
  H:[{t:"España",code:"es"},{t:"Uruguay",code:"uy"},{t:"Arabia Saudita",code:"sa"},{t:"Cabo Verde",code:"cv"}],
  I:[{t:"Francia",code:"fr"},{t:"Senegal",code:"sn"},{t:"Noruega",code:"no"},{t:"Irak",code:"iq"}],
  J:[{t:"Argentina",code:"ar"},{t:"Austria",code:"at"},{t:"Argelia",code:"dz"},{t:"Jordania",code:"jo"}],
  K:[{t:"Portugal",code:"pt"},{t:"Colombia",code:"co"},{t:"Congo DR",code:"cd"},{t:"Uzbekistán",code:"uz"}],
  L:[{t:"Inglaterra",code:"gb-eng"},{t:"Croacia",code:"hr"},{t:"Ghana",code:"gh"},{t:"Panamá",code:"pa"}],
};

// Candidatos a la Bota de Oro — selección editorial, sin datos inventados.
// Fuente: historial de clasificatorias y rendimiento 2024-25.
const GOLDEN_BOOT_CANDIDATES = [
  {name:"Kylian Mbappé",   team:"Francia",   pos:"Delantero",  club:"Real Madrid",    fact:"Máximo goleador del PSG en mundiales; campeón 2018, subcampeón 2022"},
  {name:"Erling Haaland",  team:"Noruega",   pos:"Delantero",  club:"Man. City",      fact:"36 goles en Premier 22/23; Noruega clasificó por primera vez desde 2002 convirtiéndolo en líder histórico"},
  {name:"Lionel Messi",    team:"Argentina", pos:"Mediocampista", club:"Inter Miami", fact:"Bota de Oro Mundial 2022 (7 goles); campeón vigente buscando su segunda estrella"},
  {name:"Vinicius Jr.",    team:"Brasil",    pos:"Extremo",    club:"Real Madrid",    fact:"Balón de Oro 2024; motor ofensivo del pentacampeón"},
  {name:"Harry Kane",      team:"Inglaterra",pos:"Delantero",  club:"Bayern Munich",  fact:"36 goles con Bayern en 23/24; máximo goleador histórico de Inglaterra"},
  {name:"Lamine Yamal",    team:"España",    pos:"Extremo",    club:"FC Barcelona",   fact:"Mejor joven de la Eurocopa 2024 (17 años); España busca el bicampeonato"},
  {name:"Victor Osimhen",  team:"Nigeria",   pos:"Delantero",  club:"Galatasaray",    fact:"Máximo goleador africano en Europa 2023; líder de las Súper Águilas"},
  {name:"Richarlison",     team:"Brasil",    pos:"Delantero",  club:"Tottenham",      fact:"Hat-trick en clasificatorias 2026; vital para el ataque brasileño"},
  {name:"Bukayo Saka",     team:"Inglaterra",pos:"Extremo",    club:"Arsenal",        fact:"12 goles y 13 asistencias en PL 23/24; mejor joven de Inglaterra"},
  {name:"Antoine Griezmann",team:"Francia", pos:"Mediocampista",club:"Atlético Madrid",fact:"Bota de Oro del Mundial Rusia 2018; experiencia única en grandes torneos"},
];

const VENUES = {
  "Estadio Azteca":{city:"Ciudad de México",host:"MX",capacity:"87,523",opened:1966,team:"Club América / Selección México",surface:"Pasto natural",lat:19.3028,lng:-99.1504,fact:"Único estadio en albergar 3 finales de Copa del Mundo (1970, 1986, 2026). Aquí Maradona marcó el 'Gol del Siglo' en 1986.",wc2026:"Partido inaugural · Octavos · Cuartos",img:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Vista_a%C3%A9rea_del_Estadio_Azteca_-_2026_-_02.jpg/960px-Vista_a%C3%A9rea_del_Estadio_Azteca_-_2026_-_02.jpg",color:"#006847"},
  "Akron Stadium":{city:"Zapopan, México",host:"MX",capacity:"49,813",opened:2010,team:"Chivas de Guadalajara",surface:"Pasto natural",lat:20.68167,lng:-103.46278,fact:"Conocido como 'Estadio Omnilife', es uno de los estadios más modernos de México. Su diseño circular acerca a todos los aficionados al campo.",wc2026:"Fase de grupos",img:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Estadio_Akron_02-07-2022_cabecera_sur_lado_derecho_%283%29.jpg/960px-Estadio_Akron_02-07-2022_cabecera_sur_lado_derecho_%283%29.jpg",color:"#cc0000"},
  "Estadio BBVA":{city:"Monterrey, México",host:"MX",capacity:"53,500",opened:2015,team:"CF Monterrey",surface:"Pasto natural",lat:25.6693,lng:-100.2437,fact:"Construido al pie del Cerro de la Silla, ofrece una de las vistas más espectaculares de cualquier estadio del mundo.",wc2026:"Fase de grupos · Octavos",img:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Mexico_Guadalupe_Monterrey_Estadio_BBVA_Bancomer_fifa_world_cup_2026_6.JPG/960px-Mexico_Guadalupe_Monterrey_Estadio_BBVA_Bancomer_fifa_world_cup_2026_6.JPG",color:"#ff6600"},
  "BMO Field":{city:"Toronto, Canadá",host:"CA",capacity:"45,000",opened:2007,team:"Toronto FC",surface:"Pasto natural",lat:43.6333,lng:-79.4189,fact:"Único estadio de fútbol dedicado en Canadá. Toronto es la ciudad más grande y multicultural del país.",wc2026:"Fase de grupos · Octavos",img:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Toronto_BMO_Field_in_2024.jpg/960px-Toronto_BMO_Field_in_2024.jpg",color:"#d52b1e"},
  "BC Place":{city:"Vancouver, Canadá",host:"CA",capacity:"54,500",opened:1983,team:"Vancouver Whitecaps",surface:"Pasto artificial",lat:49.2767,lng:-123.1119,fact:"Posee el techo retráctil más grande de América del Norte. Vancouver es la ciudad más multicultural de Canadá.",wc2026:"Fase de grupos · Octavos",img:"https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/BC_Place_2015_Women%27s_FIFA_World_Cup.jpg/960px-BC_Place_2015_Women%27s_FIFA_World_Cup.jpg",color:"#003da5"},
  "MetLife Stadium":{city:"East Rutherford, NJ",host:"US",capacity:"82,500",opened:2010,team:"NY Giants / NY Jets",surface:"Pasto artificial",lat:40.8135,lng:-74.0745,fact:"Sede de la GRAN FINAL del Mundial 2026 el 19 de julio. Costó $1.6 mil millones. El más cercano a la ciudad de Nueva York.",wc2026:"Fase de grupos · Semis · ⭐ FINAL",img:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Metlife_stadium_%28Aerial_view%29.jpg/960px-Metlife_stadium_%28Aerial_view%29.jpg",color:"#ffd700"},
  "AT&T Stadium":{city:"Arlington, TX",host:"US",capacity:"94,000",opened:2009,team:"Dallas Cowboys",surface:"Pasto artificial",lat:32.7480,lng:-97.0929,fact:"El estadio MÁS GRANDE del Mundial 2026. Tiene la pantalla colgante más grande del mundo (160m).",wc2026:"Fase de grupos · Cuartos · Semis",img:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Arlington_June_2020_4_%28AT%26T_Stadium%29.jpg/960px-Arlington_June_2020_4_%28AT%26T_Stadium%29.jpg",color:"#003da5"},
  "NRG Stadium":{city:"Houston, TX",host:"US",capacity:"72,220",opened:2002,team:"Houston Texans",surface:"Pasto natural/artificial",lat:29.6847,lng:-95.4107,fact:"Houston tiene la mayor concentración de venezolanos en EE.UU. Techo retráctil para el calor extremo de Texas.",wc2026:"Fase de grupos · Octavos",img:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Nrg_stadium.jpg/960px-Nrg_stadium.jpg",color:"#cc0000"},
  "SoFi Stadium":{city:"Los Ángeles, CA",host:"US",capacity:"70,000",opened:2020,team:"LA Rams / LA Chargers",surface:"Pasto artificial",lat:33.9535,lng:-118.3392,fact:"El estadio más costoso de la historia del deporte ($5.5 mil millones). Los Ángeles es la capital latina de EE.UU.",wc2026:"Fase de grupos · Octavos · Cuartos",img:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/SoFi_Stadium_2023.jpg/960px-SoFi_Stadium_2023.jpg",color:"#003da5"},
  "Arrowhead Stadium":{city:"Kansas City, MO",host:"US",capacity:"73,000",opened:1972,team:"Kansas City Chiefs",surface:"Pasto natural",lat:39.0489,lng:-94.4839,fact:"Certificado por el Guinness como el estadio al aire libre más RUIDOSO del mundo (142.2 dB).",wc2026:"Fase de grupos · Octavos",img:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Aerial_view_of_Arrowhead_Stadium_08-31-2013.jpg/960px-Aerial_view_of_Arrowhead_Stadium_08-31-2013.jpg",color:"#e31837"},
  "Hard Rock Stadium":{city:"Miami, FL",host:"US",capacity:"64,767",opened:1987,team:"Miami Dolphins",surface:"Pasto natural",lat:25.9580,lng:-80.2389,fact:"Miami es la ciudad más latina de EE.UU. El estadio albergó el Super Bowl 5 veces.",wc2026:"Fase de grupos · Semis · 3er Lugar",img:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Hard_Rock_Stadium_for_Super_Bowl_LIV_%2849606710103%29.jpg/960px-Hard_Rock_Stadium_for_Super_Bowl_LIV_%2849606710103%29.jpg",color:"#008e97"},
  "Mercedes-Benz Stadium":{city:"Atlanta, GA",host:"US",capacity:"67,382",opened:2017,team:"Atlanta Falcons / Atlanta United",surface:"Pasto artificial",lat:33.7554,lng:-84.4010,fact:"Techo retráctil en forma de iris con 8 pétalos — el único de su tipo en el mundo.",wc2026:"Fase de grupos · Octavos · Semifinal",img:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Mercedes_Benz_Stadium_time_lapse_capture_2017-08-13.jpg/960px-Mercedes_Benz_Stadium_time_lapse_capture_2017-08-13.jpg",color:"#a71930"},
  "Lincoln Financial Field":{city:"Philadelphia, PA",host:"US",capacity:"69,879",opened:2003,team:"Philadelphia Eagles",surface:"Pasto artificial",lat:39.9008,lng:-75.1675,fact:"Filadelfia es la primera ciudad de EE.UU. — aquí se firmó la Declaración de Independencia.",wc2026:"Fase de grupos · Octavos",img:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Lincoln_Financial_Field_%28Aerial_view%29.jpg/960px-Lincoln_Financial_Field_%28Aerial_view%29.jpg",color:"#004953"},
  "Levi's Stadium":{city:"Santa Clara, CA",host:"US",capacity:"68,500",opened:2014,team:"San Francisco 49ers",surface:"Pasto natural",lat:37.4033,lng:-121.9700,fact:"Ubicado en Silicon Valley. El estadio más sostenible del deporte profesional en EE.UU. con paneles solares.",wc2026:"Fase de grupos · Octavos",img:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Levi%27s_Stadium_in_February_2016_prior_to_Super_Bowl_50_%2824398261729%29.jpg/960px-Levi%27s_Stadium_in_February_2016_prior_to_Super_Bowl_50_%2824398261729%29.jpg",color:"#aa0000"},
  "Lumen Field":{city:"Seattle, WA",host:"US",capacity:"65,123",opened:2002,team:"Seattle Seahawks / Sounders",surface:"Pasto artificial",lat:47.5952,lng:-122.3316,fact:"Seattle es famosa por su cultura futbolística. Los Sounders promedian más de 40,000 aficionados por partido.",wc2026:"Fase de grupos · Octavos",img:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/2025_FIFA_Club_World_Cup_-_Seattle_Sounders_FC_vs._Atl%C3%A9tico_Madrid_-_05.jpg/960px-2025_FIFA_Club_World_Cup_-_Seattle_Sounders_FC_vs._Atl%C3%A9tico_Madrid_-_05.jpg",color:"#69be28"},
  "Gillette Stadium":{city:"Foxborough, MA",host:"US",capacity:"63,815",opened:2002,team:"New England Patriots",surface:"Pasto artificial",lat:42.0909,lng:-71.2643,fact:"Boston es la ciudad universitaria más importante de EE.UU. (Harvard, MIT). Los Patriots tienen 6 Super Bowls.",wc2026:"Fase de grupos · Octavos",img:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Gillette_Stadium_%28Top_View%29.jpg/960px-Gillette_Stadium_%28Top_View%29.jpg",color:"#0a2342"},
};

const BRACKET = {
  qf:[{id:"QF1",date:"Jul 7",time:"6PM ET",venue:"MetLife · NJ"},{id:"QF2",date:"Jul 8",time:"3PM ET",venue:"SoFi · LA"},{id:"QF3",date:"Jul 9",time:"6PM ET",venue:"AT&T · Dallas"},{id:"QF4",date:"Jul 10",time:"3PM ET",venue:"Hard Rock · Miami"}],
  sf:[{id:"SF1",date:"Jul 14",time:"6PM ET",venue:"MetLife · NJ"},{id:"SF2",date:"Jul 15",time:"6PM ET",venue:"AT&T · Dallas"}],
  final:{id:"F",date:"Jul 19",time:"3PM ET",venue:"MetLife · NJ"},
  third:{id:"3P",date:"Jul 18",time:"3PM ET",venue:"Hard Rock · Miami"},
};

const ALL_TEAMS = [...new Set(MATCHES.flatMap(m=>[m.home,m.away]).filter(t=>!t.startsWith("TBD")&&!t.includes("°")&&!t.includes("Grp")))].sort();
const QUINIELA_MATCHES = MATCHES.filter(m=>m.phase==="Grupos"&&m.home!=="TBD"&&!m.home.includes("°")).slice(0,24);

// ── QUINIELA SYSTEM ───────────────────────────────────────────────────────────
const genCode = () => {
  const c="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return "MUN26-"+Array.from({length:5},()=>c[Math.floor(Math.random()*c.length)]).join("");
};

const TEAM_EMOJI = {"México":"🇲🇽","EE.UU.":"🇺🇸","Canadá":"🇨🇦","Argentina":"🇦🇷","Brasil":"🇧🇷","Francia":"🇫🇷","España":"🇪🇸","Inglaterra":"🇬🇧","Alemania":"🇩🇪","Portugal":"🇵🇹","Países Bajos":"🇳🇱","Bélgica":"🇧🇪","Croacia":"🇭🇷","Uruguay":"🇺🇾","Colombia":"🇨🇴","Ecuador":"🇪🇨","Corea del Sur":"🇰🇷","Japón":"🇯🇵","Marruecos":"🇲🇦","Senegal":"🇸🇳","Ghana":"🇬🇭","Costa de Marfil":"🇨🇮","Sudáfrica":"🇿🇦","Egipto":"🇪🇬","Túnez":"🇹🇳","Argelia":"🇩🇿","Suiza":"🇨🇭","Suecia":"🇸🇪","Noruega":"🇳🇴","Austria":"🇦🇹","Chequia":"🇨🇿","Polonia":"🇵🇱","Turquía":"🇹🇷","Arabia Saudita":"🇸🇦","Irán":"🇮🇷","Irak":"🇮🇶","Qatar":"🇶🇦","Australia":"🇦🇺","Nueva Zelanda":"🇳🇿","Paraguay":"🇵🇾","Panamá":"🇵🇦","Haití":"🇭🇹","Bolivia":"🇧🇴","Escocia":"🏴󠁧󠁢󠁳󠁣󠁴󠁿","Bosnia y Herz.":"🇧🇦","Congo DR":"🇨🇩","Cabo Verde":"🇨🇻","Curazao":"🇨🇼","Uzbekistán":"🇺🇿","Jordania":"🇯🇴","Ghana":"🇬🇭","Panamá":"🇵🇦"};

const QuinielaSystem = ({tz, onShowPricing, premiumTier}) => {
  const [screen, setScreen] = useState("welcome");
  const [userName, setUserName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [myCode, setMyCode] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [picks, setPicks] = useState(()=>{
    const q={};
    QUINIELA_MATCHES.forEach(m=>{q[m.id]={pick:null,score1:"",score2:"",pts:null};});
    return q;
  });
  const [groupMembers, setGroupMembers] = useState([]);
  const [globalBoard, setGlobalBoard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(()=>{
    (async()=>{
      try {
        let d = null;
        if(typeof window.storage !== "undefined") {
          const r = await window.storage.get("quiniela:me");
          if(r) d = JSON.parse(r.value);
        } else {
          const ls = localStorage.getItem("quiniela:me");
          if(ls) d = JSON.parse(ls);
        }
        if(d?.name){setUserName(d.name);setMyCode(d.myCode||"");setGroupCode(d.groupCode||"");if(d.picks)setPicks(d.picks);setScreen("picks");}
      } catch(e){}
    })();
  },[]);

  const saveMe = async(name,myC,grpC,p)=>{
    try {
      if(typeof window.storage !== "undefined") {
        await window.storage.set("quiniela:me",JSON.stringify({name,myCode:myC,groupCode:grpC,picks:p}));
      } else {
        localStorage.setItem("quiniela:me",JSON.stringify({name,myCode:myC,groupCode:grpC,picks:p}));
      }
    } catch(e){}
  };

  const publish = async(name,myC,grpC,p)=>{
    const pts=Object.values(p).reduce((a,q)=>a+(q.pts||0),0);
    const predicted=Object.values(p).filter(q=>q.pick).length;
    try {
      await fetch("/api/quiniela",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({action:"save",data:{name,myCode:myC,groupCode:grpC,pts,predicted,picks:p}}),
      });
    } catch(e){ console.error("publish:",e); }
  };

  const loadGlobal = async()=>{
    setLoading(true);
    try {
      const res=await fetch("/api/quiniela?action=global");
      const data=await res.json();
      if(data.ok&&data.board) setGlobalBoard(data.board);
    } catch(e){ console.error("loadGlobal:",e); }
    setLoading(false);
  };

  const loadGroup = async(code)=>{
    setLoading(true);
    try {
      const res=await fetch(`/api/quiniela?action=group&code=${encodeURIComponent(code)}`);
      const data=await res.json();
      if(data.ok&&data.members) setGroupMembers(data.members);
    } catch(e){ console.error("loadGroup:",e); }
    setLoading(false);
  };

  const myTotalPts=Object.values(picks).reduce((a,q)=>a+(q.pts||0),0);
  const myPredicted=Object.values(picks).filter(q=>q.pick).length;

  const pill=(label,active,color,onClick)=>(
    <button onClick={onClick} style={{padding:"7px 12px",borderRadius:7,border:`1px solid ${active?color:color+"44"}`,background:active?`${color}22`:"rgba(255,255,255,.05)",color:active?color:"#888",fontFamily:"inherit",fontSize:14,fontWeight:700,cursor:"pointer"}}>{label}</button>
  );

  // ── WELCOME ──
  if(screen==="welcome") return (
    <div style={{padding:"10px 0"}}>
      <div style={{textAlign:"center",marginBottom:16}}>
        <div style={{fontSize:48,marginBottom:8}}>🎯</div>
        <div style={{fontSize:20,fontWeight:900,color:"#fff"}}>QUINIELA MUNDIAL 2026</div>
        <div style={{fontSize:15,color:"#666",marginTop:4}}>Predice, compite y gana contra tus amigos y el mundo</div>
      </div>

      {/* Modos de juego */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        <div style={{background:"rgba(8,40,80,.7)",border:"1px solid #1a6eb533",borderRadius:12,padding:"14px 12px"}}>
          <div style={{fontSize:22,marginBottom:6}}>🙋</div>
          <div style={{fontSize:14,fontWeight:800,color:"#fff",marginBottom:4}}>Modo Solo</div>
          <div style={{fontSize:12,color:"#666",lineHeight:1.5}}>Haz tus picks, acumula puntos y aparece en la tabla global con jugadores de todo el mundo.</div>
          <div style={{marginTop:8,fontSize:12,color:"#00a651",fontWeight:700}}>✅ Gratis</div>
        </div>
        <div style={{background:"linear-gradient(135deg,rgba(201,168,76,.15),rgba(8,40,80,.8))",border:"1.5px solid #c9a84c55",borderRadius:12,padding:"14px 12px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,right:0,background:"#c9a84c",color:"#000",fontSize:10,fontWeight:900,padding:"2px 8px",borderRadius:"0 12px 0 8px"}}>⭐ PRO</div>
          <div style={{fontSize:22,marginBottom:6}}>👥</div>
          <div style={{fontSize:14,fontWeight:800,color:"#ffd700",marginBottom:4}}>Grupo Privado</div>
          <div style={{fontSize:12,color:"#a0b0c8",lineHeight:1.5}}>Crea tu grupo, invita a tus amigos con un código único y lleva el ranking entre todos.</div>
          {(!premiumTier||premiumTier==="free")?(
            <button onClick={()=>onShowPricing?.("pro")} style={{marginTop:8,width:"100%",padding:"7px",borderRadius:7,border:"none",background:"linear-gradient(90deg,#c9a84c,#ffd700)",color:"#000",fontFamily:"inherit",fontSize:12,fontWeight:900,cursor:"pointer"}}>Activar por $0.99 →</button>
          ):(
            <div style={{marginTop:8,fontSize:12,color:"#00a651",fontWeight:700}}>✅ Activo en tu plan</div>
          )}
        </div>
      </div>

      {/* CTA de grupo privado */}
      <div style={{background:"rgba(201,168,76,.07)",border:"1px solid #c9a84c33",borderRadius:12,padding:"14px 16px",marginBottom:16}}>
        <div style={{fontSize:13,fontWeight:800,color:"#ffd700",marginBottom:6}}>¿Quieres armar la quiniela con tus amistades? 🏆</div>
        <div style={{fontSize:12,color:"#a0b0c8",lineHeight:1.6,marginBottom:10}}>
          Con <strong style={{color:"#ffd700"}}>Fan Pro</strong> creas tu grupo privado, compartes un código con tu grupo de WhatsApp y todos siguen el ranking en tiempo real. Ideal para la oficina, familia o peña futbolera.
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {[["📊","Ranking privado"],["🔗","Código único"],["📱","Compartir por WhatsApp"],["🔄","Actualización en vivo"]].map(([icon,label])=>(
            <div key={label} style={{display:"flex",alignItems:"center",gap:4,background:"rgba(255,255,255,.05)",borderRadius:6,padding:"4px 8px",fontSize:11,color:"#aaa"}}>
              <span>{icon}</span><span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sistema de puntos */}
      <div style={{fontSize:13,color:"#888",letterSpacing:".1em",fontWeight:700,marginBottom:8}}>SISTEMA DE PUNTOS</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:18}}>
        {[{icon:"⭐",pts:"3 pts",label:"Marcador exacto"},{icon:"✅",pts:"1 pt",label:"Resultado correcto"},{icon:"❌",pts:"0 pts",label:"Fallo"},{icon:"🏆",pts:"TOP",label:"Tabla global"}].map(({icon,pts,label})=>(
          <div key={label} style={{background:"rgba(8,40,80,.6)",border:"1px solid #1a6eb533",borderRadius:10,padding:"10px",textAlign:"center"}}>
            <div style={{fontSize:20,marginBottom:3}}>{icon}</div>
            <div style={{fontSize:16,fontWeight:900,color:"#ffd700"}}>{pts}</div>
            <div style={{fontSize:13,color:"#555",marginTop:2}}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{marginBottom:12}}>
        <div style={{fontSize:14,color:"#888",marginBottom:5,letterSpacing:".1em"}}>TU NOMBRE / APODO</div>
        <input value={userName} onChange={e=>setUserName(e.target.value)} placeholder="Ej: El Pibe, Marcos, TigreFC..." maxLength={20}
          style={{width:"100%",padding:"10px 12px",background:"rgba(255,255,255,.08)",border:"1px solid #1a6eb5",borderRadius:8,color:"#fff",fontSize:14,fontFamily:"inherit",boxSizing:"border-box"}}/>
      </div>
      <div style={{marginBottom:18}}>
        <div style={{fontSize:14,color:"#888",marginBottom:5,letterSpacing:".1em"}}>CÓDIGO DE GRUPO (opcional — si te invitaron)</div>
        <input value={joinCode} onChange={e=>setJoinCode(e.target.value.toUpperCase())} placeholder="Ej: MUN26-AB3KP"
          style={{width:"100%",padding:"10px 12px",background:"rgba(255,255,255,.08)",border:"1px solid #33333388",borderRadius:8,color:"#fff",fontSize:14,fontFamily:"inherit",boxSizing:"border-box"}}/>
      </div>
      <button disabled={!userName.trim()} onClick={async()=>{
        const myC=genCode();
        const grpC=joinCode.trim()||genCode();
        setMyCode(myC); setGroupCode(grpC);
        await saveMe(userName.trim(),myC,grpC,picks);
        setScreen("picks");
      }} style={{width:"100%",padding:"14px",borderRadius:10,border:"none",background:userName.trim()?"linear-gradient(90deg,#c9a84c,#ffd700)":"rgba(255,255,255,.05)",color:userName.trim()?"#000":"#444",fontFamily:"inherit",fontSize:14,fontWeight:900,cursor:userName.trim()?"pointer":"not-allowed"}}>
        {userName.trim()?"🎯 EMPEZAR QUINIELA":"Ingresa tu nombre para continuar"}
      </button>
    </div>
  );

  // ── PICKS ──
  if(screen==="picks") return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
        <div>
          <div style={{fontSize:15,fontWeight:800,color:"#fff"}}>👋 {userName}</div>
          <div style={{fontSize:14,color:"#c9a84c"}}>{myPredicted}/{QUINIELA_MATCHES.length} picks · {myTotalPts} pts</div>
        </div>
        <div style={{display:"flex",gap:6}}>
          {pill("👥 Mi grupo",false,"#00a651",()=>{loadGroup(groupCode);setScreen("group");})}
          {pill("🌍 Global",false,"#c9a84c",()=>{loadGlobal();setScreen("global");})}
        </div>
      </div>
      {/* Share box */}
      <div style={{background:"rgba(0,166,81,.08)",border:"1px solid #00a65133",borderRadius:10,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <div style={{flex:1}}>
          <div style={{fontSize:12,color:"#00a651",letterSpacing:".12em",fontWeight:700,marginBottom:1}}>🔗 CÓDIGO DE TU GRUPO — comparte con amigos</div>
          <div style={{fontSize:17,fontWeight:900,color:"#fff",letterSpacing:".08em"}}>{groupCode}</div>
        </div>
        <button onClick={()=>{navigator.clipboard.writeText(`¡Únete a mi quiniela del Mundial 2026! 🎯⚽\nCódigo: ${groupCode}\nAbre la app y únete en la sección Quiniela.`);setCopied(true);setTimeout(()=>setCopied(false),2000);}}
          style={{padding:"7px 11px",borderRadius:6,border:`1px solid ${copied?"#00a651":"#555"}`,background:copied?"rgba(0,166,81,.2)":"rgba(255,255,255,.06)",color:copied?"#00a651":"#aaa",fontFamily:"inherit",fontSize:13,fontWeight:700,cursor:"pointer"}}>
          {copied?"✅ Copiado":"📋 Copiar"}
        </button>
        <button onClick={()=>{const t=`¡Únete a mi quiniela del Mundial 2026! 🎯⚽\nCódigo: ${groupCode}`;window.open(`https://wa.me/?text=${encodeURIComponent(t)}`,"_blank");}}
          style={{padding:"7px 11px",borderRadius:6,border:"1px solid #25d366",background:"rgba(37,211,102,.12)",color:"#25d366",fontFamily:"inherit",fontSize:13,fontWeight:700,cursor:"pointer"}}>
          📱 WhatsApp
        </button>
      </div>
      {savedMsg&&<div style={{fontSize:14,color:"#00a651",marginBottom:10,textAlign:"center"}}>{savedMsg}</div>}
      {/* Picks list */}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {QUINIELA_MATCHES.map(m=>{
          const q=picks[m.id]||{};
          return (
            <div key={m.id} style={{background:"rgba(8,40,80,.88)",border:`1px solid ${q.pick?"#c9a84c44":"#1a6eb522"}`,borderRadius:12,padding:"12px 14px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:4}}>
                <span style={{fontSize:12,color:"#555"}}>Grupo {m.group} · {m.date} · {m[tz]} {TIMEZONES.find(t=>t.key===tz)?.label}</span>
                <div style={{display:"flex",gap:5}}>
                  {q.pick&&<span style={{fontSize:12,background:"#c9a84c22",color:"#c9a84c",padding:"2px 7px",borderRadius:4,fontWeight:700}}>✓ Pick hecho</span>}
                  {q.pts!=null&&<span style={{fontSize:12,background:q.pts===3?"rgba(0,166,81,.3)":q.pts===1?"rgba(201,168,76,.3)":"rgba(255,0,0,.2)",color:q.pts===3?"#00a651":q.pts===1?"#ffd700":"#ff6666",padding:"2px 8px",borderRadius:4,fontWeight:900}}>{q.pts===3?"⭐ +3":q.pts===1?"✅ +1":"❌ 0"} pts</span>}
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:10}}>
                {[{key:"home",label:m.home,flag:m.home,color:"#1a6eb5"},{key:"draw",label:"Empate",flag:null,color:"#888"},{key:"away",label:m.away,flag:m.away,color:"#c9a84c"}].map(({key,label,flag,color})=>(
                  <button key={key} onClick={()=>setPicks(prev=>({...prev,[m.id]:{...prev[m.id],pick:key}}))}
                    style={{padding:"9px 12px",borderRadius:8,border:`2px solid ${q.pick===key?color:color+"33"}`,background:q.pick===key?`${color}22`:"rgba(255,255,255,.03)",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:10,width:"100%",transition:"all .2s"}}>
                    {flag?<div style={{flexShrink:0}}><Flag team={flag} size={24}/></div>:<span style={{fontSize:18,flexShrink:0}}>🤝</span>}
                    <span style={{fontSize:15,fontWeight:700,color:q.pick===key?color:"#888",flex:1,textAlign:"left"}}>{flag?`🏆 Gana ${label}`:label}</span>
                    {q.pick===key&&<span style={{color,fontSize:14}}>✓</span>}
                  </button>
                ))}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:13,color:"#555",flexShrink:0}}>Marcador exacto:</span>
                <input type="number" min="0" max="20" value={q.score1||""} onChange={e=>setPicks(prev=>({...prev,[m.id]:{...prev[m.id],score1:e.target.value}}))}
                  placeholder="0" style={{width:44,padding:"6px 4px",background:"rgba(255,255,255,.07)",border:"1px solid #333",borderRadius:6,color:"#fff",fontSize:14,fontWeight:800,textAlign:"center",fontFamily:"inherit"}}/>
                <span style={{color:"#555",fontWeight:900,fontSize:16}}>–</span>
                <input type="number" min="0" max="20" value={q.score2||""} onChange={e=>setPicks(prev=>({...prev,[m.id]:{...prev[m.id],score2:e.target.value}}))}
                  placeholder="0" style={{width:44,padding:"6px 4px",background:"rgba(255,255,255,.07)",border:"1px solid #333",borderRadius:6,color:"#fff",fontSize:14,fontWeight:800,textAlign:"center",fontFamily:"inherit"}}/>
                <span style={{fontSize:13,color:"#444"}}>⭐ +3 si aciertas</span>
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={async()=>{await saveMe(userName,myCode,groupCode,picks);await publish(userName,myCode,groupCode,picks);setSavedMsg("✅ ¡Picks guardados y publicados!");setTimeout(()=>setSavedMsg(""),3000);}}
        style={{width:"100%",marginTop:14,padding:"14px",borderRadius:10,border:"none",background:"linear-gradient(90deg,#c9a84c,#ffd700)",color:"#000",fontFamily:"inherit",fontSize:14,fontWeight:900,cursor:"pointer"}}>
        💾 Guardar y publicar mis picks
      </button>
    </div>
  );

  // ── GROUP ──
  if(screen==="group") return (
    <div>
      <button onClick={()=>setScreen("picks")} style={{display:"flex",alignItems:"center",gap:6,marginBottom:14,padding:"7px 13px",borderRadius:8,border:"1px solid #555",background:"rgba(255,255,255,.05)",color:"#aaa",fontFamily:"inherit",fontSize:15,fontWeight:700,cursor:"pointer"}}>← Mis picks</button>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:18,fontWeight:800,color:"#fff"}}>👥 TABLA DE MI GRUPO</div>
        <div style={{fontSize:14,color:"#555",marginTop:2}}>Código: <span style={{color:"#c9a84c",fontWeight:700}}>{groupCode}</span></div>
      </div>
      {loading?<div style={{textAlign:"center",padding:"40px",color:"#555"}}>Cargando...</div>:
      groupMembers.length===0?(
        <div style={{textAlign:"center",padding:"40px 20px",color:"#555"}}>
          <div style={{fontSize:36,marginBottom:10}}>👥</div>
          <div style={{fontSize:16,marginBottom:8}}>Aún no hay miembros en tu grupo</div>
          <div style={{fontSize:14,color:"#444"}}>Comparte el código <span style={{color:"#c9a84c",fontWeight:700}}>{groupCode}</span> con tus amigos</div>
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {groupMembers.map((m,i)=>(
            <div key={m.myCode} style={{display:"flex",alignItems:"center",gap:12,background:m.myCode===myCode?"rgba(201,168,76,.12)":"rgba(8,40,80,.6)",border:`1px solid ${m.myCode===myCode?"#c9a84c":"#1a6eb522"}`,borderRadius:10,padding:"12px 14px"}}>
              <div style={{width:32,height:32,borderRadius:8,background:i===0?"#c9a84c":i===1?"rgba(160,160,160,.3)":i===2?"rgba(150,90,0,.3)":"rgba(255,255,255,.05)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:14,color:"#fff",flexShrink:0}}>{i+1}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:16,fontWeight:700,color:"#fff"}}>{m.name}{m.myCode===myCode?" (tú)":""}</div>
                <div style={{fontSize:13,color:"#555"}}>{m.predicted} partidos predichos</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:22,fontWeight:900,color:"#ffd700",lineHeight:1}}>{m.pts}</div>
                <div style={{fontSize:12,color:"#555"}}>pts</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:12}}>
        <button onClick={()=>loadGroup(groupCode)} style={{padding:"11px",borderRadius:8,border:"1px solid #1a6eb5",background:"rgba(26,110,181,.15)",color:"#6aadff",fontFamily:"inherit",fontSize:14,fontWeight:700,cursor:"pointer"}}>🔄 Actualizar</button>
        <button onClick={()=>{
          const lines = groupMembers.map((m,i)=>`${i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}.`} ${m.name}${m.myCode===myCode?" 👈":""} — ${m.pts} pts`);
          const text = `🏆 RANKING QUINIELA MUNDIAL 2026\nGrupo: ${groupCode}\n\n${lines.join("\n")}\n\n⚽ Únete en: mundial2026-app-theta.vercel.app`;
          if(navigator.share){navigator.share({text});}else{navigator.clipboard.writeText(text);alert("¡Ranking copiado! Pégalo donde quieras 📋");}
        }} style={{padding:"11px",borderRadius:8,border:"1px solid #25d366",background:"rgba(37,211,102,.12)",color:"#25d366",fontFamily:"inherit",fontSize:14,fontWeight:700,cursor:"pointer"}}>📤 Compartir</button>
      </div>
    </div>
  );

  // ── GLOBAL ──
  if(screen==="global") return (
    <div>
      <button onClick={()=>setScreen("picks")} style={{display:"flex",alignItems:"center",gap:6,marginBottom:14,padding:"7px 13px",borderRadius:8,border:"1px solid #555",background:"rgba(255,255,255,.05)",color:"#aaa",fontFamily:"inherit",fontSize:15,fontWeight:700,cursor:"pointer"}}>← Mis picks</button>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:18,fontWeight:800,color:"#fff"}}>🌍 TABLA GLOBAL</div>
        <div style={{fontSize:14,color:"#555",marginTop:2}}>Todos los participantes del mundo</div>
      </div>
      {loading?<div style={{textAlign:"center",padding:"40px",color:"#555"}}>Cargando...</div>:
      globalBoard.length===0?(
        <div style={{textAlign:"center",padding:"40px 20px",color:"#555"}}>
          <div style={{fontSize:36,marginBottom:10}}>🌍</div>
          <div style={{fontSize:13}}>¡Sé el primero en publicar tus picks!</div>
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {globalBoard.map((m,i)=>(
            <div key={m.myCode} style={{display:"flex",alignItems:"center",gap:12,background:m.myCode===myCode?"rgba(201,168,76,.12)":"rgba(8,40,80,.6)",border:`1px solid ${m.myCode===myCode?"#c9a84c":"#1a6eb522"}`,borderRadius:10,padding:"12px 14px"}}>
              <div style={{width:32,height:32,borderRadius:8,background:i===0?"#c9a84c":i===1?"rgba(160,160,160,.3)":i===2?"rgba(150,90,0,.3)":"rgba(255,255,255,.05)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:14,color:"#fff",flexShrink:0}}>{i+1}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:16,fontWeight:700,color:"#fff"}}>{m.name}{m.myCode===myCode?" 👈 (tú)":""}</div>
                <div style={{fontSize:13,color:"#555"}}>{m.predicted} picks · {m.groupCode===groupCode?"Tu grupo":`Grupo: ${m.groupCode}`}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:22,fontWeight:900,color:"#ffd700",lineHeight:1}}>{m.pts}</div>
                <div style={{fontSize:12,color:"#555"}}>pts</div>
              </div>
            </div>
          ))}
          {!globalBoard.find(m=>m.myCode===myCode)&&(
            <div style={{marginTop:6,padding:"11px 14px",background:"rgba(201,168,76,.08)",border:"1px solid #c9a84c44",borderRadius:10,display:"flex",alignItems:"center",gap:12}}>
              <div style={{fontSize:14,color:"#c9a84c",fontWeight:700}}>👈 TÚ — {userName}</div>
              <div style={{marginLeft:"auto",fontSize:18,fontWeight:900,color:"#ffd700"}}>{myTotalPts} pts</div>
            </div>
          )}
        </div>
      )}
      <button onClick={loadGlobal} style={{width:"100%",marginTop:12,padding:"11px",borderRadius:8,border:"1px solid #c9a84c",background:"rgba(201,168,76,.15)",color:"#ffd700",fontFamily:"inherit",fontSize:15,fontWeight:700,cursor:"pointer"}}>🔄 Actualizar tabla global</button>
    </div>
  );

  return null;
};

// ── SHARE CARD ────────────────────────────────────────────────────────────────
const ShareCard = ({match, tz, lang, onClose}) => {
  const [copied, setCopied] = useState(false);
  const canal = lang==="es"?match.esCanal:match.enCanal;
  const time = match[tz];
  const tzLabel = TIMEZONES.find(t=>t.key===tz)?.label||"ET";
  const hFlag = TEAM_EMOJI[match.home]||"⚽";
  const aFlag = TEAM_EMOJI[match.away]||"⚽";
  const text = `⚽ #Mundial2026\n${hFlag} ${match.home} 🆚 ${match.away} ${aFlag}\n📅 ${match.date} · ${time} ${tzLabel}\n🏟️ ${match.venue}, ${match.city}\n📺 ${canal}\n\n¡No te lo pierdas! 🔥`;
  const ps = PHASE_STYLES[match.phase]||PHASE_STYLES["Grupos"];
  const hostInfo = HOST_FILTERS.find(h=>h.key===match.host);
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div style={{maxWidth:360,width:"100%"}} onClick={e=>e.stopPropagation()}>
        <div style={{border:`2px solid ${ps.border}`,borderRadius:16,padding:"18px",background:ps.bg,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${ps.border},#ffd700,${ps.border})`}}/>
          <div style={{textAlign:"center",marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:800,letterSpacing:".2em",color:ps.badge}}>{PHASE_LABEL[match.phase]}{match.group?` · GRUPO ${match.group}`:""}</div>
            <div style={{fontSize:12,color:"#555",letterSpacing:".12em"}}>FIFA WORLD CUP 2026™</div>
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
            <div style={{textAlign:"center",flex:1}}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:5}}><Flag team={match.home} size={50}/></div>
              <div style={{fontSize:15,fontWeight:800,color:"#fff",textTransform:"uppercase"}}>{match.home}</div>
            </div>
            <div style={{textAlign:"center",padding:"0 10px"}}>
              <div style={{fontSize:13,fontWeight:900,color:ps.badge,letterSpacing:".2em",marginBottom:3}}>VS</div>
              <div style={{fontSize:18,fontWeight:900,color:"#fff"}}>{time}</div>
              <div style={{fontSize:12,color:"#666"}}>{tzLabel}</div>
            </div>
            <div style={{textAlign:"center",flex:1}}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:5}}><Flag team={match.away} size={50}/></div>
              <div style={{fontSize:15,fontWeight:800,color:"#fff",textTransform:"uppercase"}}>{match.away}</div>
            </div>
          </div>
          <div style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:8,padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:5}}>
            <div>
              <div style={{fontSize:13,color:"#bbb",fontWeight:600}}>🏟️ {match.venue}</div>
              <div style={{fontSize:12,color:"#666"}}>📍 {match.city}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:13,color:"#d4001a",fontWeight:700}}>📺 {canal}</div>
              {hostInfo&&<div style={{fontSize:12,color:hostInfo.color}}>{hostInfo.label}</div>}
            </div>
          </div>
          <div style={{marginTop:8,textAlign:"center",fontSize:12,color:"#444"}}>⚽ worldcup2026.app</div>
        </div>
        <div style={{display:"flex",gap:8,marginTop:10}}>
          <button onClick={()=>navigator.clipboard.writeText(text).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);})}
            style={{flex:1,padding:"10px",borderRadius:8,border:`1px solid ${copied?"#00a651":"#c9a84c"}`,background:copied?"rgba(0,166,81,.2)":"rgba(201,168,76,.15)",color:copied?"#00a651":"#ffd700",fontFamily:"inherit",fontSize:15,fontWeight:700,cursor:"pointer"}}>
            {copied?"✅ ¡Copiado!":"📋 Copiar texto"}
          </button>
          <button onClick={()=>window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,"_blank")}
            style={{flex:1,padding:"10px",borderRadius:8,border:"1px solid #25d366",background:"rgba(37,211,102,.15)",color:"#25d366",fontFamily:"inherit",fontSize:15,fontWeight:700,cursor:"pointer"}}>
            📱 WhatsApp
          </button>
          <button onClick={onClose} style={{padding:"10px 12px",borderRadius:8,border:"1px solid #555",background:"rgba(255,255,255,.05)",color:"#888",fontFamily:"inherit",fontSize:15,cursor:"pointer"}}>✕</button>
        </div>
      </div>
    </div>
  );
};

// ── VENUE MODAL ───────────────────────────────────────────────────────────────
const VenueModal = ({venueName, onClose}) => {
  const v = VENUES[venueName];
  if(!v) return null;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${v.lat},${v.lng}`;
  const hostInfo = HOST_FILTERS.find(h=>h.key===v.host);
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16,overflowY:"auto"}} onClick={onClose}>
      <div style={{maxWidth:480,width:"100%",background:"linear-gradient(160deg,#0f1f3d,#162b4f)",border:`2px solid ${v.color}`,borderRadius:18,overflow:"hidden"}} onClick={e=>e.stopPropagation()}>
        <div style={{position:"relative",height:190,overflow:"hidden",background:"#0a1628"}}>
          <img src={v.img} alt={venueName} style={{width:"100%",height:"100%",objectFit:"cover",opacity:.8}} onError={e=>{e.target.style.display="none";}}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,#0f1f3d 0%,transparent 60%)"}}/>
          <button onClick={onClose} style={{position:"absolute",top:10,right:10,background:"rgba(0,0,0,.6)",border:"1px solid #555",borderRadius:20,color:"#fff",padding:"4px 10px",cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>✕ Cerrar</button>
          {hostInfo&&<span style={{position:"absolute",bottom:10,left:14,fontSize:13,background:`${hostInfo.color}cc`,color:"#fff",padding:"3px 8px",borderRadius:4,fontWeight:700}}>{hostInfo.label}</span>}
        </div>
        <div style={{padding:"14px 18px 18px"}}>
          <div style={{fontSize:18,fontWeight:900,color:"#fff",marginBottom:2}}>{venueName}</div>
          <div style={{fontSize:14,color:"#666",marginBottom:12}}>📍 {v.city} · Inaugurado {v.opened}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
            {[{l:"Capacidad",v:v.capacity,icon:"👥"},{l:"Equipo local",v:v.team,icon:"🏈"},{l:"Superficie",v:v.surface,icon:"🌱"},{l:"Mundial 2026",v:v.wc2026,icon:"⚽"}].map(({l,v:val,icon})=>(
              <div key={l} style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.08)",borderRadius:8,padding:"9px 11px"}}>
                <div style={{fontSize:12,color:"#555",letterSpacing:".08em",marginBottom:2}}>{icon} {l.toUpperCase()}</div>
                <div style={{fontSize:14,color:"#ddd",fontWeight:600,lineHeight:1.3}}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{background:`${v.color}18`,border:`1px solid ${v.color}44`,borderRadius:10,padding:"11px 13px",marginBottom:12}}>
            <div style={{fontSize:12,color:v.color,letterSpacing:".12em",fontWeight:700,marginBottom:5}}>💡 DATO CURIOSO</div>
            <div style={{fontSize:15,color:"#ccc",lineHeight:1.6}}>{v.fact}</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{flex:1,padding:"9px",borderRadius:8,border:"1px solid #00a651",background:"rgba(0,166,81,.15)",color:"#00a651",fontFamily:"inherit",fontSize:14,fontWeight:700,textDecoration:"none",textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>🗺️ Google Maps</a>
            <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(venueName+" estadio Mundial 2026")}`} target="_blank" rel="noopener noreferrer" style={{flex:1,padding:"9px",borderRadius:8,border:"1px solid #f00",background:"rgba(255,0,0,.12)",color:"#ff5555",fontFamily:"inherit",fontSize:14,fontWeight:700,textDecoration:"none",textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>▶️ YouTube</a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── LIVE CARD ─────────────────────────────────────────────────────────────────
const LiveCard = ({match:m, score:sc, tz, lang, minute}) => {
  const ps = PHASE_STYLES[m.phase]||PHASE_STYLES["Grupos"];
  const canal = lang==="es"?m.esCanal:m.enCanal;
  const isLive = sc?.status==="live";
  if(!sc) return null;
  return (
    <div style={{background:ps.bg,border:`1px solid ${isLive?"#f00":ps.border}`,borderRadius:12,padding:"14px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <span style={{fontSize:12,fontWeight:800,background:isLive?"#f00":"#555",color:"#fff",padding:"2px 7px",borderRadius:3}}>{isLive?"🔴 EN VIVO":"⏱ FINALIZADO"}</span>
        {isLive&&<span style={{fontSize:14,fontWeight:900,color:"#f44"}}>{minute||sc.minute||"?"}'</span>}
        <span style={{fontSize:12,color:"#666"}}>📺 {canal}</span>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{textAlign:"center",flex:1}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:4}}><Flag team={m.home} size={40}/></div>
          <div style={{fontSize:14,fontWeight:700,color:"#fff",textTransform:"uppercase"}}>{m.home}</div>
        </div>
        <div style={{textAlign:"center",padding:"0 10px"}}>
          <div style={{fontSize:26,fontWeight:900,color:"#fff",lineHeight:1}}>{sc.homeScore}–{sc.awayScore}</div>
          <div style={{fontSize:12,color:"#666",marginTop:2}}>{m[tz]}</div>
        </div>
        <div style={{textAlign:"center",flex:1}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:4}}><Flag team={m.away} size={40}/></div>
          <div style={{fontSize:14,fontWeight:700,color:"#fff",textTransform:"uppercase"}}>{m.away}</div>
        </div>
      </div>
      <div style={{marginTop:8,fontSize:12,color:"#555",textAlign:"center"}}>🏟️ {m.venue} · {m.city}</div>
    </div>
  );
};

// ── BRACKET SLOT ──────────────────────────────────────────────────────────────
const BSlot = ({match:m, color, style={}}) => (
  <div style={{background:`${color}11`,border:`1px solid ${color}44`,borderRadius:8,padding:"9px 11px",...style}}>
    <div style={{fontSize:12,fontWeight:700,color,letterSpacing:".08em",marginBottom:4}}>{m.date} · {m.time}</div>
    <div style={{display:"flex",justifyContent:"space-between",gap:6}}>
      <div style={{flex:1,background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:4,padding:"5px 7px",fontSize:13,color:"#777",textAlign:"center"}}>TBD</div>
      <div style={{fontSize:12,fontWeight:700,color:"#444",display:"flex",alignItems:"center"}}>vs</div>
      <div style={{flex:1,background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:4,padding:"5px 7px",fontSize:13,color:"#777",textAlign:"center"}}>TBD</div>
    </div>
    <div style={{marginTop:5,fontSize:12,color:"#444"}}>🏟️ {m.venue}</div>
  </div>
);

// ── BREAKPOINT HOOK ───────────────────────────────────────────────────────────
function useBreakpoint() {
  const [w, setW] = useState(typeof window!=="undefined"?window.innerWidth:1280);
  useEffect(()=>{
    const fn=()=>setW(window.innerWidth);
    window.addEventListener("resize",fn);
    return ()=>window.removeEventListener("resize",fn);
  },[]);
  return { isMobile:w<640, isTablet:w>=640&&w<1024, isDesktop:w>=1024, w };
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const {isMobile,isTablet,isDesktop} = useBreakpoint();

  // ── Goal celebration state ──
  const [goalQueue, setGoalQueue] = useState([]); // queue of goal events
  const prevScoresRef = useRef({});               // {matchId: {homeScore, awayScore}}

  const [view, setView]           = useState("schedule");
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [premiumTier, setPremiumTier]     = useState(()=>checkPremium().tier);
  const [showPricing, setShowPricing]     = useState(false);
  const [pricingDefault, setPricingDefault] = useState("vip");

  const openPricing = useCallback((tier="vip")=>{
    setPricingDefault(tier);
    setShowPricing(true);
  },[]);
  const [month, setMonth]         = useState("2026-06");
  const [tz, setTz]               = useState("et");
  const [teamFilter, setTeamFilter] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("");
  const [hostFilter, setHostFilter] = useState("");
  const [lang, setLang]           = useState("es");
  const [favorite, setFavorite]   = useState("");
  const [liveScores, setLiveScores] = useState({});
  const [liveMinute, setLiveMinute] = useState({});
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [fetchStatus, setFetchStatus] = useState("idle");
  const [standings, setStandings] = useState(()=>{
    const s={};
    Object.entries(INIT_STANDINGS).forEach(([g,teams])=>{s[g]=teams.map(t=>({...t,pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0}));});
    return s;
  });
  const [scorers, setScorers]     = useState([]);
  const [scorersFetched, setScorersFetched] = useState(false);
  const [shareMatch, setShareMatch] = useState(null);
  const [venueModal, setVenueModal] = useState(null);
  const [news, setNews]           = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsFetched, setNewsFetched] = useState(false);
  const [predictView, setPredictView] = useState("pick");
  const [predictMatch, setPredictMatch] = useState(null);
  const [predictPick, setPredictPick] = useState(null);
  const [predictResult, setPredictResult] = useState(null);
  const [now, setNow]             = useState(new Date());
  const [nextRefresh, setNextRefresh] = useState(120);

  // Tick every second
  useEffect(()=>{ const t=setInterval(()=>setNow(new Date()),1000); return ()=>clearInterval(t); },[]);
  useEffect(()=>{ const t=setInterval(()=>setNextRefresh(p=>p<=1?120:p-1),1000); return ()=>clearInterval(t); },[]);

  // Live update sim
  useEffect(()=>{
    if(view!=="live") return;
    const t=setInterval(()=>{setLiveMinute(p=>{const n={...p};Object.keys(n).forEach(k=>{n[k]=Math.min((n[k]||0)+1,90);});return n;});setLastUpdate(new Date());},30000);
    return ()=>clearInterval(t);
  },[view]);

  // Countdown
  const nextMatch = useMemo(()=>{
    if(!favorite) return MATCHES.find(m=>m.date>="2026-06-11"&&!m.home.includes("°")&&m.home!=="TBD");
    return MATCHES.find(m=>(m.home===favorite||m.away===favorite)&&m.home!=="TBD")||null;
  },[favorite]);

  const countdown = useMemo(()=>{
    if(!nextMatch) return null;
    const etStr=nextMatch.et.replace("†","").trim();
    const parts=etStr.split(" ");
    const ampm=parts[1]; const [hS,mS]=parts[0].split(":");
    let h=parseInt(hS);
    if(ampm==="PM"&&h!==12) h+=12;
    if(ampm==="AM"&&h===12) h=0;
    const target=new Date(`${nextMatch.date}T${String(h).padStart(2,"0")}:${mS||"00"}:00`);
    const diff=target-now;
    if(diff<=0) return null;
    return {days:Math.floor(diff/86400000),hours:Math.floor((diff%86400000)/3600000),mins:Math.floor((diff%3600000)/60000),secs:Math.floor((diff%60000)/1000),match:nextMatch};
  },[nextMatch,now]);

  // API helper — proxy through /api/claude (serverless function)
  const callAPI = useCallback(async(prompt,onSuccess,onError)=>{
    try {
      const res=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt})});
      const data=await res.json();
      if(data.error){console.error("API error:",data.error);onError&&onError(data.error);return;}
      const text=(data.text||"").trim();
      if(!text){onError&&onError("Empty response");return;}
      onSuccess(JSON.parse(text));
    } catch(e){console.error("callAPI error",e);onError&&onError(e.message);}
  },[]);

  const fetchLiveScores = useCallback(async ()=>{
    setFetchStatus("fetching");
    try{
      const res = await fetch("/api/live");
      const data = await res.json();

      if(data.status==="pre_tournament"||!data.matches?.length){
        setFetchStatus("ok"); setLastUpdate(new Date()); return;
      }

      const map={};
      const newGoals=[];

      data.matches.forEach(s=>{
        // Intentar emparejar con MATCHES local por nombre de equipo (fuzzy)
        const match=MATCHES.find(m=>{
          const hHome=m.home.toLowerCase(), hAway=m.away.toLowerCase();
          const sHome=(s.home||"").toLowerCase(), sAway=(s.away||"").toLowerCase();
          return (hHome.includes(sHome.slice(0,5))||sHome.includes(hHome.slice(0,5)))&&
                 (hAway.includes(sAway.slice(0,5))||sAway.includes(hAway.slice(0,5)));
        });
        const id = match?.id || `fd_${s.fdId}`;
        const sc = {homeScore:s.homeScore??0, awayScore:s.awayScore??0, status:s.status, minute:s.minute, goals:s.goals||[]};
        map[id] = sc;

        // ── Detectar goles nuevos ──────────────────────────────
        const prev = prevScoresRef.current[id];
        if(!prev){ return; } // primer fetch, solo guardar baseline

        const homeDiff = (sc.homeScore||0) - (prev.homeScore||0);
        const awayDiff = (sc.awayScore||0) - (prev.awayScore||0);

        if(homeDiff > 0 || awayDiff > 0){
          // Buscar el/los goleador(es) nuevos comparando lista de goles
          const prevGoalCount = (prev.goals||[]).length;
          const newGoalEntries = (sc.goals||[]).slice(prevGoalCount); // los que no estaban antes

          if(newGoalEntries.length > 0){
            // Tenemos nombre del anotador
            newGoalEntries.forEach(g=>{
              newGoals.push({
                home:      match?.home || s.home,
                away:      match?.away || s.away,
                homeScore: sc.homeScore,
                awayScore: sc.awayScore,
                team:      g.team,
                scorer:    g.type==="OWN_GOAL" ? `${g.name} (A.P.)` : g.name,
                minute:    g.minute,
              });
            });
          } else {
            // No tenemos goleador detallado, usamos equipo por diferencia de score
            if(homeDiff > 0){
              newGoals.push({home:match?.home||s.home, away:match?.away||s.away, homeScore:sc.homeScore, awayScore:sc.awayScore, team:match?.home||s.home, scorer:null, minute:sc.minute});
            }
            if(awayDiff > 0){
              newGoals.push({home:match?.home||s.home, away:match?.away||s.away, homeScore:sc.homeScore, awayScore:sc.awayScore, team:match?.away||s.away, scorer:null, minute:sc.minute});
            }
          }
        }
      });

      // Guardar baseline para próxima comparación
      prevScoresRef.current = map;
      if(newGoals.length > 0) setGoalQueue(q=>[...q, ...newGoals]);
      if(Object.keys(map).length > 0) setLiveScores(map);
      setFetchStatus("ok"); setLastUpdate(new Date());

    } catch(e){
      console.error("fetchLiveScores:", e);
      setFetchStatus("error");
    }
  },[]);

  const fetchStandings = useCallback(()=>{
    callAPI(`Tabla de posiciones Mundial FIFA 2026, grupos A-L. Hoy: ${new Date().toLocaleDateString("es-ES")}. Solo JSON: {"A":[{t,pj,pg,pe,pp,gf,gc,pts}],...}. Sin markdown.`,(parsed)=>{
      const merged={};
      Object.entries(INIT_STANDINGS).forEach(([g,teams])=>{
        const upd=parsed[g]||[];
        merged[g]=teams.map(team=>{const live=upd.find(u=>u.t===team.t);return live?{...team,...live}:{...team,pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0};}).sort((a,b)=>b.pts-a.pts||(b.gf-b.gc)-(a.gf-a.gc)||b.gf-a.gf);
      });
      setStandings(merged);
    });
  },[callAPI]);

  const [scorersSource, setScorersSource] = useState(null);
  const [scorersCrossChecked, setScorersCrossChecked] = useState(false);
  const [scorersUpdatedAt, setScorersUpdatedAt] = useState(null);
  const [scorersLoading, setScorersLoading] = useState(false);

  // ── Reporte de fallas ──
  const [reportTypes, setReportTypes]   = useState([]);
  const [reportComment, setReportComment] = useState("");
  const [reportStatus, setReportStatus] = useState("idle"); // idle|sending|ok|error
  const REPORT_OPTIONS = [
    "Los scores en vivo no actualizan",
    "La predicción IA no responde",
    "La animación de gol no aparece",
    "Una bandera se ve incorrecta",
    "El calendario muestra info incorrecta",
    "Las noticias no cargan",
    "La quiniela tiene un error",
    "Problema con las sedes / fotos",
    "La app va lenta o se congela",
    "Otro problema",
  ];
  const toggleReportType = (opt) => setReportTypes(prev =>
    prev.includes(opt) ? prev.filter(t=>t!==opt) : [...prev, opt]
  );
  const submitReport = async () => {
    if(reportTypes.length===0 && !reportComment.trim()) return;
    setReportStatus("sending");
    try{
      const res = await fetch("/api/report",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          types:   reportTypes,
          comment: reportComment.trim(),
          page:    view,
          ua:      navigator.userAgent,
          ts:      new Date().toISOString(),
        }),
      });
      const data = await res.json();
      setReportStatus(data.ok ? "ok" : "error");
      if(data.ok){ setReportTypes([]); setReportComment(""); }
    }catch(e){
      setReportStatus("error");
    }
  };

  const fetchScorers = useCallback(async ()=>{
    const hoy=new Date().toISOString().split("T")[0];
    if(hoy<"2026-06-11"){setScorersFetched(true);return;}
    setScorersLoading(true);
    try{
      const res=await fetch("/api/scorers");
      const data=await res.json();
      if(data.status==="live"&&Array.isArray(data.scorers)&&data.scorers.length>0){
        setScorers(data.scorers);
        setScorersSource(data.source||null);
        setScorersCrossChecked(!!data.crossChecked);
        setScorersUpdatedAt(data.updatedAt||null);
      } else if(data.status==="pre_tournament"){
        // no hacer nada, la UI ya maneja este estado
      } else {
        setScorers([]);
        setScorersSource(data.errors?.join(" · ")||"Sin datos");
      }
      setScorersFetched(true);
    }catch(e){
      console.error("fetchScorers:",e);
      setScorersSource("Error de red");
      setScorersFetched(true);
    }finally{
      setScorersLoading(false);
    }
  },[]);

  const fetchNews = useCallback(()=>{
    setNewsLoading(true);
    callAPI(
      `Eres un periodista deportivo experto en el Mundial FIFA 2026. Hoy es ${new Date().toLocaleDateString("es-ES")}. Dame 8 titulares de noticias del Mundial 2026 en español (equipos, jugadores, partidos, sedes, curiosidades). Responde SOLO con JSON válido sin markdown: [{"title":"Titular aquí","source":"ESPN","summary":"Resumen de 2 oraciones.","url":null,"youtubeQuery":"busqueda youtube"}]`,
      (data)=>{if(Array.isArray(data)&&data.length>0){setNews(data);setNewsFetched(true);}setNewsLoading(false);},
      ()=>{setNewsLoading(false);}
    );
  },[callAPI]);

  const runPredictor = useCallback((match,pick)=>{
    // Gate on tier limits before calling API
    if (!canUseIa(premiumTier)) {
      const usage = getIaUsage(premiumTier);
      if (usage.mode === "daily") {
        openPricing("pro");
      } else {
        openPricing("vip");
      }
      return;
    }
    setPredictView("loading");
    const pickLabel=pick==="home"?match.home:pick==="away"?match.away:"Empate";
    callAPI(
      `Eres analista experto del Mundial FIFA 2026. Analiza: ${match.home} vs ${match.away} (Grupo ${match.group||match.phase}, ${match.date}, ${match.venue}). El usuario predice: ${pickLabel}. Responde SOLO con JSON válido sin markdown: {"homeProb":50,"drawProb":25,"awayProb":25,"factors":["factor1","factor2","factor3"],"homePlayer":"Nombre","awayPlayer":"Nombre","prediction":"Local gana","score":"2-1","userCorrect":true,"summary":"Análisis breve"}`,
      (data)=>{recordIaUse(premiumTier);setPredictResult(data);setPredictView("result");},
      (err)=>{console.error("Predictor error:",err);setPredictView("error");}
    );
  },[callAPI, premiumTier, openPricing]);

  // Auto-refresh (after fetch fns are defined)
  useEffect(()=>{
    const t=setInterval(()=>{if(new Date().toISOString().split("T")[0]>="2026-06-11") fetchLiveScores();},2*60*1000);
    return ()=>clearInterval(t);
  },[fetchLiveScores]);

  useEffect(()=>{
    const t=setInterval(()=>{if(new Date().toISOString().split("T")[0]>="2026-06-11"){fetchStandings();fetchScorers();}},10*60*1000);
    return ()=>clearInterval(t);
  },[fetchStandings,fetchScorers]);

  const filtered = useMemo(()=>MATCHES.filter(m=>{
    if(!m.date.startsWith(month)) return false;
    if(teamFilter&&m.home!==teamFilter&&m.away!==teamFilter) return false;
    if(phaseFilter&&m.phase!==phaseFilter) return false;
    if(hostFilter&&m.host!==hostFilter) return false;
    return true;
  }),[month,teamFilter,phaseFilter,hostFilter]);

  const byDay = useMemo(()=>{
    const map={};
    filtered.forEach(m=>{const d=m.date.split("-")[2];if(!map[d])map[d]=[];map[d].push(m);});
    return Object.entries(map).sort((a,b)=>+a[0]-+b[0]);
  },[filtered]);

  const todayStr = new Date().toISOString().split("T")[0];
  const liveMatches = MATCHES.filter(m=>liveScores[m.id]&&m.date===todayStr);
  const favoriteMatches = MATCHES.filter(m=>m.home===favorite||m.away===favorite);

  const pill=(active,color="#c9a84c")=>({padding:"5px 10px",borderRadius:6,border:"1px solid",borderColor:active?color:"rgba(255,255,255,.15)",background:active?`${color}33`:"rgba(255,255,255,.07)",color:active?"#fff":"#aaa",fontFamily:"inherit",fontSize:14,fontWeight:700,cursor:"pointer",transition:"all .2s"});
  const navBtn=(txt,icon,active,onClick)=>(
    <button onClick={onClick} style={{flex:"1 1 auto",padding:isMobile?"8px 4px":"10px 11px",border:"none",background:active?"rgba(201,168,76,.15)":"none",borderBottom:active?"3px solid #c9a84c":"3px solid transparent",color:active?"#ffd700":"#666",fontFamily:"inherit",fontWeight:700,fontSize:isMobile?10:13,letterSpacing:isMobile?".02em":".06em",cursor:"pointer",transition:"all .2s",textTransform:"uppercase",display:"flex",flexDirection:isMobile?"column":"row",alignItems:"center",justifyContent:"center",gap:isMobile?2:4,whiteSpace:"nowrap",minWidth:0}}>
      <span style={{fontSize:isMobile?16:13}}>{icon}</span>
      {!isMobile&&txt}
      {isMobile&&<span style={{fontSize:9,lineHeight:1.1,textAlign:"center"}}>{txt}</span>}
    </button>
  );

  // Dismiss top goal from queue
  const dismissGoal = useCallback(()=>{
    setGoalQueue(q=>q.slice(1));
  },[]);

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0f1f3d,#162b4f 45%,#0c1f14)",fontFamily:"'Oswald','Impact',sans-serif",color:"#fff"}}>

      {/* ── CSS animations (injected once) ── */}
      <style>{GOAL_CSS}</style>

      {/* ── Goal celebration overlay ── */}
      {goalQueue.length>0&&(
        <div onClick={dismissGoal} style={{cursor:"pointer"}}>
          <GoalCelebration event={goalQueue[0]} onDone={dismissGoal}/>
        </div>
      )}

      {/* ── Pricing modal global ── */}
      {showPricing&&(
        <PricingModal
          defaultTier={pricingDefault}
          onClose={()=>setShowPricing(false)}
          onActivate={(tier)=>{ setPremiumTier(tier); setShowPricing(false); }}
        />
      )}

      {/* ── Ko-fi support button ── */}
      <KofiButton />

      {shareMatch&&<ShareCard match={shareMatch} tz={tz} lang={lang} onClose={()=>setShareMatch(null)}/>}
      {venueModal&&<VenueModal venueName={venueModal} onClose={()=>setVenueModal(null)}/>}

      {/* HEADER */}
      <div style={{position:"sticky",top:0,zIndex:30,background:"rgba(12,24,52,.98)",backdropFilter:"blur(20px)",borderBottom:"2px solid #c9a84c"}}>
        <div style={{maxWidth:"100%",margin:"0 auto",padding:isMobile?"6px 10px 0":"10px 16px 0"}}>

          {/* ── Mobile layout: título arriba, controles abajo ── */}
          {isMobile?(
            <>
              {/* Fila 1: logo + título + badge */}
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <img src="/logo.png" alt="Mundial 2026" style={{width:44,height:44,borderRadius:8,objectFit:"cover",flexShrink:0}}/>
                <div style={{minWidth:0,flex:1}}>
                  <div style={{fontSize:"clamp(17px,5.5vw,22px)",fontWeight:900,letterSpacing:".1em",background:"linear-gradient(90deg,#ffd700,#c9a84c,#fff)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1}}>MUNDIAL 2026</div>
                  {/* Subtítulo en 2 líneas si no cabe — sin cortar */}
                  <div style={{fontSize:"clamp(9px,2.5vw,11px)",color:"#c9a84c",letterSpacing:".04em",marginTop:3,lineHeight:1.4}}>
                    <span>GUÍA DEL FAN LATINO · 🇺🇸 EE.UU. · 🇲🇽 México · 🇨🇦 Canadá</span>
                    <span style={{display:"block"}}>11 Jun – 19 Jul 2026</span>
                  </div>
                </div>
                <PremiumBadge tier={premiumTier} onClick={()=>openPricing(premiumTier==="free"?"vip":premiumTier)} />
              </div>
              {/* Fila 2: ZONA HORARIA */}
              <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:4}}>
                <span style={{fontSize:11,color:"#888",letterSpacing:".06em",flexShrink:0}}>🕐 HORA</span>
                <div style={{display:"flex",gap:2}}>{TIMEZONES.map(t=><button key={t.key} onClick={()=>setTz(t.key)} style={{...pill(tz===t.key),fontSize:11,padding:"3px 8px"}} title={t.full}>{t.label}</button>)}</div>
              </div>
              {/* Fila 3: VER EN */}
              <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:5}}>
                <span style={{fontSize:11,color:"#888",letterSpacing:".06em",flexShrink:0}}>📺 VER EN</span>
                <div style={{display:"flex",gap:2}}>
                  <button onClick={()=>setLang("es")} style={{...pill(lang==="es","#d4001a"),fontSize:11,padding:"3px 9px",display:"flex",alignItems:"center",gap:3}}><span>🇪🇸</span><span>Español</span></button>
                  <button onClick={()=>setLang("en")} style={{...pill(lang==="en","#003da5"),fontSize:11,padding:"3px 9px",display:"flex",alignItems:"center",gap:3}}><span>🇺🇸</span><span>English</span></button>
                </div>
              </div>
            </>
          ):(
            /* ── Desktop/Tablet layout: todo en una fila ── */
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <img src="/logo.png" alt="Mundial 2026" style={{width:52,height:52,borderRadius:10,objectFit:"cover",flexShrink:0}}/>
                <div>
                  <div style={{fontSize:"clamp(16px,3.2vw,26px)",fontWeight:900,letterSpacing:".12em",background:"linear-gradient(90deg,#ffd700,#c9a84c,#fff)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1}}>MUNDIAL 2026</div>
                  <div style={{fontSize:12,color:"#c9a84c",letterSpacing:".15em"}}>GUÍA DEL FAN LATINO · 🇺🇸 EE.UU. · 🇲🇽 México · 🇨🇦 Canadá · 11 Jun – 19 Jul</div>
                </div>
                <PremiumBadge tier={premiumTier} onClick={()=>openPricing(premiumTier==="free"?"vip":premiumTier)} />
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:12,color:"#555",letterSpacing:".1em"}}>🕐 ZONA HORARIA</span>
                  <div style={{display:"flex",gap:2}}>{TIMEZONES.map(t=><button key={t.key} onClick={()=>setTz(t.key)} style={{...pill(tz===t.key),fontSize:13,padding:"4px 8px"}} title={t.full}>{t.label}</button>)}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:12,color:"#555",letterSpacing:".1em"}}>📺 VER EN</span>
                  <div style={{display:"flex",gap:2}}>
                    <button onClick={()=>setLang("es")} style={{...pill(lang==="es","#d4001a"),fontSize:13,padding:"4px 9px",display:"flex",alignItems:"center",gap:4}}><span>🇪🇸</span><span>Español</span></button>
                    <button onClick={()=>setLang("en")} style={{...pill(lang==="en","#003da5"),fontSize:13,padding:"4px 9px",display:"flex",alignItems:"center",gap:4}}><span>🇺🇸</span><span>English</span></button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:0,borderTop:"1px solid rgba(255,255,255,.07)"}}>

            {navBtn("Calendario","📅",view==="schedule",()=>setView("schedule"))}
            {navBtn("En Vivo","🔴",view==="live",()=>setView("live"))}
            {navBtn("Posiciones","📊",view==="standings",()=>{setView("standings");fetchStandings();})}
            {navBtn("Goleadores","⚽",view==="scorers",()=>{setView("scorers");if(!scorersFetched)fetchScorers();})}
            {navBtn("Predicción IA","🔮",view==="predictor",()=>setView("predictor"))}
            {navBtn("Quiniela","🎯",view==="quiniela",()=>setView("quiniela"))}
            {navBtn("Noticias","📰",view==="news",()=>{setView("news");if(!newsFetched)fetchNews();})}
            {navBtn("Sedes","🏟️",view==="venues",()=>setView("venues"))}
            {navBtn("Turista","🗺️",view==="tourist",()=>setView("tourist"))}
            {navBtn("Bracket","🏆",view==="bracket",()=>setView("bracket"))}
            {navBtn("Favoritos","⭐",view==="compact",()=>setView("compact"))}
            {navBtn("Ayuda","❓",view==="help",()=>setView("help"))}
          </div>
        </div>
      </div>

      {/* COUNTDOWN */}
      {countdown&&(
        <div style={{background:"rgba(201,168,76,.08)",borderBottom:"1px solid rgba(201,168,76,.2)",padding:"7px 16px"}}>
          <div style={{maxWidth:"100%",margin:"0 auto",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
            <div style={{fontSize:12,color:"#c9a84c",letterSpacing:".12em",fontWeight:700}}>{favorite?`⏱ PRÓXIMO · ${favorite.toUpperCase()}`:"⏱ PRÓXIMO PARTIDO"}</div>
            <div style={{display:"flex",alignItems:"center",gap:7}}>
              <Flag team={countdown.match.home} size={20}/>
              <span style={{fontSize:14,color:"#fff",fontWeight:700}}>{countdown.match.home}</span>
              <span style={{fontSize:12,color:"#555"}}>vs</span>
              <span style={{fontSize:14,color:"#fff",fontWeight:700}}>{countdown.match.away}</span>
              <Flag team={countdown.match.away} size={20}/>
            </div>
            <div style={{display:"flex",gap:10,marginLeft:"auto"}}>
              {[{v:countdown.days,l:"días"},{v:countdown.hours,l:"hrs"},{v:countdown.mins,l:"min"},{v:countdown.secs,l:"seg"}].map(({v,l})=>(
                <div key={l} style={{textAlign:"center",minWidth:30}}>
                  <div style={{fontSize:16,fontWeight:900,color:"#ffd700",lineHeight:1}}>{String(v).padStart(2,"0")}</div>
                  <div style={{fontSize:11,color:"#555",letterSpacing:".1em"}}>{l.toUpperCase()}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:12,color:"#555"}}>📅 {countdown.match.date} · {countdown.match[tz]} {TIMEZONES.find(t=>t.key===tz)?.label} · {countdown.match.city}</div>
          </div>
        </div>
      )}

      {/* ── STANDINGS ── */}
      {view==="standings"&&(
        <div style={{maxWidth:"100%",margin:"20px auto",padding:"0 16px 60px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
            <div><div style={{fontSize:18,fontWeight:800,color:"#fff"}}>📊 TABLA DE POSICIONES</div><div style={{fontSize:14,color:"#555",marginTop:2}}>Fase de grupos · 12 grupos</div></div>
            <button onClick={fetchStandings} style={{...pill(false),padding:"8px 14px",borderColor:"#1a6eb5",color:"#6aadff"}}>🔄 Actualizar</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":isTablet?"repeat(2,1fr)":"repeat(4,1fr)",gap:12}}>
            {Object.entries(standings).map(([grp,teams])=>(
              <div key={grp} style={{background:"rgba(8,40,80,.85)",border:"1px solid #1a6eb544",borderRadius:12,overflow:"hidden"}}>
                <div style={{background:"#1a6eb5",padding:"7px 12px",fontSize:14,fontWeight:800,letterSpacing:".15em",color:"#fff"}}>GRUPO {grp}</div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead><tr style={{borderBottom:"1px solid rgba(255,255,255,.08)"}}>
                    {["#","Equipo","PJ","PG","PE","PP","GF","GC","Pts"].map(h=><th key={h} style={{padding:"6px 8px",color:"#888",fontWeight:700,textAlign:h==="Equipo"?"left":"center",fontSize:12}}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {teams.map((t,i)=>(
                      <tr key={t.t} style={{borderBottom:"1px solid rgba(255,255,255,.04)",background:t.t===favorite?"rgba(201,168,76,.08)":"transparent"}}>
                        <td style={{padding:"6px",textAlign:"center"}}><div style={{width:16,height:16,borderRadius:3,background:i<2?"#00a651":i===2?"#ff7a00":"transparent",border:i<2||i===2?"none":"1px solid #333",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"#fff",margin:"0 auto"}}>{i+1}</div></td>
                        <td style={{padding:"6px 8px"}}><div style={{display:"flex",alignItems:"center",gap:5}}><Flag team={t.t} size={20}/><span style={{color:t.t===favorite?"#ffd700":"#ddd",fontWeight:t.t===favorite?700:400,fontSize:16,overflow:"hidden",textOverflow:"ellipsis",maxWidth:120}}>{t.t}</span></div></td>
                        {[t.pj,t.pg,t.pe,t.pp,t.gf,t.gc].map((v,j)=><td key={j} style={{padding:"7px",textAlign:"center",color:"#aaa",fontSize:13}}>{v}</td>)}
                        <td style={{padding:"7px",textAlign:"center",fontWeight:900,color:t.pts>0?"#ffd700":"#555",fontSize:15}}>{t.pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
          <div style={{marginTop:12,display:"flex",gap:12,flexWrap:"wrap",fontSize:13,color:"#555"}}>
            <span><span style={{display:"inline-block",width:10,height:10,background:"#00a651",borderRadius:2,marginRight:4,verticalAlign:"middle"}}></span>Clasifican directamente</span>
            <span><span style={{display:"inline-block",width:10,height:10,background:"#ff7a00",borderRadius:2,marginRight:4,verticalAlign:"middle"}}></span>Posible 3° mejor</span>
          </div>
        </div>
      )}

      {/* ── SCORERS ── */}
      {view==="scorers"&&(()=>{
        const hoy=new Date().toISOString().split("T")[0];
        const torneoIniciado=hoy>="2026-06-11";
        return(
        <div style={{maxWidth:700,margin:"20px auto",padding:"0 16px 60px"}}>
          {/* Cabecera */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4,flexWrap:"wrap",gap:10}}>
            <div>
              <div style={{fontSize:18,fontWeight:800,color:"#fff"}}>
                ⚽ {torneoIniciado?"TOP GOLEADORES":"CANDIDATOS · BOTA DE ORO"}
              </div>
              <div style={{fontSize:13,color:"#556",marginTop:2}}>
                {torneoIniciado
                  ? "Máximos anotadores del torneo · Datos en vivo"
                  : "Favoritos editoriales antes del inicio del torneo"}
              </div>
            </div>
            {torneoIniciado&&(
              <button onClick={fetchScorers} style={{...pill(false),padding:"8px 14px",borderColor:"#c9a84c",color:"#ffd700"}}>🔄 Actualizar</button>
            )}
          </div>

          {/* Banner pre-torneo */}
          {!torneoIniciado&&(
            <div style={{background:"rgba(201,168,76,.1)",border:"1px solid #c9a84c55",borderRadius:10,padding:"10px 14px",marginBottom:16,display:"flex",alignItems:"flex-start",gap:10}}>
              <span style={{fontSize:20,flexShrink:0}}>📅</span>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:"#ffd700"}}>El torneo comienza el 11 de junio de 2026</div>
                <div style={{fontSize:12,color:"#999",marginTop:3}}>
                  Los goleadores reales se mostrarán cuando arranque el Mundial. Lo que ves abajo es una selección editorial — no son estadísticas del torneo.
                </div>
              </div>
            </div>
          )}

          {/* Barra de fuente + validación cruzada (post-inicio) */}
          {torneoIniciado&&scorersFetched&&scorersSource&&(
            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:10,marginTop:8}}>
              <span style={{fontSize:11,color:"#999",letterSpacing:".05em"}}>FUENTE:</span>
              <span style={{fontSize:11,fontWeight:700,color:"#6aadff",background:"rgba(106,173,255,.1)",borderRadius:4,padding:"2px 7px"}}>{scorersSource}</span>
              {scorersCrossChecked&&(
                <span style={{fontSize:11,fontWeight:700,color:"#4a7",background:"rgba(68,170,100,.1)",borderRadius:4,padding:"2px 7px"}}>✓ Cruzado con ESPN</span>
              )}
              {scorersUpdatedAt&&(
                <span style={{fontSize:11,color:"#444",marginLeft:"auto"}}>
                  Actualizado {new Date(scorersUpdatedAt).toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})}
                </span>
              )}
            </div>
          )}

          {/* Lista: datos reales (post-inicio) */}
          {torneoIniciado&&(
            <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:4}}>
              {scorersLoading&&(
                <div style={{textAlign:"center",padding:"30px 0",color:"#c9a84c",fontSize:15}}>
                  ⏳ Consultando fuentes oficiales…
                </div>
              )}
              {!scorersLoading&&scorers.length===0&&scorersFetched&&(
                <div style={{color:"#555",fontSize:14,textAlign:"center",padding:"30px 0"}}>
                  Sin datos disponibles. Pulsa 🔄 Actualizar.
                </div>
              )}
              {scorers.map((sc,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,background:"rgba(8,40,80,.8)",border:`1px solid ${sc.verified?"#4a733355":"#1a6eb533"}`,borderRadius:12,padding:"12px 14px",position:"relative"}}>
                  {sc.verified&&(
                    <span title="Dato confirmado en ESPN" style={{position:"absolute",top:7,right:9,fontSize:10,color:"#4a7",letterSpacing:".05em"}}>✓ ESPN</span>
                  )}
                  <div style={{width:30,height:30,borderRadius:7,background:i===0?"#c9a84c":i===1?"#888":i===2?"#7a4a00":"rgba(255,255,255,.05)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:16,color:i<3?"#fff":"#555",flexShrink:0}}>{i+1}</div>
                  <Flag team={sc.team} size={28}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:16,fontWeight:700,color:"#fff"}}>{sc.name}</div>
                    <div style={{fontSize:13,color:"#555"}}>{sc.team}</div>
                  </div>
                  <div style={{textAlign:"center",minWidth:44}}>
                    <div style={{fontSize:22,fontWeight:900,color:"#ffd700",lineHeight:1}}>{sc.goals}</div>
                    <div style={{fontSize:11,color:"#555",letterSpacing:".1em"}}>GOLES</div>
                  </div>
                  {sc.assists!=null&&<div style={{textAlign:"center",minWidth:36}}>
                    <div style={{fontSize:16,fontWeight:700,color:"#888",lineHeight:1}}>{sc.assists}</div>
                    <div style={{fontSize:11,color:"#444",letterSpacing:".1em"}}>ASIST.</div>
                  </div>}
                  {sc.penalties!=null&&sc.penalties>0&&<div style={{textAlign:"center",minWidth:30}}>
                    <div style={{fontSize:14,fontWeight:700,color:"#a55",lineHeight:1}}>{sc.penalties}</div>
                    <div style={{fontSize:10,color:"#444",letterSpacing:".05em"}}>PEN.</div>
                  </div>}
                </div>
              ))}
            </div>
          )}

          {/* Lista editorial (pre-inicio) */}
          {!torneoIniciado&&(
            <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:4}}>
              {GOLDEN_BOOT_CANDIDATES.map((c,i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,background:"rgba(8,40,80,.8)",border:"1px solid #1a6eb533",borderRadius:12,padding:"12px 14px"}}>
                  <div style={{width:28,height:28,borderRadius:6,background:"rgba(255,255,255,.05)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:14,color:"#556",flexShrink:0}}>{i+1}</div>
                  <Flag team={c.team} size={28}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                      <span style={{fontSize:16,fontWeight:700,color:"#fff"}}>{c.name}</span>
                      <span style={{fontSize:11,color:"#888",background:"rgba(255,255,255,.06)",borderRadius:4,padding:"2px 6px",letterSpacing:".05em"}}>{c.pos}</span>
                    </div>
                    <div style={{fontSize:12,color:"#4a7",marginTop:2}}>{c.club} · {c.team}</div>
                    <div style={{fontSize:12,color:"#556",marginTop:4,lineHeight:1.4}}>{c.fact}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Disclaimer */}
          <div style={{marginTop:16,padding:"10px 14px",background:"rgba(255,255,255,.03)",borderRadius:8,borderLeft:"3px solid #333"}}>
            <div style={{fontSize:12,color:"#556",lineHeight:1.5}}>
              {torneoIniciado
                ? "📡 Datos obtenidos de football-data.org (fuente oficial FIFA) y validados contra ESPN. Los penaltis se contabilizan dentro de los goles totales. Para cifras oficiales: "
                : "ℹ️ Esta selección es editorial y no representa estadísticas del torneo. Los goleadores reales aparecerán al inicio del torneo (11 jun). Para información oficial: "}
              <a href="https://www.fifa.com/fifaplus/es/tournaments/mens/worldcup/canadamexicousa2026" target="_blank" rel="noopener noreferrer" style={{color:"#6aadff",textDecoration:"underline"}}>FIFA.com</a>
              {torneoIniciado&&<>{" · "}<a href="https://www.espn.com/soccer/competition/_/id/FIFA.WORLD_Q.UEFA" target="_blank" rel="noopener noreferrer" style={{color:"#6aadff",textDecoration:"underline"}}>ESPN</a></>}.
            </div>
          </div>
        </div>
        );
      })()}

      {/* ── PREDICCIÓN IA ── */}
      {view==="predictor"&&(
        <div style={{maxWidth:900,margin:"20px auto",padding:"0 16px 60px"}}>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:18,fontWeight:800,color:"#fff"}}>🔮 PREDICCIÓN CON IA</div>
            <div style={{fontSize:14,color:"#555",marginTop:2}}>Elige un partido, haz tu predicción y Claude la analiza</div>
          </div>
          {predictView==="result"&&(
            <button onClick={()=>{setPredictView("pick");setPredictMatch(null);setPredictPick(null);setPredictResult(null);}} style={{display:"flex",alignItems:"center",gap:6,marginBottom:14,padding:"8px 14px",borderRadius:8,border:"1px solid #1a6eb5",background:"rgba(26,110,181,.15)",color:"#6aadff",fontFamily:"inherit",fontSize:15,fontWeight:700,cursor:"pointer"}}>← Hacer otra predicción</button>
          )}
          {predictView==="loading"&&(
            <button onClick={()=>{setPredictView("pick");setPredictMatch(null);setPredictPick(null);}} style={{display:"flex",alignItems:"center",gap:6,marginBottom:14,padding:"8px 14px",borderRadius:8,border:"1px solid #555",background:"rgba(255,255,255,.05)",color:"#888",fontFamily:"inherit",fontSize:15,fontWeight:700,cursor:"pointer"}}>← Cancelar</button>
          )}
          {predictView==="result"&&predictResult&&predictMatch?(
            <div>
              <div style={{background:PHASE_STYLES[predictMatch.phase]?.bg||"rgba(8,40,80,.88)",border:`1px solid ${PHASE_STYLES[predictMatch.phase]?.border||"#1a6eb5"}`,borderRadius:14,padding:"14px",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}><Flag team={predictMatch.home} size={38}/><span style={{fontSize:14,fontWeight:800,color:"#fff"}}>{predictMatch.home}</span></div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:14,color:"#c9a84c",fontWeight:700}}>TU PICK: {predictPick==="home"?predictMatch.home:predictPick==="away"?predictMatch.away:"EMPATE"}</div>
                  <div style={{fontSize:17,fontWeight:900,color:predictResult.userCorrect?"#00a651":"#ff7a00",marginTop:3}}>{predictResult.userCorrect?"✅ ¡Buena pick!":"🤔 Puede sorprender"}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:14,fontWeight:800,color:"#fff"}}>{predictMatch.away}</span><Flag team={predictMatch.away} size={38}/></div>
              </div>
              <div style={{background:"rgba(8,40,80,.6)",border:"1px solid #1a6eb533",borderRadius:12,padding:"14px",marginBottom:12}}>
                <div style={{fontSize:13,fontWeight:700,color:"#888",letterSpacing:".1em",marginBottom:10}}>PROBABILIDADES</div>
                {[{label:predictMatch.home,prob:predictResult.homeProb,color:"#1a6eb5",flag:predictMatch.home},{label:"Empate",prob:predictResult.drawProb,color:"#888",flag:null},{label:predictMatch.away,prob:predictResult.awayProb,color:"#c9a84c",flag:predictMatch.away}].map(({label,prob,color,flag})=>(
                  <div key={label} style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                      <div style={{display:"flex",alignItems:"center",gap:7}}>
                        {flag?<Flag team={flag} size={20}/>:<span style={{fontSize:16}}>🤝</span>}
                        <span style={{fontSize:14,color:"#ccc"}}>{label}</span>
                      </div>
                      <span style={{fontSize:15,fontWeight:800,color}}>{prob}%</span>
                    </div>
                    <div style={{height:7,background:"rgba(255,255,255,.08)",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${prob}%`,background:color,borderRadius:4}}/></div>
                  </div>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:10,marginBottom:12}}>
                <div style={{background:"rgba(201,168,76,.1)",border:"1px solid #c9a84c33",borderRadius:12,padding:"13px",textAlign:"center"}}>
                  <div style={{fontSize:13,color:"#c9a84c",letterSpacing:".1em",marginBottom:5}}>PREDICCIÓN IA</div>
                  <div style={{fontSize:26,fontWeight:900,color:"#ffd700"}}>{predictResult.score||"1-0"}</div>
                  <div style={{fontSize:14,color:"#888",marginTop:3}}>{predictResult.prediction}</div>
                </div>
                <div style={{background:"rgba(8,40,80,.6)",border:"1px solid #1a6eb533",borderRadius:12,padding:"13px"}}>
                  <div style={{fontSize:13,color:"#888",letterSpacing:".1em",marginBottom:8}}>JUGADORES CLAVE</div>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:7}}><Flag team={predictMatch.home} size={20}/><span style={{fontSize:14,color:"#fff",fontWeight:600}}>{predictResult.homePlayer}</span></div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}><Flag team={predictMatch.away} size={20}/><span style={{fontSize:14,color:"#fff",fontWeight:600}}>{predictResult.awayPlayer}</span></div>
                </div>
              </div>
              <div style={{background:"rgba(8,40,80,.6)",border:"1px solid #1a6eb533",borderRadius:12,padding:"13px",marginBottom:12}}>
                <div style={{fontSize:13,color:"#888",letterSpacing:".1em",marginBottom:8}}>FACTORES CLAVE</div>
                {(predictResult.factors||[]).map((f,i)=><div key={i} style={{display:"flex",gap:7,marginBottom:6}}><span style={{color:"#c9a84c",fontWeight:800,fontSize:15,flexShrink:0}}>{i+1}.</span><span style={{fontSize:15,color:"#ccc",lineHeight:1.5}}>{f}</span></div>)}
                {predictResult.summary&&<div style={{marginTop:8,paddingTop:8,borderTop:"1px solid rgba(255,255,255,.08)",fontSize:15,color:"#aaa",lineHeight:1.6,fontStyle:"italic"}}>"{predictResult.summary}"</div>}
              </div>
              <button onClick={()=>predictMatch&&setShareMatch(predictMatch)} style={{width:"100%",padding:"10px",borderRadius:8,border:"1px solid #c9a84c",background:"rgba(201,168,76,.15)",color:"#ffd700",fontFamily:"inherit",fontSize:15,fontWeight:700,cursor:"pointer"}}>📤 Compartir partido</button>
            </div>
          ):predictView==="loading"?(
            <div style={{textAlign:"center",padding:"60px 20px"}}>
              <div style={{fontSize:48,marginBottom:14}}>🔮</div>
              <div style={{fontSize:14,color:"#c9a84c",fontWeight:700,letterSpacing:".1em",marginBottom:6}}>ANALIZANDO CON IA...</div>
              <div style={{fontSize:15,color:"#555"}}>Claude evalúa estadísticas, forma y contexto del partido</div>
            </div>
          ):predictView==="error"?(
            <div style={{textAlign:"center",padding:"60px 20px"}}>
              <div style={{fontSize:48,marginBottom:14}}>⚠️</div>
              <div style={{fontSize:16,color:"#ff7a00",fontWeight:700,marginBottom:8}}>Error al conectar con la IA</div>
              <div style={{fontSize:14,color:"#555",marginBottom:20}}>Verifica tu conexión e intenta de nuevo</div>
              <button onClick={()=>{setPredictView("pick");setPredictMatch(null);setPredictPick(null);}} style={{padding:"12px 24px",borderRadius:10,border:"1px solid #c9a84c",background:"rgba(201,168,76,.15)",color:"#ffd700",fontFamily:"inherit",fontSize:14,fontWeight:700,cursor:"pointer"}}>← Intentar de nuevo</button>
            </div>
          ):(
            <div>
              <div style={{fontSize:15,color:"#888",marginBottom:12}}>Selecciona un partido de la fase de grupos:</div>
              <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(auto-fill,minmax(255px,1fr))",gap:9,maxHeight:460,overflowY:"auto",paddingRight:4}}>
                {MATCHES.filter(m=>m.phase==="Grupos"&&m.home!=="TBD"&&!m.home.includes("°")).map(m=>{
                  const isSelected=predictMatch?.id===m.id;
                  return (
                    <div key={m.id} onClick={()=>{setPredictMatch(m);setPredictPick(null);}} style={{background:isSelected?"rgba(201,168,76,.12)":"rgba(8,40,80,.88)",border:`1px solid ${isSelected?"#c9a84c":"#1a6eb544"}`,borderRadius:10,padding:"9px 11px",cursor:"pointer",transition:"all .2s"}}>
                      <div style={{fontSize:12,color:"#555",marginBottom:5}}>Grupo {m.group} · {m.date} · {m[tz]} {TIMEZONES.find(t=>t.key===tz)?.label}</div>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                        <div style={{display:"flex",alignItems:"center",gap:5}}><Flag team={m.home} size={22}/><span style={{fontSize:14,fontWeight:700,color:"#fff"}}>{m.home}</span></div>
                        <span style={{fontSize:12,color:"#444",padding:"0 5px"}}>vs</span>
                        <div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:14,fontWeight:700,color:"#fff"}}>{m.away}</span><Flag team={m.away} size={22}/></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {predictMatch&&(
                <div style={{marginTop:18,background:"rgba(8,40,80,.8)",border:"1px solid #1a6eb5",borderRadius:14,padding:"16px"}}>
                  <div style={{fontSize:15,color:"#888",marginBottom:12,letterSpacing:".08em"}}>TU PREDICCIÓN: {predictMatch.home.toUpperCase()} vs {predictMatch.away.toUpperCase()}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
                    {[{key:"home",label:predictMatch.home,flag:predictMatch.home,color:"#1a6eb5"},{key:"draw",label:"Empate",flag:null,color:"#888"},{key:"away",label:predictMatch.away,flag:predictMatch.away,color:"#c9a84c"}].map(({key,label,flag,color})=>(
                      <button key={key} onClick={()=>setPredictPick(key)} style={{padding:"12px 16px",borderRadius:10,border:`2px solid ${predictPick===key?color:color+"44"}`,background:predictPick===key?`${color}22`:"rgba(255,255,255,.04)",cursor:"pointer",fontFamily:"inherit",transition:"all .2s",display:"flex",alignItems:"center",gap:12,width:"100%"}}>
                        {flag?<div style={{flexShrink:0}}><Flag team={flag} size={28}/></div>:<span style={{fontSize:22,flexShrink:0}}>🤝</span>}
                        <span style={{fontSize:16,fontWeight:700,color:predictPick===key?color:"#aaa",textAlign:"left"}}>{flag?`🏆 Gana ${label}`:label}</span>
                        {predictPick===key&&<span style={{marginLeft:"auto",fontSize:16}}>✓</span>}
                      </button>
                    ))}
                  </div>
                  <button onClick={()=>predictPick&&runPredictor(predictMatch,predictPick)} disabled={!predictPick} style={{width:"100%",padding:"13px",borderRadius:10,border:"none",background:predictPick?"linear-gradient(90deg,#c9a84c,#ffd700)":"rgba(255,255,255,.05)",color:predictPick?"#000":"#444",fontFamily:"inherit",fontSize:16,fontWeight:900,cursor:predictPick?"pointer":"not-allowed",letterSpacing:".06em"}}>
                    {predictPick?"🔮 ANALIZAR CON CLAUDE IA":"← Primero elige tu predicción"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── QUINIELA ── */}
      {view==="quiniela"&&(
        <div style={{maxWidth:700,margin:"20px auto",padding:"0 16px 60px"}}>
          <QuinielaSystem tz={tz} onShowPricing={openPricing} premiumTier={premiumTier}/>
        </div>
      )}

      {/* ── NEWS ── */}
      {view==="news"&&(
        <div style={{maxWidth:900,margin:"20px auto",padding:"0 16px 60px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
            <div><div style={{fontSize:18,fontWeight:800,color:"#fff"}}>📰 NOTICIAS EN ESPAÑOL</div><div style={{fontSize:14,color:"#555",marginTop:2}}>Titulares del Mundial 2026 · Actualizados por IA</div></div>
            <button onClick={fetchNews} style={{...pill(false),padding:"8px 14px",borderColor:"#c9a84c",color:"#ffd700"}}>{newsLoading?"⏳ Cargando...":"🔄 Actualizar"}</button>
          </div>
          {newsLoading&&!newsFetched&&<div style={{textAlign:"center",padding:"60px 20px"}}><div style={{fontSize:40,marginBottom:12}}>📰</div><div style={{fontSize:16,color:"#c9a84c",fontWeight:700}}>Buscando noticias con IA...</div></div>}
          {!newsLoading&&!newsFetched&&<div style={{textAlign:"center",padding:"60px 20px"}}><div style={{fontSize:40,marginBottom:12}}>📰</div><div style={{fontSize:16,color:"#555"}}>Pulsa "Actualizar" para cargar los titulares más recientes</div></div>}
          {newsFetched&&(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {news.map((n,i)=>(
                <div key={i} style={{background:"rgba(10,30,65,.8)",border:"1px solid #1a6eb533",borderRadius:12,padding:"14px 16px"}}>
                  <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                    <div style={{width:34,height:34,borderRadius:7,background:"#1a6eb5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>📰</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:700,color:"#fff",lineHeight:1.4,marginBottom:4}}>{n.title}</div>
                      <div style={{fontSize:14,color:"#777",lineHeight:1.5,marginBottom:8}}>{n.summary}</div>
                      <div style={{display:"flex",gap:7,alignItems:"center",flexWrap:"wrap"}}>
                        <span style={{fontSize:13,color:"#c9a84c",background:"rgba(201,168,76,.15)",padding:"2px 8px",borderRadius:4,fontWeight:600}}>{n.source}</span>
                        {n.url&&<a href={n.url} target="_blank" rel="noopener noreferrer" style={{fontSize:13,color:"#6aadff",background:"rgba(26,110,181,.15)",padding:"2px 8px",borderRadius:4,textDecoration:"none",fontWeight:600,border:"1px solid #1a6eb544"}}>🔗 Leer artículo</a>}
                        <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent((n.youtubeQuery||n.title)+" resumen")}`} target="_blank" rel="noopener noreferrer" style={{fontSize:13,color:"#ff6666",background:"rgba(255,0,0,.12)",padding:"2px 8px",borderRadius:4,textDecoration:"none",fontWeight:600,border:"1px solid #ff000044"}}>▶️ Ver resumen</a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── VENUES ── */}
      {view==="venues"&&(
        <div style={{maxWidth:"100%",margin:"20px auto",padding:"0 16px 60px"}}>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:18,fontWeight:800,color:"#fff"}}>🏟️ SEDES DEL MUNDIAL 2026</div>
            <div style={{fontSize:14,color:"#555",marginTop:2}}>16 estadios · 3 países · Toca cada sede para más información</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":isTablet?"repeat(2,1fr)":"repeat(4,1fr)",gap:16}}>
            {Object.entries(VENUES).map(([name,v])=>{
              const hostInfo=HOST_FILTERS.find(h=>h.key===v.host);
              return (
                <div key={name} onClick={()=>setVenueModal(name)} style={{background:"rgba(10,30,65,.8)",border:`1px solid ${v.color}55`,borderRadius:14,overflow:"hidden",cursor:"pointer",transition:"all .25s"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-4px)"} onMouseLeave={e=>e.currentTarget.style.transform="none"}>
                  <div style={{height:190,overflow:"hidden",background:"#0a1628",position:"relative"}}>
                    <img src={v.img} alt={name} style={{width:"100%",height:"100%",objectFit:"cover",opacity:.85}} onError={e=>{e.target.style.display="none";}}/>
                    <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(8,20,55,.95) 0%,transparent 50%)"}}/>
                    {hostInfo&&<span style={{position:"absolute",top:10,left:10,fontSize:12,background:`${hostInfo.color}dd`,color:"#fff",padding:"3px 8px",borderRadius:5,fontWeight:700}}>{hostInfo.label}</span>}
                    <div style={{position:"absolute",bottom:12,left:14,right:14}}>
                      <div style={{fontSize:17,fontWeight:800,color:"#fff",lineHeight:1.2,textShadow:"0 1px 6px rgba(0,0,0,.9)"}}>{name}</div>
                      <div style={{fontSize:13,color:"#ddd",marginTop:3,textShadow:"0 1px 4px rgba(0,0,0,.8)"}}>📍 {v.city}</div>
                    </div>
                  </div>
                  <div style={{padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:14,color:"#aaa"}}>👥 {v.capacity}</span>
                    <span style={{fontSize:13,color:v.color,fontWeight:700,background:`${v.color}22`,padding:"3px 10px",borderRadius:5,border:`1px solid ${v.color}44`}}>Ver más →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── LIVE ── */}
      {view==="live"&&(
        <div style={{maxWidth:"100%",margin:"20px auto",padding:"0 16px 60px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
            <div>
              <div style={{fontSize:18,fontWeight:800,color:"#fff"}}>🔴 PARTIDOS EN VIVO</div>
              <div style={{fontSize:14,color:"#555",marginTop:2,display:"flex",alignItems:"center",gap:8}}>
                <span>Actualizado: {lastUpdate.toLocaleTimeString()}</span>
                <span style={{color:"#333"}}>·</span>
                <span style={{color:"#c9a84c"}}>🔄 Auto en {Math.floor(nextRefresh/60)}:{String(nextRefresh%60).padStart(2,"0")}</span>
              </div>
            </div>
            <button onClick={fetchLiveScores} style={{...pill(false),padding:"8px 14px",borderColor:"#00a651",color:fetchStatus==="fetching"?"#888":"#00a651"}}>{fetchStatus==="fetching"?"⏳ Consultando...":"🔄 Actualizar scores"}</button>
          </div>
          {liveMatches.length===0?(
            <div style={{textAlign:"center",padding:"40px 20px"}}>
              <div style={{fontSize:48}}>⚽</div>
              <div style={{fontSize:14,color:"#555",marginTop:12}}>El torneo comienza el 11 de junio · Pulsa "Actualizar scores" para consultar</div>
            </div>
          ):(
            <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":isTablet?"repeat(2,1fr)":"repeat(auto-fill,minmax(265px,1fr))",gap:12}}>
              {liveMatches.map(m=><LiveCard key={m.id} match={m} score={liveScores[m.id]??null} tz={tz} lang={lang} minute={liveMinute[m.id]}/>)}
            </div>
          )}
        </div>
      )}

      {/* ── BRACKET ── */}
      {view==="bracket"&&(
        <div style={{maxWidth:"100%",margin:"20px auto",padding:"0 16px 60px"}}>
          <div style={{fontSize:18,fontWeight:800,color:"#fff",marginBottom:6}}>🏆 CUADRO ELIMINATORIO</div>
          <div style={{fontSize:14,color:"#555",marginBottom:16}}>Cruces confirmados al término de la fase de grupos</div>
          <div style={{overflowX:"auto"}}>
            <div style={{minWidth:540,display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:14,alignItems:"start"}}>
              <div><div style={{fontSize:13,fontWeight:700,color:"#ff7a00",letterSpacing:".1em",marginBottom:8,textAlign:"center"}}>CUARTOS</div>{BRACKET.qf.map((m,i)=><BSlot key={m.id} match={m} color="#ff7a00" style={{marginBottom:i<3?12:0}}/>)}</div>
              <div><div style={{fontSize:13,fontWeight:700,color:"#cc0000",letterSpacing:".1em",marginBottom:8,textAlign:"center"}}>SEMIS</div>{BRACKET.sf.map((m,i)=><BSlot key={m.id} match={m} color="#cc0000" style={{marginBottom:i<1?30:0}}/>)}</div>
              <div><div style={{fontSize:13,fontWeight:700,color:"#ffd700",letterSpacing:".1em",marginBottom:8,textAlign:"center"}}>FINAL</div><BSlot match={BRACKET.final} color="#ffd700"/></div>
              <div><div style={{fontSize:13,fontWeight:700,color:"#c9a84c",letterSpacing:".1em",marginBottom:8,textAlign:"center"}}>3ER LUGAR</div><BSlot match={BRACKET.third} color="#c9a84c"/></div>
            </div>
          </div>
        </div>
      )}

      {/* ── FAVORITES ── */}
      {view==="compact"&&(
        <div style={{maxWidth:"100%",margin:"20px auto",padding:"0 16px 60px"}}>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16,flexWrap:"wrap"}}>
            <div style={{fontSize:18,fontWeight:800,color:"#fff"}}>⭐ MI EQUIPO FAVORITO</div>
            <select value={favorite} onChange={e=>setFavorite(e.target.value)} style={{background:"rgba(255,255,255,.1)",border:"1px solid #c9a84c55",color:"#ffd700",padding:"6px 10px",borderRadius:8,fontFamily:"inherit",fontSize:15,cursor:"pointer",fontWeight:700}}>
              <option value="">— Elige tu selección —</option>
              {OFFICIAL_48.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          {!favorite?(
            <div style={{textAlign:"center",padding:"60px 20px",color:"#444"}}><div style={{fontSize:48}}>⭐</div><div style={{fontSize:14,marginTop:12}}>Elige tu equipo favorito arriba</div></div>
          ):(
            <>
              {TEAM_META[favorite]&&(
                <div style={{display:"flex",alignItems:"center",gap:14,background:"rgba(201,168,76,.08)",border:"1px solid #c9a84c33",borderRadius:12,padding:"14px 18px",marginBottom:16}}>
                  <Flag team={favorite} size={54}/>
                  <div>
                    <div style={{fontSize:20,fontWeight:900,letterSpacing:".1em",color:"#ffd700"}}>{favorite.toUpperCase()}</div>
                    <div style={{fontSize:14,color:"#777",marginTop:2}}>Grupo {TEAM_META[favorite]?.grp} · {favoriteMatches.length} partidos en grupos</div>
                  </div>
                </div>
              )}
              <div style={{display:"flex",flexDirection:"column",gap:9}}>
                {favoriteMatches.map(m=>{
                  const sc=liveScores[m.id]??null;
                  const ps=PHASE_STYLES[m.phase]||PHASE_STYLES["Grupos"];
                  const canal=lang==="es"?m.esCanal:m.enCanal;
                  return (
                    <div key={m.id} style={{background:ps.bg,border:`1px solid ${ps.border}44`,borderRadius:11,padding:"11px 14px",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                      <div style={{minWidth:48,textAlign:"center"}}>
                        <div style={{fontSize:15,fontWeight:900,color:"#c9a84c"}}>{m.date.split("-")[2]}</div>
                        <div style={{fontSize:11,color:"#555"}}>{new Date(m.date+"T12:00:00").toLocaleDateString("es-ES",{month:"short"}).toUpperCase()}</div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:180}}>
                        <Flag team={m.home} size={24}/>
                        <span style={{fontSize:14,fontWeight:m.home===favorite?700:400,color:m.home===favorite?"#ffd700":"#ccc"}}>{m.home}</span>
                        {sc?(
                          <div style={{padding:"2px 8px",background:sc.status==="live"?"rgba(255,0,0,.2)":"rgba(255,255,255,.05)",border:`1px solid ${sc.status==="live"?"#f00":"#333"}`,borderRadius:5,fontSize:16,fontWeight:900,color:"#fff"}}>
                            {sc.homeScore}–{sc.awayScore}{sc.status==="live"&&<span style={{fontSize:11,color:"#f44",marginLeft:4}}>{sc.minute}'</span>}
                          </div>
                        ):(
                          <span style={{fontSize:14,color:"#555",padding:"0 5px"}}>{m[tz]}</span>
                        )}
                        <span style={{fontSize:14,fontWeight:m.away===favorite?700:400,color:m.away===favorite?"#ffd700":"#ccc"}}>{m.away}</span>
                        <Flag team={m.away} size={24}/>
                      </div>
                      <div style={{fontSize:12,color:"#555",textAlign:"right",marginLeft:"auto"}}>
                        <div style={{color:CH_COLOR[canal]||"#888",fontWeight:700}}>📺 {canal}</div>
                        <div style={{marginTop:1}}>📍 {m.city}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── GUÍA TURISTA ── */}
      {view==="tourist"&&(
        <TouristGuide
          initialVenue={selectedVenue}
          isMobile={isMobile}
          onShowPricing={openPricing}
          premiumTier={premiumTier}
          onTierChange={setPremiumTier}
        />
      )}

      {/* ── AYUDA & REPORTE ── */}
      {view==="help"&&(()=>{
        const sec=(icon,title,desc)=>(
          <div style={{background:"rgba(8,40,80,.7)",border:"1px solid #1a6eb533",borderRadius:12,padding:"14px 16px",marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <span style={{fontSize:22}}>{icon}</span>
              <span style={{fontSize:15,fontWeight:800,color:"#ffd700",letterSpacing:".06em"}}>{title}</span>
            </div>
            <div style={{fontSize:13,color:"#aaa",lineHeight:1.7}}>{desc}</div>
          </div>
        );
        return(
        <div style={{maxWidth:700,margin:"20px auto",padding:"0 16px 80px"}}>
          <div style={{fontSize:20,fontWeight:900,color:"#fff",marginBottom:4}}>❓ GUÍA DE LA APP</div>
          <div style={{fontSize:13,color:"#556",marginBottom:16}}>Todo lo que necesitas saber para sacarle el máximo provecho al Mundial 2026</div>

          {/* ── PLANES ── */}
          <div style={{background:"linear-gradient(135deg,rgba(201,168,76,.12),rgba(8,40,80,.8))",border:"1.5px solid #c9a84c55",borderRadius:14,padding:"16px",marginBottom:16}}>
            <div style={{fontSize:15,fontWeight:900,color:"#ffd700",marginBottom:10}}>🏅 PLANES DISPONIBLES</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[
                {tier:"Fan Básico",price:"Gratis",color:"#556",items:["📅 Calendario 72 partidos","🔴 Marcadores en vivo","📊 Tabla de posiciones","⚽ Goleadores","🔮 1 predicción IA por día","🎯 Quiniela (modo solo)","📰 Noticias IA","🏟️ Sedes y estadios","⭐ Partido favorito"]},
                {tier:"Fan Pro",price:"$0.99",color:"#4a9eff",items:["⚡ Todo lo de Básico","🔮 20 predicciones IA (torneo)","🎯 Grupos privados en quiniela","📤 Compartir ranking del grupo"]},
                {tier:"Fan VIP",price:"$4.99",color:"#ffd700",items:["⭐ Todo lo de Pro","🔮 Predicciones IA ilimitadas ∞","🗺️ Guía Turista 16 sedes","🍽️ Restaurantes latinos","🚗 Transporte y fan zones","🗣️ Frases útiles + WhatsApp","☁️ Clima y seguridad por sede"]},
                {tier:"Fan Ultimate",price:"$7.99",color:"#ff7a00",items:["🏆 Todo lo anterior","🎰 Análisis de apuestas con IA","📊 Picks con % de probabilidad"]},
              ].map(({tier,price,color,items})=>(
                <div key={tier} style={{background:"rgba(0,0,0,.2)",borderLeft:`3px solid ${color}`,borderRadius:8,padding:"10px 12px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <span style={{fontSize:13,fontWeight:900,color}}>{tier}</span>
                    <span style={{fontSize:13,fontWeight:800,color:"#fff"}}>{price}</span>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"3px 12px"}}>
                    {items.map(i=><span key={i} style={{fontSize:11,color:"#aaa"}}>{i}</span>)}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={()=>openPricing("vip")} style={{width:"100%",marginTop:12,padding:"11px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#c9a84c,#ffd700)",color:"#0a1f40",fontWeight:900,fontSize:14,cursor:"pointer"}}>
              🛒 Ver planes y activar
            </button>
          </div>

          {/* ── FUNCIONES ── */}
          <div style={{fontSize:13,fontWeight:800,color:"#888",letterSpacing:".1em",marginBottom:10}}>FUNCIONES DE LA APP</div>

          {sec("📅","CALENDARIO","Muestra los 72 partidos del Mundial ordenados por fecha. Filtra por equipo, fase (Grupos / R32 / Cuartos / Semis / Final) o sede anfitriona. Cambia entre Junio y Julio en las pestañas superiores. Ajusta tu zona horaria (ET · CT · MT · PT) en el encabezado. Toca cualquier partido para ver detalles y compartirlo — el texto compartido incluye las banderas de los equipos 🏳️.")}
          {sec("🔴","EN VIVO","Partidos del día con marcadores en tiempo real, actualizados cada 2 minutos. Cuando se marca un gol aparece una animación de celebración en pantalla completa. Toca en cualquier lugar o espera 5 segundos para cerrarla.")}
          {sec("📊","POSICIONES","Tabla de los 12 grupos (A–L) con puntos, partidos jugados, goles a favor/en contra y diferencia. Se actualiza automáticamente durante el torneo.")}
          {sec("⚽","GOLEADORES","Antes del 11 jun muestra los 10 candidatos a la Bota de Oro. Durante el torneo cambia a goleadores reales en tiempo real desde football-data.org.")}
          {sec("🔮","PREDICCIÓN IA","Elige un partido, selecciona tu resultado esperado (local / empate / visitante) y Claude IA analiza el partido. Recibirás: probabilidades con banderas de cada equipo, marcador predicho, jugadores clave y análisis. Límites: 1/día (Básico), 20 totales (Pro), ilimitadas (VIP/Ultimate).")}
          {sec("🎯","QUINIELA — MODO SOLO","Predice los 24 partidos de grupos. Sistema de puntos: ⭐ 3 pts marcador exacto · ✅ 1 pt resultado correcto · ❌ 0 pts fallo. Ingresa tu apodo, haz tus picks y guárdalos. Compares en la tabla global con jugadores de todo el mundo. Gratis para todos.")}
          {sec("🎯","QUINIELA — GRUPOS PRIVADOS (Pro)","Con Fan Pro creas tu grupo privado con un código único. Compártelo por WhatsApp con amigos, familia o la oficina. Todos hacen sus picks y el ranking se actualiza en vivo. Desde la pantalla del grupo toca '📤 Compartir' para enviar el ranking completo por WhatsApp con medallas 🥇🥈🥉.")}
          {sec("🗺️","GUÍA DEL TURISTA LATINO (VIP)","Información completa para las 16 sedes: restaurantes latinos, opciones de transporte (Uber, metro, parking, shuttle), fan zones oficiales, frases útiles en inglés/francés con botón de compartir por WhatsApp, clima mes a mes, nivel de seguridad y hospedaje recomendado. Al entrar verás el contenido 2 segundos y luego aparece la oferta de desbloqueo.")}
          {sec("🏟️","SEDES","Galería de los 16 estadios en EE.UU., México y Canadá. Toca cada uno para ver capacidad, superficie, curiosidades, partidos que albergará y foto real (Wikimedia Commons).")}
          {sec("🏆","BRACKET","Cuadro eliminatorio completo: Cuartos de Final → Semifinales → 3er lugar → Final (19 jul, MetLife Stadium).")}
          {sec("⭐","FAVORITOS","Selecciona tu selección para ver solo sus partidos, marcador en vivo y cuenta regresiva al siguiente partido.")}
          {sec("📰","NOTICIAS","Genera 8 titulares del Mundial con IA. Toca el ícono de YouTube para buscar el tema en video.")}
          {sec("📤","TARJETAS DE COMPARTIR","En cualquier partido toca el botón compartir para generar una tarjeta visual con banderas, horario, estadio y canal de TV. El texto copiado incluye emojis de bandera de cada equipo para que se vea bien en WhatsApp.")}
          {sec("🕐","ZONA HORARIA","ET (Este) · CT (Centro) · MT (Montaña) · PT (Pacífico). Se aplica a todos los horarios del app al instante.")}
          {sec("📺","IDIOMA DE TV","Español → Telemundo / Universo. English → FOX / FS1 / Tubi.")}
          {sec("⚡","MEJORAR PLAN","Toca el botón en la esquina superior derecha del encabezado para ver todos los planes, comprar en Gumroad y activar tu código. También puedes activar tu código directamente desde ahí si ya compraste.")}

          {/* ── APOYA EL PROYECTO ── */}
          <div style={{borderTop:"2px solid #c9a84c44",paddingTop:20,marginTop:10,marginBottom:10}}>
            <div style={{fontSize:17,fontWeight:800,color:"#ffd700",marginBottom:4}}>☕ APOYA ESTE PROYECTO</div>
            <div style={{fontSize:13,color:"#889",marginBottom:16,lineHeight:1.6}}>
              Esta app es gratuita, sin anuncios y está hecha con mucho amor por el fútbol. Si te ha sido útil y quieres ayudar a mantenerla activa durante el Mundial, considera invitarme un café ☕
            </div>

            <div style={{background:"linear-gradient(145deg,rgba(201,168,76,.08),rgba(201,168,76,.18))",border:"1.5px solid #c9a84c",borderRadius:16,padding:"18px 16px"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <span style={{fontSize:28}}>⚽</span>
                <div>
                  <div style={{fontSize:14,fontWeight:800,color:"#ffd700",letterSpacing:".04em"}}>Mundial 2026 · Guía del Fan Latino</div>
                  <div style={{fontSize:12,color:"#aaa"}}>ko-fi.com/mundial2026</div>
                </div>
              </div>

              <p style={{fontSize:13,color:"#c0cde0",lineHeight:1.65,margin:"0 0 14px"}}>
                Con tu apoyo podemos seguir mejorando la app: más estadísticas, notificaciones de goles, predicciones en tiempo real y mucho más durante todo el torneo.
              </p>

              {/* Montos sugeridos */}
              <div style={{display:"flex",gap:8,marginBottom:12}}>
                {[
                  {amt:"$3",label:"☕ Un café"},
                  {amt:"$5",label:"⚽ Un gol"},
                ].map(({amt,label})=>(
                  <a key={amt}
                    href="https://ko-fi.com/mundial2026"
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      flex:1,textAlign:"center",padding:"10px 6px",
                      background:"rgba(201,168,76,.12)",
                      border:"1.5px solid #c9a84c",borderRadius:10,
                      color:"#ffd700",fontWeight:800,fontSize:14,
                      textDecoration:"none",lineHeight:1.3,
                      display:"block",
                    }}>
                    <div>{amt}</div>
                    <div style={{fontSize:11,fontWeight:400,color:"#aaa",marginTop:2}}>{label}</div>
                  </a>
                ))}
              </div>

              {/* CTA principal */}
              <a
                href="https://ko-fi.com/mundial2026"
                target="_blank" rel="noopener noreferrer"
                style={{
                  display:"block",textAlign:"center",
                  background:"linear-gradient(135deg,#c9a84c,#ffd700)",
                  color:"#0a1f40",fontWeight:900,fontSize:15,
                  padding:"12px 0",borderRadius:12,
                  textDecoration:"none",letterSpacing:".06em",
                }}>
                ☕ Apoyar en Ko-fi
              </a>

              <div style={{marginTop:10,fontSize:11,color:"#556",textAlign:"center"}}>
                Pago seguro · Sin suscripción · Monto libre · 100% va al desarrollador
              </div>
            </div>
          </div>

          {/* ── FORMULARIO DE REPORTE ── */}
          <div style={{borderTop:"2px solid #c9a84c44",paddingTop:20,marginTop:10}}>
            <div style={{fontSize:17,fontWeight:800,color:"#fff",marginBottom:4}}>🚨 REPORTAR UNA FALLA</div>
            <div style={{fontSize:13,color:"#556",marginBottom:14}}>¿Algo no funciona? Cuéntanos para mejorarlo.</div>

            {/* Opciones predefinidas */}
            <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:14}}>
              {REPORT_OPTIONS.map(opt=>{
                const sel=reportTypes.includes(opt);
                return(
                  <button key={opt} onClick={()=>toggleReportType(opt)} style={{padding:"6px 12px",borderRadius:20,border:`1px solid ${sel?"#c9a84c":"#2a3a5a"}`,background:sel?"rgba(201,168,76,.18)":"rgba(255,255,255,.04)",color:sel?"#ffd700":"#666",fontFamily:"inherit",fontSize:12,fontWeight:sel?700:400,cursor:"pointer",transition:"all .2s",letterSpacing:".03em"}}>
                    {sel?"✓ ":""}{opt}
                  </button>
                );
              })}
            </div>

            {/* Comentario libre */}
            <textarea
              value={reportComment}
              onChange={e=>{ if(e.target.value.length<=500) setReportComment(e.target.value); if(reportStatus!=="idle") setReportStatus("idle"); }}
              placeholder="Describe el problema con más detalle (opcional, máx. 500 caracteres)…"
              rows={4}
              style={{width:"100%",background:"rgba(255,255,255,.06)",border:"1px solid #2a3a5a",borderRadius:10,padding:"10px 12px",color:"#ddd",fontFamily:"inherit",fontSize:13,resize:"vertical",outline:"none",boxSizing:"border-box",lineHeight:1.6}}
            />
            <div style={{fontSize:11,color:"#334",textAlign:"right",marginTop:3}}>{reportComment.length}/500</div>

            {/* Botón enviar */}
            {reportStatus==="ok"?(
              <div style={{marginTop:12,padding:"12px 16px",background:"rgba(68,170,100,.12)",border:"1px solid #4aa",borderRadius:10,color:"#4da",fontSize:14,fontWeight:700,textAlign:"center"}}>
                ✅ Reporte enviado. ¡Gracias por ayudarnos a mejorar!
              </div>
            ):reportStatus==="error"?(
              <div style={{marginTop:12,padding:"12px 16px",background:"rgba(200,50,50,.12)",border:"1px solid #a44",borderRadius:10,color:"#e77",fontSize:14,textAlign:"center"}}>
                ❌ No se pudo enviar. Intenta de nuevo.
                <button onClick={()=>setReportStatus("idle")} style={{marginLeft:10,background:"none",border:"none",color:"#e77",cursor:"pointer",textDecoration:"underline",fontFamily:"inherit",fontSize:13}}>Reintentar</button>
              </div>
            ):(
              <button
                onClick={submitReport}
                disabled={reportStatus==="sending"||(reportTypes.length===0&&!reportComment.trim())}
                style={{marginTop:12,width:"100%",padding:"12px",borderRadius:10,border:"none",background:(reportTypes.length>0||reportComment.trim())?"linear-gradient(90deg,#c9a84c,#ffd700)":"rgba(255,255,255,.08)",color:(reportTypes.length>0||reportComment.trim())?"#0a1f40":"#444",fontFamily:"inherit",fontSize:15,fontWeight:800,cursor:(reportTypes.length>0||reportComment.trim())?"pointer":"not-allowed",letterSpacing:".08em",transition:"all .2s"}}
              >
                {reportStatus==="sending"?"⏳ Enviando…":"📤 ENVIAR REPORTE"}
              </button>
            )}

            <div style={{marginTop:12,fontSize:11,color:"#334",textAlign:"center",lineHeight:1.5}}>
              Tu reporte llega directamente al equipo técnico. No incluye datos personales.
            </div>
          </div>
        </div>
        );
      })()}

      {/* ── SCHEDULE ── */}
      {view==="schedule"&&(
        <>
          <div style={{position:"sticky",top:105,zIndex:20,background:"rgba(1,10,28,.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,.07)",padding:"7px 16px"}}>
            <div style={{maxWidth:"100%",margin:"0 auto",display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
              <select value={teamFilter} onChange={e=>setTeamFilter(e.target.value)} style={{background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.15)",color:"#fff",padding:"5px 9px",borderRadius:6,fontFamily:"inherit",fontSize:14,cursor:"pointer"}}>
                <option value="">🌍 Todos los equipos</option>
                {ALL_TEAMS.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
              <select value={phaseFilter} onChange={e=>setPhaseFilter(e.target.value)} style={{background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.15)",color:"#fff",padding:"5px 9px",borderRadius:6,fontFamily:"inherit",fontSize:14,cursor:"pointer"}}>
                <option value="">🏆 Todas las fases</option>
                {["Grupos","Ronda de 32","Cuartos","Semifinal","3er Lugar","Final"].map(p=><option key={p} value={p}>{p}</option>)}
              </select>
              {HOST_FILTERS.map(({key,label,color})=>(
                <button key={key} onClick={()=>setHostFilter(hostFilter===key?"":key)} style={pill(hostFilter===key,color)}>{label}</button>
              ))}
              {(teamFilter||phaseFilter||hostFilter)&&<button onClick={()=>{setTeamFilter("");setPhaseFilter("");setHostFilter("");}} style={{...pill(false),borderColor:"rgba(255,80,80,.3)",color:"#ff8080"}}>✕</button>}
              <span style={{marginLeft:"auto",color:"#444",fontSize:10}}>{filtered.length} partidos</span>
            </div>
          </div>
          <div style={{maxWidth:"100%",margin:"0 auto",padding:isMobile?"8px 10px 0":"10px 16px 0"}}>
            <div style={{display:"flex",gap:0,borderBottom:"1px solid rgba(255,255,255,.07)",marginBottom:10}}>
              {MONTHS.map(m=>(
                <button key={m.key} onClick={()=>setMonth(m.key)} style={{padding:"8px 20px",border:"none",background:"none",fontFamily:"inherit",fontWeight:700,fontSize:14,letterSpacing:".1em",textTransform:"uppercase",cursor:"pointer",color:month===m.key?"#ffd700":"#555",borderBottom:month===m.key?"3px solid #ffd700":"3px solid transparent",transition:"all .2s"}}>
                  {m.label} <span style={{marginLeft:5,fontSize:12,background:"rgba(201,168,76,.2)",color:"#c9a84c",padding:"1px 5px",borderRadius:9}}>{MATCHES.filter(x=>x.date.startsWith(m.key)).length}</span>
                </button>
              ))}
            </div>
            <div style={{display:"flex",gap:3,marginBottom:12}}>
              {Object.keys(PHASE_STYLES).map(p=>{
                const ps=PHASE_STYLES[p]; const active=phaseFilter===p;
                return <button key={p} onClick={()=>setPhaseFilter(active?"":p)} style={{flex:p==="Grupos"?3:p==="Ronda de 32"?2:1,padding:"5px 3px",border:`1px solid ${ps.border}`,background:active?ps.bg:"rgba(255,255,255,.03)",borderRadius:5,fontFamily:"inherit",fontWeight:700,fontSize:"clamp(8px,1.2vw,11px)",color:active?ps.badge:"#555",cursor:"pointer",transition:"all .2s",textAlign:"center"}}>{PHASE_LABEL[p]}</button>;
              })}
            </div>
          </div>
          <main style={{maxWidth:"100%",margin:"0 auto",padding:"0 16px 60px"}}>
            {byDay.length===0?(
              <div style={{textAlign:"center",padding:"60px 20px",color:"#444"}}><div style={{fontSize:48}}>⚽</div><div style={{fontSize:14,marginTop:12}}>No hay partidos con ese filtro</div></div>
            ):byDay.map(([day,matches])=>{
              const dateObj=new Date(`${month}-${day}T12:00:00`);
              const weekday=dateObj.toLocaleDateString("es-ES",{weekday:"long"}).toUpperCase();
              const monthName=dateObj.toLocaleDateString("es-ES",{month:"long"}).toUpperCase();
              return (
                <div key={day} style={{marginBottom:22}}>
                  <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:10}}>
                    <div style={{background:"linear-gradient(135deg,#c9a84c,#ffd700)",color:"#000",fontWeight:900,fontSize:20,width:44,height:44,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{day}</div>
                    <div><div style={{fontSize:14,fontWeight:700,color:"#ddd"}}>{weekday}</div><div style={{fontSize:12,color:"#c9a84c",letterSpacing:".15em"}}>{monthName} 2026</div></div>
                    <div style={{flex:1,height:1,background:"linear-gradient(90deg,rgba(201,168,76,.4),transparent)",marginLeft:6}}/>
                    <div style={{fontSize:12,color:"#444",background:"rgba(255,255,255,.05)",padding:"2px 8px",borderRadius:16}}>{matches.length} PARTIDO{matches.length>1?"S":""}</div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":isTablet?"repeat(2,1fr)":"repeat(auto-fill,minmax(265px,1fr))",gap:10}}>
                    {matches.map(m=>{
                      const ps=PHASE_STYLES[m.phase]||PHASE_STYLES["Grupos"];
                      const sc=liveScores[m.id]??null;
                      const canal=lang==="es"?m.esCanal:m.enCanal;
                      const cColor=CH_COLOR[canal]||"#888";
                      const hostInfo=HOST_FILTERS.find(h=>h.key===m.host);
                      const isFav=m.home===favorite||m.away===favorite;
                      return (
                        <div key={m.id} style={{background:ps.bg,border:`1px solid ${isFav?"#ffd700":ps.border+"88"}`,borderRadius:12,padding:"12px",position:"relative",overflow:"hidden"}}>
                          {isFav&&<div style={{position:"absolute",top:0,right:0,background:"#ffd700",color:"#000",fontSize:11,fontWeight:900,padding:"2px 6px",borderRadius:"0 0 0 6px"}}>⭐ FAV</div>}
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,flexWrap:"wrap",gap:3}}>
                            <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                              <span style={{fontSize:12,fontWeight:800,background:ps.badge,color:"#fff",padding:"2px 6px",borderRadius:3}}>{PHASE_LABEL[m.phase]}{m.group?` · G${m.group}`:""}</span>
                              {hostInfo&&<span style={{fontSize:12,padding:"2px 6px",borderRadius:3,background:`${hostInfo.color}28`,color:hostInfo.color,border:`1px solid ${hostInfo.color}44`,fontWeight:700}}>{hostInfo.label}</span>}
                              {sc?.status==="live"&&<span style={{fontSize:12,background:"#f00",color:"#fff",padding:"2px 6px",borderRadius:3,fontWeight:900}}>🔴 EN VIVO</span>}
                            </div>
                            <span style={{fontSize:12,fontWeight:800,color:cColor,background:`${cColor}22`,padding:"2px 6px",borderRadius:3,border:`1px solid ${cColor}44`}}>📺 {canal}</span>
                          </div>
                          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:9}}>
                            <div style={{textAlign:"center",flex:1}}>
                              <div style={{display:"flex",justifyContent:"center",marginBottom:4}}>{TEAM_META[m.home]?<Flag team={m.home} size={36}/>:<div style={{fontSize:24,lineHeight:1}}>🏆</div>}</div>
                              <div style={{fontSize:"clamp(14px,1.7vw,16px)",fontWeight:700,color:"#fff",textTransform:"uppercase",lineHeight:1.2}}>{m.home}</div>
                            </div>
                            <div style={{textAlign:"center",padding:"0 7px"}}>
                              {sc?(
                                <><div style={{fontSize:17,fontWeight:900,color:"#fff",lineHeight:1}}>{sc.homeScore}–{sc.awayScore}</div><div style={{fontSize:12,color:sc.status==="live"?"#f44":"#777"}}>{sc.status==="live"?`${liveMinute[m.id]||sc.minute||"?"}'`:"FINAL"}</div></>
                              ):(
                                <><div style={{fontSize:12,fontWeight:900,letterSpacing:".2em",color:ps.badge,marginBottom:2}}>VS</div><div style={{fontSize:15,fontWeight:800,color:"#fff"}}>{m[tz]}</div><div style={{fontSize:11,color:"#555"}}>{TIMEZONES.find(t=>t.key===tz)?.label}</div></>
                              )}
                            </div>
                            <div style={{textAlign:"center",flex:1}}>
                              <div style={{display:"flex",justifyContent:"center",marginBottom:4}}>{TEAM_META[m.away]?<Flag team={m.away} size={36}/>:<div style={{fontSize:24,lineHeight:1}}>🏆</div>}</div>
                              <div style={{fontSize:"clamp(14px,1.7vw,16px)",fontWeight:700,color:"#fff",textTransform:"uppercase",lineHeight:1.2}}>{m.away}</div>
                            </div>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 8px",borderRadius:6,background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.08)"}}>
                            <span style={{fontSize:11}}>🏟️</span>
                            <div style={{flex:1,minWidth:0}}>
                              <div onClick={()=>VENUES[m.venue]&&setVenueModal(m.venue)} style={{fontSize:12,color:VENUES[m.venue]?"#6aadff":"#bbb",fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",cursor:VENUES[m.venue]?"pointer":"default",textDecoration:VENUES[m.venue]?"underline":"none"}}>{m.venue}{VENUES[m.venue]?" 🔗":""}</div>
                              <div style={{fontSize:12,color:"#555"}}>📍 {m.city}</div>
                            </div>
                            <div style={{display:"flex",flexDirection:"column",gap:1,borderLeft:"1px solid rgba(255,255,255,.1)",paddingLeft:6}}>
                              {TIMEZONES.map(t=>(
                                <div key={t.key} style={{fontSize:11,color:tz===t.key?ps.badge:"#444",fontWeight:tz===t.key?800:400}}>
                                  <span style={{opacity:.5}}>{t.label}: </span>{m[t.key]}
                                </div>
                              ))}
                            </div>
                          </div>
                          {TEAM_META[m.home]&&(
                            <button onClick={()=>setShareMatch(m)} style={{marginTop:6,width:"100%",padding:"5px",borderRadius:6,border:"1px solid rgba(255,255,255,.08)",background:"rgba(255,255,255,.03)",color:"#555",fontFamily:"inherit",fontSize:13,cursor:"pointer",transition:"all .2s"}} onMouseEnter={e=>e.target.style.color="#ffd700"} onMouseLeave={e=>e.target.style.color="#555"}>
                              📤 Compartir partido
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </main>
        </>
      )}

      <footer style={{textAlign:"center",padding:"16px",borderTop:"1px solid rgba(201,168,76,.15)",color:"#2a2a2a",fontSize:12,letterSpacing:".1em"}}>
        <div style={{marginBottom:6}}>⚽ MUNDIAL 2026 · GUÍA DEL FAN LATINO · Fuentes: FOX Sports · ESPN · NBC Sports</div>
        <div style={{fontSize:11,color:"#222",lineHeight:1.6,maxWidth:600,margin:"0 auto"}}>
          Esta aplicación es independiente y no está afiliada, patrocinada, respaldada ni autorizada por FIFA, sus subsidiarias, socios oficiales ni ninguna federación de fútbol. Los nombres de equipos, fechas y estadios se usan con fines informativos únicamente.
        </div>
      </footer>

      {/* BOTÓN IR ARRIBA */}
      <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} title="Ir arriba"
        style={{position:"fixed",bottom:24,right:20,zIndex:50,width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#c9a84c,#ffd700)",border:"none",color:"#000",fontSize:20,fontWeight:900,cursor:"pointer",boxShadow:"0 4px 20px rgba(201,168,76,.5)",display:"flex",alignItems:"center",justifyContent:"center"}}>
        ↑
      </button>
    </div>
  );
}