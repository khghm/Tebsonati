import { useMemo, useState } from "react";
import { ARTICLES, IMG } from "../data";
import type { Article } from "../data";
import { Ic, MarkButton, Modal, Reveal, SectionHead, fa, useToast } from "../ui";

const CATS = ["همه", "پژوهشی", "آموزشی", "تدابیر فصول", "خبر", "گزارش ویژه"] as const;

export default function Journal() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("همه");
  const [q, setQ] = useState("");
  const [reading, setReading] = useState<Article | null>(null);
  const { push } = useToast();

  const list = useMemo(() => {
    const nq = q.replace(/ي/g, "ی").replace(/ك/g, "ک").trim().toLowerCase();
    return ARTICLES.filter(
      (a) =>
        (cat === "همه" || a.cat === cat) &&
        (nq === "" || [a.title, a.excerpt, a.author].some((x) => x.replace(/ي/g, "ی").toLowerCase().includes(nq)))
    );
  }, [cat, q]);

  const featured = list[0];
  const rest = list.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <Reveal>
        <SectionHead
          kicker="مجلهٔ علمی-پژوهشی"
          title="مجلهٔ دانشنامه؛ از پژوهش تا تدبیر"
          desc="آخرین یافته‌های پژوهشی، مطالب خودمراقبتی، اخبار رویدادها و گزارش‌های ویژه از کتب مرجع طب ایرانی."
        />
      </Reveal>

      <Reveal delay={120}>
        <div className="mt-9 flex flex-col md:flex-row gap-4 items-stretch">
          <div className="flex gap-2 overflow-x-auto no-scrollbar flex-1">
            {CATS.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`shrink-0 px-4 py-2.5 text-[13px] font-semibold border transition-all duration-300 ${
                  cat === c ? "bg-teal text-night border-teal" : "border-edge text-dim hover:border-teal/60 hover:text-teal"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <label className="relative md:w-72">
            <span className="absolute inset-y-0 end-3.5 flex items-center text-faint"><Ic.search className="w-4.5 h-4.5" /></span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="جست‌وجو در مقالات…"
              className="w-full bg-deep border border-edge focus:border-teal outline-none text-sm text-ivory placeholder:text-faint py-2.5 ps-4 pe-10 transition-colors"
            />
          </label>
        </div>
      </Reveal>

      {list.length === 0 && (
        <div className="mt-10 border border-dashed border-edge p-14 text-center">
          <p className="font-display text-2xl text-dim">مقاله‌ای با این مشخصات نیست!</p>
          <p className="mt-2 text-sm text-faint">دسته یا عبارت جست‌وجو را تغییر دهید.</p>
        </div>
      )}

      {featured && (
        <Reveal delay={100}>
          <div className="mt-8 grid lg:grid-cols-[1.25fr_1fr] border border-edge bg-deep overflow-hidden">
            <div className="relative min-h-[260px] overflow-hidden">
              <img src={IMG.manuscript} alt={featured.title} className="absolute inset-0 w-full h-full object-cover opacity-75 kenburns" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-l from-deep via-deep/30 to-transparent" />
            </div>
            <div className="p-6 sm:p-8 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-3 py-1 bg-gold text-night">{featured.cat} — مقالهٔ ویژه</span>
                <MarkButton id={featured.id} label={featured.title} view="journal" />
              </div>
              <h2 className="mt-4 font-display text-2xl sm:text-3xl text-ivory leading-[1.45]">{featured.title}</h2>
              <p className="mt-3 text-[13.5px] text-dim leading-7">{featured.excerpt}</p>
              <div className="mt-4 flex items-center gap-4 text-[11px] text-faint">
                <span className="flex items-center gap-1.5"><Ic.user className="w-3.5 h-3.5" />{featured.author}</span>
                <span>{featured.date}</span>
                <span>{fa(featured.read)} دقیقه</span>
                <span className="flex items-center gap-1"><Ic.eye className="w-3.5 h-3.5" />{fa(featured.views)}</span>
              </div>
              <button onClick={() => setReading(featured)} className="mt-auto pt-6 inline-flex items-center gap-2 text-sm font-bold text-gold hover:text-goldsoft transition-colors group">
                خواندن کامل مقاله
                <span className="transition-transform duration-300 group-hover:-translate-x-1"><Ic.arrow className="w-4 h-4" /></span>
              </button>
            </div>
          </div>
        </Reveal>
      )}

      <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rest.map((a, i) => (
          <Reveal key={a.id} delay={Math.min(i * 70, 280)}>
            <article className="card-lift frame h-full border border-edge bg-deep p-5 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-teal border border-teal/30 bg-teal/5 px-2.5 py-1">{a.cat}</span>
                <MarkButton id={a.id} label={a.title} view="journal" />
              </div>
              <h3 className="mt-3 font-display text-xl text-ivory leading-[1.5]">{a.title}</h3>
              <p className="mt-2 text-[12.5px] text-dim leading-6 flex-1">{a.excerpt}</p>
              <div className="mt-4 pt-3 border-t border-edge/60 flex items-center justify-between text-[11px] text-faint">
                <span>{a.author} • {a.date}</span>
                <button onClick={() => setReading(a)} className="font-bold text-gold hover:text-goldsoft transition-colors inline-flex items-center gap-1.5">
                  ادامهٔ مطلب
                  <Ic.arrow className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Modal open={!!reading} onClose={() => setReading(null)} title={reading?.title ?? ""} wide>
        {reading && (
          <div>
            <div className="flex flex-wrap items-center gap-3 text-[12px] text-faint border-b border-edge/60 pb-4">
              <span className="font-bold text-teal">{reading.cat}</span>
              <span className="flex items-center gap-1.5"><Ic.user className="w-4 h-4" />{reading.author}</span>
              <span>{reading.date}</span>
              <span>{fa(reading.read)} دقیقه مطالعه</span>
              <span className="flex items-center gap-1"><Ic.eye className="w-4 h-4" />{fa(reading.views)} بازدید</span>
            </div>
            <div className="mt-5 space-y-4">
              <p className="font-nasta text-lg text-goldsoft leading-relaxed">{reading.excerpt}</p>
              {reading.body.map((p, i) => (
                <p key={i} className="text-[14px] leading-8 text-dim">{p}</p>
              ))}
            </div>
            <div className="mt-6 border border-gold/30 bg-gold/5 p-4">
              <div className="text-[11px] font-bold text-gold mb-2">منابع و مآخذ</div>
              <p className="text-[12.5px] leading-6 text-dim">
                قانون در طب (ابن‌سینا) • مخزن‌الادویه (عقیلی خراسانی) • نشریهٔ علمی «طب سنتی اسلام و ایران» • پایگاه هستی‌شناسی IrGO
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(`${reading.title} — ${reading.excerpt}`).then(() => push("چکیدهٔ مقاله کپی شد"));
                }}
                className="inline-flex items-center gap-2 border border-edge px-5 py-2.5 text-sm font-semibold text-dim hover:text-teal hover:border-teal transition-colors"
              >
                <Ic.send className="w-4 h-4" />
                اشتراک چکیده
              </button>
              <MarkButton id={reading.id} label={reading.title} view="journal" className="border border-edge px-5 py-2.5" />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
