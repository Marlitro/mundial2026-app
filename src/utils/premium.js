export const PREMIUM_CODES = {
  // ── PRO $0.99 ──────────────────────────────
  'PRO2026':          'pro',
  'FANPRO26':         'pro',
  'MUNDIAL99':        'pro',
  'PREDICION26':      'pro',
  'PICKS2026':        'pro',
  'KOFI2026':         'pro',

  // ── VIP $4.99 ──────────────────────────────
  'MARLITROTURISTA2026': 'vip',
  'TURISTA2026':      'vip',
  'MUNDIAL499':       'vip',
  'FANVIP26':         'vip',
  'GUIA2026':         'vip',
  'SEDES2026':        'vip',
  'VIAJERO26':        'vip',
  'TIKTOK2026':       'vip',
  'BETA2026':         'vip',

  // ── ULTIMATE $7.99 ─────────────────────────
  'ULTIMATE26':       'ultimate',
  'MUNDIAL799':       'ultimate',
  'FANFULL26':        'ultimate',
  'TODOACCESS26':     'ultimate',
  'APUESTAS26':       'ultimate',
  'PRENSA26':         'ultimate',
};

export const TIER_LABELS = {
  free:     { label:"Fan Básico",   emoji:"",   color:"#556" },
  pro:      { label:"Fan Pro",      emoji:"⚡",  color:"#4a9eff" },
  vip:      { label:"Fan VIP",      emoji:"⭐",  color:"#ffd700" },
  ultimate: { label:"Fan Ultimate", emoji:"🏆",  color:"#ff7a00" },
};

// Límites de predicciones IA por tier
// free: 1 por día | pro: 20 totales en el torneo | vip/ultimate: ilimitadas
export const TIER_ACCESS = {
  free:     { guiaTurista:false, prediccionesIA:"1/día",   iaLimit:1,  iaMode:"daily",    quiniela:true, apuestas:false },
  pro:      { guiaTurista:false, prediccionesIA:"20 total", iaLimit:20, iaMode:"total",    quiniela:true, apuestas:false },
  vip:      { guiaTurista:true,  prediccionesIA:"∞",        iaLimit:999,iaMode:"unlimited",quiniela:true, apuestas:false },
  ultimate: { guiaTurista:true,  prediccionesIA:"∞",        iaLimit:999,iaMode:"unlimited",quiniela:true, apuestas:true  },
};

export const GUMROAD = {
  pro:      "https://marlitro.gumroad.com/l/fanpro",
  vip:      "https://marlitro.gumroad.com/l/fanvip",
  ultimate: "https://marlitro.gumroad.com/l/fanultimate",
};

// ── Storage keys ───────────────────────────────────────────────────────────
const TIER_KEY        = 'premium:tier';
const IA_TOTAL_KEY    = 'ia:count:total';
const IA_DATE_KEY     = 'ia:date:daily';
const IA_DAILY_KEY    = 'ia:count:daily';

// ── Tier ───────────────────────────────────────────────────────────────────
export function checkPremium() {
  try {
    const raw = localStorage.getItem(TIER_KEY);
    return raw ? JSON.parse(raw) : { tier: 'free' };
  } catch { return { tier: 'free' }; }
}

export function activatePremium(code) {
  const tier = PREMIUM_CODES[code.toUpperCase().trim()];
  if (!tier) return { success: false, msg: 'Código inválido' };
  const data = { tier, code: code.toUpperCase().trim(), activatedAt: Date.now() };
  localStorage.setItem(TIER_KEY, JSON.stringify(data));
  return { success: true, tier };
}

export function hasTouristAccess() {
  const { tier } = checkPremium();
  return TIER_ACCESS[tier]?.guiaTurista ?? false;
}

// ── Contador de predicciones IA ────────────────────────────────────────────
export function getIaUsage(tier) {
  const access = TIER_ACCESS[tier] || TIER_ACCESS.free;
  try {
    if (access.iaMode === 'daily') {
      const today = new Date().toISOString().split('T')[0];
      const saved = localStorage.getItem(IA_DATE_KEY);
      const count = saved === today ? parseInt(localStorage.getItem(IA_DAILY_KEY) || '0') : 0;
      return { used: count, limit: access.iaLimit, mode: 'daily', remaining: access.iaLimit - count };
    }
    if (access.iaMode === 'total') {
      const count = parseInt(localStorage.getItem(IA_TOTAL_KEY) || '0');
      return { used: count, limit: access.iaLimit, mode: 'total', remaining: access.iaLimit - count };
    }
    return { used: 0, limit: 999, mode: 'unlimited', remaining: 999 };
  } catch {
    return { used: 0, limit: access.iaLimit, mode: access.iaMode, remaining: access.iaLimit };
  }
}

export function canUseIa(tier) {
  const { remaining } = getIaUsage(tier);
  return remaining > 0;
}

export function recordIaUse(tier) {
  const access = TIER_ACCESS[tier] || TIER_ACCESS.free;
  try {
    if (access.iaMode === 'daily') {
      const today = new Date().toISOString().split('T')[0];
      const savedDate = localStorage.getItem(IA_DATE_KEY);
      const prev = savedDate === today ? parseInt(localStorage.getItem(IA_DAILY_KEY) || '0') : 0;
      localStorage.setItem(IA_DATE_KEY, today);
      localStorage.setItem(IA_DAILY_KEY, String(prev + 1));
    } else if (access.iaMode === 'total') {
      const prev = parseInt(localStorage.getItem(IA_TOTAL_KEY) || '0');
      localStorage.setItem(IA_TOTAL_KEY, String(prev + 1));
    }
  } catch {}
}
