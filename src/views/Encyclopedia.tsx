import { useEffect, useMemo, useState } from "react";
import {
  COMPOUNDS,
  DISEASES,
  FOODS,
  HERBS,
  TEMPERAMENTS,
} from "../data";
import type { Compound, Disease, Food, Herb, TemperamentId } from "../data";
import { EXTRA_COMPOUNDS, EXTRA_DISEASES, EXTRA_FOODS, EXTRA_HERBS, FOOD_DETAILS, HERB_DETAILS, MIZAJ_GUIDE } from "../dataExtra";
import { EXTRA_HERBS_2 } from "../dataHerbs2";
import { EXTRA_FOODS_2 } from "../dataFoods2";
import { EXTRA_COMPOUNDS_2 } from "../dataCompounds2";
import { EXTRA_DISEASES_2 } from "../dataDiseases2";
import { EXTRA_DISEASES_3 } from "../dataDiseases3";
import { Ic, MarkButton, Reveal, SectionHead, Stars, TemperChip, fa } from "../ui";
import { EntryPhoto } from "../plate";
import { compoundWikiTitle, diseaseWikiTitle, foodWikiTitle, herbWikiTitle } from "../wikiPhotos";

const ALL_HERBS = [...HERBS, ...EXTRA_HERBS, ...EXTRA_HERBS_2];
const ALL_FOODS = [...FOODS, ...EXTRA_FOODS, ...EXTRA_FOODS_2];
const ALL_COMPOUNDS = [...COMPOUNDS, ...EXTRA_COMPOUNDS, ...EXTRA_COMPOUNDS_2];
const ALL_DISEASES = [...DISEASES, ...EXTRA_DISEASES, ...EXTRA_DISEASES_2, ...EXTRA_DISEASES_3];

type Tab = "herbs" | "foods" | "compounds" | "diseases" | "mizaj";

const TABS: { id: Tab; label: string; count: number; icon: React.ReactNode }[] = [
  { id: "herbs", label: "گیاهان دارویی", count: ALL_HERBS.length, icon: <Ic.leaf className="w-4 h-4" /> },
  { id: "foods", label: "مفردات غذایی", count: ALL_FOODS.length, icon: <Ic.mortar className="w-4 h-4" /> },
  { id: "compounds", label: "داروهای مرکب", count: ALL_COMPOUNDS.length, icon: <Ic.flask className="w-4 h-4" /> },
  { id: "diseases", label: "بیماری‌ها", count: ALL_DISEASES.length, icon: <Ic.heart className="w-4 h-4" /> },
  { id: "mizaj", label: "مزاج‌نامه", count: MIZAJ_GUIDE.length, icon: <Ic.scale className="w-4 h-4" /> },
];

/* ---------- نوار مقیاس مزاج ---------- */
function ScaleBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-8 text-[10.5px] text-faint shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-night border border-edge/50">
        <div className="h-full transition-all duration-700" style={{ width: `${value}%`, background: color, opacity: 0.85 }} />
      </div>
      <span className="w-7 text-[10px] text-faint" style={{ textAlign: "left" }}>{fa(value)}</span>
    </div>
  );
}

