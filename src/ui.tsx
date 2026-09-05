import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/* ---------- کمکی‌ها ---------- */
export const fa = (n: number) => n.toLocaleString("fa-IR");
export const toman = (n: number) => `${n.toLocaleString("fa-IR")} تومان`;

/* ---------- آیکن‌های اختصاصی (SVG دست‌ساز) ---------- */
type IconProps = { className?: string };
const S = ({ children, className = "w-5 h-5" }: IconProps & { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    {children}
  </svg>
);

export const Ic = {
  leaf: (p: IconProps) => (
    <S {...p}><path d="M4 20C4 11.5 10.5 4.5 20 4c-.6 9.5-7 16-15.5 16" /><path d="M4 20c3.5-5.5 8-10 13-13.5" /></S>
  ),
  mortar: (p: IconProps) => (
    <S {...p}><path d="M4.5 10h15c0 4.6-3 8-7.5 8s-7.5-3.4-7.5-8Z" /><path d="M13.5 4.5 10 10" /><path d="M9 21h6" /><path d="M4.5 10c-1-1.5-1-3 0-4" /></S>
  ),
  flask: (p: IconProps) => (
    <S {...p}><path d="M10 3h4" /><path d="M11 3v6L5 19a1.5 1.5 0 0 0 1.3 2.2h11.4A1.5 1.5 0 0 0 19 19L13 9V3" /><path d="M8 15h8" /></S>
  ),
  book: (p: IconProps) => (
    <S {...p}><path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15.5H6.75A1.75 1.75 0 0 0 5 20.25Z" /><path d="M19 18.5v2.5H6.75A1.75 1.75 0 0 1 5 19.25" /><path d="M9 7h6" /></S>
  ),
  scroll: (p: IconProps) => (
    <S {...p}><path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2Z" /><path d="M6 4a2 2 0 0 0-2 2v2h4" /><path d="M10 9h7M10 13h7M10 17h4" /></S>
  ),
  scale: (p: IconProps) => (
    <S {...p}><path d="M12 4v16" /><path d="M8 20h8" /><path d="M4 7h16" /><path d="M6.5 7 4 12a2.8 2.8 0 0 0 5.5 0Z" /><path d="M17.5 7 15 12a2.8 2.8 0 0 0 5.5 0Z" /><circle cx="12" cy="4" r="1" /></S>
  ),
  chat: (p: IconProps) => (
    <S {...p}><path d="M4 5.5h16V16h-8.5L7 20v-4H4Z" /><path d="M8 9h8M8 12.5h5" /></S>
  ),
  globe: (p: IconProps) => (
    <S {...p}><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17" /><path d="M12 3.5c2.6 2.3 4 5.2 4 8.5s-1.4 6.2-4 8.5c-2.6-2.3-4-5.2-4-8.5s1.4-6.2 4-8.5Z" /></S>
  ),
  mic: (p: IconProps) => (
    <S {...p}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0" /><path d="M12 17.5V21M9 21h6" /></S>
  ),
  search: (p: IconProps) => (
    <S {...p}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.4-4.4" /></S>
  ),
  bookmark: (p: IconProps) => (
    <S {...p}><path d="M6.5 3.5h11V21L12 16.8 6.5 21Z" /></S>
  ),
  bookmarkFill: (p: IconProps) => (
    <svg viewBox="0 0 24 24" className={p.className ?? "w-5 h-5"} fill="currentColor" aria-hidden="true"><path d="M6.5 3.5h11V21L12 16.8 6.5 21Z" /></svg>
  ),
  star: (p: IconProps) => (
    <svg viewBox="0 0 24 24" className={p.className ?? "w-4 h-4"} fill="currentColor" aria-hidden="true"><path d="m12 2.8 2.8 5.7 6.3.9-4.6 4.4 1.1 6.3L12 17.1l-5.6 3 1.1-6.3L2.9 9.4l6.3-.9Z" /></svg>
  ),
  starLine: (p: IconProps) => (
    <S {...p}><path d="m12 3.5 2.5 5 5.6.8-4 3.9.9 5.6-5-2.6-5 2.6.9-5.6-4-3.9 5.6-.8Z" /></S>
  ),
  arrow: (p: IconProps) => (
    <S {...p}><path d="M19 12H5" /><path d="m11 6-6 6 6 6" /></S>
  ),
  arrowLeft: (p: IconProps) => (
    <S {...p}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></S>
  ),
  close: (p: IconProps) => (
    <S {...p}><path d="m6 6 12 12M18 6 6 18" /></S>
  ),
  menu: (p: IconProps) => (
    <S {...p}><path d="M4 7h16M4 12h16M4 17h10" /></S>
  ),
  check: (p: IconProps) => (
    <S {...p}><path d="m5 13 4 4L19 7" /></S>
  ),
  shield: (p: IconProps) => (
    <S {...p}><path d="M12 3 5 5.8v5.4c0 4.4 3 7.6 7 9.8 4-2.2 7-5.4 7-9.8V5.8Z" /><path d="m9 12 2 2 4-4.5" /></S>
  ),
  calendar: (p: IconProps) => (
    <S {...p}><rect x="4" y="5.5" width="16" height="15" rx="2" /><path d="M4 10h16M8 3.5v4M16 3.5v4" /></S>
  ),
  user: (p: IconProps) => (
    <S {...p}><circle cx="12" cy="8" r="4" /><path d="M4.5 20.5c1.2-3.5 4-5.5 7.5-5.5s6.3 2 7.5 5.5" /></S>
  ),
  cart: (p: IconProps) => (
    <S {...p}><path d="M3.5 5h2.2l2 11h10.5l2.3-8H7" /><circle cx="9" cy="19.5" r="1.4" /><circle cx="16.5" cy="19.5" r="1.4" /></S>
  ),
  play: (p: IconProps) => (
    <svg viewBox="0 0 24 24" className={p.className ?? "w-5 h-5"} fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5Z" /></svg>
  ),
  download: (p: IconProps) => (
    <S {...p}><path d="M12 4v11M7.5 11 12 15.5 16.5 11" /><path d="M5 19.5h14" /></S>
  ),
  send: (p: IconProps) => (
    <S {...p}><path d="m3.5 11.5 17-7.5-7.5 17-2-7.5Z" /><path d="m13 13.5 7.5-9.5" /></S>
  ),
  phone: (p: IconProps) => (
    <S {...p}><path d="M6 3.5h3l1.5 4.5-2 1.5a12 12 0 0 0 6 6l1.5-2 4.5 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 5.7 2 2 0 0 1 6 3.5Z" /></S>
  ),
  mail: (p: IconProps) => (
    <S {...p}><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4.5 7.5 7.5 5.5 7.5-5.5" /></S>
  ),
  pin: (p: IconProps) => (
    <S {...p}><path d="M12 21s-6.5-5.6-6.5-10.4A6.4 6.4 0 0 1 12 4a6.4 6.4 0 0 1 6.5 6.6C18.5 15.4 12 21 12 21Z" /><circle cx="12" cy="10.5" r="2.2" /></S>
  ),
  fire: (p: IconProps) => (
    <S {...p}><path d="M12 3.5C9.5 7 7 9 7 12.5a5 5 0 0 0 10 0C17 9 14.5 7 12 3.5Z" /><path d="M12 17.5a2.2 2.2 0 0 0 2.2-2.2c0-1.4-1-2.4-2.2-4-1.2 1.6-2.2 2.6-2.2 4A2.2 2.2 0 0 0 12 17.5Z" /></S>
  ),
  wind: (p: IconProps) => (
    <S {...p}><path d="M4 8.5h9a2.5 2.5 0 1 0-2.4-3.2" /><path d="M4 13h13a2.5 2.5 0 1 1-2.4 3.2" /><path d="M4 17.5h6" /></S>
  ),
  drop: (p: IconProps) => (
    <S {...p}><path d="M12 3.5S6 10 6 14a6 6 0 0 0 12 0c0-4-6-10.5-6-10.5Z" /><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" /></S>
  ),
  mountain: (p: IconProps) => (
    <S {...p}><path d="m3 19 6.5-10 3.5 5 2.5-3.5L21 19Z" /><path d="M3 19h18" /></S>
  ),
  heart: (p: IconProps) => (
    <S {...p}><path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.2 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z" /></S>
  ),
  eye: (p: IconProps) => (
    <S {...p}><path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" /><circle cx="12" cy="12" r="2.5" /></S>
  ),
  reply: (p: IconProps) => (
    <S {...p}><path d="M10 8H5v5" /><path d="M5.5 12.5A8 8 0 0 1 19 16" /></S>
  ),
  cap: (p: IconProps) => (
    <S {...p}><path d="m12 4 10 4.5L12 13 2 8.5Z" /><path d="M6.5 10.5v4.5c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-4.5" /><path d="M22 8.5V14" /></S>
  ),
  warn: (p: IconProps) => (
    <S {...p}><path d="M12 4 2.5 20h19Z" /><path d="M12 10v4.5" /><circle cx="12" cy="17.2" r="0.4" fill="currentColor" /></S>
  ),
};

/* ---------- شمسه (نشان) ---------- */
export const Shamseh = ({ className = "w-9 h-9" }: IconProps) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
    <rect x="11" y="11" width="18" height="18" fill="#e3b558" transform="rotate(45 20 20)" />
    <rect x="11" y="11" width="18" height="18" fill="#3fc8b8" opacity="0.9" />
    <rect x="11" y="11" width="18" height="18" fill="none" stroke="#f2d592" strokeWidth="1" />
    <circle cx="20" cy="20" r="4.2" fill="#0a1522" />
    <circle cx="20" cy="20" r="1.6" fill="#f2d592" />
  </svg>
);

