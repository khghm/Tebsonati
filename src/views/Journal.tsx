import { useEffect, useMemo, useRef, useState } from "react";
import { IMG } from "../data";
import { ALL_JOURNAL_ARTICLES } from "../journalArticles";
import type { LongArticle } from "../dataExtra";

const LONG_ARTICLES = ALL_JOURNAL_ARTICLES;
import { Ic, MarkButton, Modal, Reveal, SectionHead, fa, useToast } from "../ui";

const CATS = ["همه", "پژوهشی", "آموزشی", "تدابیر فصول", "خبر", "گزارش ویژه"] as const;

function ArticleBody({ article, onOpenRelated }: { article: LongArticle; onOpenRelated: (a: LongArticle) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const scroller = el.closest(".overflow-y-auto") as HTMLElement | null;
    if (!scroller) return;
    const onScroll = () => {
      const max = scroller.scrollHeight - scroller.clientHeight;
      setProgress(max > 0 ? Math.min(100, Math.round((scroller.scrollTop / max) * 100)) : 0);
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [article]);

  const related = LONG_ARTICLES.filter((a) => a.id !== article.id && a.cat === article.cat).slice(0, 2);
  const fallbackRelated = related.length > 0 ? related : LONG_ARTICLES.filter((a) => a.id !== article.id).slice(0, 2);

  return (
    <div ref={ref}>
      {/* نوار پیشرفت مطالعه */}
      <div className="sticky top-0 z-10 -mx-6 sm:-mx-8 bg-deep border-b border-edge/60 px-6 sm:px-8 py-2.5 flex items-center gap-3">
        <span className="text-[10.5px] text-faint shrink-0">پیشرفت مطالعه</span>
        <div className="flex-1 h-1 bg-night border border-edge/50">
          <div className="h-full bg-gradient-to-l from-gold to-teal transition-all duration-200" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-[10.5px] text-gold shrink-0 w-9" style={{ textAlign: "left" }}>{fa(progress)}٪</span>
      </div>

      <div className="mt-5">
        <p className="font-nasta text-lg text-goldsoft leading-relaxed border-s-2 border-gold/50 ps-4">{article.excerpt}</p>

        {article.sections.map((s, si) => (
          <div key={si} className="mt-7">
            {s.h && (
              <h4 className="flex items-center gap-3 font-display text-xl text-ivory">
                <span className="text-gold text-sm">§</span>
                {s.h}
                <span className="flex-1 h-px bg-edge/70" />
              </h4>
            )}
            <div className="mt-3 space-y-3.5">
              {s.ps.map((p, pi) => (
                <p key={pi} className="text-[14px] leading-8 text-dim">
                  {si === 0 && pi === 0 ? <span className="float-start font-display text-[2.6rem] leading-[0.9] text-goldsoft me-2.5 mt-1.5">{p.slice(0, 1)}</span> : null}
                  {si === 0 && pi === 0 ? p.slice(1) : p}
                </p>
              ))}
              {s.quote && (
                <blockquote className="relative border border-gold/25 bg-gold/5 px-6 py-4">
                  <span className="absolute -top-3 start-4 font-nasta text-2xl text-gold px-2 bg-deep">❝</span>
                  <p className="font-nasta text-[15px] text-goldsoft leading-8">{s.quote}</p>
                </blockquote>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* منابع */}
      <div className="mt-8 border border-gold/30 bg-gold/5 p-5">
        <div className="text-[11px] font-bold text-gold mb-2.5 flex items-center gap-2"><Ic.scroll className="w-4 h-4" />منابع و مآخذ</div>
        <ul className="space-y-1.5">
          {article.refs.map((r) => (
            <li key={r} className="text-[12.5px] leading-6 text-dim flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rotate-45 bg-gold/70 shrink-0" />
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* مرتبط‌ها */}
      <div className="mt-6">
        <div className="text-[11px] font-bold text-faint mb-2.5">خواندنی‌های مرتبط</div>
        <div className="grid sm:grid-cols-2 gap-3">
          {fallbackRelated.map((a) => (
            <RelatedCard key={a.id} a={a} onOpen={() => onOpenRelated(a)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function RelatedCard({ a, onOpen }: { a: LongArticle; onOpen: () => void }) {
  return (
    <button onClick={onOpen} className="text-start border border-edge/70 bg-night/30 p-4 hover:border-teal/60 transition-colors duration-300 group">
      <span className="text-[10.5px] font-bold text-teal">{a.cat}</span>
      <span className="block mt-1 text-[13px] font-bold text-ivory leading-6 group-hover:text-goldsoft transition-colors">{a.title}</span>
      <span className="block mt-1 text-[10.5px] text-faint">{fa(a.read)} دقیقه • {a.author}</span>
    </button>
  );
}

export default function Journal() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("همه");
  const [q, setQ] = useState("");
  const [reading, setReading] = useState<LongArticle | null>(null);
  const [visible, setVisible] = useState(12);
  const { push } = useToast();

  useEffect(() => {
    setVisible(12);
  }, [cat, q]);

  const openRelated = (a: LongArticle) => {
    setReading(a);
    // اسکرول مودال به بالای مقالهٔ جدید
    requestAnimationFrame(() => {
      document.querySelectorAll(".overflow-y-auto").forEach((el) => (el.scrollTop = 0));
    });
  };

  const list = useMemo(() => {
    const nq = q.replace(/ي/g, "ی").replace(/ك/g, "ک").trim().toLowerCase();
    return LONG_ARTICLES.filter(
      (a) =>
        (cat === "همه" || a.cat === cat) &&
        (nq === "" ||
          [a.title, a.excerpt, a.author, ...a.sections.flatMap((s) => [s.h ?? "", ...s.ps])].some((x) =>
            x.replace(/ي/g, "ی").toLowerCase().includes(nq)
          ))
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
          desc="بیش از صد گزارش بلند و مستند در مزاج‌شناسی و درمان بیماری‌ها: بازخوانی کتب مرجع، مرور شواهد نوین، تدابیر فصول و اخبار حوزهٔ طب ایرانی."
        />
      </Reveal>

      <Reveal delay={90}>
        <div className="mt-5 flex items-center gap-3 text-[12px] text-faint">
          <span className="w-8 h-[2px] bg-gradient-to-l from-gold to-transparent" />
          <span>{fa(list.length)} مقاله در این نمایه</span>
          <span>•</span>
          <span>جست‌وجو در متن کامل مقالات</span>
        </div>
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
            <span className="absolute inset-y-0 end-3.5 flex items-center text-faint"><Ic.search className="w-4 h-4" /></span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="جست‌وجو در متن مقالات…"
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
              <div className="mt-4 flex items-center flex-wrap gap-x-4 gap-y-1 text-[11px] text-faint">
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
        {rest.slice(0, visible).map((a, i) => (
          <Reveal key={a.id} delay={Math.min(i * 70, 280)}>
            <article className="card-lift frame h-full border border-edge bg-deep p-5 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-teal border border-teal/30 bg-teal/5 px-2.5 py-1">{a.cat}</span>
                <MarkButton id={a.id} label={a.title} view="journal" />
              </div>
              <h3 className="mt-3 font-display text-xl text-ivory leading-[1.5]">{a.title}</h3>
              <p className="mt-2 text-[12.5px] text-dim leading-6 flex-1">{a.excerpt}</p>
              <div className="mt-3 flex items-center gap-3 text-[10.5px] text-faint">
                <span>{fa(a.sections.length)} بخش</span>
                <span>•</span>
                <span>{fa(a.read)} دقیقه مطالعه</span>
              </div>
              <div className="mt-3 pt-3 border-t border-edge/60 flex items-center justify-between text-[11px] text-faint">
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

      {visible < rest.length && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisible((v) => v + 24)}
            className="inline-flex items-center gap-2.5 border border-gold/50 text-gold px-7 py-3 text-sm font-semibold hover:bg-gold hover:text-night transition-all duration-300"
          >
            بارگذاری مقالات بیشتر
            <span className="text-[11px] opacity-70">({fa(rest.length - visible)} مقالهٔ دیگر)</span>
          </button>
        </div>
      )}

      <Modal open={!!reading} onClose={() => setReading(null)} title={reading?.title ?? ""} wide>
        {reading && (
          <div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-faint border-b border-edge/60 pb-4">
              <span className="font-bold text-teal">{reading.cat}</span>
              <span className="flex items-center gap-1.5"><Ic.user className="w-4 h-4" />{reading.author}</span>
              <span>{reading.date}</span>
              <span>{fa(reading.read)} دقیقه مطالعه</span>
              <span className="flex items-center gap-1"><Ic.eye className="w-4 h-4" />{fa(reading.views)} بازدید</span>
            </div>
            <ArticleBody key={reading.id} article={reading} onOpenRelated={openRelated} />
            <div className="mt-6 flex flex-wrap gap-3 border-t border-edge/60 pt-5">
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
