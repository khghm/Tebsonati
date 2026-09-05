import { useEffect, useState } from "react";
import { MIZAJ_PROFILES, QUIZ } from "../data";
import type { MizajProfile } from "../data";
import { Ic, Reveal, fa, useToast } from "../ui";
import { PlateArt } from "../plate";

type Stage = "intro" | "quiz" | "result";
type Scores = { hot: number; cold: number; wet: number; dry: number };

function compute(scores: Scores): { profile: MizajProfile; pcts: Record<keyof Scores, number> } {
  const total = scores.hot + scores.cold + scores.wet + scores.dry || 1;
  const pcts = {
    hot: Math.round((scores.hot / total) * 100),
    cold: Math.round((scores.cold / total) * 100),
    wet: Math.round((scores.wet / total) * 100),
    dry: Math.round((scores.dry / total) * 100),
  };
  let id = "sauda";
  if (scores.hot > scores.cold && scores.dry > scores.wet) id = "safra";
  else if (scores.hot > scores.cold && scores.wet >= scores.dry) id = "dam";
  else if (scores.wet >= scores.dry) id = "balgham";
  const profile = MIZAJ_PROFILES.find((p) => p.id === id)!;
  return { profile, pcts };
}

const QUALITY_META: { key: keyof Scores; label: string; color: string }[] = [
  { key: "hot", label: "گرمی", color: "#d8604a" },
  { key: "cold", label: "سردی", color: "#3fc8b8" },
  { key: "wet", label: "تری", color: "#7fb8c9" },
  { key: "dry", label: "خشکی", color: "#e3b558" },
];

