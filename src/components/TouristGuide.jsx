import React, { useState, useEffect, useRef } from "react";
import { TOURIST_GUIDES } from "../data/touristGuides.js";
import { hasTouristAccess, checkPremium } from "../utils/premium.js";
import GuideDetail from "./GuideDetail.jsx";

const FLAG = { US:"🇺🇸", MX:"🇲🇽", CA:"🇨🇦" };
const SEC_COLOR = { BAJO:"#00a651", MEDIO:"#ff7a00", ALTO:"#cc0000" };

const VENUES_ORDER = [
  "Estadio Azteca","Estadio BBVA","Akron Stadium",
  "MetLife Stadium","SoFi Stadium","AT&T Stadium","NRG Stadium",
  "Mercedes-Benz Stadium","Levi's Stadium","Lumen Field",
  "Lincoln Financial Field","Arrowhead Stadium","Gillette Stadium",
  "Hard Rock Stadium","BMO Field","BC Place",
];

// Peek durations
const PEEK_MS   = 2200;  // how long user sees blurred content
const SLIDE_MS  = 420;   // slide-up animation

export default function TouristGuide({ initialVenue, isMobile, onShowPricing, premiumTier, onTierChange }) {
  const [filter, setFilter]     = useState("ALL");
  const [selected, setSelected] = useState(initialVenue || null);
  const [peekDone, setPeekDone] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const timerRef = useRef(null);

  const tier      = premiumTier || checkPremium().tier;
  const hasAccess = hasTouristAccess() || ["vip","ultimate"].includes(tier);

  // Peek effect: after PEEK_MS show the offer sheet
  useEffect(() => {
    if (hasAccess) return;
    timerRef.current = setTimeout(() => {
      setPeekDone(true);
      setTimeout(() => setShowOffer(true), 50);
    }, PEEK_MS);
    return () => clearTimeout(timerRef.current);
  }, [hasAccess]);

  useEffect(() => {
    if (initialVenue) setSelected(initialVenue);
  }, [initialVenue]);

  if (selected && TOURIST_GUIDES[selected]) {
    return (
      <GuideDetail
        guide={TOURIST_GUIDES[selected]}
        onBack={() => setSelected(null)}
      />
    );
  }

  const guides = VENUES_ORDER
    .filter(v => TOURIST_GUIDES[v])
    .filter(v => filter === "ALL" || TOURIST_GUIDES[v].country === filter)
    .map(v => TOURIST_GUIDES[v]);

  return (
    <div style={{ maxWidth:700, margin:"0 auto", padding:"12px 16px 80px", position:"relative" }}>

      {/* ── CSS for peek animation ── */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes fadeOverlay {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .peek-blur { filter: blur(${peekDone ? "5px" : "0px"}); transition: filter .6s ease; pointer-events: ${peekDone && !hasAccess ? "none" : "auto"}; user-select: ${peekDone && !hasAccess ? "none" : "auto"}; }
      `}</style>

      {/* ── Overlay backdrop — click to dismiss ── */}
      {!hasAccess && peekDone && showOffer && (
        <div
          onClick={() => setShowOffer(false)}
          style={{
            position:"fixed", inset:0, zIndex:40,
            background:"rgba(1,10,26,.55)",
            animation:`fadeOverlay ${SLIDE_MS}ms ease forwards`,
          }}
        />
      )}

      {/* ── Bottom sheet offer ── */}
      {!hasAccess && showOffer && (
        <div style={{
          position:"fixed", bottom:0, left:0, right:0, zIndex:50,
          background:"linear-gradient(180deg,#081a38,#04102b)",
          borderTop:"2px solid #c9a84c",
          borderRadius:"22px 22px 0 0",
          padding:"20px 20px 40px",
          animation:`slideUp ${SLIDE_MS}ms cubic-bezier(.22,.61,.36,1) forwards`,
          boxShadow:"0 -8px 40px rgba(0,0,0,.7)",
        }}>
          {/* Handle + close */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", position:"relative", marginBottom:18 }}>
            <div style={{ width:42, height:4, background:"rgba(255,255,255,.2)", borderRadius:2 }}/>
            <button
              onClick={() => setShowOffer(false)}
              style={{
                position:"absolute", right:0, top:-8,
                background:"rgba(255,255,255,.08)", border:"none",
                borderRadius:20, width:32, height:32,
                color:"#aaa", fontSize:18, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>✕</button>
          </div>

          <div style={{ textAlign:"center", marginBottom:16 }}>
            <div style={{ fontSize:32, marginBottom:6 }}>🗺️🔒</div>
            <div style={{ fontSize:19, fontWeight:900, color:"#ffd700", letterSpacing:".04em", marginBottom:6 }}>
              Guía del Turista Latino
            </div>
            <div style={{ fontSize:13, color:"#a0b8d0", lineHeight:1.6, marginBottom:4 }}>
              Restaurantes latinos, transporte, fan zones, frases útiles,
              clima y seguridad para las <strong style={{color:"#fff"}}>16 sedes</strong>.
            </div>
            <div style={{ fontSize:13, color:"#c9a84c", fontWeight:700 }}>
              Disponible desde Fan VIP — <span style={{color:"#ffd700"}}>$4.99</span> pago único
            </div>
          </div>

          {/* Feature pills */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:7, justifyContent:"center", marginBottom:20 }}>
            {["🍽️ Restaurantes latinos","🚗 Transporte","🎉 Fan Zones","🗣️ Frases útiles","☁️ Clima","🛡️ Seguridad","🏨 Hospedaje"].map(f => (
              <div key={f} style={{
                padding:"5px 10px", borderRadius:20,
                background:"rgba(201,168,76,.12)", border:"1px solid #c9a84c44",
                fontSize:11, color:"#c9a84c", fontWeight:700,
              }}>{f}</div>
            ))}
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => { setShowOffer(false); onShowPricing?.("vip"); }}
            style={{
              width:"100%", padding:"15px", borderRadius:13, border:"none",
              background:"linear-gradient(135deg,#c9a84c,#ffd700)",
              color:"#0a1f40", fontWeight:900, fontSize:16,
              cursor:"pointer", letterSpacing:".05em", marginBottom:10,
            }}>
            🛒 Ver planes y precios
          </button>

          {/* Dismiss — continue free */}
          <button
            onClick={() => setShowOffer(false)}
            style={{
              width:"100%", padding:"11px", borderRadius:10, border:"1px solid #1a3a5c",
              background:"transparent", color:"#556",
              fontFamily:"inherit", fontSize:13, cursor:"pointer",
            }}>
            Continuar con versión gratuita
          </button>
        </div>
      )}

      {/* ── Content (blurs after peek) ── */}
      <div className="peek-blur">

        {/* Header */}
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:20, fontWeight:900, color:"#fff", marginBottom:4 }}>
            🗺️ GUÍA DEL TURISTA LATINO
          </div>
          <div style={{ fontSize:13, color:"#556", lineHeight:1.5 }}>
            Restaurantes latinos, transporte, fan zones, frases útiles, clima y seguridad para las 16 sedes del Mundial 2026.
          </div>
        </div>

        {/* Access badge */}
        {hasAccess && (
          <div style={{
            display:"inline-flex", alignItems:"center", gap:6, marginBottom:14,
            padding:"5px 12px", borderRadius:20,
            background:"rgba(0,166,81,.12)", border:"1px solid #00a65133",
            fontSize:12, color:"#00a651", fontWeight:700,
          }}>
            ✅ Acceso {tier.toUpperCase()} activado
          </div>
        )}

        {/* Country filter */}
        <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
          {[["ALL","🌎 Todas"],["US","🇺🇸 EE.UU."],["MX","🇲🇽 México"],["CA","🇨🇦 Canadá"]].map(([key,label])=>(
            <button key={key} onClick={()=>{ if(hasAccess) setFilter(key); }} style={{
              padding:"7px 14px", borderRadius:20, border:"none",
              background: filter===key ? "rgba(201,168,76,.2)" : "rgba(255,255,255,.05)",
              borderBottom: filter===key ? "2px solid #c9a84c" : "2px solid transparent",
              color: filter===key ? "#ffd700" : "#666",
              fontFamily:"inherit", fontSize:13, fontWeight:700,
              cursor: hasAccess ? "pointer" : "default",
            }}>{label}</button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:12 }}>
          {guides.map((g) => {
            const climaActual = new Date().getMonth() >= 6 ? g.clima?.julio : g.clima?.junio;
            const firstRest   = g.comida?.[0];

            return (
              <div key={g.venue} style={{
                background:"rgba(0,31,63,.88)", border:"1px solid #1a6eb533",
                borderRadius:14, overflow:"hidden",
                borderTop:`3px solid ${g.accentColor}`,
              }}>
                {/* Card header */}
                <div style={{ padding:"14px 14px 10px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
                        <span style={{ fontSize:18 }}>{FLAG[g.country]}</span>
                        <span style={{ fontSize:13, fontWeight:900, color:"#fff" }}>{g.city}</span>
                      </div>
                      <div style={{ fontSize:11, color:"#556" }}>{g.venue}</div>
                    </div>
                    <div style={{
                      fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:8,
                      background:`${SEC_COLOR[g.seguridad?.nivel]}22`,
                      color: SEC_COLOR[g.seguridad?.nivel],
                      border:`1px solid ${SEC_COLOR[g.seguridad?.nivel]}44`,
                    }}>{g.seguridad?.nivel}</div>
                  </div>
                </div>

                {/* Preview content */}
                <div style={{ padding:"0 14px 12px" }}>
                  {climaActual && (
                    <div style={{ fontSize:12, color:"#a0b8d0", marginBottom:8, display:"flex", alignItems:"center", gap:6 }}>
                      <span>{climaActual.condicion?.split(" ")[0]}</span>
                      <span>{climaActual.temp}</span>
                    </div>
                  )}

                  {firstRest && (
                    <div style={{ background:"rgba(8,40,80,.5)", borderRadius:8, padding:"8px 10px", marginBottom:10 }}>
                      <div style={{ fontSize:12, color:"#c9a84c", fontWeight:700 }}>
                        🍽️ {firstRest.nombre}
                      </div>
                      <div style={{ fontSize:11, color:"#556" }}>
                        {firstRest.tipo} · {firstRest.distancia} · {firstRest.precio}
                      </div>
                    </div>
                  )}

                  {!hasAccess ? (
                    <div style={{
                      display:"flex", alignItems:"center", gap:6,
                      padding:"7px 10px", borderRadius:8,
                      background:"rgba(201,168,76,.08)", border:"1px solid #c9a84c33",
                      fontSize:11, color:"#c9a84c",
                    }}>
                      🔒 {(g.comida?.length||1)-1} restaurantes + transporte + frases + clima
                    </div>
                  ) : (
                    <button onClick={()=>setSelected(g.venue)} style={{
                      width:"100%", padding:"8px 0", borderRadius:8, border:"none",
                      background:`linear-gradient(135deg,${g.accentColor},${g.accentColor}bb)`,
                      color:"#fff", fontFamily:"inherit", fontSize:13, fontWeight:800,
                      cursor:"pointer", letterSpacing:".04em",
                    }}>
                      Ver Guía Completa →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
