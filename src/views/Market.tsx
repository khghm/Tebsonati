import { useMemo, useState } from "react";
import { PRODUCTS } from "../data";
import type { Product } from "../data";
import { Ic, Reveal, SectionHead, Stars, fa, toman, useToast } from "../ui";

const CATS = ["همه", "گیاهان و دمنوش", "روغن‌های طبیعی", "عسل و شیرینی‌ها", "عرقیات", "میوه‌های خشک"];

const TILE_COLORS = ["#e3b558", "#3fc8b8", "#d8604a", "#7fb8c9", "#8fbc7f"];

function ProductGlyph({ seed }: { seed: number }) {
  const c = TILE_COLORS[seed % TILE_COLORS.length];
  return (
    <svg viewBox="0 0 120 90" className="w-full h-full" aria-hidden="true">
      <rect width="120" height="90" fill="#0e1d2e" />
      <g stroke={c} strokeOpacity="0.16" fill="none">
        {Array.from({ length: 5 }).map((_, i) => (
          <rect key={i} x={i * 26 + 4} y={i % 2 ? 6 : 14} width="20" height="20" transform={`rotate(45 ${i * 26 + 14} ${i % 2 ? 16 : 24})`} />
        ))}
      </g>
      <circle cx="60" cy="45" r="24" fill={c} fillOpacity="0.1" stroke={c} strokeOpacity="0.55" />
      <rect x="50" y="35" width="20" height="20" fill="none" stroke={c} strokeOpacity="0.7" transform="rotate(45 60 45)" />
      <path d="M60 30 C52 40 50 46 54 52 a7 7 0 0 0 12 0 c4-6 2-12-6-22Z" fill={c} fillOpacity="0.85" />
    </svg>
  );
}