/* ---------- Toast ---------- */
type Toast = { id: number; msg: string };
const ToastCtx = createContext<{ push: (msg: string) => void }>({ push: () => {} });
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);
  const push = (msg: string) => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400);
  };
  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] flex flex-col gap-2 items-center pointer-events-none px-4">
        {toasts.map((t) => (
          <div key={t.id} className="toast-in pointer-events-auto flex items-center gap-3 bg-pane border border-gold/40 text-ivory text-sm font-medium px-5 py-3 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)]">
            <span className="w-2 h-2 rounded-full bg-teal shadow-[0_0_10px_rgba(63,200,184,0.8)]" />
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* ---------- نشان‌گذاری ---------- */
export type MarkItem = { id: string; label: string; view: string };
type MarksCtx = {
  marks: MarkItem[];
  has: (id: string) => boolean;
  toggle: (item: MarkItem) => void;
};
const BookmarkCtx = createContext<MarksCtx>({ marks: [], has: () => false, toggle: () => {} });
export const useMarks = () => useContext(BookmarkCtx);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [marks, setMarks] = useState<MarkItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("tibb-marks") || "[]") as MarkItem[];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("tibb-marks", JSON.stringify(marks));
    } catch {
      /* ignore */
    }
  }, [marks]);
  const { push } = useToast();
  const has = (id: string) => marks.some((m) => m.id === id);
  const toggle = (item: MarkItem) => {
    setMarks((prev) => {
      if (prev.some((m) => m.id === item.id)) {
        push(`«${item.label}» از نشان‌شده‌ها حذف شد`);
        return prev.filter((m) => m.id !== item.id);
      }
      push(`«${item.label}» نشان شد — در کتابچهٔ شما ذخیره شد`);
      return [...prev, item];
    });
  };
  return <BookmarkCtx.Provider value={{ marks, has, toggle }}>{children}</BookmarkCtx.Provider>;
}

