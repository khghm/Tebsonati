import { useEffect, useMemo, useRef, useState } from "react";
import { BOOKS, COMPOUNDS, DISEASES, EVENTS, FOODS, HERBS, PRODUCTS } from "./data";
import { FULL_COURSES } from "./courses";
import { EXTRA_COMPOUNDS, EXTRA_DISEASES, EXTRA_FOODS, EXTRA_HERBS } from "./dataExtra";
import { ALL_JOURNAL_ARTICLES } from "./journalArticles";
import { EXTRA_HERBS_2 } from "./dataHerbs2";
import { EXTRA_FOODS_2 } from "./dataFoods2";
import { EXTRA_COMPOUNDS_2 } from "./dataCompounds2";
import { EXTRA_DISEASES_2 } from "./dataDiseases2";
import { EXTRA_DISEASES_3 } from "./dataDiseases3";
import { BookmarkProvider, Ic, Shamseh, ToastProvider, fa, useMarks, useToast } from "./ui";
import Home from "./views/Home";
import Encyclopedia from "./views/Encyclopedia";
import Quiz from "./views/Quiz";
import Journal from "./views/Journal";
import Academy from "./views/Academy";
import Library from "./views/Library";
import Market from "./views/Market";
import Community from "./views/Community";
import { About, Contact, Faq } from "./views/Info";
import { PlateArt } from "./plate";
import type { ArtKind } from "./plate";

type ViewId = "home" | "encyclopedia" | "quiz" | "journal" | "academy" | "library" | "market" | "community" | "about" | "contact" | "faq";

const NAV: { id: ViewId; label: string }[] = [
  { id: "home", label: "خانه" },
  { id: "encyclopedia", label: "دانشنامه" },
  { id: "quiz", label: "مزاج‌سنجی" },
  { id: "journal", label: "مجله" },
  { id: "academy", label: "آکادمی" },
  { id: "library", label: "کتابخانه" },
  { id: "market", label: "بازارچه" },
  { id: "community", label: "انجمن" },
];

type SearchItem = { id: string; title: string; sub: string; view: ViewId; kind: string; q?: string; art?: { k: ArtKind; t?: string } };

const KINDS = ["همه", "گیاه دارویی", "مفرد غذایی", "داروی مرکب", "بیماری", "مقاله", "کتاب", "دوره", "محصول", "رویداد"];

function buildIndex(): SearchItem[] {
  return [
    ...[...HERBS, ...EXTRA_HERBS, ...EXTRA_HERBS_2].map((h) => ({ id: h.id, title: h.name, sub: h.latin, view: "encyclopedia" as ViewId, kind: "گیاه دارویی", q: h.name, art: { k: "herb" as ArtKind, t: h.temperament } })),
    ...[...FOODS, ...EXTRA_FOODS, ...EXTRA_FOODS_2].map((f) => ({ id: f.id, title: f.name, sub: f.cat, view: "encyclopedia" as ViewId, kind: "مفرد غذایی", q: f.name, art: { k: "food" as ArtKind, t: f.temperament } })),
    ...[...COMPOUNDS, ...EXTRA_COMPOUNDS, ...EXTRA_COMPOUNDS_2].map((c) => ({ id: c.id, title: c.name, sub: c.kind, view: "encyclopedia" as ViewId, kind: "داروی مرکب", q: c.name, art: { k: "compound" as ArtKind, t: c.temperament } })),
    ...[...DISEASES, ...EXTRA_DISEASES, ...EXTRA_DISEASES_2, ...EXTRA_DISEASES_3].map((d) => ({ id: d.id, title: d.name, sub: "دیدگاه طب سنتی", view: "encyclopedia" as ViewId, kind: "بیماری", q: d.name, art: { k: "disease" as ArtKind, t: d.temperament } })),
    ...ALL_JOURNAL_ARTICLES.map((a) => ({ id: a.id, title: a.title, sub: a.cat, view: "journal" as ViewId, kind: "مقاله" })),
    ...BOOKS.map((b) => ({ id: b.id, title: `«${b.title}»`, sub: b.author, view: "library" as ViewId, kind: "کتاب", q: b.title })),
    ...FULL_COURSES.map((c) => ({ id: c.id, title: c.title, sub: `دورهٔ باز • ${fa(c.lessons.length)} درس • ${fa(c.hours)} ساعت`, view: "academy" as ViewId, kind: "دوره" })),
    ...PRODUCTS.map((p) => ({ id: p.id, title: p.name, sub: p.seller, view: "market" as ViewId, kind: "محصول" })),
    ...EVENTS.map((e) => ({ id: e.id, title: e.title, sub: e.date, view: "community" as ViewId, kind: "رویداد" })),
  ];
}