export default function Market() {
  const [cat, setCat] = useState("همه");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [placed, setPlaced] = useState(false);
  const { push } = useToast();

  const list = useMemo(() => PRODUCTS.filter((p) => cat === "همه" || p.cat === cat), [cat]);
  const cartItems = Object.entries(cart).map(([id, qty]) => ({ p: PRODUCTS.find((x) => x.id === id)!, qty }));
  const total = cartItems.reduce((s, i) => s + i.p.price * i.qty, 0);
  const count = cartItems.reduce((s, i) => s + i.qty, 0);

  const add = (p: Product) => {
    setPlaced(false);
    setCart((c) => ({ ...c, [p.id]: (c[p.id] ?? 0) + 1 }));
    push(`«${p.name}» به سبد اضافه شد`);
  };
  const dec = (id: string) => {
    setCart((c) => {
      const q = (c[id] ?? 0) - 1;
      const next = { ...c };
      if (q <= 0) delete next[id];
      else next[id] = q;
      return next;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <Reveal>
        <SectionHead
          kicker="بازارچهٔ اینترنتی محصولات سالم"
          title="بازارچهٔ عطاریِ دیجیتال"
          desc="فرآورده‌های گیاهی استاندارد با مجوز بهداشت، از فروشندگان اعتبارسنجی‌شده — با تضمین اصالت و امکان بازگشت."
        />
      </Reveal>

      {/* اعتبارسنجی فروشندگان */}
      <Reveal delay={110}>
        <div className="mt-8 border border-teal/25 bg-teal/5 p-5 grid md:grid-cols-3 gap-5">
          {[
            { icon: <Ic.shield className="w-6 h-6" />, t: "استعلام مجوز", d: "مجوز بهداشت و پروانهٔ ساخت هر فرآورده پیش از عرضه استعلام می‌شود." },
            { icon: <Ic.flask className="w-6 h-6" />, t: "آزمایش نمونه", d: "نمونهٔ تصادفی محصولات برای اصالت و خلوص آزمایش می‌شود." },
            { icon: <Ic.user className="w-6 h-6" />, t: "نظرت دائمی", d: "امتیاز و نظرات خریداران، اعتبار فروشنده را به‌صورت زنده تعیین می‌کند." },
          ].map((s, i) => (
            <div key={s.t} className="flex items-start gap-3.5">
              <span className="shrink-0 w-12 h-12 border border-teal/40 bg-night/40 flex items-center justify-center text-teal">{s.icon}</span>
              <div>
                <h4 className="font-display text-lg text-ivory">{fa(i + 1)}. {s.t}</h4>
                <p className="mt-1 text-[12px] text-dim leading-6">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="mt-10 grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        <div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {CATS.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`shrink-0 px-4 py-2 text-[13px] font-semibold border transition-all duration-300 ${
                  cat === c ? "bg-gold text-night border-gold" : "border-edge text-dim hover:border-gold/60 hover:text-goldsoft"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-5 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {list.map((p, i) => (
              <Reveal key={p.id} delay={Math.min(i * 60, 240)}>
                <div className="card-lift frame h-full border border-edge bg-deep flex flex-col">
                  <div className="relative h-32 overflow-hidden">
                    <ProductGlyph seed={i} />
                    {p.badge && <span className="absolute top-3 start-3 text-[10px] font-bold px-2.5 py-1 bg-madder text-ivory">{p.badge}</span>}
                    {p.verified && (
                      <span className="absolute top-3 end-3 flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-night/70 border border-teal/50 text-teal">
                        <Ic.shield className="w-3.5 h-3.5" />
                        معتبر
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-[14px] text-ivory leading-6">{p.name}</h3>
                    </div>
                    <p className="mt-1 text-[11.5px] text-dim leading-5 flex-1">{p.desc}</p>
                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-faint">
                      <span>{p.seller}</span>
                      <span className="flex items-center gap-1"><Stars value={p.rating} />{fa(p.rating)}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-edge/60 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[13.5px] font-bold text-goldsoft">{toman(p.price)}</div>
                        {p.oldPrice && <div className="text-[10.5px] text-faint line-through">{toman(p.oldPrice)}</div>}
                      </div>
                      {cart[p.id] ? (
                        <div className="flex items-center gap-1.5 border border-gold/50">
                          <button onClick={() => add(p)} className="px-2.5 py-1.5 text-gold hover:bg-gold hover:text-night transition-colors font-bold">+</button>
                          <span className="text-[12px] font-bold text-ivory w-5 text-center">{fa(cart[p.id])}</span>
                          <button onClick={() => dec(p.id)} className="px-2.5 py-1.5 text-gold hover:bg-gold hover:text-night transition-colors font-bold">−</button>
                        </div>
                      ) : (
                        <button onClick={() => add(p)} className="inline-flex items-center gap-1.5 bg-gold text-night text-[12px] font-bold px-4 py-2 hover:bg-goldsoft transition-colors">
                          <Ic.cart className="w-4 h-4" />
                          افزودن
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* سبد خرید */}
        <Reveal delay={150} className="lg:sticky lg:top-24">
          <aside className="border border-edge bg-deep p-5">
            <h3 className="font-display text-xl text-ivory flex items-center gap-2.5">
              <Ic.cart className="w-5 h-5 text-gold" />
              سبد خرید
              {count > 0 && <span className="text-[11px] font-bold bg-gold text-night px-2 py-0.5">{fa(count)} قلم</span>}
            </h3>
            {cartItems.length === 0 ? (
              <p className="mt-4 text-[12.5px] text-faint leading-6">سبد شما خالی است؛ از قفسه‌ها محصولی برگزینید.</p>
            ) : (
              <>
                <ul className="mt-4 space-y-3 max-h-64 overflow-y-auto pe-1">
                  {cartItems.map(({ p, qty }) => (
                    <li key={p.id} className="flex items-center gap-3 border-b border-edge/50 pb-3">
                      <div className="w-10 h-10 shrink-0 overflow-hidden border border-edge/60"><ProductGlyph seed={PRODUCTS.indexOf(p)} /></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-semibold text-ivory truncate">{p.name}</div>
                        <div className="text-[10.5px] text-faint mt-0.5">{fa(qty)} × {toman(p.price)}</div>
                      </div>
                      <button onClick={() => dec(p.id)} className="text-faint hover:text-madder transition-colors" aria-label="کاهش"><Ic.close className="w-4 h-4" /></button>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center justify-between text-[13px]">
                  <span className="text-dim">جمع سبد</span>
                  <span className="font-display text-xl text-goldsoft">{toman(total)}</span>
                </div>
                {placed ? (
                  <div className="mt-4 border border-teal/50 bg-teal/10 text-teal text-center py-3 text-[13px] font-bold">
                    ✓ سفارش نمونهٔ شما ثبت شد
                  </div>
                ) : (
                  <button
                    onClick={() => { setPlaced(true); push("سفارش شما ثبت شد؛ برای هماهنگی ارسال تماس می‌گیریم"); setCart({}); }}
                    className="mt-4 w-full bg-gold text-night font-bold py-3 text-sm hover:bg-goldsoft transition-all duration-300"
                  >
                    تکمیل خرید
                  </button>
                )}
                <p className="mt-3 text-[10.5px] text-faint leading-5 flex items-start gap-1.5">
                  <Ic.shield className="w-3.5 h-3.5 shrink-0 mt-0.5 text-teal" />
                  تضمین اصالت؛ در صورت مغایرت، بازگشت تا ۷ روز.
                </p>
              </>
            )}
          </aside>
        </Reveal>
      </div>
    </div>
  );
}
