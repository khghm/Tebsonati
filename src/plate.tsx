/* ===== سامانهٔ تصویرسازی نسخه‌های خطی =====
   برای هر مدخل دانشنامه، بر پایهٔ شناسه و مزاج، یک «تصویر نسخهٔ خطی» یکتا
   به سبک هرباریوم و تذهیب ایرانی تولید می‌شود. */
import { useEffect, useId, useMemo, useState } from "react";
import { TEMPERAMENTS } from "./data";
import { entryPhoto } from "./entryImages";
import { useWikiPhoto } from "./wikiPhotos";

export type ArtKind = "herb" | "food" | "compound" | "disease" | "mizaj";

const GOLD = "#e3b558";
const IVORY = "#f0e8d8";

/* رنگ بر پایهٔ مزاج — سازگار با TEMPERAMENTS و نام‌های اختصاری اخلاط */
const COLOR_ALIASES: Record<string, string> = {
  safra: "#e3b558",
  dam: "#d8604a",
  balgham: "#3fc8b8",
  sauda: "#7f93ad",
  hot: "#d8604a",
  cold: "#3fc8b8",
  wet: "#7fb8c9",
  dry: "#e3b558",
  balanced: "#8fbc7f",
};

function resolveColor(temperament?: string): string {
  if (!temperament) return GOLD;
  if (TEMPERAMENTS[temperament as keyof typeof TEMPERAMENTS]) return TEMPERAMENTS[temperament as keyof typeof TEMPERAMENTS].color;
  return COLOR_ALIASES[temperament] ?? GOLD;
}

