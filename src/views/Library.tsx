import { useMemo, useState } from "react";
import { BOOKS, IMG, THESES, TIMELINE } from "../data";
import type { Book } from "../data";
import { Ic, Modal, Reveal, SectionHead, fa, useToast } from "../ui";

const CENTURIES = ["همه", "قرن ۳ ه‍.ق", "قرن ۳–۴ ه‍.ق", "قرن ۴ ه‍.ق", "قرن ۵ ه‍.ق", "قرن ۶ ه‍.ق", "قرن ۱۱ ه‍.ق", "قرن ۱۲ ه‍.ق"];

export default function Library() {
  const [q, setQ] = useState("");
  const [century, setCentury] = useState("همه");
  const [advanced, setAdvanced] = useState(false);
  const [field, setField] = useState("");
  const [reading, setReading] = useState<Book | null>(null);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <Reveal>
        <SectionHead
          kicker="کتابخانهٔ دیجیتال و اسناد مکتوب"
          title="گنجینهٔ مکتوب طب ایرانی"
          desc="کتب خطی و چاپی از قرن سوم تا قاجار، رساله‌های دانشگاهی و خط زمان تاریخ پزشکی ایران — با جست‌وجوی پیشرفتهٔ مبتنی بر هستی‌شناسی."
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
        <span className="hidden sm:block">نسخه‌های دیجیتال با همکاری کتابخانه‌های نسخه‌های خطی</span>
      </div>
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {books.map((b, i) => (
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
                <span>{b.vols}</span>
              </div>
              <button onClick={() => setReading(b)} className="mt-3 w-full border border-gold/40 text-gold text-[12.5px] font-bold py-2.5 hover:bg-gold hover:text-night transition-all duration-300">
                تورق نسخهٔ دیجیتال
              </button>
            </div>
          </Reveal>
        ))}
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
              { v: "۸", l: "کتاب مرجع دیجیتال" },
              { v: "۴", l: "رسالهٔ نمایه‌شده" },
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

      <Modal open={!!reading} onClose={() => setReading(null)} title={reading ? `«${reading.title}»` : ""}>
        {reading && (
          <div>
            <div className="flex flex-wrap gap-2 text-[11px] mb-4">
              <span className="px-2.5 py-1 border border-gold/40 text-gold">{reading.author}</span>
              <span className="px-2.5 py-1 border border-edge text-dim">{reading.century}</span>
              <span className="px-2.5 py-1 border border-edge text-dim">{reading.vols}</span>
            </div>
            <p className="text-[14px] leading-8 text-dim">{reading.desc}</p>
            <div className="mt-5 border border-edge/70 bg-night/40 p-4">
              <div className="text-[11px] font-bold text-teal mb-2">دربارهٔ نسخهٔ دیجیتال</div>
              <p className="text-[12.5px] leading-6 text-dim">
                نسخهٔ اسکن‌شده با همکاری کتابخانه‌های نسخه‌های خطی، همراه متن تصحیح‌شده، نمایهٔ مفردات متصل به دانشنامه و جست‌وجوی هستی‌شناسانه ارائه می‌شود.
              </p>
            </div>
            <button
              onClick={() => { push("درخواست دسترسی ثبت شد؛ پس از تأیید، پیوند مطالعه ارسال می‌شود"); setReading(null); }}
              className="mt-5 w-full bg-gold text-night font-bold py-3 text-sm hover:bg-goldsoft transition-colors"
            >
              درخواست دسترسی به نسخهٔ کامل
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
