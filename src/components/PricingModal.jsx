import React, { useState } from "react";
import { GUMROAD, TIER_LABELS } from "../utils/premium.js";
import CodeActivator from "./CodeActivator.jsx";

const PLANS = [
  {
    key: "free",
    name: "Fan Básico",
    price: "$0",
    sub: "Gratis",
    badge: null,
    color: "#556",
    features: [
      "✅ Calendario 72 partidos",
      "✅ Horarios y canales TV",
      "✅ Tabla de posiciones",
      "✅ 1 predicción IA por día",
      "✅ Quiniela básica",
      "❌ 20 predicciones IA (Pro)",
      "❌ Guía Turista 16 sedes",
      "❌ Análisis de apuestas",
    ],
  },
  {
    key: "pro",
    name: "Fan Pro",
    price: "$0.99",
    sub: "pago único",
    badge: "★ Popular",
    badgeColor: "#4a9eff",
    color: "#4a9eff",
    url: GUMROAD.pro,
    features: [
      "✅ Todo lo de Básico",
      "✅ 20 predicciones IA (torneo completo)",
      "✅ Quiniela grupos privados",
      "✅ Tarjetas de compartir",
      "✅ Sin límite de picks",
      "❌ Guía Turista 16 sedes",
      "❌ Análisis de apuestas",
    ],
  },
  {
    key: "vip",
    name: "Fan VIP",
    price: "$4.99",
    sub: "pago único",
    badge: "★★ Mejor valor",
    badgeColor: "#ffd700",
    color: "#ffd700",
    url: GUMROAD.vip,
    features: [
      "✅ Todo lo de Pro",
      "✅ Predicciones IA ilimitadas ∞",
      "✅ Guía Turista 16 sedes",
      "✅ Restaurantes latinos por ciudad",
      "✅ Transporte y fan zones",
      "✅ Frases útiles + WhatsApp",
      "✅ Clima por sede",
      "❌ Análisis de apuestas IA",
    ],
  },
  {
    key: "ultimate",
    name: "Fan Ultimate",
    price: "$7.99",
    sub: "pago único",
    badge: "🏆 Todo incluido",
    badgeColor: "#ff7a00",
    color: "#ff7a00",
    url: GUMROAD.ultimate,
    features: [
      "✅ Todo lo anterior",
      "✅ Análisis apuestas con IA",
      "✅ Picks con % de probabilidad",
      "✅ Alertas de valor (EV+)",
      "✅ Acceso anticipado a features",
    ],
  },
];

export default function PricingModal({ defaultTier = "vip", onClose, onActivate }) {
  const [selected, setSelected] = useState(defaultTier);
  const plan = PLANS.find(p => p.key === selected);

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:1000,
      background:"rgba(0,0,0,.75)", backdropFilter:"blur(8px)",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:"16px",
    }} onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>

      <div style={{
        background:"linear-gradient(160deg,#010c1f,#021428)",
        border:"1px solid #c9a84c55",
        borderRadius:18, width:"100%", maxWidth:480,
        maxHeight:"90vh", overflowY:"auto",
        boxShadow:"0 24px 64px rgba(0,0,0,.7)",
      }}>
        {/* Header */}
        <div style={{
          padding:"20px 20px 0",
          display:"flex", justifyContent:"space-between", alignItems:"flex-start",
        }}>
          <div>
            <div style={{fontSize:18, fontWeight:900, color:"#ffd700", letterSpacing:".06em"}}>
              🏆 DESBLOQUEA EL MUNDIAL
            </div>
            <div style={{fontSize:12, color:"#556", marginTop:3}}>
              Pago único · Sin suscripción · Válido todo el torneo
            </div>
          </div>
          <button onClick={onClose} style={{
            background:"none", border:"none", color:"#556",
            fontSize:22, cursor:"pointer", lineHeight:1, padding:"0 4px",
          }}>×</button>
        </div>

        {/* Plan selector tabs */}
        <div style={{
          display:"flex", gap:6, padding:"16px 20px 0",
          overflowX:"auto",
        }}>
          {PLANS.map(p => (
            <button key={p.key} onClick={() => setSelected(p.key)} style={{
              flex:"1 1 auto", minWidth:70, padding:"8px 4px",
              borderRadius:10, border:"none",
              background: selected===p.key
                ? `rgba(${p.key==="free"?"80,80,80":p.key==="pro"?"74,158,255":p.key==="vip"?"201,168,76":"255,122,0"},.2)`
                : "rgba(255,255,255,.04)",
              borderBottom: selected===p.key ? `2px solid ${p.color}` : "2px solid transparent",
              cursor:"pointer", transition:"all .2s",
            }}>
              <div style={{fontSize:13, fontWeight:900, color: selected===p.key ? p.color : "#444"}}>
                {p.price}
              </div>
              <div style={{fontSize:10, color:"#445", marginTop:2, letterSpacing:".04em"}}>
                {p.name}
              </div>
            </button>
          ))}
        </div>

        {/* Selected plan detail */}
        <div style={{padding:"16px 20px"}}>
          {plan.badge && (
            <div style={{
              display:"inline-block", marginBottom:10,
              padding:"3px 10px", borderRadius:12,
              background:`${plan.badgeColor}22`,
              border:`1px solid ${plan.badgeColor}55`,
              color: plan.badgeColor, fontSize:11, fontWeight:700,
            }}>
              {plan.badge}
            </div>
          )}

          {/* Features list */}
          <div style={{
            background:"rgba(8,40,80,.5)", borderRadius:12,
            padding:"14px", marginBottom:16,
          }}>
            {plan.features.map((f,i) => (
              <div key={i} style={{
                fontSize:13, lineHeight:1.7,
                color: f.startsWith("✅") ? "#a0c8a0" : "#3a4a5a",
              }}>{f}</div>
            ))}
          </div>

          {/* CTA */}
          {plan.key === "free" ? (
            <div style={{
              textAlign:"center", padding:"12px",
              background:"rgba(255,255,255,.04)", borderRadius:10,
              fontSize:13, color:"#445",
            }}>
              Ya estás en el plan gratuito 🎉<br/>
              <span style={{fontSize:12, color:"#334"}}>Selecciona otro plan para mejorar</span>
            </div>
          ) : (
            <a href={plan.url} target="_blank" rel="noopener noreferrer"
              style={{
                display:"block", textAlign:"center",
                padding:"14px", borderRadius:12,
                background:`linear-gradient(135deg,${plan.color},${plan.color}bb)`,
                color: plan.key==="vip" ? "#0a1f40" : "#fff",
                fontWeight:900, fontSize:15, textDecoration:"none",
                letterSpacing:".06em",
              }}>
              🛒 Obtener {plan.name} — {plan.price}
            </a>
          )}

          <div style={{
            marginTop:10, fontSize:11, color:"#334", textAlign:"center", lineHeight:1.5,
          }}>
            Después de pagar en Gumroad recibirás tu código por email en &lt;2 horas
          </div>
        </div>

        {/* Divider */}
        <div style={{borderTop:"1px solid #1a2a3a", margin:"0 20px"}} />

        {/* Code activator */}
        <div style={{padding:"16px 20px 20px"}}>
          <div style={{fontSize:12, color:"#c9a84c", fontWeight:700, marginBottom:10}}>
            🔑 ¿Ya tienes tu código?
          </div>
          <CodeActivator
            onActivate={(tier) => {
              onActivate?.(tier);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}
