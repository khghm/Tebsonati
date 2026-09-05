import { useMemo, useState } from "react";
import {
  BOOKS,
  ELEMENTS,
  EVENTS,
  HERBS,
  IMG,
  ONTO_LINKS,
  ONTO_NODES,
  SEASONS,
  STATS,
  TEMPERAMENTS,
} from "../data";
import { LONG_ARTICLES } from "../dataExtra";
import { CountUp, Ic, MarkButton, Reveal, SectionHead, Stars, TemperChip, fa } from "../ui";

type Go = (view: string, opts?: { q?: string }) => void;

const HERO_STATS = STATS;

/* ---------- چرخ اخلاط ---------- */
function ElementWheel() {
  const [active, setActive] = useState(0);
  const el = ELEMENTS[active];
  const quads = [
    "M180 180 L180 28 A152 152 0 0 1 332 180 Z",
    "M180 180 L28 180 A152 152 0 0 1 180 28 Z",
    "M180 180 L180 332 A152 152 0 0 1 28 180 Z",
    "M180 180 L332 180 A152 152 0 0 1 180 332 Z",
  ];
  const order = [0, 1, 3, 2]; // آتش، هوا، خاک، آب
  const labelPos = [
    { x: 246, y: 118 },
    { x: 114, y: 118 },
    { x: 114, y: 252 },
    { x: 246, y: 252 },
  ];
  return (
    <div className="wheel-wrap flex flex-col items-center gap-5">
      <div className="relative w-[min(88vw,420px)] aspect-square select-none">
        <svg viewBox="0 0 360 360" className="w-full h-full">
          {/* حلقهٔ تزئینی چرخان */}
          <g className="anim-spin-slow" style={{ transformOrigin: "180px 180px" }}>
            <circle cx="180" cy="180" r="172" fill="none" stroke="#e3b558" strokeOpacity="0.28" strokeWidth="1" strokeDasharray="3 9" />
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i * Math.PI) / 4;
              const x = 180 + 172 * Math.cos(a);
              const y = 180 + 172 * Math.sin(a);
              return <rect key={i} x={x - 4} y={y - 4} width="8" height="8" transform={`rotate(45 ${x} ${y})`} fill="#3fc8b8" opacity="0.55" />;
            })}
          </g>
          <circle cx="180" cy="180" r="152" fill="#0e1d2e" stroke="#24405c" />
          {/* چهار عنصر */}
          {order.map((ei, qi) => {
            const e = ELEMENTS[ei];
            const isActive = active === ei;
            return (
              <path
                key={e.id}
                d={quads[qi]}
                fill={e.color}
                fillOpacity={isActive ? 0.3 : 0.09}
                stroke={e.color}
                strokeOpacity={isActive ? 1 : 0.4}
                strokeWidth={isActive ? 2 : 1}
                className="cursor-pointer transition-all duration-500 hover:fill-opacity-30"
                onClick={() => setActive(ei)}
              >
                <title>{`${e.name} — ${e.qualities}`}</title>
              </path>
            );
          })}
          <line x1="28" y1="180" x2="332" y2="180" stroke="#0a1522" strokeWidth="3" />
          <line x1="180" y1="28" x2="180" y2="332" stroke="#0a1522" strokeWidth="3" />
          {/* برچسب‌ها */}
          {order.map((ei, qi) => (
            <text
              key={`t-${ei}`}
              x={labelPos[qi].x}
              y={labelPos[qi].y}
              textAnchor="middle"
              className="cursor-pointer"
              onClick={() => setActive(ei)}
              fill={active === ei ? ELEMENTS[ei].color : "#9db1c4"}
              style={{ fontFamily: "Lalezar, serif", fontSize: 24, transition: "fill .4s" }}
            >
              {ELEMENTS[ei].name}
            </text>
          ))}
          {/* مرکز */}
          <circle cx="180" cy="180" r="62" fill="#0a1522" stroke="#e3b558" strokeOpacity="0.7" strokeWidth="1.5" />
          <circle cx="180" cy="180" r="70" fill="none" stroke="#3fc8b8" strokeOpacity="0.3" strokeDasharray="2 6" className="anim-spin-slow" style={{ transformOrigin: "180px 180px" }} />
          <text x="180" y="172" textAnchor="middle" fill="#f2d592" style={{ fontFamily: "Lalezar, serif", fontSize: 21 }}>اخلاط</text>
          <text x="180" y="198" textAnchor="middle" fill="#f2d592" style={{ fontFamily: "Lalezar, serif", fontSize: 21 }}>چهارگانه</text>
        </svg>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full pointer-events-none" style={{ boxShadow: `0 0 70px ${el.color}33` }} />
      </div>

      <div key={el.id} className="toast-in w-full max-w-md border border-edge bg-deep/80 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rotate-45" style={{ background: el.color }} />
            <h3 className="font-display text-xl" style={{ color: el.color }}>{el.name}</h3>
          </div>
          <span className="text-xs text-dim">{el.qualities}</span>
        </div>
        <p className="mt-2 text-[13px] leading-6 text-dim">{el.desc}</p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px]">
          <div className="border border-edge/70 py-2 px-1"><div className="text-faint mb-0.5">خلط</div><div className="text-ivory font-semibold">{el.humour}</div></div>
          <div className="border border-edge/70 py-2 px-1"><div className="text-faint mb-0.5">اندام</div><div className="text-ivory font-semibold">{el.organ}</div></div>
          <div className="border border-edge/70 py-2 px-1"><div className="text-faint mb-0.5">فصل</div><div className="text-ivory font-semibold">{el.season}</div></div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {el.herbs.map((h) => (
            <span key={h} className="text-[11px] px-2 py-0.5 bg-pane text-dim border border-edge/60">
              {h}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- شبکهٔ هستی‌شناسی ---------- */
const NODE_COLORS: Record<string, string> = {
  herb: "#3fc8b8",
  temper: "#e3b558",
  disease: "#d8604a",
  organ: "#8fbc7f",
  compound: "#7f93ad",
};

function OntoGraph() {
  const [hover, setHover] = useState<string | null>(null);
  const pos = useMemo(() => Object.fromEntries(ONTO_NODES.map((n) => [n.id, n])), []);
  const isLit = (a: string, b: string) => hover === null || a === hover || b === hover;
  return (
    <div className="border border-edge bg-deep/70 p-4 h-full">
      <svg viewBox="0 0 100 72" className="w-full h-auto">
        {ONTO_LINKS.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={(pos[a] as (typeof ONTO_NODES)[number]).x}
            y1={(pos[a] as (typeof ONTO_NODES)[number]).y * 0.72}
            x2={(pos[b] as (typeof ONTO_NODES)[number]).x}
            y2={(pos[b] as (typeof ONTO_NODES)[number]).y * 0.72}
            stroke={isLit(a, b) ? (hover ? "#e3b558" : "#3fc8b8") : "#24405c"}
            strokeOpacity={isLit(a, b) ? 0.7 : 0.35}
            strokeWidth="0.35"
            strokeDasharray="1.4 1.4"
            className="transition-all duration-500"
          />
        ))}
        {ONTO_NODES.map((n) => (
          <g
            key={n.id}
            onMouseEnter={() => setHover(n.id)}
            onMouseLeave={() => setHover(null)}
            className="cursor-pointer"
            opacity={isLit(n.id, n.id) ? 1 : 0.35}
          >
            <circle cx={n.x} cy={n.y * 0.72} r={hover === n.id ? 4.6 : 3.6} fill={NODE_COLORS[n.type]} fillOpacity="0.16" stroke={NODE_COLORS[n.type]} strokeWidth="0.4" className="transition-all duration-300" />
            <circle cx={n.x} cy={n.y * 0.72} r="1.1" fill={NODE_COLORS[n.type]} />
            <text x={n.x} y={n.y * 0.72 + 7.4} textAnchor="middle" fill="#f0e8d8" style={{ fontSize: 3.1, fontFamily: "Vazirmatn, sans-serif" }}>
              {n.label}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 justify-center">
        {Object.entries({ گیاه: "#3fc8b8", مزاج: "#e3b558", بیماری: "#d8604a", اندام: "#8fbc7f", مرکب: "#7f93ad" }).map(([k, c]) => (
          <span key={k} className="flex items-center gap-1.5 text-[11px] text-dim">
            <span className="w-2 h-2 rounded-full" style={{ background: c }} />
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- صفحهٔ خانه ---------- */
export default function Home({ go }: { go: Go }) {
  const season = useMemo(() => {
    const m = new Date().getMonth() + 1;
    if (m >= 3 && m <= 5) return SEASONS[0];
    if (m >= 6 && m <= 8) return SEASONS[1];
    if (m >= 9 && m <= 11) return SEASONS[2];
    return SEASONS[3];
  }, []);

  const tickerItems = HERBS.map((h) => ({ name: h.name, label: TEMPERAMENTS[h.temperament].label, color: TEMPERAMENTS[h.temperament].color }));
  const featured = LONG_ARTICLES[0];

  const bento = [
    { title: "دانشنامهٔ جامع", desc: "گیاهان دارویی، مفردات غذایی، مرکبات و بیماری‌ها با شناسنامهٔ داوری‌شده", view: "encyclopedia", icon: <Ic.leaf className="w-7 h-7" />, big: true },
    { title: "مزاج‌سنج هوشمند", desc: "پرسشنامهٔ استاندارد دوازده‌پرسشی با الگوریتم تشخیص مزاج و توصیه‌های اختصاصی", view: "quiz", icon: <Ic.scale className="w-6 h-6" /> },
    { title: "مجلهٔ علمی", desc: "پژوهش‌ها، تدابیر فصول و گزارش‌های ویژه از کتب مرجع", view: "journal", icon: <Ic.scroll className="w-6 h-6" /> },
    { title: "آکادمی آموزش", desc: "دوره‌های رایگان تا تخصصی، وبینار زنده و کارگاه عملی", view: "academy", icon: <Ic.cap className="w-6 h-6" />, wide: true },
    { title: "کتابخانهٔ دیجیتال", desc: "کتب خطی، رساله‌ها و خط زمان تاریخ طب ایران", view: "library", icon: <Ic.book className="w-6 h-6" /> },
    { title: "بازارچهٔ سالم", desc: "محصولات گیاهی استاندارد از فروشندگان اعتبارسنجی‌شده", view: "market", icon: <Ic.cart className="w-6 h-6" /> },
    { title: "انجمن تخصصی", desc: "تالار گفت‌وگو، پرسش از متخصص و رویدادها", view: "community", icon: <Ic.chat className="w-6 h-6" /> },
    { title: "بخش بین‌الملل", desc: "معرفی مکتب طب ایرانی به جهان و همکاری با WHO", view: "about", icon: <Ic.globe className="w-6 h-6" /> },
  ];

  return (
    <div>
      {/* ===== گشایش: چرخ اخلاط ===== */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 lg:pt-16 pb-10 grid lg:grid-cols-[1.05fr_1fr] gap-12 items-center">
          <div>
            <Reveal>
              <p className="font-nasta text-gold text-2xl leading-relaxed">نسخه‌ای برای شفای هزاره‌ها…</p>
              <h1 className="mt-2 font-display text-[2.9rem] sm:text-6xl xl:text-[4.6rem] leading-[1.15] text-ivory">
                دانشنامهٔ <span className="text-gold">طب سنتی</span> ایران
              </h1>
              <p className="mt-5 max-w-xl text-dim leading-8 text-[15px]">
                گردآوری نظام‌مند دانش هزارسالهٔ ایرانی — از اخلاط چهارگانه و مزاج‌شناسی تا مفردات و قرابادین — با داوری علمی، هستی‌شناسی تخصصی و پیوند با پژوهش‌های نوین سلامت.
              </p>
            </Reveal>
            <Reveal delay={150}>
              <div className="mt-7 flex flex-wrap gap-3">
                <button onClick={() => go("quiz")} className="group inline-flex items-center gap-3 bg-gold text-night font-bold px-6 py-3.5 transition-all duration-300 hover:bg-goldsoft hover:shadow-[0_10px_30px_-8px_rgba(227,181,88,0.5)]">
                  مزاج خود را بشناسید
                  <span className="transition-transform duration-300 group-hover:-translate-x-1"><Ic.arrow className="w-4 h-4" /></span>
                </button>
                <button onClick={() => go("encyclopedia")} className="inline-flex items-center gap-3 border border-edge text-ivory px-6 py-3.5 hover:border-teal hover:text-teal transition-colors duration-300">
                  کاوش در دانشنامه
                </button>
              </div>
            </Reveal>
            <Reveal delay={280}>
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 border-t border-edge/70">
                {HERO_STATS.map((s, i) => (
                  <div key={s.label} className={`py-5 ${i > 0 ? "sm:border-s sm:border-edge/70 sm:ps-6" : ""} ${i % 2 === 1 ? "border-s border-edge/70 ps-5 sm:ps-6" : ""}`}>
                    <div className="font-display text-3xl text-goldsoft">
                      <CountUp to={s.value} suffix={s.suffix} />
                    </div>
                    <div className="mt-1 text-[11px] text-faint leading-5">{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={200} className="justify-self-center w-full">
            <ElementWheel />
          </Reveal>
        </div>
      </section>

      {/* ===== نوار متحرک مفردات ===== */}
      <section className="border-y border-edge/60 bg-deep/50 overflow-hidden py-3" aria-hidden="true">
        <div className="anim-ticker flex gap-3 w-max">
          {[...tickerItems, ...tickerItems].map((t, i) => (
            <span key={i} className="flex items-center gap-2 text-[12px] text-dim border border-edge/50 px-4 py-1.5 whitespace-nowrap bg-night/40">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.color }} />
              <span className="text-ivory font-semibold">{t.name}</span>
              {t.label}
            </span>
          ))}
        </div>
      </section>

      {/* ===== دسترسی سریع ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <Reveal>
          <SectionHead kicker="درهای دانش" title="هشت راه به گنجینهٔ طب ایرانی" desc="هر بخش برای گروهی از مخاطبان — از عموم مردم تا پژوهشگران — طراحی شده است." />
        </Reveal>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {bento.map((b, i) => (
            <Reveal key={b.title} delay={i * 70} className={b.big ? "col-span-2 row-span-2" : b.wide ? "col-span-2" : ""}>
              <button
                onClick={() => go(b.view)}
                className={`card-lift group relative w-full h-full text-start border border-edge bg-deep p-5 sm:p-6 overflow-hidden ${b.big ? "min-h-[320px] md:min-h-full flex flex-col justify-end" : "min-h-[150px]"}`}
              >
                {b.big && (
                  <>
                    <img src={IMG.attari} alt="عطاری سنتی" className="absolute inset-0 w-full h-full object-cover opacity-35 kenburns" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-night via-night/60 to-night/20" />
                  </>
                )}
                <div className="relative">
                  <div className={`${b.big ? "text-gold" : "text-teal"} mb-3 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-0.5`}>{b.icon}</div>
                  <h3 className={`font-display ${b.big ? "text-3xl" : "text-xl"} text-ivory leading-snug`}>{b.title}</h3>
                  <p className={`mt-1.5 text-dim leading-6 ${b.big ? "text-sm max-w-sm" : "text-[12px]"}`}>{b.desc}</p>
                  <span className={`mt-4 inline-flex items-center gap-2 text-[12px] font-semibold transition-colors duration-300 ${b.big ? "text-gold" : "text-teal"}`}>
                    ورود به بخش
                    <span className="transition-transform duration-300 group-hover:-translate-x-1.5"><Ic.arrow className="w-3.5 h-3.5" /></span>
                  </span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== تدبیر فصل ===== */}
      <section className="border-y border-edge/60 bg-deep/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid lg:grid-cols-[1fr_1.2fr] gap-10 items-center">
          <Reveal>
            <div>
              <p className="font-nasta text-teal text-xl">تدبیر این روزها</p>
              <h2 className="mt-1 font-display text-4xl text-ivory">
                فصلِ <span className="text-gold">{season.name}</span>؛ غلبهٔ {season.humour}
              </h2>
              <p className="mt-3 text-dim leading-7 text-sm">{season.headline}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {season.foods.map((f) => (
                  <span key={f} className="text-[12px] px-3 py-1.5 border border-gold/30 text-goldsoft bg-gold/5">{f}</span>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <ul className="grid sm:grid-cols-2 gap-3">
              {season.tips.map((t, i) => (
                <li key={t} className="flex items-start gap-3 border border-edge/70 bg-night/40 p-4 card-lift">
                  <span className="mt-0.5 text-teal shrink-0"><Ic.check className="w-4 h-4" /></span>
                  <span className="text-[13px] leading-6 text-ivory/90">{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ===== گیاهان پرکاربرد ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <Reveal>
            <SectionHead align="start" kicker="مفردات برگزیده" title="گیاهان پرکاربرد" desc="شناسنامهٔ کامل هر گیاه: طبع، خواص، منع مصرف و تداخلات." />
          </Reveal>
          <Reveal delay={100}>
            <button onClick={() => go("encyclopedia")} className="group inline-flex items-center gap-2 text-sm text-teal hover:text-goldsoft transition-colors font-semibold">
              مشاهدهٔ همهٔ گیاهان
              <span className="transition-transform duration-300 group-hover:-translate-x-1"><Ic.arrow className="w-4 h-4" /></span>
            </button>
          </Reveal>
        </div>
        <div className="mt-8 flex gap-4 overflow-x-auto pb-4 snap-x no-scrollbar -mx-4 px-4">
          {HERBS.slice(0, 9).map((h, i) => (
            <Reveal key={h.id} delay={i * 60} className="snap-start shrink-0 w-[270px]">
              <div className="card-lift frame h-full border border-edge bg-deep p-5 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <TemperChip label={TEMPERAMENTS[h.temperament].label} color={TEMPERAMENTS[h.temperament].color} />
                  <MarkButton id={h.id} label={h.name} view="encyclopedia" />
                </div>
                <h3 className="mt-3 font-display text-2xl text-ivory">{h.name}</h3>
                <p className="text-[11px] text-faint italic" dir="ltr" style={{ textAlign: "right" }}>{h.latin}</p>
                <ul className="mt-3 space-y-1.5 flex-1">
                  {h.props.slice(0, 3).map((p) => (
                    <li key={p} className="flex items-start gap-2 text-[12.5px] text-dim leading-5">
                      <span className="text-gold mt-1.5 w-1 h-1 rotate-45 bg-gold shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-3 border-t border-edge/60 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] text-faint">
                    <Stars value={h.rating} />
                    {fa(h.rating)}
                  </span>
                  <button onClick={() => go("encyclopedia", { q: h.name })} className="text-[12px] font-semibold text-teal hover:text-goldsoft transition-colors">
                    شناسنامهٔ کامل
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== مقالات پربازدید ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <Reveal>
          <SectionHead kicker="از مجلهٔ علمی" title="پربازدیدترین نوشته‌ها" />
        </Reveal>
        <div className="mt-9 grid lg:grid-cols-2 gap-5">
          <Reveal>
            <button onClick={() => go("journal")} className="group relative w-full h-full min-h-[340px] overflow-hidden border border-edge text-start">
              <img src={IMG.miniature} alt={featured.title} className="absolute inset-0 w-full h-full object-cover opacity-60 kenburns" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-night via-night/70 to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-6 sm:p-8">
                <span className="self-start text-[11px] font-bold px-3 py-1 bg-gold text-night">{featured.cat}</span>
                <h3 className="mt-3 font-display text-2xl sm:text-3xl text-ivory leading-[1.4] group-hover:text-goldsoft transition-colors duration-300">{featured.title}</h3>
                <p className="mt-2 text-[13px] text-dim leading-6 max-w-lg">{featured.excerpt}</p>
                <div className="mt-4 flex items-center gap-4 text-[11px] text-faint">
                  <span>{featured.author}</span>
                  <span>•</span>
                  <span>{fa(featured.read)} دقیقه مطالعه</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Ic.eye className="w-3.5 h-3.5" />{fa(featured.views)}</span>
                </div>
              </div>
            </button>
          </Reveal>
          <div className="flex flex-col gap-3">
            {LONG_ARTICLES.slice(1, 5).map((a, i) => (
              <Reveal key={a.id} delay={i * 80}>
                <button onClick={() => go("journal")} className="card-lift w-full text-start border border-edge bg-deep p-4 sm:p-5 flex items-center gap-4 group">
                  <span className="font-display text-3xl text-edge group-hover:text-gold transition-colors duration-300 shrink-0">{fa(i + 2).replace("۱", "")}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[11px] text-teal font-semibold mb-1">{a.cat}</span>
                    <span className="block font-bold text-[15px] text-ivory leading-6 truncate">{a.title}</span>
                    <span className="block text-[11px] text-faint mt-1">{a.date} • {fa(a.read)} دقیقه</span>
                  </span>
                  <span className="text-faint group-hover:text-gold transition-all duration-300 shrink-0 group-hover:-translate-x-1"><Ic.arrow className="w-4 h-4" /></span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== هستی‌شناسی ===== */}
      <section className="border-y border-edge/60 bg-deep/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid lg:grid-cols-[1fr_1.15fr] gap-10 items-center">
          <Reveal>
            <div>
              <SectionHead align="start" kicker="فناوری دانش" title="هستی‌شناسی طب سنتی ایران" desc="شبکه‌ای زنده از مفاهیم؛ بیماری‌ها، گیاهان، مزاج‌ها و داروها با روابط معنادار به هم می‌پیوندند تا بازیابی اطلاعات از «جست‌وجوی واژه» به «یافتن معنا» ارتقا یابد." />
              <ul className="mt-6 space-y-3">
                {["پیاده‌سازی بر پایهٔ هستی‌شناسی عمومی IrGO با بیش از ۳٬۵۰۰ کلاس مفهومی", "پیشنهاد هوشمند مفاهیم مرتبط هنگام جست‌وجو", "اتصال به پایگاه محصولات طبیعی UNaProd برای اعتبارسنجی"].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-dim leading-7">
                    <span className="mt-2 w-2 h-2 rotate-45 border border-gold bg-gold/30 shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
              <button onClick={() => go("encyclopedia")} className="mt-7 inline-flex items-center gap-2 border border-gold/50 text-gold px-5 py-2.5 text-sm font-semibold hover:bg-gold hover:text-night transition-all duration-300">
                تجربهٔ جست‌وجوی مفهومی
                <Ic.arrow className="w-4 h-4" />
              </button>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <OntoGraph />
          </Reveal>
        </div>
      </section>

      {/* ===== کتابخانه + رویدادها ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid lg:grid-cols-[1.15fr_1fr] gap-12">
        <div>
          <Reveal>
            <SectionHead align="start" kicker="گنجینهٔ مکتوب" title="از قفسهٔ کتب مرجع" />
          </Reveal>
          <div className="mt-7 grid sm:grid-cols-2 gap-4">
            {BOOKS.slice(0, 4).map((b, i) => (
              <Reveal key={b.id} delay={i * 80}>
                <button onClick={() => go("library")} className="card-lift frame w-full text-start border border-edge bg-deep p-5 group">
                  <div className="flex items-center gap-2 text-[11px] text-teal font-semibold">
                    <Ic.book className="w-4 h-4" />
                    {b.field}
                  </div>
                  <h3 className="mt-2 font-display text-xl text-ivory group-hover:text-goldsoft transition-colors duration-300">«{b.title}»</h3>
                  <p className="mt-1 text-[12px] text-faint">{b.author} — {b.century}</p>
                  <p className="mt-2 text-[12.5px] text-dim leading-6">{b.desc}</p>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
        <div>
          <Reveal>
            <SectionHead align="start" kicker="تقویم دانش" title="رویدادهای پیشِ رو" />
          </Reveal>
          <div className="mt-7 flex flex-col gap-3">
            {EVENTS.slice(0, 4).map((e, i) => (
              <Reveal key={e.id} delay={i * 80}>
                <button onClick={() => go("community")} className="card-lift w-full text-start border border-edge bg-deep p-4 flex items-center gap-4 group">
                  <span className="shrink-0 w-14 h-14 border border-gold/40 bg-gold/5 flex flex-col items-center justify-center text-gold">
                    <Ic.calendar className="w-5 h-5" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[11px] font-bold text-teal mb-0.5">{e.type}</span>
                    <span className="block font-bold text-[14px] text-ivory leading-6">{e.title}</span>
                    <span className="block text-[11px] text-faint mt-1">{e.date} — {e.place}</span>
                  </span>
                  <span className="text-faint group-hover:text-gold transition-all duration-300 group-hover:-translate-x-1 shrink-0"><Ic.arrow className="w-4 h-4" /></span>
                </button>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <button onClick={() => go("community")} className="mt-5 w-full border border-edge py-3 text-sm font-semibold text-dim hover:text-teal hover:border-teal transition-colors duration-300">
              مشاهدهٔ همهٔ رویدادها و ثبت‌نام
            </button>
          </Reveal>
        </div>
      </section>

      {/* ===== دعوت به مزاج‌سنجی ===== */}
      <section className="relative overflow-hidden border-t border-edge/60">
        <div className="absolute inset-0 bg-girih opacity-60" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(700px 300px at 50% 100%, rgba(227,181,88,0.12), transparent 70%)" }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
          <Reveal>
            <p className="font-nasta text-gold text-2xl">«من عرف مزاجه، ملک دواءه»</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl text-ivory leading-[1.25]">هر که مزاج خود بشناسد، کلید درمان خویش دارد</h2>
            <p className="mt-4 text-dim max-w-xl mx-auto leading-7 text-sm">
              پرسشنامهٔ دوازده‌پرسشی مزاج‌سنج، بر اساس قرائن کلاسیک (پوست، خواب، گوارش، خلق‌وخو…) مزاج غالب شما را با درصد هر کیفیت برآورد می‌کند.
            </p>
            <button onClick={() => go("quiz")} className="mt-8 inline-flex items-center gap-3 bg-gold text-night font-bold px-8 py-4 hover:bg-goldsoft transition-all duration-300 hover:shadow-[0_14px_36px_-10px_rgba(227,181,88,0.55)] group">
              آغاز مزاج‌سنجی رایگان
              <span className="transition-transform duration-300 group-hover:-translate-x-1"><Ic.arrow className="w-4 h-4" /></span>
            </button>
            <p className="mt-4 text-[11px] text-faint">این ابزار آموزشی است و جایگزین معاینهٔ متخصص نیست.</p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