/* مولد اعداد شبه‌تصادفی قطعی */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function strSeed(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

type Rnd = () => number;
const R = (r: Rnd, min: number, max: number) => min + r() * (max - min);
const RI = (r: Rnd, min: number, max: number) => Math.floor(R(r, min, max + 1));

/* ---------- قاب مشترک: زمینه + تذهیب ---------- */
function Frame({ gid, color, r, caption }: { gid: string; color: string; r: Rnd; caption?: string }) {
  const stars = Array.from({ length: RI(r, 6, 10) }, () => ({
    x: R(r, 10, 190),
    y: R(r, 8, 118),
    s: R(r, 0.5, 1.4),
    o: R(r, 0.12, 0.4),
  }));
  return (
    <>
      <defs>
        <linearGradient id={`${gid}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d1b2b" />
          <stop offset="100%" stopColor="#12253a" />
        </linearGradient>
        <radialGradient id={`${gid}-glow`} cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor={color} stopOpacity="0.16" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="200" height="140" fill={`url(#${gid}-bg)`} />
      <rect width="200" height="140" fill={`url(#${gid}-glow)`} />
      {stars.map((st, i) => (
        <circle key={i} cx={st.x} cy={st.y} r={st.s} fill={IVORY} opacity={st.o} />
      ))}
      {/* قاب دوگانهٔ طلایی */}
      <rect x="4" y="4" width="192" height="132" fill="none" stroke={GOLD} strokeOpacity="0.5" strokeWidth="1.2" />
      <rect x="8" y="8" width="184" height="124" fill="none" stroke={GOLD} strokeOpacity="0.16" strokeWidth="0.7" />
      {/* لچکی‌های گوشه */}
      {[
        [4, 4, 0],
        [196, 4, 90],
        [196, 136, 180],
        [4, 136, 270],
      ].map(([x, y, rot], i) => (
        <path
          key={i}
          d="M0 14 L0 0 L14 0"
          transform={`translate(${x} ${y}) rotate(${rot})`}
          fill="none"
          stroke={color}
          strokeOpacity="0.85"
          strokeWidth="1.6"
        />
      ))}
      {caption && (
        <text x="100" y="129" textAnchor="middle" fill={IVORY} opacity="0.75" style={{ fontSize: 7.5, fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", letterSpacing: 0.6 }}>
          {caption}
        </text>
      )}
    </>
  );
}

/* ---------- برگ ---------- */
function Leaf({ x, y, len, w, angle, color, fillO = 0.28 }: { x: number; y: number; len: number; w: number; angle: number; color: string; fillO?: number }) {
  return (
    <ellipse cx={x} cy={y} rx={len / 2} ry={w / 2} transform={`rotate(${angle} ${x} ${y})`} fill={color} fillOpacity={fillO} stroke={GOLD} strokeOpacity="0.7" strokeWidth="0.8" />
  );
}

/* ---------- گیاه: ساقهٔ خمیده با برگ‌ها و گل ---------- */
function HerbMotif({ r, color }: { r: Rnd; color: string }) {
  const pts = (t: number, x0: number, cx: number, x1: number, y0: number, y1: number) => ({
    x: (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1,
    y: (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * ((y0 + y1) / 2) + t * t * y1,
  });
  const stems = RI(r, 1, 2);
  const out: React.ReactNode[] = [];
  for (let s = 0; s < stems; s++) {
    const x0 = 100 + (s === 0 ? 0 : R(r, -30, 30));
    const cx = x0 + R(r, -22, 22);
    const top = { x: cx + R(r, -8, 8), y: s === 0 ? R(r, 26, 34) : R(r, 48, 62) };
    const d = `M ${x0} 116 Q ${cx} ${(116 + top.y) / 2} ${top.x} ${top.y}`;
    out.push(<path key={`st${s}`} d={d} fill="none" stroke={GOLD} strokeWidth={s === 0 ? 1.6 : 1.1} strokeOpacity="0.85" strokeLinecap="round" />);
    /* برگ‌ها */
    const nLeaves = RI(r, 3, 5);
    for (let i = 0; i < nLeaves; i++) {
      const t = 0.18 + (i / nLeaves) * 0.62;
      const p = pts(t, x0, cx, top.x, 116, top.y);
      const side = i % 2 === 0 ? -1 : 1;
      const ang = side * R(r, 28, 52) + (side > 0 ? -8 : 8);
      const len = R(r, 16, 26);
      const lx = p.x + side * (len / 2) * Math.cos((ang * Math.PI) / 180);
      const ly = p.y - (len / 4) * 0.4;
      out.push(<Leaf key={`lf${s}-${i}`} x={lx} y={ly} len={len} w={R(r, 6, 9)} angle={ang} color={color} fillO={R(r, 0.18, 0.34)} />);
    }
    /* گل */
    const ft = RI(r, 0, 3);
    if (ft === 0) {
      const n = RI(r, 5, 8);
      const pr = R(r, 8, 11);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const px = top.x + Math.cos(a) * pr * 0.72;
        const py = top.y + Math.sin(a) * pr * 0.72;
        out.push(<ellipse key={`pt${s}-${i}`} cx={px} cy={py} rx={pr / 2.1} ry={pr / 4.4} transform={`rotate(${(a * 180) / Math.PI} ${px} ${py})`} fill={color} fillOpacity="0.4" stroke={GOLD} strokeOpacity="0.7" strokeWidth="0.7" />);
      }
      out.push(<circle key={`pc${s}`} cx={top.x} cy={top.y} r={R(r, 2.4, 3.6)} fill={GOLD} fillOpacity="0.9" />);
    } else if (ft === 1) {
      out.push(
        <path key={`bl${s}`} d={`M ${top.x - 8} ${top.y + 2} Q ${top.x - 9} ${top.y - 9} ${top.x} ${top.y - 11} Q ${top.x + 9} ${top.y - 9} ${top.x + 8} ${top.y + 2} Q ${top.x} ${top.y + 6} ${top.x - 8} ${top.y + 2} Z`} fill={color} fillOpacity="0.4" stroke={GOLD} strokeOpacity="0.8" strokeWidth="0.8" />
      );
      out.push(<circle key={`blc${s}`} cx={top.x} cy={top.y + 4} r="1.6" fill={GOLD} />);
    } else if (ft === 2) {
      const k = RI(r, 5, 8);
      for (let i = 0; i < k; i++) {
        out.push(<circle key={`um${s}-${i}`} cx={top.x + R(r, -11, 11)} cy={top.y + R(r, -9, 7)} r={R(r, 1.6, 2.8)} fill={color} fillOpacity="0.55" stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.6" />);
      }
    } else {
      const k = RI(r, 4, 6);
      for (let i = 0; i < k; i++) {
        out.push(<ellipse key={`sp${s}-${i}`} cx={top.x} cy={top.y - i * 4.4} rx={R(r, 4.5, 6.5) - i * 0.5} ry="2.6" fill={color} fillOpacity={0.5 - i * 0.05} stroke={GOLD} strokeOpacity="0.6" strokeWidth="0.6" />);
      }
    }
  }
  /* ریشه */
  const roots = RI(r, 2, 4);
  for (let i = 0; i < roots; i++) {
    const a = R(r, -40, 40);
    out.push(<path key={`rt${i}`} d={`M 100 116 q ${a * 0.4} ${R(r, 5, 9)} ${a} ${R(r, 8, 15)}`} fill="none" stroke={GOLD} strokeOpacity="0.45" strokeWidth="1" strokeLinecap="round" />);
  }
  out.push(<ellipse key="ground" cx="100" cy="116" rx="34" ry="2.4" fill={GOLD} fillOpacity="0.16" />);
  return <>{out}</>;
}

/* ---------- غذا: ظرف یا میوه ---------- */
function FoodMotif({ r, color }: { r: Rnd; color: string }) {
  const out: React.ReactNode[] = [];
  const bowl = r() < 0.5;
  if (bowl) {
    out.push(
      <path key="bowl" d="M 48 84 Q 50 112 100 112 Q 150 112 152 84 Z" fill={color} fillOpacity="0.14" stroke={GOLD} strokeWidth="1.4" strokeOpacity="0.85" />
    );
    out.push(<ellipse key="rim" cx="100" cy="84" rx="52" ry="9" fill="#0d1b2b" stroke={GOLD} strokeWidth="1.2" strokeOpacity="0.9" />);
    const k = RI(r, 4, 7);
    for (let i = 0; i < k; i++) {
      out.push(<circle key={`f${i}`} cx={R(r, 62, 138)} cy={R(r, 72, 84)} r={R(r, 4, 7)} fill={color} fillOpacity="0.5" stroke={GOLD} strokeOpacity="0.6" strokeWidth="0.7" />);
    }
    /* بخار */
    for (let i = 0; i < 2; i++) {
      const x = 88 + i * 24;
      out.push(<path key={`sm${i}`} d={`M ${x} 66 q 5 -8 0 -16 q -5 -8 0 -16`} fill="none" stroke={IVORY} strokeOpacity="0.3" strokeWidth="1.2" strokeLinecap="round" />);
    }
    out.push(<ellipse key="sh" cx="100" cy="118" rx="42" ry="2.6" fill={GOLD} fillOpacity="0.14" />);
  } else {
    /* بشقاب با میوه‌های چیده */
    out.push(<ellipse key="plate" cx="100" cy="96" rx="56" ry="15" fill={color} fillOpacity="0.08" stroke={GOLD} strokeWidth="1.3" strokeOpacity="0.85" />);
    out.push(<ellipse key="plate2" cx="100" cy="96" rx="42" ry="10.5" fill="none" stroke={GOLD} strokeWidth="0.8" strokeOpacity="0.4" />);
    const k = RI(r, 3, 5);
    for (let i = 0; i < k; i++) {
      const fx = 100 + (i - (k - 1) / 2) * R(r, 16, 22);
      const fy = 86 - (i % 2 === 0 ? 0 : 8);
      const rad = R(r, 7, 11);
      out.push(<circle key={`fr${i}`} cx={fx} cy={fy} r={rad} fill={color} fillOpacity="0.45" stroke={GOLD} strokeOpacity="0.75" strokeWidth="0.9" />);
      out.push(<path key={`fl${i}`} d={`M ${fx} ${fy - rad} q 4 -6 9 -6 q -2 5 -9 6 Z`} fill="#8fbc7f" fillOpacity="0.6" stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.5" />);
    }
    out.push(<ellipse key="sh" cx="100" cy="114" rx="48" ry="2.6" fill={GOLD} fillOpacity="0.12" />);
  }
  /* تزئین جانبی */
  const gx = r() < 0.5 ? 30 : 170;
  out.push(<Leaf key="garn" x={gx} y={104} len={18} w={6} angle={r() < 0.5 ? -30 : 210} color={color} fillO={0.3} />);
  out.push(<circle key="gd" cx={gx + (r() < 0.5 ? 10 : -10)} cy={96} r="2" fill={GOLD} fillOpacity="0.8" />);
  return <>{out}</>;
}

/* ---------- مرکب: قرابادین (قمقمه/هاون) ---------- */
function CompoundMotif({ r, color, gid }: { r: Rnd; color: string; gid: string }) {
  const out: React.ReactNode[] = [];
  if (r() < 0.55) {
    /* قمقمهٔ تقطیر */
    out.push(
      <clipPath key="clip" id={`${gid}-liq`}>
        <circle cx="100" cy="88" r="27" />
      </clipPath>
    );
    out.push(<circle key="body" cx="100" cy="88" r="27" fill={color} fillOpacity="0.1" stroke={GOLD} strokeWidth="1.4" strokeOpacity="0.9" />);
    out.push(<rect key="liq" x="73" y="96" width="54" height="20" fill={color} fillOpacity="0.45" clipPath={`url(#${gid}-liq)`} />);
    out.push(<rect key="neck" x="93" y="42" width="14" height="22" fill={color} fillOpacity="0.1" stroke={GOLD} strokeWidth="1.3" strokeOpacity="0.9" />);
    out.push(<rect key="lip" x="90" y="38" width="20" height="6" fill="none" stroke={GOLD} strokeWidth="1.2" strokeOpacity="0.9" />);
    out.push(<path key="spout" d="M 107 52 q 16 4 22 16 l -5 3 q -8 -10 -17 -13 Z" fill={color} fillOpacity="0.15" stroke={GOLD} strokeWidth="1.1" strokeOpacity="0.85" />);
    /* قطره‌ها */
    for (let i = 0; i < 3; i++) {
      out.push(<path key={`dp${i}`} d={`M ${131 + i * 2} ${74 + i * 11} q 2.6 4 0 6 q -2.6 -2 0 -6 Z`} fill={color} fillOpacity="0.7" />);
    }
    /* حباب‌ها */
    for (let i = 0; i < 4; i++) {
      out.push(<circle key={`bb${i}`} cx={R(r, 84, 116)} cy={R(r, 92, 108)} r={R(r, 1.2, 2.6)} fill={IVORY} fillOpacity="0.5" />);
    }
    out.push(<ellipse key="sh" cx="100" cy="120" rx="34" ry="2.6" fill={GOLD} fillOpacity="0.14" />);
  } else {
    /* هاون و دسته */
    out.push(<path key="mortar" d="M 62 82 L 70 114 Q 100 122 130 114 L 138 82 Z" fill={color} fillOpacity="0.12" stroke={GOLD} strokeWidth="1.4" strokeOpacity="0.9" />);
    out.push(<ellipse key="mrim" cx="100" cy="82" rx="38" ry="8" fill="#0d1b2b" stroke={GOLD} strokeWidth="1.2" strokeOpacity="0.9" />);
    out.push(<ellipse key="mliq" cx="100" cy="83" rx="28" ry="5" fill={color} fillOpacity="0.45" />);
    const pa = R(r, 24, 40);
    out.push(<line key="pestle" x1="100" y1="80" x2={100 + 34 * Math.cos((pa * Math.PI) / 180)} y2={80 - 40 * Math.sin((pa * Math.PI) / 180)} stroke={GOLD} strokeWidth="5" strokeLinecap="round" strokeOpacity="0.85" />);
    /* ذرات پخش‌شده */
    for (let i = 0; i < 5; i++) {
      out.push(<circle key={`gr${i}`} cx={R(r, 76, 124)} cy={R(r, 60, 76)} r={R(r, 0.8, 1.8)} fill={color} fillOpacity="0.7" />);
    }
    out.push(<ellipse key="sh" cx="100" cy="120" rx="40" ry="2.6" fill={GOLD} fillOpacity="0.14" />);
  }
  /* هلال تزئینی */
  const hx = r() < 0.5 ? 26 : 174;
  out.push(<path key="moon" d={`M ${hx} 24 a 9 9 0 1 0 6 16 a 7.5 7.5 0 1 1 -6 -16 Z`} fill={GOLD} fillOpacity="0.55" />);
  return <>{out}</>;
}

/* ---------- بیماری: نبض و گره‌های آسیب ---------- */
function DiseaseMotif({ r, color }: { r: Rnd; color: string }) {
  const out: React.ReactNode[] = [];
  /* خط نبض */
  const ys: number[] = [];
  let x = 12;
  const segs: string[] = [`M 12 70`];
  while (x < 188) {
    const spike = r() < 0.32;
    const nx = x + R(r, 12, 24);
    if (spike) {
      const h = R(r, 16, 30) * (r() < 0.5 ? -1 : 1);
      segs.push(`L ${x + 4} 70 L ${x + 7} ${70 + h} L ${x + 10} 70 L ${nx} 70`);
    } else {
      segs.push(`L ${nx} ${70 + R(r, -3, 3)}`);
    }
    x = nx;
  }
  const dPulse = segs.join(" ");
  out.push(<path key="pulseGlow" d={dPulse} fill="none" stroke={color} strokeWidth="4" strokeOpacity="0.15" strokeLinejoin="round" />);
  out.push(<path key="pulse" d={dPulse} fill="none" stroke={color} strokeWidth="1.4" strokeOpacity="0.9" strokeLinejoin="round" />);
  /* حلقهٔ تعادل شکسته */
  const cy = r() < 0.5 ? 38 : 102;
  out.push(<path key="arc1" d={`M ${100 - 20} ${cy} a 20 20 0 0 1 32 -13`} fill="none" stroke={GOLD} strokeWidth="1.6" strokeOpacity="0.8" strokeLinecap="round" />);
  out.push(<path key="arc2" d={`M ${100 + 19} ${cy + 7} a 20 20 0 0 1 -27 12`} fill="none" stroke={color} strokeWidth="1.6" strokeOpacity="0.8" strokeLinecap="round" strokeDasharray="3 4" />);
  out.push(<circle key="core" cx="100" cy={cy} r="3.4" fill={color} fillOpacity="0.85" />);
  /* شبکهٔ گره‌ها */
  const nodes = Array.from({ length: RI(r, 4, 6) }, () => ({ x: R(r, 18, 182), y: cy < 70 ? R(r, 88, 122) : R(r, 18, 52) }));
  nodes.forEach((n, i) => {
    const m = nodes[(i + 1) % nodes.length];
    out.push(<line key={`ln${i}`} x1={n.x} y1={n.y} x2={m.x} y2={m.y} stroke={GOLD} strokeOpacity="0.22" strokeWidth="0.7" />);
    out.push(<circle key={`nd${i}`} cx={n.x} cy={n.y} r="2.2" fill={i % 2 ? color : GOLD} fillOpacity="0.75" />);
  });
  return <>{out}</>;
}

/* ---------- مزاج: ستارهٔ گره (خاتم) ---------- */
function MizajMotif({ r, color }: { r: Rnd; color: string }) {
  const out: React.ReactNode[] = [];
  const n = RI(r, 6, 10);
  const cx = 100;
  const cy = 70;
  const R1 = R(r, 34, 40);
  const R2 = R1 * R(r, 0.42, 0.55);
  const starPts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const rad = i % 2 === 0 ? R1 : R2;
    const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2;
    starPts.push(`${cx + rad * Math.cos(a)},${cy + rad * Math.sin(a)}`);
  }
  out.push(<polygon key="star" points={starPts.join(" ")} fill={color} fillOpacity="0.16" stroke={color} strokeWidth="1.4" strokeOpacity="0.9" strokeLinejoin="round" />);
  const innerPts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    innerPts.push(`${cx + R2 * 0.72 * Math.cos(a)},${cy + R2 * 0.72 * Math.sin(a)}`);
  }
  out.push(<polygon key="inner" points={innerPts.join(" ")} fill="none" stroke={GOLD} strokeWidth="0.9" strokeOpacity="0.8" />);
  out.push(<circle key="c1" cx={cx} cy={cy} r={R2 * 0.34} fill={color} fillOpacity="0.55" />);
  out.push(<circle key="ring" cx={cx} cy={cy} r={R1 + 8} fill="none" stroke={GOLD} strokeWidth="0.8" strokeOpacity="0.35" strokeDasharray="2 5" />);
  /* چهار سکنج در چهار جهت */
  [[cx, cy - R1 - 16], [cx, cy + R1 + 16], [cx - R1 - 16, cy], [cx + R1 + 16, cy]].forEach(([px, py], i) => {
    out.push(<rect key={`sq${i}`} x={px - 3} y={py - 3} width="6" height="6" transform={`rotate(45 ${px} ${py})`} fill={i % 2 ? GOLD : color} fillOpacity="0.6" />);
  });
  return <>{out}</>;
}

/* ---------- کامپوننت اصلی ---------- */
export function PlateArt({
  kind,
  id,
  temperament,
  color: colorOverride,
  caption,
  className = "",
}: {
  kind: ArtKind;
  id: string;
  temperament?: string;
  color?: string;
  caption?: string;
  className?: string;
}) {
  const gid = useId();
  const content = useMemo(() => {
    const r = mulberry32(strSeed(id + kind));
    const color = colorOverride ?? resolveColor(temperament);
    const frame = <Frame gid={gid} color={color} r={mulberry32(strSeed(id))} caption={caption} />;
    let motif: React.ReactNode = null;
    if (kind === "herb") motif = <HerbMotif r={r} color={color} />;
    else if (kind === "food") motif = <FoodMotif r={r} color={color} />;
    else if (kind === "compound") motif = <CompoundMotif r={r} color={color} gid={gid} />;
    else if (kind === "disease") motif = <DiseaseMotif r={r} color={color} />;
    else motif = <MizajMotif r={r} color={color} />;
    return (
      <>
        {frame}
        {motif}
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, kind, temperament, colorOverride, caption, gid]);

  return (
    <svg viewBox="0 0 200 140" preserveAspectRatio="xMidYMid slice" className={`w-full h-full block ${className}`} role="img" aria-hidden="true">
      {content}
    </svg>
  );
}

/* ---------- تصویر واقعی مدخل ----------
   تصویر فتورئالیستیک متناسب با مدخل را نمایش می‌دهد؛ در صورت خطا در بارگذاری،
   به‌صورت خودکار به تصویر نسخهٔ خطی برمی‌گردد. */
export function EntryPhoto({
  kind,
  id,
  temperament,
  hint = "",
  caption,
  tint,
  wiki,
  className = "",
}: {
  kind: ArtKind;
  id: string;
  temperament?: string;
  hint?: string;
  caption?: string;
  tint?: string;
  wiki?: string | null;
  className?: string;
}) {
  const [err, setErr] = useState(false);
  const [wikiFailed, setWikiFailed] = useState(false);
  const base = useMemo(() => entryPhoto(kind, hint, id), [kind, hint, id]);
  const wikiUrl = useWikiPhoto(wiki ?? null);

  /* با تغییر آدرس، وضعیت خطا بازنشانی می‌شود */
  useEffect(() => {
    setWikiFailed(false);
  }, [wikiUrl]);

  /* نمایش خوش‌بینانه: به‌محض رسیدن آدرسِ عکس واقعی، آن را نشان می‌دهیم و فقط در صورت خطا پنهان می‌کنیم.
     این کار باگ «تصویرِ از پیش کش‌شده که رویداد onLoad برایش شلیک نمی‌کند» را برطرف می‌کند. */
  const showWiki = !!wikiUrl && !wikiFailed;

  return (
    <div className={`relative w-full h-full overflow-hidden bg-deep ${className}`}>
      {/* لایهٔ پایه (دسته‌بندی یا نسخهٔ خطی) — همیشه زیر، تا هیچ‌گاه جای خالی نباشد */}
      {base && !err ? (
        <img
          src={base}
          alt=""
          loading="lazy"
          onError={() => setErr(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${showWiki ? "opacity-0" : "opacity-100"}`}
        />
      ) : (
        <div className={`absolute inset-0 transition-opacity duration-700 ${showWiki ? "opacity-0" : "opacity-100"}`}>
          <PlateArt kind={kind} id={id} temperament={temperament} />
        </div>
      )}

      {/* عکس واقعیِ خود مدخل — به‌محض رسیدن آدرس سوار می‌شود؛ فقط در صورت خطا پنهان می‌ماند */}
      {wikiUrl && (
        <img
          src={wikiUrl}
          alt={caption ?? ""}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setWikiFailed(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out hover:scale-[1.06] ${showWiki ? "opacity-100" : "opacity-0"}`}
        />
      )}

      {/* سایهٔ خوانایی و لایهٔ رنگ مزاج */}
      <span className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,21,34,0.62), rgba(10,21,34,0.05) 55%)" }} />
      {tint && <span className="pointer-events-none absolute inset-0 mix-blend-color" style={{ background: tint }} />}
      {caption && (
        <span
          className="absolute bottom-1.5 start-2 text-[9.5px] italic text-[#eadfc6]/95"
          dir="ltr"
          style={{ textAlign: "left", textShadow: "0 1px 4px rgba(0,0,0,0.85)" }}
        >
          {caption}
        </span>
      )}
      {/* قاب تزئینی */}
      <span className="pointer-events-none absolute inset-1.5 border border-[#e3b558]/25" />
    </div>
  );
}
