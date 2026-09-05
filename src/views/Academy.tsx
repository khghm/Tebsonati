import { useEffect, useState } from "react";
import { COURSES, WEBINARS } from "../data";
import { CountUp, Ic, Reveal, SectionHead, Stars, fa, useToast } from "../ui";

type Enrolled = Record<string, number>;

const LEVELS = ["همه", "مقدماتی", "متوسط", "تخصصی", "کارگاه"] as const;
const LEVEL_COLOR: Record<string, string> = {
  مقدماتی: "#3fc8b8",
  متوسط: "#e3b558",
  تخصصی: "#d8604a",
  کارگاه: "#8fbc7f",
};

const WORKSHOPS = [
  { id: "ws1", title: "ساخت فرآورده‌های گیاهی در منزل", seats: 40, date: "۱۲ بهمن ۱۴۰۴", place: "آزمایشگاه آکادمی — اصفهان" },
  { id: "ws2", title: "طبخ غذاهای سنتی مزاج‌محور", seats: 24, date: "۱۹ بهمن ۱۴۰۴", place: "آشپزخانهٔ کارگاه — تهران" },
  { id: "ws3", title: "شناسایی میدانی گیاهان دارویی دماوند", seats: 30, date: "۲۶ اردیبهشت ۱۴۰۵", place: "اردوی میدانی — دماوند" },
];