function AppInner() {
  const [view, setView] = useState<ViewId>("home");
  const [encQuery, setEncQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [sq, setSq] = useState("");
  const [skind, setSkind] = useState("همه");
  const [drawer, setDrawer] = useState(false);
  const [menu, setMenu] = useState(false);
  const [listening, setListening] = useState(false);
  const [news, setNews] = useState("");
  const { marks } = useMarks();
  const { push } = useToast();
  const index = useMemo(buildIndex, []);
  const searchRef = useRef<HTMLInputElement>(null);
  const recRef = useRef<{ stop: () => void } | null>(null);

  const go = (v: string, opts?: { q?: string }) => {
    if (v === "encyclopedia") setEncQuery(opts?.q ?? "");
    setView(v as ViewId);
    setMenu(false);
    setDrawer(false);
    setSearchOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* میان‌بر کیبورد */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((s) => !s);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setDrawer(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 60);
  }, [searchOpen]);

  const results = useMemo(() => {
    const nq = sq.replace(/ي/g, "ی").replace(/ك/g, "ک").trim().toLowerCase();
    return index
      .filter((i) => (skind === "همه" || i.kind === skind) && (nq === "" || i.title.replace(/ي/g, "ی").toLowerCase().includes(nq) || i.sub.toLowerCase().includes(nq)))
      .slice(0, 12);
  }, [sq, skind, index]);

  const startVoice = () => {
    const W = window as unknown as Record<string, unknown>;
    const SR = (W.webkitSpeechRecognition ?? W.SpeechRecognition) as (new () => {
      lang: string;
      interimResults: boolean;
      onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
      onend: () => void;
      onerror: () => void;
      start: () => void;
      stop: () => void;
    }) | undefined;
    if (!SR) {
      push("مرورگر شما از جست‌وجوی صوتی پشتیبانی نمی‌کند");
      return;
    }
    const rec = new SR();
    rec.lang = "fa-IR";
    rec.interimResults = true;
    rec.onresult = (e) => {
      let txt = "";
      for (let i = 0; i < e.results.length; i++) txt += e.results[i][0].transcript;
      setSq(txt);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => {
      setListening(false);
      push("خطا در دریافت صدا؛ دوباره تلاش کنید");
    };
    recRef.current = rec;
    rec.start();
    setListening(true);
    push("در حال شنیدن… نام گیاه یا دارو را بگویید");
  };

  const submitNews = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(news)) {
      push("ایمیل معتبر وارد کنید تا خبرنامه فعال شود");
      return;
    }
    setNews("");
    push("به خبرنامهٔ دانشنامه پیوستید — نخستین نامه هفتهٔ آینده می‌رسد");
  };

  const encKey = view === "encyclopedia" ? `enc-${encQuery}` : view;

  return (
    <div className="min-h-screen relative">
      {/* پس‌زمینهٔ محیطی */}
      <div className="fixed inset-0 -z-10 bg-glow" />
      <div className="fixed inset-0 -z-10 bg-girih opacity-70" />
      <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <span className="absolute top-[18%] start-[12%] w-1.5 h-1.5 rotate-45 bg-gold/40 anim-float" />
        <span className="absolute top-[62%] end-[10%] w-2 h-2 rotate-45 bg-teal/30 anim-float" style={{ animationDelay: "1.8s" }} />
        <span className="absolute top-[40%] end-[30%] w-1 h-1 rotate-45 bg-madder/40 anim-float" style={{ animationDelay: "3.2s" }} />
      </div>

      {/* ---------- هدر ---------- */}
      <header className="sticky top-0 z-50 border-b border-edge/70 bg-night/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 h-16">
            <button onClick={() => go("home")} className="flex items-center gap-3 shrink-0 group">
              <span className="transition-transform duration-500 group-hover:rotate-45"><Shamseh className="w-9 h-9" /></span>
              <span className="hidden sm:block text-start leading-none">
                <span className="font-display text-xl text-ivory block">دانشنامهٔ طب سنتی</span>
                <span className="font-nasta text-gold text-[13px] leading-none">ایران</span>
              </span>
            </button>

            <nav className="hidden lg:flex items-center gap-5 mx-6" aria-label="ناوبری اصلی">
              {NAV.map((n) => (
                <button key={n.id} onClick={() => go(n.id)} className={`navlink text-[13px] font-semibold ${view === n.id ? "text-gold active" : "text-dim hover:text-ivory"}`}>
                  {n.label}
                </button>
              ))}
            </nav>

            <div className="ms-auto flex items-center gap-1.5">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2.5 border border-edge hover:border-gold/60 text-dim hover:text-ivory px-3.5 py-2 text-[12.5px] transition-colors"
                aria-label="جست‌وجو"
              >
                <Ic.search className="w-4.5 h-4.5" />
                <span className="hidden sm:inline">جست‌وجوی هوشمند</span>
                <kbd className="hidden sm:inline text-[10px] border border-edge px-1.5 py-0.5 text-faint">Ctrl K</kbd>
              </button>
              <button onClick={() => setDrawer(true)} className="relative border border-edge hover:border-gold/60 text-dim hover:text-gold p-2.5 transition-colors" aria-label="نشان‌شده‌ها">
                <Ic.bookmark className="w-4.5 h-4.5" />
                {marks.length > 0 && (
                  <span className="absolute -top-1.5 -start-1.5 w-4.5 h-4.5 min-w-4.5 bg-gold text-night text-[9.5px] font-bold flex items-center justify-center">{fa(marks.length)}</span>
                )}
              </button>
              <button onClick={() => setMenu(!menu)} className="lg:hidden border border-edge text-dim hover:text-ivory p-2.5 transition-colors" aria-label="منو">
                {menu ? <Ic.close className="w-5 h-5" /> : <Ic.menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
        {/* منوی موبایل */}
        <div className={`lg:hidden grid transition-all duration-500 ${menu ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} `}>
          <div className="overflow-hidden">
            <nav className="px-4 sm:px-6 pb-4 grid grid-cols-2 gap-2" aria-label="ناوبری موبایل">
              {NAV.map((n) => (
                <button key={n.id} onClick={() => go(n.id)} className={`text-start px-4 py-3 border text-[13px] font-semibold transition-colors ${view === n.id ? "border-gold text-gold bg-gold/10" : "border-edge/70 text-dim hover:text-ivory"}`}>
                  {n.label}
                </button>
              ))}
              <button onClick={() => go("about")} className={`text-start px-4 py-3 border text-[13px] font-semibold ${view === "about" ? "border-gold text-gold" : "border-edge/70 text-dim"}`}>دربارهٔ ما</button>
              <button onClick={() => go("faq")} className={`text-start px-4 py-3 border text-[13px] font-semibold ${view === "faq" ? "border-gold text-gold" : "border-edge/70 text-dim"}`}>سوالات متداول</button>
            </nav>
          </div>
        </div>
      </header>

      {/* ---------- جست‌وجوی سراسری ---------- */}
      {searchOpen && (
        <div className="fixed inset-0 z-[70]">
          <div className="absolute inset-0 bg-night/85 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
          <div className="relative max-w-2xl mx-auto mt-[12vh] px-4">
            <div className="border border-gold/40 bg-deep shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] toast-in">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-edge/70">
                <Ic.search className="w-5 h-5 text-gold shrink-0" />
                <input
                  ref={searchRef}
                  value={sq}
                  onChange={(e) => setSq(e.target.value)}
                  placeholder="جست‌وجو در گیاهان، داروها، مقالات، کتب، دوره‌ها…"
                  className="flex-1 bg-transparent outline-none text-[15px] text-ivory placeholder:text-faint"
                />
                <button onClick={() => (listening ? recRef.current?.stop() : startVoice())} className={`shrink-0 p-2 border transition-all ${listening ? "border-madder text-madder animate-pulse" : "border-edge text-faint hover:text-teal hover:border-teal/60"}`} aria-label="جست‌وجوی صوتی" title="جست‌وجوی صوتی (فارسی)">
                  <Ic.mic className="w-5 h-5" />
                </button>
                <button onClick={() => setSearchOpen(false)} className="shrink-0 text-faint hover:text-ivory transition-colors" aria-label="بستن">
                  <Ic.close className="w-5 h-5" />
                </button>
              </div>
              <div className="flex gap-1.5 px-5 py-3 border-b border-edge/70 overflow-x-auto no-scrollbar">
                {KINDS.map((k) => (
                  <button key={k} onClick={() => setSkind(k)} className={`shrink-0 text-[11px] px-2.5 py-1 border transition-colors ${skind === k ? "border-teal text-teal bg-teal/10" : "border-edge/70 text-faint hover:text-ivory"}`}>
                    {k}
                  </button>
                ))}
              </div>
              <div className="max-h-[46vh] overflow-y-auto p-2">
                {results.length === 0 && (
                  <p className="text-center text-[13px] text-faint py-10">چیزی نیافتیم؛ واژهٔ دیگری بیازمایید یا فیلتر را تغییر دهید.</p>
                )}
                {results.map((r) => (
                  <button key={`${r.kind}-${r.id}`} onClick={() => go(r.view, { q: r.q })} className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-pane text-start transition-colors group">
                    {r.art ? (
                      <span className="shrink-0 w-14 h-10 border border-edge/70 overflow-hidden">
                        <PlateArt kind={r.art.k} id={r.id} temperament={r.art.t} />
                      </span>
                    ) : (
                      <span className="shrink-0 text-[10px] font-bold text-gold border border-gold/35 bg-gold/5 px-2 py-1">{r.kind}</span>
                    )}
                    <span className="flex-1 min-w-0">
                      <span className="block text-[14px] font-semibold text-ivory truncate group-hover:text-goldsoft transition-colors">{r.title}</span>
                      <span className="block text-[11px] text-faint truncate">{r.kind} — {r.sub}</span>
                    </span>
                    <Ic.arrow className="w-4 h-4 text-faint group-hover:text-gold transition-all group-hover:-translate-x-1 shrink-0" />
                  </button>
                ))}
              </div>
              <div className="px-5 py-2.5 border-t border-edge/70 text-[10.5px] text-faint flex items-center gap-4">
                <span className="flex items-center gap-1.5"><Ic.mic className="w-3.5 h-3.5" />جست‌وجوی صوتی برای کم‌بینایان و سالمندان</span>
                <span className="ms-auto">بازیابی مبتنی بر هستی‌شناسی IrGO</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------- کشوی نشان‌شده‌ها ---------- */}
      <div className={`fixed inset-0 z-[75] ${drawer ? "" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-night/70 transition-opacity duration-500 ${drawer ? "opacity-100" : "opacity-0"}`} onClick={() => setDrawer(false)} />
        <aside className={`absolute inset-y-0 end-0 w-[min(92vw,360px)] bg-deep border-s border-edge transition-transform duration-500 ease-out flex flex-col ${drawer ? "translate-x-0" : "-translate-x-[110%]"}`} aria-label="نشان‌شده‌ها">
          <div className="flex items-center justify-between p-5 border-b border-edge/70">
            <h2 className="font-display text-xl text-ivory flex items-center gap-2.5">
              <Ic.bookmark className="w-5 h-5 text-gold" />
              کتابچهٔ نشان‌ها
              <span className="text-[11px] text-faint">({fa(marks.length)})</span>
            </h2>
            <button onClick={() => setDrawer(false)} className="text-faint hover:text-ivory transition-colors" aria-label="بستن">
              <Ic.close className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {marks.length === 0 && (
              <div className="text-center py-16">
                <Ic.bookmark className="w-10 h-10 text-edge mx-auto" />
                <p className="mt-4 text-[13px] text-dim">هنوز چیزی نشان نکرده‌اید</p>
                <p className="mt-1.5 text-[11.5px] text-faint leading-6">روی نشانِ هر گیاه، مقاله یا مدخل بزنید تا اینجا ذخیره شود.</p>
              </div>
            )}
            {marks.map((m) => (
              <div key={m.id} className="flex items-center gap-3 border border-edge/70 bg-night/40 p-3.5">
                <span className="w-2 h-2 rotate-45 bg-gold shrink-0" />
                <span className="flex-1 min-w-0">
                  <span className="block text-[13px] font-semibold text-ivory truncate">{m.label}</span>
                  <span className="block text-[10.5px] text-faint mt-0.5">{m.view === "encyclopedia" ? "دانشنامه" : m.view === "journal" ? "مجله" : "بخش سامانه"}</span>
                </span>
                <button onClick={() => go(m.view)} className="text-[11px] font-bold text-teal hover:text-goldsoft transition-colors shrink-0">
                  رفتن ↩
                </button>
              </div>
            ))}
          </div>
          <p className="p-4 border-t border-edge/70 text-[10.5px] text-faint leading-5">نشان‌ها در مرورگر شما ذخیره می‌شوند و در بازدیدهای بعدی باقی می‌مانند.</p>
        </aside>
      </div>

      {/* ---------- بدنه ---------- */}
      <main key={encKey}>
        {view === "home" && <Home go={go} />}
        {view === "encyclopedia" && <Encyclopedia initialQuery={encQuery} />}
        {view === "quiz" && <Quiz />}
        {view === "journal" && <Journal />}
        {view === "academy" && <Academy />}
        {view === "library" && <Library />}
        {view === "market" && <Market />}
        {view === "community" && <Community />}
        {view === "about" && <About />}
        {view === "contact" && <Contact />}
        {view === "faq" && <Faq />}
      </main>

      {/* ---------- پانوشت ---------- */}
      <footer className="mt-16 border-t border-edge/70 bg-deep/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-8">
          <div className="grid md:grid-cols-[1.3fr_1fr_1fr_1.4fr] gap-10">
            <div>
              <div className="flex items-center gap-3">
                <Shamseh className="w-10 h-10" />
                <div>
                  <div className="font-display text-xl text-ivory leading-none">دانشنامهٔ طب سنتی ایران</div>
                  <div className="font-nasta text-gold text-sm mt-1">میراث، دانش، سلامت</div>
                </div>
              </div>
              <p className="mt-4 text-[12.5px] text-dim leading-7 max-w-xs">
                پلتفرم جامع دانش‌بنیان برای گردآوری، آموزش و ترویج طب سنتی ایران؛ با داوری علمی، هستی‌شناسی تخصصی و نگاه بین‌المللی.
              </p>
              <div className="mt-4 flex gap-2">
                {["EN", "AR", "TR"].map((l) => (
                  <button key={l} onClick={() => push(`نسخهٔ ${l} به‌زودی گشوده می‌شود`)} className="text-[11px] font-bold border border-edge px-3 py-1.5 text-dim hover:border-teal hover:text-teal transition-colors">
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-display text-lg text-goldsoft">بخش‌های سامانه</h4>
              <ul className="mt-4 space-y-2.5 text-[13px]">
                {NAV.slice(1).map((n) => (
                  <li key={n.id}>
                    <button onClick={() => go(n.id)} className="text-dim hover:text-gold transition-colors">{n.label}</button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display text-lg text-goldsoft">راهنما</h4>
              <ul className="mt-4 space-y-2.5 text-[13px]">
                <li><button onClick={() => go("about")} className="text-dim hover:text-gold transition-colors">دربارهٔ ما و مأموریت</button></li>
                <li><button onClick={() => go("contact")} className="text-dim hover:text-gold transition-colors">تماس با ما</button></li>
                <li><button onClick={() => go("faq")} className="text-dim hover:text-gold transition-colors">سوالات متداول</button></li>
                <li><button onClick={() => go("community")} className="text-dim hover:text-gold transition-colors">رویدادها و همایش‌ها</button></li>
                <li><button onClick={() => go("quiz")} className="text-dim hover:text-gold transition-colors">مزاج‌سنجی رایگان</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display text-lg text-goldsoft">خبرنامهٔ فصلی</h4>
              <p className="mt-3 text-[12.5px] text-dim leading-6">تدابیر هر فصل، مقالات برگزیده و رویدادها — ماهی یک نامه، بدون اسپم.</p>
              <div className="mt-3 flex">
                <input
                  value={news}
                  onChange={(e) => setNews(e.target.value)}
                  placeholder="ایمیل شما"
                  className="flex-1 min-w-0 bg-night/60 border border-edge focus:border-gold outline-none text-sm text-ivory placeholder:text-faint py-3 px-4 transition-colors"
                />
                <button onClick={submitNews} className="shrink-0 bg-gold text-night font-bold px-5 hover:bg-goldsoft transition-colors" aria-label="عضویت در خبرنامه">
                  <Ic.send className="w-4.5 h-4.5" />
                </button>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[10.5px] text-faint">
                <Ic.shield className="w-4 h-4 text-teal shrink-0" />
                اتصال امن SSL • پشتیبان‌گیری خودکار • حریم خصوصی کاربران
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-edge/60 pt-6 grid md:grid-cols-[1fr_auto] gap-4 items-center">
            <p className="text-[11px] text-faint leading-6">
              محتوای این سامانه صرفاً جنبهٔ آموزشی و اطلاع‌رسانی دارد و جایگزین تشخیص، تجویز و درمان پزشکی نیست. در موارد حاد با اورژانس ۱۱۵ تماس بگیرید.
            </p>
            <p className="text-[11px] text-faint shrink-0">© ۱۴۰۴ دانشنامهٔ طب سنتی ایران — تمامی حقوق محفوظ است</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <BookmarkProvider>
        <AppInner />
      </BookmarkProvider>
    </ToastProvider>
  );
}
