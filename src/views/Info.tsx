import { useState } from "react";
import { FAQS, IMG, PARTNERS, TEAM } from "../data";
import { Ic, Reveal, SectionHead, fa, useToast } from "../ui";

/* ================= دربارهٔ ما ================= */
export function About() {
  const missions = [
    { icon: <Ic.book className="w-6 h-6" />, t: "گردآوری نظام‌مند دانش", d: "یکپارچه‌سازی دانش پراکندهٔ طب سنتی ایران در دانشنامه‌ای داوری‌شده و متصل به هستی‌شناسی تخصصی." },
    { icon: <Ic.user className="w-6 h-6" />, t: "دسترسی همگانی به دانش معتبر", d: "آموزش خودمراقبتی برای عموم، منابع پژوهشی برای دانشجویان و ابزارهای تخصصی برای پزشکان." },
    { icon: <Ic.globe className="w-6 h-6" />, t: "حفظ میراث و بین‌المللی‌سازی", d: "معرفی مکتب طب ایرانی به جهان با محتوای چندزبانه و همکاری با نهادهای بین‌المللی." },
    { icon: <Ic.flask className="w-6 h-6" />, t: "پل میان سنت و نوآوری", d: "گفت‌وگوی دانش سنت با پژوهش‌های نوین سلامت؛ از داده‌کاوی متون تا اعتبارسنجی فرآورده‌ها." },
  ];
  const langs = ["English", "العربية", "Türkçe", "Français"];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <Reveal>
        <SectionHead
          kicker="دربارهٔ ما"
          title="مرجعیت علمی و فرهنگی طب سنتی ایران"
          desc="چشم‌انداز ما مرجعیت دانش طب سنتی ایران در سطح ملی و بین‌المللی است؛ پلی میان میراث هزارساله و سلامت امروز."
        />
      </Reveal>

      <Reveal delay={120}>
        <div className="mt-9 grid sm:grid-cols-2 gap-4">
          {missions.map((m, i) => (
            <div key={m.t} className="card-lift frame border border-edge bg-deep p-6 flex items-start gap-4">
              <span className="shrink-0 w-13 h-13 min-w-13 border border-gold/40 bg-gold/5 text-gold flex items-center justify-center">{m.icon}</span>
              <div>
                <div className="text-[11px] text-faint">مأموریت {fa(i + 1)}</div>
                <h3 className="mt-0.5 font-display text-xl text-ivory">{m.t}</h3>
                <p className="mt-1.5 text-[12.5px] text-dim leading-6">{m.d}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* تیم */}
      <div className="mt-14">
        <Reveal>
          <SectionHead kicker="هیئت علمی و اجرایی" title="نگهبانان این گنجینه" />
        </Reveal>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TEAM.map((t, i) => (
            <Reveal key={t.name} delay={i * 80}>
              <div className="card-lift border border-edge bg-deep p-5 text-center h-full">
                <span className="mx-auto w-16 h-16 border border-gold/50 bg-gold/5 flex items-center justify-center text-gold">
                  <Ic.user className="w-7 h-7" />
                </span>
                <h3 className="mt-3 font-display text-lg text-ivory">{t.name}</h3>
                <p className="mt-0.5 text-[11.5px] text-teal font-semibold">{t.role}</p>
                <p className="mt-2 text-[12px] text-dim leading-6">{t.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* بین‌الملل و همکاری‌ها */}
      <div className="mt-14 grid lg:grid-cols-2 gap-6">
        <Reveal>
          <div className="border border-edge bg-deep p-6 h-full">
            <p className="font-nasta text-gold text-xl">بخش بین‌الملل</p>
            <h3 className="mt-1 font-display text-2xl text-ivory">طب ایرانی، به زبان جهان</h3>
            <p className="mt-3 text-[13px] text-dim leading-7">
              گزیدهٔ محتوای دانشنامه به زبان‌های انگلیسی، عربی و ترکی در دست انتشار است؛ همراه با معرفی مکتب طب ایرانی در مجامع جهانی و همکاری آموزشی-پژوهشی با سازمان جهانی بهداشت و مراکز علمی بین‌المللی.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {langs.map((l) => (
                <span key={l} className="text-[12px] px-3.5 py-1.5 border border-teal/40 text-teal bg-teal/5 font-semibold">{l}</span>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="border border-edge bg-deep p-6 h-full">
            <p className="font-nasta text-gold text-xl">همکاران و مجوزها</p>
            <h3 className="mt-1 font-display text-2xl text-ivory">شبکهٔ اعتماد</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {PARTNERS.map((p) => (
                <span key={p} className="text-[12px] px-3.5 py-2 border border-edge/80 bg-night/40 text-dim flex items-center gap-2">
                  <Ic.shield className="w-4 h-4 text-gold" />
                  {p}
                </span>
              ))}
            </div>
            <p className="mt-4 text-[12px] text-faint leading-6">محتوای سامانه زیر نظر هیئت داوری علمی و بر پایهٔ منابع معتبر منتشر می‌شود.</p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ================= تماس با ما ================= */
export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "پرسش علمی", msg: "" });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const { push } = useToast();

  const submit = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 3) e.name = "نام را کامل وارد کنید";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "ایمیل معتبر نیست";
    if (form.msg.trim().length < 15) e.msg = "پیام باید دست‌کم ۱۵ حرف باشد";
    setErrs(e);
    if (Object.keys(e).length === 0) {
      push("پیام شما ثبت شد؛ پاسخ تا ۲ روز کاری به ایمیل‌تان می‌رسد");
      setForm({ name: "", email: "", subject: "پرسش علمی", msg: "" });
    }
  };

  const inp = (key: keyof typeof form, placeholder: string, extra = "") => (
    <div>
      <input
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        className={`w-full bg-night/60 border outline-none text-sm text-ivory placeholder:text-faint py-3.5 px-4 transition-colors focus:border-gold ${extra} ${errs[key] ? "border-madder" : "border-edge"}`}
      />
      {errs[key] && <p className="mt-1 text-[11px] text-madder">{errs[key]}</p>}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <Reveal>
        <SectionHead kicker="تماس با ما" title="درهای دانشخانه به روی شما باز است" desc="پرسش علمی، پیشنهاد همکاری یا گزارش خطا — هیئت پشتیبانی پاسخ‌گوست." />
      </Reveal>

      <div className="mt-9 grid lg:grid-cols-[1.2fr_1fr] gap-6 items-start">
        <Reveal>
          <div className="border border-edge bg-deep p-6 sm:p-7">
            <h3 className="font-display text-xl text-ivory">فرم تماس</h3>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {inp("name", "نام و نام خانوادگی")}
              {inp("email", "ایمیل")}
            </div>
            <div className="mt-3">
              <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full bg-night/60 border border-edge text-sm text-dim py-3.5 px-4 outline-none focus:border-gold">
                {["پرسش علمی", "همکاری پژوهشی", "گزارش خطای محتوایی", "پیشنهاد و انتقاد", "بازارچه و فروشندگان"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="mt-3">
              <textarea
                value={form.msg}
                onChange={(e) => setForm({ ...form, msg: e.target.value })}
                rows={5}
                placeholder="پیام شما…"
                className={`w-full bg-night/60 border outline-none text-sm text-ivory placeholder:text-faint p-4 resize-none transition-colors focus:border-gold ${errs.msg ? "border-madder" : "border-edge"}`}
              />
              {errs.msg && <p className="mt-1 text-[11px] text-madder">{errs.msg}</p>}
            </div>
            <button onClick={submit} className="mt-4 inline-flex items-center gap-2 bg-gold text-night font-bold px-8 py-3.5 text-sm hover:bg-goldsoft transition-all duration-300">
              <Ic.send className="w-4 h-4" />
              ارسال پیام
            </button>
          </div>
        </Reveal>

        <div className="grid gap-4">
          <Reveal delay={100}>
            <div className="border border-edge bg-deep p-5 space-y-4">
              {[
                { icon: <Ic.pin className="w-5 h-5" />, t: "نشانی", d: "تهران، خیابان انقلاب، مجتمع دانشکده‌های پزشکی، ساختمان دانشنامه، طبقهٔ سوم" },
                { icon: <Ic.phone className="w-5 h-5" />, t: "تلفن پشتیبانی", d: "۰۲۱-۶۴۴۵۲۰۰۰ (شنبه تا چهارشنبه، ۸ تا ۱۶)" },
                { icon: <Ic.mail className="w-5 h-5" />, t: "ایمیل", d: "info@tibb-ensani.ir" },
              ].map((c) => (
                <div key={c.t} className="flex items-start gap-3.5">
                  <span className="shrink-0 w-10 h-10 border border-gold/40 bg-gold/5 text-gold flex items-center justify-center">{c.icon}</span>
                  <div>
                    <div className="text-[13px] font-bold text-ivory">{c.t}</div>
                    <div className="text-[12px] text-dim leading-6 mt-0.5">{c.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={180}>
            <div className="border border-teal/30 bg-teal/5 p-5">
              <h4 className="font-display text-lg text-ivory flex items-center gap-2"><Ic.chat className="w-5 h-5 text-teal" />پشتیبانی آنلاین</h4>
              <p className="mt-1.5 text-[12px] text-dim leading-6">پاسخ‌گوی خودکار، راهنمای شما در سامانه است؛ برای پرسش تخصصی از بخش «پرسش و پاسخ» انجمن استفاده کنید.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["چطور مزاجم را بدانم؟", "راهنمای ثبت‌نام دوره", "شرایط فروش در بازارچه"].map((s) => (
                  <button key={s} onClick={() => push(`«${s}» — پاسخ در بخش‌های مرتبط سامانه و سوالات متداول آمده است`)} className="text-[11.5px] px-3 py-1.5 border border-teal/40 text-teal hover:bg-teal hover:text-night transition-all duration-300">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

/* ================= سوالات متداول ================= */
export function Faq() {
  const [cat, setCat] = useState("همه");
  const [open, setOpen] = useState<number | null>(0);
  const cats = ["همه", ...Array.from(new Set(FAQS.map((f) => f.cat)))];
  const list = FAQS.filter((f) => cat === "همه" || f.cat === cat);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Reveal>
        <SectionHead kicker="پرسش‌های متداول" title="پاسخ پرسش‌های پرتکرار" desc="از مزاج‌شناسی و تداخلات دارویی تا منابع معتبر مطالعه." />
      </Reveal>
      <Reveal delay={110}>
        <div className="mt-8 flex gap-2 overflow-x-auto no-scrollbar justify-start">
          {cats.map((c) => (
            <button key={c} onClick={() => { setCat(c); setOpen(0); }} className={`shrink-0 px-4 py-2 text-[13px] font-semibold border transition-all ${cat === c ? "bg-gold text-night border-gold" : "border-edge text-dim hover:border-gold/60 hover:text-goldsoft"}`}>
              {c}
            </button>
          ))}
        </div>
      </Reveal>
      <div className="mt-6 space-y-3">
        {list.map((f, i) => (
          <Reveal key={f.q} delay={Math.min(i * 50, 200)}>
            <div className={`border bg-deep transition-colors duration-300 ${open === i ? "border-gold/50" : "border-edge"}`}>
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center gap-4 text-start p-5">
                <span className={`shrink-0 w-9 h-9 border flex items-center justify-center font-display text-lg transition-colors ${open === i ? "border-gold text-gold" : "border-edge text-faint"}`}>{fa(i + 1)}</span>
                <span className="flex-1 font-bold text-[14.5px] text-ivory leading-7">{f.q}</span>
                <span className={`shrink-0 transition-transform duration-300 text-faint ${open === i ? "rotate-45 text-gold" : ""}`}><Ic.arrowLeft className="w-4 h-4" /></span>
              </button>
              <div className={`grid transition-all duration-500 ${open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 ps-[4.5rem] text-[13.5px] text-dim leading-7">{f.a}</p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={150}>
        <div className="mt-10 relative overflow-hidden border border-edge">
          <img src={IMG.attari} alt="عطاری" className="absolute inset-0 w-full h-full object-cover opacity-25" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-l from-night via-night/80 to-night/50" />
          <div className="relative p-7 sm:p-9">
            <h3 className="font-display text-2xl text-ivory">پاسخ خود را نیافتید؟</h3>
            <p className="mt-1.5 text-[13px] text-dim max-w-md leading-6">پرسش خود را در انجمن ثبت کنید تا متخصصان هیئت علمی پاسخ دهند، یا از فرم تماس با ما بنویسید.</p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