export default function Academy() {
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("همه");
  const [enrolled, setEnrolled] = useState<Enrolled>(() => {
    try {
      return JSON.parse(localStorage.getItem("tibb-enrolled") || "{}") as Enrolled;
    } catch {
      return {};
    }
  });
  const [seats, setSeats] = useState<Record<string, number>>(() => Object.fromEntries(WORKSHOPS.map((w) => [w.id, w.seats])));
  const [reminders, setReminders] = useState<string[]>([]);
  const { push } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem("tibb-enrolled", JSON.stringify(enrolled));
    } catch { /* ignore */ }
  }, [enrolled]);

  const toggleEnroll = (id: string, title: string) => {
    setEnrolled((prev) => {
      if (prev[id] !== undefined) {
        push(`از دورهٔ «${title}» خارج شدید`);
        const next = { ...prev };
        delete next[id];
        return next;
      }
      push(`در دورهٔ «${title}» ثبت‌نام شدید — درس نخست گشوده شد`);
      return { ...prev, [id]: 12 };
    });
  };

  const advance = (id: string, title: string) => {
    setEnrolled((prev) => {
      const cur = prev[id] ?? 0;
      const next = Math.min(100, cur + 24);
      if (next === 100) push(`تبریک! دورهٔ «${title}» را به پایان رساندید 🎓`);
      else push(`درس بعدی «${title}» بارگذاری شد`);
      return { ...prev, [id]: next };
    });
  };

  const filtered = COURSES.filter((c) => level === "همه" || c.level === level);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <Reveal>
        <SectionHead
          kicker="آکادمی آموزش مجازی"
          title="از مقدماتی تا تخصصی؛ آموزش نظام‌مند طب ایرانی"
          desc="دوره‌های داوری‌شده با اساتید دانشگاهی، وبینارهای زنده و کارگاه‌های عملی — برای عموم مردم، دانشجویان و متخصصان."
        />
      </Reveal>

      <Reveal delay={100}>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 border border-edge bg-deep/60 divide-x divide-x-reverse divide-edge/60">
          {[
            { v: 24, l: "دوره و کارگاه فعال", s: "" },
            { v: 18400, l: "دانش‌پذیر ثبت‌شده", s: "+" },
            { v: 96, l: "ساعت محتوای ویدیویی", s: "" },
            { v: 42, l: "وبینار برگزارشده", s: "" },
          ].map((s) => (
            <div key={s.l} className="p-5 text-center">
              <div className="font-display text-3xl text-goldsoft"><CountUp to={s.v} suffix={s.s} /></div>
              <div className="mt-1 text-[11px] text-faint">{s.l}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* دوره‌ها */}
      <Reveal delay={140}>
        <div className="mt-10 flex flex-wrap gap-2">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`px-4 py-2 text-[13px] font-semibold border transition-all duration-300 ${
                level === l ? "bg-gold text-night border-gold" : "border-edge text-dim hover:border-gold/60 hover:text-goldsoft"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((c, i) => {
          const progress = enrolled[c.id];
          const isEnrolled = progress !== undefined;
          const color = LEVEL_COLOR[c.level];
          return (
            <Reveal key={c.id} delay={Math.min(i * 60, 240)}>
              <div className="card-lift frame h-full border border-edge bg-deep p-5 flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-1 border" style={{ color, borderColor: `${color}55`, background: `${color}12` }}>{c.level}</span>
                  {c.price === 0 ? (
                    <span className="text-[11px] font-bold px-2.5 py-1 bg-teal/10 text-teal border border-teal/40">رایگان</span>
                  ) : (
                    <span className="text-[12px] font-bold text-goldsoft">{c.price.toLocaleString("fa-IR")} تومان</span>
                  )}
                </div>
                <h3 className="mt-3 font-display text-xl text-ivory leading-[1.45]">{c.title}</h3>
                <p className="mt-2 text-[12.5px] text-dim leading-6 flex-1">{c.desc}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.tags.map((t) => (
                    <span key={t} className="text-[10.5px] px-2 py-0.5 bg-pane border border-edge/60 text-faint">#{t}</span>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] border-y border-edge/60 py-3">
                  <div><div className="text-ivory font-bold">{fa(c.lessons)}</div><div className="text-faint mt-0.5">درس</div></div>
                  <div><div className="text-ivory font-bold">{fa(c.hours)}</div><div className="text-faint mt-0.5">ساعت</div></div>
                  <div className="flex items-center justify-center gap-1"><Stars value={c.rating} /><span className="text-ivory font-bold">{fa(c.rating)}</span></div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-faint">
                  <span className="flex items-center gap-1.5"><Ic.cap className="w-4 h-4" />{c.instructor}</span>
                  <span>{fa(c.students)} دانش‌پذیر</span>
                </div>
                {isEnrolled ? (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="text-teal font-semibold">پیشرفت شما</span>
                      <span className="text-faint">{fa(progress)}٪</span>
                    </div>
                    <div className="h-2 bg-night border border-edge/60">
                      <div className="h-full bg-gradient-to-l from-teal to-gold transition-all duration-700" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => advance(c.id, c.title)}
                        disabled={progress >= 100}
                        className="flex-1 bg-teal text-night font-bold text-[13px] py-2.5 hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {progress >= 100 ? "دوره کامل شد ✓" : "پیمودن درس بعدی"}
                      </button>
                      <button onClick={() => toggleEnroll(c.id, c.title)} className="border border-edge px-3 text-[12px] text-faint hover:text-madder hover:border-madder/60 transition-colors" title="خروج از دوره">
                        <Ic.close className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => toggleEnroll(c.id, c.title)} className="mt-4 w-full bg-gold text-night font-bold text-[13px] py-3 hover:bg-goldsoft transition-all duration-300">
                    ثبت‌نام در دوره
                  </button>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* وبینارها و کارگاه‌ها */}
      <div className="mt-14 grid lg:grid-cols-2 gap-8">
        <div>
          <Reveal>
            <h3 className="font-display text-2xl text-ivory flex items-center gap-3">
              <span className="relative flex w-2.5 h-2.5"><span className="absolute inline-flex h-full w-full rounded-full bg-madder opacity-60" style={{ animation: "pulseRing 1.6s ease-out infinite" }} /><span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-madder" /></span>
              وبینارهای زنده
            </h3>
          </Reveal>
          <div className="mt-5 flex flex-col gap-3">
            {WEBINARS.map((w, i) => (
              <Reveal key={w.id} delay={i * 80}>
                <div className="border border-edge bg-deep p-4 flex items-center gap-4 card-lift">
                  <span className={`shrink-0 text-[10.5px] font-bold px-2.5 py-1 ${w.status === "پیشِ‌رو" ? "bg-madder/15 text-madder border border-madder/40" : "bg-pane text-dim border border-edge"}`}>{w.status}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[14px] text-ivory truncate">{w.title}</h4>
                    <p className="text-[11px] text-faint mt-1">{w.date} — {w.teacher}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (reminders.includes(w.id)) {
                        push("یادآوری لغو شد");
                        setReminders(reminders.filter((r) => r !== w.id));
                      } else {
                        push("یادآوری تنظیم شد — پیش از شروع اطلاع می‌دهیم");
                        setReminders([...reminders, w.id]);
                      }
                    }}
                    className={`shrink-0 text-[12px] font-bold px-4 py-2 border transition-colors ${reminders.includes(w.id) ? "border-teal text-teal bg-teal/10" : "border-edge text-dim hover:border-gold hover:text-gold"}`}
                  >
                    {reminders.includes(w.id) ? "✓ یادآوری شد" : "یادآوری"}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div>
          <Reveal>
            <h3 className="font-display text-2xl text-ivory flex items-center gap-3">
              <Ic.flask className="w-6 h-6 text-teal" />
              کارگاه‌های عملی
            </h3>
          </Reveal>
          <div className="mt-5 flex flex-col gap-3">
            {WORKSHOPS.map((w, i) => (
              <Reveal key={w.id} delay={i * 80}>
                <div className="border border-edge bg-deep p-4 card-lift">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-bold text-[14px] text-ivory">{w.title}</h4>
                    <span className={`text-[11px] shrink-0 ${seats[w.id] === 0 ? "text-madder font-bold" : "text-faint"}`}>
                      {seats[w.id] === 0 ? "تکمیل ظرفیت" : `${fa(seats[w.id])} صندلی باقی‌مانده`}
                    </span>
                  </div>
                  <p className="text-[11px] text-faint mt-1">{w.date} — {w.place}</p>
                  <button
                    disabled={seats[w.id] === 0}
                    onClick={() => {
                      setSeats((prev) => ({ ...prev, [w.id]: prev[w.id] - 1 }));
                      push(`جای شما در کارگاه «${w.title}» رزرو شد`);
                    }}
                    className="mt-3 w-full border border-teal/50 text-teal font-bold text-[12.5px] py-2.5 hover:bg-teal hover:text-night transition-all duration-300 disabled:opacity-35 disabled:cursor-not-allowed"
                  >
                    رزرو صندلی
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