function ExpandShell({
  id,
  openId,
  setOpenId,
  header,
  children,
}: {
  id: string;
  openId: string | null;
  setOpenId: (v: string | null) => void;
  header: React.ReactNode;
  children: React.ReactNode;
}) {
  const open = openId === id;
  return (
    <div className={`border transition-all duration-500 bg-deep ${open ? "border-gold/50 shadow-[0_18px_44px_-18px_rgba(0,0,0,0.8)]" : "border-edge card-lift"}`}>
      <button onClick={() => setOpenId(open ? null : id)} className="w-full text-start p-5" aria-expanded={open}>
        {header}
        <span className={`mt-3 inline-flex items-center gap-2 text-[11px] font-semibold transition-colors ${open ? "text-gold" : "text-teal"}`}>
          {open ? "بستن شناسنامه" : "گشودن شناسنامهٔ کامل"}
          <span className={`transition-transform duration-300 ${open ? "rotate-90" : ""}`}><Ic.arrowLeft className="w-3.5 h-3.5" /></span>
        </span>
      </button>
      <div className={`grid transition-all duration-500 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="px-5 pb-6 pt-1 border-t border-edge/60">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, warn = false }: { label: string; children: React.ReactNode; warn?: boolean }) {
  return (
    <div className={warn ? "border border-madder/40 bg-madder/5 p-3.5" : "border border-edge/70 bg-night/30 p-3.5"}>
      <div className={`text-[11px] font-bold mb-1.5 ${warn ? "text-madder" : "text-teal"}`}>{label}</div>
      <div className="text-[13px] leading-6 text-dim">{children}</div>
    </div>
  );
}

export default function Encyclopedia({ initialQuery = "" }: { initialQuery?: string }) {
  const [tab, setTab] = useState<Tab>("herbs");
  const [q, setQ] = useState(initialQuery);
  const [temper, setTemper] = useState<TemperamentId | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [visible, setVisible] = useState(18);

  useEffect(() => {
    setVisible(18);
  }, [tab, q, temper]);

  const norm = (s: string) => s.replace(/ي/g, "ی").replace(/ك/g, "ک").trim().toLowerCase();

  const goRelated = (name: string) => {
    const n = norm(name);
    const inHerbs = ALL_HERBS.some((x) => [x.name, x.local, ...x.props].some((s) => norm(s).includes(n)));
    const inFoods = ALL_FOODS.some((x) => [x.name, x.benefits].some((s) => norm(s).includes(n)));
    const inCompounds = ALL_COMPOUNDS.some((x) => [x.name, ...x.ingredients].some((s) => norm(s).includes(n)));
    const inDiseases = ALL_DISEASES.some((x) => [x.name, ...x.symptoms].some((s) => norm(s).includes(n)));
    if (ALL_HERBS.some((x) => norm(x.name) === n)) setTab("herbs");
    else if (ALL_FOODS.some((x) => norm(x.name) === n)) setTab("foods");
    else if (ALL_COMPOUNDS.some((x) => norm(x.name) === n)) setTab("compounds");
    else if (ALL_DISEASES.some((x) => norm(x.name) === n)) setTab("diseases");
    else if (inHerbs) setTab("herbs");
    else if (inCompounds) setTab("compounds");
    else if (inDiseases) setTab("diseases");
    else if (inFoods) setTab("foods");
    setQ(name);
    setOpenId(null);
  };

  const results = useMemo(() => {
    const nq = norm(q);
    if (tab === "mizaj") return [];
    if (tab === "herbs")
      return ALL_HERBS.filter(
        (h) =>
          (temper === "all" || h.temperament === temper) &&
          (nq === "" || [h.name, h.local, h.latin, h.uses, ...h.props, ...(HERB_DETAILS[h.id]?.components ?? [])].some((x) => norm(x).includes(nq)))
      );
    if (tab === "foods")
      return ALL_FOODS.filter(
        (f) =>
          (temper === "all" || f.temperament === temper) &&
          (nq === "" || [f.name, f.benefits, f.tadabir, f.cat, FOOD_DETAILS[f.id]?.nutrition ?? ""].some((x) => norm(x).includes(nq)))
      );
    if (tab === "compounds")
      return ALL_COMPOUNDS.filter(
        (c) =>
          (temper === "all" || c.temperament === temper) &&
          (nq === "" || [c.name, c.props, c.use, ...c.ingredients].some((x) => norm(x).includes(nq)))
      );
    return ALL_DISEASES.filter(
      (d) =>
        (temper === "all" || d.temperament === temper) &&
        (nq === "" || [d.name, d.causes, ...d.symptoms, ...d.diet, ...d.therapy].some((x) => norm(x).includes(nq)))
    );
  }, [tab, q, temper]);

  const mizajList = useMemo(() => {
    const nq = norm(q);
    if (tab !== "mizaj") return [];
    return MIZAJ_GUIDE.filter(
      (m) => nq === "" || [m.title, m.desc, m.organ, ...m.body, ...m.best].some((x) => norm(x).includes(nq))
    );
  }, [tab, q]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <Reveal>
        <SectionHead
          kicker="دانشنامهٔ داوری‌شده"
          title="دانشنامهٔ جامع طب سنتی ایران"
          desc="هر مدخل با ارجاع به کتب مرجع و بازبینی هیئت علمی منتشر می‌شود؛ فیلتر بر پایهٔ مزاج، بازیابی بر پایهٔ هستی‌شناسی."
        />
      </Reveal>

      {/* ابزار جست‌وجو */}
      <Reveal delay={120}>
        <div className="mt-9 border border-edge bg-deep/70 p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch">
            <label className="relative flex-1">
              <span className="absolute inset-y-0 end-4 flex items-center text-faint"><Ic.search className="w-5 h-5" /></span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="نام گیاه، دارو، بیماری یا خاصیت… (مثلاً: ضد نفخ)"
                className="w-full bg-night/60 border border-edge focus:border-gold outline-none text-sm text-ivory placeholder:text-faint py-3.5 ps-4 pe-12 transition-colors"
              />
            </label>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTab(t.id); setOpenId(null); }}
                  className={`shrink-0 flex items-center gap-2 px-4 py-3 text-[13px] font-semibold border transition-all duration-300 ${
                    tab === t.id ? "bg-gold text-night border-gold" : "border-edge text-dim hover:border-gold/60 hover:text-goldsoft"
                  }`}
                >
                  {t.icon}
                  {t.label}
                  <span className={`text-[10px] px-1.5 py-0.5 ${tab === t.id ? "bg-night/20" : "bg-pane"}`}>{fa(t.count)}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-[11px] text-faint me-1">فیلتر مزاج:</span>
            <button onClick={() => setTemper("all")} className={`text-[12px] px-3 py-1.5 border transition-colors ${temper === "all" ? "border-teal text-teal bg-teal/10" : "border-edge text-dim hover:text-ivory"}`}>
              همه
            </button>
            {(Object.keys(TEMPERAMENTS) as TemperamentId[]).map((t) => (
              <button
                key={t}
                onClick={() => setTemper(temper === t ? "all" : t)}
                className={`text-[12px] px-3 py-1.5 border transition-colors ${temper === t ? "bg-white/5" : "border-edge text-dim hover:text-ivory"}`}
                style={temper === t ? { borderColor: TEMPERAMENTS[t].color, color: TEMPERAMENTS[t].color } : undefined}
              >
                {TEMPERAMENTS[t].label}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="mt-6 flex items-center justify-between text-[12px] text-faint">
        <span>{tab === "mizaj" ? fa(mizajList.length) : fa(results.length)} مدخل یافت شد</span>
        <span className="hidden sm:block">نشان‌گذاری با کلیک بر نشانِ هر مدخل؛ ذخیره در کتابچهٔ شما</span>
      </div>

      {/* فهرست نتایج */}
      <div className="mt-4 grid gap-4">
        {tab !== "mizaj" && results.length === 0 && (
          <div className="border border-dashed border-edge p-12 text-center">
            <p className="font-display text-2xl text-dim">چیزی در این قفسه نیافتیم!</p>
            <p className="mt-2 text-sm text-faint">عبارت دیگری را بیازمایید یا فیلتر مزاج را بردارید.</p>
          </div>
        )}
        {tab === "mizaj" && mizajList.length === 0 && (
          <div className="border border-dashed border-edge p-12 text-center">
            <p className="font-display text-2xl text-dim">چیزی در این قفسه نیافتیم!</p>
            <p className="mt-2 text-sm text-faint">عبارت دیگری را بیازمایید.</p>
          </div>
        )}

        {/* ---------- مزاج‌نامهٔ نه‌گانه ---------- */}
        {tab === "mizaj" &&
          mizajList.map((m, i) => (
            <Reveal key={m.id} delay={Math.min(i * 60, 240)}>
              <ExpandShell
                id={`m-${m.id}`}
                openId={openId}
                setOpenId={setOpenId}
                header={
                  <div className="flex items-start gap-4">
                    <div className="w-28 sm:w-36 h-20 sm:h-28 shrink-0 border border-edge/70 overflow-hidden hidden sm:block">
                      <EntryPhoto kind="mizaj" id={m.id} tint={`${m.colour}33`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="w-3 h-3 rotate-45 shrink-0" style={{ background: m.colour }} />
                            <h3 className="font-display text-2xl text-ivory">{m.title}</h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 border border-edge/70 text-faint">{m.kind}</span>
                          </div>
                          <p className="mt-2 text-[13px] text-dim leading-6 max-w-2xl">{m.desc}</p>
                        </div>
                        <div className="text-[11px] text-faint text-end shrink-0">
                          <div>اندام: {m.organ}</div>
                          {m.season !== "—" && <div className="mt-0.5">فصل: {m.season}</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                }
              >
                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                  <Field label="نشانه‌های جسمانی">
                    <ul className="space-y-1.5">
                      {m.body.map((s) => (
                        <li key={s} className="flex items-start gap-2"><span className="mt-2 w-1.5 h-1.5 rotate-45 shrink-0" style={{ background: m.colour }} />{s}</li>
                      ))}
                    </ul>
                  </Field>
                  <Field label="نشانه‌های روانی و ذهنی">
                    <ul className="space-y-1.5">
                      {m.mind.map((s) => (
                        <li key={s} className="flex items-start gap-2"><span className="mt-2 w-1.5 h-1.5 rotate-45 shrink-0" style={{ background: m.colour }} />{s}</li>
                      ))}
                    </ul>
                  </Field>
                  <Field label="سازگارترین تدابیر">
                    <span className="flex flex-wrap gap-1.5">
                      {m.best.map((s) => (
                        <span key={s} className="px-2.5 py-1 bg-teal/8 border border-teal/30 text-[12px] text-teal">{s}</span>
                      ))}
                    </span>
                  </Field>
                  <Field label="پرهیزات" warn>
                    <span className="flex flex-wrap gap-1.5">
                      {m.avoid.map((s) => (
                        <span key={s} className="px-2.5 py-1 bg-madder/8 border border-madder/30 text-[12px] text-madder">{s}</span>
                      ))}
                    </span>
                  </Field>
                </div>
              </ExpandShell>
            </Reveal>
          ))}

        {tab === "herbs" &&
          (results as Herb[]).slice(0, visible).map((h, i) => (
            <Reveal key={h.id} delay={Math.min(i * 60, 240)}>
              <ExpandShell
                id={h.id}
                openId={openId}
                setOpenId={setOpenId}
                header={
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                    <div className="sm:w-52 sm:shrink-0 h-36 sm:h-40 border border-edge/70 overflow-hidden">
                      <EntryPhoto kind="herb" id={h.id} temperament={h.temperament} hint={h.parts} caption={h.latin} wiki={herbWikiTitle(h)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-display text-2xl text-ivory">{h.name}</h3>
                            <TemperChip label={TEMPERAMENTS[h.temperament].label} color={TEMPERAMENTS[h.temperament].color} />
                          </div>
                          <p className="mt-1 text-[12px] text-faint">{h.local} — <span className="italic" dir="ltr">{h.latin}</span> — بخش مورد استفاده: {h.parts}</p>
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {h.props.map((p) => (
                              <span key={p} className="text-[11px] px-2.5 py-1 bg-pane border border-edge/60 text-dim">{p}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5 text-[11px] text-faint"><Stars value={h.rating} />{fa(h.rating)}</span>
                          <MarkButton id={h.id} label={`گیاه ${h.name}`} view="encyclopedia" />
                        </div>
                      </div>
                    </div>
                  </div>
                }
              >
                {(() => {
                  const d = HERB_DETAILS[h.id];
                  return (
                    <div className="mt-4 space-y-3">
                      {/* مقیاس مزاج + زیستگاه و پیشینه */}
                      {d && (
                        <div className="grid sm:grid-cols-[220px_1fr] gap-3">
                          <div className="border border-edge/70 bg-night/30 p-3.5">
                            <div className="text-[11px] font-bold text-teal mb-2.5">مقیاس کیفیات</div>
                            <div className="space-y-2">
                              <ScaleBar label="گرمی" value={d.scale.hot} color="#d8604a" />
                              <ScaleBar label="سردی" value={d.scale.cold} color="#3fc8b8" />
                              <ScaleBar label="خشکی" value={d.scale.dry} color="#e3b558" />
                              <ScaleBar label="تری" value={d.scale.wet} color="#7fb8c9" />
                            </div>
                          </div>
                          <div className="grid gap-3">
                            <Field label="زیستگاه و خاستگاه">{d.habitat}</Field>
                            <Field label="پیشینه در سنت ایرانی">{d.history}</Field>
                          </div>
                        </div>
                      )}
                      <div className="grid sm:grid-cols-2 gap-3">
                        <Field label="موارد استفاده در سنت">{h.uses}</Field>
                        <Field label="روش تهیه و مصرف">{d ? d.method : "طبق دستور متخصص."}</Field>
                        <Field label="دوز متعارف">{d ? d.dose : "با نظر متخصص."}</Field>
                        {d && (
                          <Field label="ترکیبات شاخص">
                            <span className="flex flex-wrap gap-1.5">
                              {d.components.map((c) => (
                                <span key={c} className="px-2.5 py-1 bg-pane border border-edge/60 text-[12px]">{c}</span>
                              ))}
                            </span>
                          </Field>
                        )}
                        <Field label="منع مصرف" warn>{h.contra}</Field>
                        <Field label="تداخلات دارویی">{h.interactions}</Field>
                        <Field label="احتیاط">{h.caution}</Field>
                      </div>
                      {d && (
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="text-[11px] font-bold text-faint me-1">مفاهیم مرتبط در هستی‌شناسی:</span>
                          {d.related.map((r) => (
                            <button
                              key={r}
                              onClick={() => goRelated(r)}
                              className="text-[12px] px-3 py-1 border border-teal/40 text-teal hover:bg-teal hover:text-night transition-all duration-300"
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      )}
                      <p className="text-[11px] text-faint border-t border-edge/60 pt-3">منابع: مخزن‌الادویه، تحفه‌المؤمنین، تک‌نگاری‌های هیئت علمی — {fa(h.votes)} امتیاز کاربران</p>
                    </div>
                  );
                })()}
              </ExpandShell>
            </Reveal>
          ))}

        {tab === "foods" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(results as Food[]).slice(0, visible).map((f, i) => (
              <Reveal key={f.id} delay={Math.min(i * 60, 240)}>
                <ExpandShell
                  id={f.id}
                  openId={openId}
                  setOpenId={setOpenId}
                  header={
                    <div className="flex items-start gap-4">
                      <div className="w-28 sm:w-32 h-20 shrink-0 border border-edge/70 overflow-hidden hidden sm:block">
                        <EntryPhoto kind="food" id={f.id} temperament={f.temperament} hint={f.cat} wiki={foodWikiTitle(f.name)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h3 className="font-display text-xl text-ivory">{f.name}</h3>
                            <TemperChip label={TEMPERAMENTS[f.temperament].label} color={TEMPERAMENTS[f.temperament].color} />
                          </div>
                          <MarkButton id={f.id} label={`غذای ${f.name}`} view="encyclopedia" />
                        </div>
                        <p className="mt-1 text-[11px] text-teal font-semibold">{f.cat}</p>
                      </div>
                    </div>
                  }
                >
                  {(() => {
                    const fd = FOOD_DETAILS[f.id];
                    return (
                      <div className="grid gap-3 mt-4">
                        <Field label="ارزش و خواص از دیدگاه سنت">{f.benefits}</Field>
                        {fd && <Field label="ارزش غذایی (هر ۱۰۰ گرم)">{fd.nutrition}</Field>}
                        <Field label="تدابیر و مصلح">{f.tadabir}</Field>
                        {fd && <Field label="پیشینه در سفرهٔ ایرانی">{fd.history}</Field>}
                        {fd && <Field label="احتیاط" warn>{fd.caution}</Field>}
                      </div>
                    );
                  })()}
                </ExpandShell>
              </Reveal>
            ))}
          </div>
        )}

        {tab === "compounds" && (
          <div className="grid md:grid-cols-2 gap-4">
            {(results as Compound[]).slice(0, visible).map((c, i) => (
              <Reveal key={c.id} delay={Math.min(i * 60, 240)}>
                <ExpandShell
                  id={c.id}
                  openId={openId}
                  setOpenId={setOpenId}
                  header={
                    <div className="flex items-start gap-4">
                      <div className="w-28 sm:w-32 h-20 shrink-0 border border-edge/70 overflow-hidden hidden sm:block">
                        <EntryPhoto kind="compound" id={c.id} temperament={c.temperament} hint={c.kind} wiki={compoundWikiTitle(c.name, c.ingredients)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h3 className="font-display text-xl text-ivory">{c.name}</h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-lapis/20 text-[#9cc0ea] border border-lapis/40">{c.kind}</span>
                            <TemperChip label={TEMPERAMENTS[c.temperament].label} color={TEMPERAMENTS[c.temperament].color} />
                          </div>
                          <MarkButton id={c.id} label={`داروی ${c.name}`} view="encyclopedia" />
                        </div>
                        <p className="mt-2 text-[13px] text-dim leading-6">{c.props}</p>
                      </div>
                    </div>
                  }
                >
                  <div className="grid gap-3 mt-4">
                    <Field label="ترکیبات">
                      <span className="flex flex-wrap gap-1.5">
                        {c.ingredients.map((ing) => (
                          <span key={ing} className="px-2.5 py-1 bg-pane border border-edge/60 text-[12px]">{ing}</span>
                        ))}
                      </span>
                    </Field>
                    <Field label="کاربرد و روش مصرف">{c.use}</Field>
                  </div>
                  <p className="mt-3 text-[11px] text-madder flex items-center gap-2"><Ic.warn className="w-4 h-4 shrink-0" />ساخت و مصرف مرکبات تنها با نظارت متخصص طب سنتی انجام شود.</p>
                </ExpandShell>
              </Reveal>
            ))}
          </div>
        )}

        {tab === "diseases" &&
          (results as Disease[]).slice(0, visible).map((d, i) => (
            <Reveal key={d.id} delay={Math.min(i * 60, 240)}>
              <ExpandShell
                id={d.id}
                openId={openId}
                setOpenId={setOpenId}
                header={
                  <div className="flex items-start gap-4">
                    <div className="w-32 sm:w-40 h-20 sm:h-28 shrink-0 border border-edge/70 overflow-hidden hidden sm:block">
                      <EntryPhoto kind="disease" id={d.id} temperament={d.temperament} wiki={diseaseWikiTitle(d.name)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="font-display text-2xl text-ivory">{d.name}</h3>
                          <TemperChip label={TEMPERAMENTS[d.temperament].label} color={TEMPERAMENTS[d.temperament].color} />
                        </div>
                        <MarkButton id={d.id} label={d.name} view="encyclopedia" />
                      </div>
                    </div>
                  </div>
                }
              >
                <p className="mt-4 text-[13px] leading-7 text-dim border-s-2 border-gold/60 ps-4">{d.causes}</p>
                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                  <Field label="علائم کلیدی">
                    <ul className="space-y-1.5">
                      {d.symptoms.map((s) => (
                        <li key={s} className="flex items-start gap-2"><span className="mt-2 w-1.5 h-1.5 rotate-45 bg-teal shrink-0" />{s}</li>
                      ))}
                    </ul>
                  </Field>
                  <Field label="تدابیر غذایی">
                    <ul className="space-y-1.5">
                      {d.diet.map((s) => (
                        <li key={s} className="flex items-start gap-2"><span className="mt-2 w-1.5 h-1.5 rotate-45 bg-gold shrink-0" />{s}</li>
                      ))}
                    </ul>
                  </Field>
                </div>
                <div className="mt-3">
                  <Field label="تدابیر یداویی و رفتاری">
                    <span className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
                      {d.therapy.map((s) => (
                        <span key={s} className="flex items-start gap-2"><span className="mt-2 w-1.5 h-1.5 rotate-45 bg-madder shrink-0" />{s}</span>
                      ))}
                    </span>
                  </Field>
                </div>
                <p className="mt-3 text-[11px] text-madder flex items-center gap-2"><Ic.warn className="w-4 h-4 shrink-0" />این مدخل آموزشی است؛ برای تشخیص و درمان به متخصص طب سنتی مراجعه کنید.</p>
              </ExpandShell>
            </Reveal>
          ))}
      </div>

      {/* بارگذاری بیشتر */}
      {tab !== "mizaj" && results.length > visible && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisible((v) => v + 24)}
            className="group inline-flex items-center gap-3 border border-gold/50 text-gold font-bold px-8 py-3.5 hover:bg-gold hover:text-night transition-all duration-300"
          >
            بارگذاری {fa(Math.min(24, results.length - visible))} مدخل دیگر
            <span className="text-[11px] font-normal opacity-75">({fa(results.length - visible)} مدخل باقی‌مانده)</span>
          </button>
        </div>
      )}
    </div>
  );
}