/* ---------- نمایان‌سازی هنگام اسکرول ---------- */
export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("in");
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`rv ${className}`} style={{ ["--rvd" as string]: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ---------- شمارندهٔ اعداد ---------- */
export function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const dur = 1600;
          const tick = (t: number) => {
            const p = Math.min(1, (t - t0) / dur);
            setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);
  return (
    <span ref={ref}>
      {fa(val)}
      {suffix}
    </span>
  );
}

/* ---------- سربرگ بخش ---------- */
export function SectionHead({ kicker, title, desc, align = "center" }: { kicker: string; title: string; desc?: string; align?: "center" | "start" }) {
  return (
    <div className={align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
      <div className={`divider-orn text-[11px] tracking-[0.35em] uppercase mb-3 ${align === "center" ? "" : "justify-start"}`}>
        <span className="font-nasta text-sm tracking-normal text-gold normal-case">{kicker}</span>
      </div>
      <h2 className="font-display text-3xl sm:text-4xl text-ivory leading-[1.25]">{title}</h2>
      {desc && <p className="mt-3 text-dim text-sm sm:text-[15px] leading-7">{desc}</p>}
    </div>
  );
}

/* ---------- امتیاز ستاره‌ای ---------- */
export function Stars({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} title={`امتیاز ${fa(value)} از ۵`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(value) ? "text-gold" : "text-edge"}>
          <Ic.star className="w-3.5 h-3.5" />
        </span>
      ))}
    </span>
  );
}

/* ---------- نشانک مزاج ---------- */
export function TemperChip({ label, color }: { label: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 border" style={{ color, borderColor: `${color}55`, background: `${color}14` }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

/* ---------- دکمهٔ نشان ---------- */
export function MarkButton({ id, label, view, className = "" }: { id: string; label: string; view: string; className?: string }) {
  const { has, toggle } = useMarks();
  const saved = has(id);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggle({ id, label, view });
      }}
      aria-label={saved ? "حذف نشان" : "نشان‌گذاری"}
      className={`transition-all duration-300 ${saved ? "text-gold scale-110" : "text-faint hover:text-gold"} ${className}`}
    >
      {saved ? <Ic.bookmarkFill className="w-4.5 h-4.5" /> : <Ic.bookmark className="w-4.5 h-4.5" />}
    </button>
  );
}

/* ---------- مودال ---------- */
export function Modal({ open, onClose, title, children, wide = false }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-night/85 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${wide ? "max-w-3xl" : "max-w-xl"} max-h-[86vh] overflow-y-auto bg-deep border border-edge frame p-6 sm:p-8 toast-in`}>
        <div className="flex items-start justify-between gap-4 mb-5">
          <h3 className="font-display text-2xl text-goldsoft leading-snug">{title}</h3>
          <button onClick={onClose} className="shrink-0 text-faint hover:text-ivory transition-colors p-1" aria-label="بستن">
            <Ic.close className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