export default function Quiz() {
  const [stage, setStage] = useState<Stage>("intro");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [result, setResult] = useState<{ profile: MizajProfile; pcts: Record<keyof Scores, number> } | null>(null);
  const [barsOn, setBarsOn] = useState(false);
  const { push } = useToast();

  useEffect(() => {
    if (stage === "result") {
      setBarsOn(false);
      const t = setTimeout(() => setBarsOn(true), 150);
      return () => clearTimeout(t);
    }
  }, [stage]);

  const start = () => {
    setStage("quiz");
    setIdx(0);
    setAnswers([]);
    setPicked(null);
  };

  const pick = (oi: number) => {
    if (picked !== null) return;
    setPicked(oi);
    setTimeout(() => {
      const next = [...answers, oi];
      setAnswers(next);
      setPicked(null);
      if (idx + 1 >= QUIZ.length) {
        const scores: Scores = { hot: 0, cold: 0, wet: 0, dry: 0 };
        next.forEach((a, qi) => {
          const o = QUIZ[qi].options[a];
          scores.hot += o.hot;
          scores.cold += o.cold;
          scores.wet += o.wet;
          scores.dry += o.dry;
        });
        const res = compute(scores);
        setResult(res);
        try {
          localStorage.setItem("tibb-mizaj", JSON.stringify({ profileId: res.profile.id, pcts: res.pcts, date: Date.now() }));
        } catch { /* ignore */ }
        setStage("result");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setIdx(idx + 1);
      }
    }, 320);
  };

  const copyResult = () => {
    if (!result) return;
    const txt = `نتیجهٔ مزاج‌سنجی دانشنامهٔ طب سنتی ایران: ${result.profile.title} — گرمی ${fa(result.pcts.hot)}٪، سردی ${fa(result.pcts.cold)}٪، تری ${fa(result.pcts.wet)}٪، خشکی ${fa(result.pcts.dry)}٪`;
    navigator.clipboard?.writeText(txt).then(() => push("نتیجه در بریده‌دان کپی شد"));
  };

  /* ---------- مقدمه ---------- */
  if (stage === "intro") {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <p className="font-nasta text-gold text-2xl">سامانهٔ تشخیص مزاج</p>
            <h1 className="mt-1 font-display text-4xl sm:text-5xl text-ivory">مزاج خود را بشناسید</h1>
            <p className="mt-4 text-dim leading-8 text-sm">
              دوازده پرسش بر پایهٔ قرائن کلاسیک مزاج‌شناسی — پوست، خواب، گوارش، خلق‌وخو — پاسخ‌ها را صادقانه و بر اساس «معمولِ» خود بدهید، نه روزهای استثنایی.
            </p>
          </div>
        </Reveal>
        <Reveal delay={140}>
          <div className="mt-9 grid sm:grid-cols-4 gap-3">
            {MIZAJ_PROFILES.map((p) => (
              <div key={p.id} className="border border-edge bg-deep p-4 text-center card-lift">
                <span className="inline-block w-3 h-3 rotate-45 mb-3" style={{ background: p.color }} />
                <h3 className="font-display text-lg" style={{ color: p.color }}>{p.title}</h3>
                <p className="mt-1 text-[11px] text-faint">{p.element} • {p.season}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={220}>
          <div className="mt-10 flex flex-col items-center gap-4">
            <button onClick={start} className="group inline-flex items-center gap-3 bg-gold text-night font-bold px-9 py-4 hover:bg-goldsoft transition-all duration-300 hover:shadow-[0_14px_36px_-10px_rgba(227,181,88,0.55)]">
              آغاز پرسشنامه
              <span className="transition-transform duration-300 group-hover:-translate-x-1"><Ic.arrow className="w-4 h-4" /></span>
            </button>
            <p className="flex items-center gap-2 text-[11px] text-madder max-w-md text-center leading-5">
              <Ic.warn className="w-4 h-4 shrink-0" />
              این سامانه آموزشی است؛ تشخیص قطعی و تجویز تنها بر عهدهٔ پزشک یا متخصص طب سنتی است.
            </p>
          </div>
        </Reveal>
      </div>
    );
  }

  /* ---------- پرسش‌ها ---------- */
  if (stage === "quiz") {
    const q = QUIZ[idx];
    const progress = ((idx) / QUIZ.length) * 100;
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-center justify-between text-[12px] text-faint mb-3">
          <span>پرسش {fa(idx + 1)} از {fa(QUIZ.length)}</span>
          <button onClick={() => (idx === 0 ? setStage("intro") : (setIdx(idx - 1), setAnswers(answers.slice(0, -1))))} className="hover:text-gold transition-colors">
            بازگشت ↩
          </button>
        </div>
        <div className="h-1.5 bg-pane border border-edge/60">
          <div className="h-full bg-gradient-to-l from-gold to-teal transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div key={idx} className="toast-in mt-8">
          <h2 className="font-display text-2xl sm:text-3xl text-ivory leading-[1.5]">{q.q}</h2>
          <div className="mt-6 grid gap-3">
            {q.options.map((o, oi) => (
              <button
                key={oi}
                onClick={() => pick(oi)}
                className={`group text-start border p-4 sm:p-5 transition-all duration-300 flex items-center gap-4 ${
                  picked === oi ? "border-gold bg-gold/10" : "border-edge bg-deep hover:border-teal/70 hover:bg-pane"
                }`}
              >
                <span className={`shrink-0 w-9 h-9 border flex items-center justify-center font-display text-lg transition-colors duration-300 ${
                  picked === oi ? "border-gold text-gold bg-gold/10" : "border-edge text-faint group-hover:text-teal group-hover:border-teal/60"
                }`}>
                  {fa(oi + 1)}
                </span>
                <span className="text-[14px] leading-7 text-ivory/90">{o.label}</span>
                {picked === oi && <span className="ms-auto text-gold shrink-0"><Ic.check className="w-5 h-5" /></span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ---------- نتیجه ---------- */
  if (!result) return null;
  const { profile, pcts } = result;
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
      <Reveal>
        <div className="text-center">
          <div className="mx-auto w-56 h-40 mb-2 border border-edge/70 overflow-hidden">
            <PlateArt kind="mizaj" id={profile.id} color={profile.color} />
          </div>
          <p className="font-nasta text-gold text-2xl">نتیجهٔ مزاج‌سنجی شما</p>
          <h1 className="mt-1 font-display text-4xl sm:text-5xl" style={{ color: profile.color }}>{profile.title}</h1>
          <p className="mt-2 text-[13px] text-faint">عنصر {profile.element} • فصل {profile.season} • اندام حاکم: {profile.organ}</p>
        </div>
      </Reveal>

      {/* نمودار کیفیت‌ها */}
      <Reveal delay={120}>
        <div className="mt-8 border border-edge bg-deep p-6">
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            {QUALITY_META.map((m) => (
              <div key={m.key}>
                <div className="flex items-center justify-between text-[12px] mb-1.5">
                  <span className="font-semibold text-ivory">{m.label}</span>
                  <span className="text-faint">{fa(pcts[m.key])}٪</span>
                </div>
                <div className="h-2.5 bg-night border border-edge/60">
                  <div className="h-full transition-all duration-1000 ease-out" style={{ width: barsOn ? `${pcts[m.key]}%` : "0%", background: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="mt-6 grid lg:grid-cols-[1.2fr_1fr] gap-5">
        <Reveal delay={160}>
          <div className="border border-edge bg-deep p-6 h-full">
            <h3 className="font-display text-xl text-goldsoft">شرح مزاج شما</h3>
            <p className="mt-3 text-[14px] leading-8 text-dim">{profile.desc}</p>
            <h4 className="mt-5 text-[12px] font-bold text-teal">نشانه‌های غالب</h4>
            <ul className="mt-2 space-y-1.5">
              {profile.signs.map((s) => (
                <li key={s} className="flex items-start gap-2 text-[13px] text-dim leading-6">
                  <span className="mt-2 w-1.5 h-1.5 rotate-45 shrink-0" style={{ background: profile.color }} />{s}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <div className="grid gap-5">
          <Reveal delay={220}>
            <div className="border border-edge bg-deep p-5">
              <h4 className="font-display text-lg text-teal">توصیه‌های تغذیه‌ای</h4>
              <ul className="mt-2.5 space-y-1.5">
                {profile.foods.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-[13px] text-dim leading-6"><Ic.check className="w-4 h-4 text-teal shrink-0 mt-0.5" />{s}</li>
                ))}
              </ul>
              <h4 className="mt-4 font-display text-lg text-madder">پرهیزات</h4>
              <ul className="mt-2.5 space-y-1.5">
                {profile.avoid.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-[13px] text-dim leading-6"><Ic.close className="w-4 h-4 text-madder shrink-0 mt-0.5" />{s}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={280}>
            <div className="border border-edge bg-deep p-5">
              <h4 className="font-display text-lg text-goldsoft">تدابیر رفتاری</h4>
              <ul className="mt-2.5 space-y-1.5">
                {profile.behaviors.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-[13px] text-dim leading-6"><span className="mt-2 w-1.5 h-1.5 rotate-45 bg-gold shrink-0" />{s}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>

      <Reveal delay={200}>
        <div className="mt-6 border border-madder/40 bg-madder/5 p-4 flex items-start gap-3">
          <Ic.warn className="w-5 h-5 text-madder shrink-0 mt-0.5" />
          <p className="text-[12.5px] leading-6 text-dim">
            <strong className="text-madder">هشدار پزشکی:</strong> این نتیجه تخمینی آموزشی است و به‌هیچ‌وجه جایگزین معاینه، تشخیص یا تجویز پزشک نیست. پیش از هر تغییر رژیم یا مصرف داروی گیاهی — به‌ویژه در بیماری مزمن، بارداری یا مصرف داروی شیمیایی — با متخصص مشورت کنید و خوددرمانی نکنید.
          </p>
        </div>
      </Reveal>

      <Reveal delay={260}>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={start} className="border border-edge px-6 py-3 text-sm font-semibold text-dim hover:text-gold hover:border-gold transition-colors duration-300">
            آزمون دوباره
          </button>
          <button onClick={copyResult} className="inline-flex items-center gap-2 bg-gold text-night font-bold px-6 py-3 text-sm hover:bg-goldsoft transition-colors duration-300">
            <Ic.send className="w-4 h-4" />
            اشتراک‌گذاری نتیجه
          </button>
        </div>
      </Reveal>
    </div>
  );
}
