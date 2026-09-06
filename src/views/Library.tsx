import { useEffect, useMemo, useState } from "react";
import { BOOKS, IMG, THESES, TIMELINE } from "../data";
import type { Book } from "../data";
import { BOOK_TEXTS } from "../books";
import { Ic, Reveal, SectionHead, fa, useToast } from "../ui";

const CENTURIES = ["همه", "قرن ۳ ه‍.ق", "قرن ۳–۴ ه‍.ق", "قرن ۴ ه‍.ق", "قرن ۵ ه‍.ق", "قرن ۶ ه‍.ق", "قرن ۱۱ ه‍.ق", "قرن ۱۲ ه‍.ق"];

function loadPos(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem("tibb-book-pos") || "{}") as Record<string, number>;
  } catch {
    return {};
  }
}

/* ---------- مطالعه‌گر متن کتاب ---------- */
function BookReader({ book, onBack }: { book: Book; onBack: () => void }) {
  const text = BOOK_TEXTS[book.id];
  const [posMap, setPosMap] = useState<Record<string, number>>(loadPos);
  const [idx, setIdx] = useState(() => Math.min(posMap[book.id] ?? 0, (text?.chapters.length ?? 1) - 1));
  const { push } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem("tibb-book-pos", JSON.stringify(posMap));
    } catch { /* ignore */ }
  }, [posMap]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [idx]);

  if (!text) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="font-display text-2xl text-dim">متن مطالعاتی این کتاب به‌زودی بارگذاری می‌شود.</p>
        <button onClick={onBack} className="mt-6 border border-gold/50 text-gold px-6 py-3 hover:bg-gold hover:text-night transition-all">بازگشت به کتابخانه</button>
      </div>
    );
  }

  const chapter = text.chapters[idx];
  const progress = ((idx + 1) / text.chapters.length) * 100;

  const go = (n: number) => {
    if (n < 0 || n >= text.chapters.length) return;
    setIdx(n);
    setPosMap((p) => ({ ...p, [book.id]: n }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-[13px] font-semibold text-faint hover:text-gold transition-colors group">
        <span className="transition-transform duration-300 group-hover:translate-x-1"><Ic.arrowLeft className="w-4 h-4" /></span>
        بازگشت به کتابخانه
      </button>

      {/* سربرگ کتاب */}
      <div className="mt-5 border border-edge bg-deep p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2.5 text-[11.5px]">
          <span className="px-3 py-1 border border-gold/50 text-gold bg-gold/5 font-bold">{book.author}</span>
          <span className="px-3 py-1 border border-edge text-dim">{book.century}</span>
          <span className="px-3 py-1 border border-edge text-dim">{book.vols}</span>
          <span className="px-3 py-1 border border-teal/40 text-teal bg-teal/5">{book.field}</span>
        </div>
        <h1 className="mt-4 font-display text-3xl sm:text-4xl text-ivory leading-[1.35]">«{book.title}»</h1>
        <p className="mt-4 font-nasta text-[17px] text-goldsoft/90 leading-loose max-w-3xl">{text.intro}</p>
        <div className="mt-6">
          <div className="flex items-center justify-between text-[11.5px] mb-2">
            <span className="text-faint">فصل {fa(idx + 1)} از {fa(text.chapters.length)} — جای مطالعهٔ شما ذخیره می‌شود</span>
            <span className="font-bold text-goldsoft">{fa(Math.round(progress))}٪</span>
          </div>
          <div className="h-1.5 bg-night border border-edge/60">
            <div className="h-full bg-gradient-to-l from-gold to-teal transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-[320px_1fr] gap-6 items-start">
        {/* فهرست فصل‌ها */}
        <aside className="lg:sticky lg:top-24">
          <div className="border border-edge bg-deep p-4 hidden lg:block">
            <h3 className="text-[12px] font-bold text-faint mb-3 flex items-center gap-2"><Ic.scroll className="w-4 h-4 text-teal" />فهرست فصل‌های مطالعاتی</h3>
            <ul className="space-y-1.5">
              {text.chapters.map((c, i) => (
                <li key={c.id}>
                  <button
                    onClick={() => go(i)}
                    className={`w-full text-start flex items-center gap-3 p-3 border transition-all duration-300 ${
                      i === idx ? "border-gold/60 bg-gold/10" : "border-transparent hover:border-edge hover:bg-pane/60"
                    }`}
                  >
                    <span className={`shrink-0 w-7 h-7 border flex items-center justify-center text-[12px] font-bold ${
                      i === idx ? "border-gold text-gold" : i < idx ? "border-teal/50 text-teal" : "border-edge text-faint"
                    }`}>
                      {i < idx ? <Ic.check className="w-4 h-4" /> : fa(i + 1)}
                    </span>
                    <span className={`text-[12.5px] font-semibold leading-6 ${i === idx ? "text-goldsoft" : "text-ivory/85"}`}>{c.title}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-edge/60">
              <h4 className="text-[11.5px] font-bold text-teal mb-2">منابع این مطالعه</h4>
              <ul className="space-y-1.5">
                {text.sources.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-[11px] leading-5 text-faint">
                    <span className="mt-1.5 w-1 h-1 rotate-45 bg-teal shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* گزینشگر فصل در موبایل */}
          <div className="lg:hidden border border-edge bg-deep p-3">
            <select value={idx} onChange={(e) => go(Number(e.target.value))} className="w-full bg-night/60 border border-edge text-sm text-ivory py-3 px-3 outline-none focus:border-gold">
              {text.chapters.map((c, i) => (
                <option key={c.id} value={i}>فصل {fa(i + 1)} — {c.title}</option>
              ))}
            </select>
          </div>
        </aside>

        {/* متن فصل */}
        <div className="border border-edge bg-deep p-6 sm:p-10">
          <div className="divider-orn mb-7">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /></svg>
          </div>
          <div key={chapter.id} className="toast-in">
            <h2 className="font-display text-2xl sm:text-3xl text-goldsoft leading-[1.5] text-center">{chapter.title}</h2>
            <div className="mt-7 space-y-6 max-w-3xl mx-auto">
              {chapter.ps.map((p, pi) => (
                <p key={pi} className="text-[15px] leading-[2.4] text-dim text-justify">
                  {p}
                </p>
              ))}
              {chapter.quote && (
                <blockquote className="relative border border-gold/40 bg-gold/5 p-6 sm:p-7 text-center">
                  <span className="absolute -top-3 start-1/2 translate-x-1/2 bg-deep px-3 font-nasta text-gold text-xl">»</span>
                  <p className="font-nasta text-[19px] leading-loose text-goldsoft">{chapter.quote}</p>
                </blockquote>
              )}
            </div>
          </div>
          <div className="divider-orn mt-9">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /></svg>
          </div>

          {/* ناوبری فصل */}
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => go(idx - 1)}
              disabled={idx === 0}
              className="border border-edge px-4 py-2.5 text-[13px] font-semibold text-dim hover:border-gold hover:text-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              فصل پیشین
            </button>
            {idx < text.chapters.length - 1 ? (
              <button onClick={() => go(idx + 1)} className="bg-gold text-night px-6 py-2.5 text-[13px] font-bold hover:bg-goldsoft transition-colors">
                فصل بعدی ←
              </button>
            ) : (
              <button
                onClick={() => { push("پایان مطالعهٔ کتاب — گوارایتان باد!"); onBack(); }}
                className="bg-teal text-night px-6 py-2.5 text-[13px] font-bold hover:brightness-110 transition-all"
              >
                پایان کتاب ✓
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- صفحهٔ کتابخانه ---------- */
export default function Library() {
  const [q, setQ] = useState("");
  const [century, setCentury] = useState("همه");
  const [advanced, setAdvanced] = useState(false);
  const [field, setField] = useState("");
  const [openBookId, setOpenBookId] = useState<string | null>(null);
  const { push } = useToast();

  const books = useMemo(() => {
    const nq = q.replace(/ي/g, "ی").replace(/ك/g, "ک").trim().toLowerCase();
    const nf = field.replace(/ي/g, "ی").replace(/ك/g, "ک").trim().toLowerCase();
    return BOOKS.filter(
      (b) =>
        (century === "همه" || b.century === century) &&
        (nq === "" || [b.title, b.author, b.desc, b.field].some((x) => x.replace(/ي/g, "ی").toLowerCase().includes(nq))) &&
        (nf === "" || b.field.replace(/ي/g, "ی").toLowerCase().includes(nf))
    );
  }, [q, century, field]);

  const openBook = openBookId ? BOOKS.find((b) => b.id === openBookId) ?? null : null;

  if (openBook) {
    return <BookReader book={openBook} onBack={() => setOpenBookId(null)} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <Reveal>
        <SectionHead
          kicker="کتابخانهٔ دیجیتال و اسناد مکتوب"
          title="گنجینهٔ مکتوب طب ایرانی"
          desc="کتب مرجع از قرن سوم تا قاجار با متن مطالعاتی کامل — فصل‌به‌فصل، به نثر معیار امروز — همراه رساله‌های دانشگاهی و خط زمان تاریخ پزشکی ایران."
        />
      </Reveal>

      {/* جست‌وجوی پیشرفته */}
      <Reveal delay={120}>
        <div className="mt-9 border border-edge bg-deep/70 p-4 sm:p-5">
          <div className="flex flex-col md:flex-row gap-3">
            <label className="relative flex-1">
              <span className="absolute inset-y-0 end-4 flex items-center text-faint"><Ic.search className="w-5 h-5" /></span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="نام کتاب، مؤلف یا موضوع…"
                className="w-full bg-night/60 border border-edge focus:border-gold outline-none text-sm text-ivory placeholder:text-faint py-3 ps-4 pe-12 transition-colors"
              />
            </label>
            <button
              onClick={() => setAdvanced(!advanced)}
              className={`shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 border text-[13px] font-semibold transition-colors ${advanced ? "border-gold text-gold bg-gold/10" : "border-edge text-dim hover:border-gold/60 hover:text-goldsoft"}`}
            >
              <Ic.scale className="w-4 h-4" />
              جست‌وجوی پیشرفته
            </button>
          </div>
          <div className={`grid transition-all duration-500 ${advanced ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"}`}>
            <div className="overflow-hidden">
              <div className="grid md:grid-cols-2 gap-3">
                <label className="relative">
                  <span className="absolute inset-y-0 end-3.5 flex items-center text-faint text-[11px]">حوزه</span>
                  <input
                    value={field}
                    onChange={(e) => setField(e.target.value)}
                    placeholder="مثلاً: داروشناسی یا بالینی"
                    className="w-full bg-night/60 border border-edge focus:border-gold outline-none text-sm text-ivory placeholder:text-faint py-3 ps-16 pe-4 transition-colors"
                  />
                </label>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {CENTURIES.map((c) => (
                    <button key={c} onClick={() => setCentury(c)} className={`shrink-0 text-[12px] px-3 py-2 border transition-colors ${century === c ? "border-teal text-teal bg-teal/10" : "border-edge text-dim hover:text-ivory"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* کتب */}
      <div className="mt-6 flex items-center justify-between text-[12px] text-faint">
        <span>{fa(books.length)} کتاب در قفسه</span>
        <span className="hidden sm:block">متن مطالعاتی هر کتاب با کلیک بر «مطالعهٔ متن کتاب» گشوده می‌شود</span>
      </div>
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {books.map((b, i) => {
          const chapters = BOOK_TEXTS[b.id]?.chapters.length ?? 0;
          return (
            <Reveal key={b.id} delay={Math.min(i * 60, 240)}>
              <div className="card-lift frame h-full border border-edge bg-deep p-5 flex flex-col">
                <div className="flex items-center justify-between">
                  <Ic.book className="w-6 h-6 text-gold" />
                  <span className="text-[10.5px] text-faint">{b.century}</span>
                </div>
                <h3 className="mt-3 font-display text-xl text-ivory leading-[1.45]">«{b.title}»</h3>
                <p className="mt-1 text-[11.5px] text-teal font-semibold">{b.author}</p>
                <p className="mt-2 text-[12px] text-dim leading-6 flex-1">{b.desc}</p>
                <div className="mt-3 flex items-center justify-between text-[10.5px] text-faint border-t border-edge/60 pt-3">
                  <span>{b.field}</span>
                  <span>{b.vols} • {fa(chapters)} فصل مطالعاتی</span>
                </div>
                <button onClick={() => setOpenBookId(b.id)} className="mt-3 w-full inline-flex items-center justify-center gap-2 border border-gold/40 text-gold text-[12.5px] font-bold py-2.5 hover:bg-gold hover:text-night transition-all duration-300">
                  <Ic.scroll className="w-4 h-4" />
                  مطالعهٔ متن کتاب
                </button>
              </div>
            </Reveal>
          );
        })}
        {books.length === 0 && (
          <div className="sm:col-span-2 lg:col-span-4 border border-dashed border-edge p-12 text-center">
            <p className="font-display text-2xl text-dim">کتابی با این مشخصات یافت نشد!</p>
          </div>
        )}
      </div>

      {/* اسناد تاریخی */}
      <div className="mt-16 grid lg:grid-cols-[1fr_1.2fr] gap-6 border border-edge bg-deep/50 overflow-hidden">
        <div className="relative min-h-[280px] overflow-hidden">
          <img src={IMG.manuscript} alt="نسخهٔ خطی" className="absolute inset-0 w-full h-full object-cover opacity-70 kenburns" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-l from-deep to-transparent" />
        </div>
        <div className="p-6 sm:p-9">
          <p className="font-nasta text-gold text-xl">اسناد تاریخی</p>
          <h3 className="mt-1 font-display text-3xl text-ivory">از گندی‌شاپور تا هستی‌شناسی دیجیتال</h3>
          <p className="mt-3 text-[13.5px] text-dim leading-8">
            تاریخ طب ایران پیوسته‌ای است از مدرسهٔ گندی‌شاپور، بالینِ رازی، نظام‌مندی ابن‌سینا، احیای فارسیِ جرجانی تا دانشنامه‌های دارویی صفوی و قاجار — و امروز، دیجیتالی‌شدن این میراث با ابزارهای داده‌کاوی. خط زمان زیر، ایستگاه‌های اصلی این سفر هزارساله است.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            {[
              { v: "۸", l: "کتاب با متن مطالعاتی کامل" },
              { v: "۳۴", l: "فصل مطالعاتی فارسی" },
              { v: "۲۵۰+", l: "برگ نسخهٔ خطی اسکن‌شده" },
            ].map((s) => (
              <div key={s.l} className="border border-edge/70 py-3 px-2 bg-night/30">
                <div className="font-display text-2xl text-goldsoft">{s.v}</div>
                <div className="mt-1 text-[10.5px] text-faint leading-4">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* خط زمان */}
      <div className="mt-14">
        <Reveal>
          <SectionHead kicker="تاریخچه" title="خط زمان طب سنتی ایران" />
        </Reveal>
        <div className="mt-10 relative">
          <div className="absolute inset-y-0 start-[7px] sm:start-1/2 w-px bg-gradient-to-b from-gold/60 via-edge to-teal/60" />
          <div className="space-y-8">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year + t.title} delay={Math.min(i * 50, 200)}>
                <div className={`relative flex ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"} items-start gap-5`}>
                  <span className="absolute start-0 sm:start-1/2 sm:-translate-x-1/2 translate-x-0 mt-1.5 w-[15px] h-[15px] rotate-45 border-2 border-gold bg-night z-10" />
                  <div className={`ms-8 sm:ms-0 sm:w-[calc(50%-2.5rem)] ${i % 2 === 0 ? "sm:text-end" : "sm:text-start"}`}>
                    <div className="font-display text-lg text-gold">{t.year}</div>
                    <div className="border border-edge bg-deep p-4 mt-1.5 card-lift text-start">
                      <h4 className="font-bold text-[15px] text-ivory">{t.title}</h4>
                      <p className="mt-1.5 text-[12.5px] text-dim leading-6">{t.desc}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* رساله‌ها */}
      <div className="mt-14">
        <Reveal>
          <h3 className="font-display text-2xl text-ivory flex items-center gap-3"><Ic.scroll className="w-6 h-6 text-teal" />پایان‌نامه‌ها و رساله‌های نمایه‌شده</h3>
        </Reveal>
        <div className="mt-5 grid md:grid-cols-2 gap-3">
          {THESES.map((t, i) => (
            <Reveal key={t.title} delay={Math.min(i * 70, 240)}>
              <div className="border border-edge bg-deep p-4 flex items-center gap-4 card-lift">
                <span className="shrink-0 w-11 h-11 border border-edge/70 bg-pane flex items-center justify-center text-gold"><Ic.scroll className="w-5 h-5" /></span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[13.5px] text-ivory leading-6">{t.title}</h4>
                  <p className="text-[11px] text-faint mt-1">{t.field} — سال {t.year}</p>
                </div>
                <button
                  onClick={() => push("درخواست دانلود ثبت شد؛ پیوند به ایمیل شما ارسال می‌شود")}
                  className="shrink-0 inline-flex items-center gap-1.5 text-[12px] font-bold text-teal border border-teal/40 px-3 py-2 hover:bg-teal hover:text-night transition-all duration-300"
                >
                  <Ic.download className="w-4 h-4" />
                  چکیده
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
