import { useEffect, useMemo, useState } from "react";
import { WEBINARS } from "../data";
import { FULL_COURSES } from "../courses";
import type { FullCourse } from "../courses";
import { CountUp, Ic, Reveal, SectionHead, Stars, fa, useToast } from "../ui";

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

function loadRead(): Record<string, number[]> {
  try {
    return JSON.parse(localStorage.getItem("tibb-read") || "{}") as Record<string, number[]>;
  } catch {
    return {};
  }
}

/* ---------- بلوک‌های محتوای درس ---------- */
function LessonContent({ lesson }: { lesson: FullCourse["lessons"][number] }) {
  return (
    <div className="space-y-8">
      {lesson.blocks.map((b, bi) => (
        <div key={bi} className="space-y-5">
          {b.ps.map((p, pi) => (
            <p key={pi} className="text-[15px] leading-9 text-dim">
              {pi === 0 && <span className="text-goldsoft font-bold">{""}</span>}
              {p}
            </p>
          ))}
          {b.list?.map((l, li) => (
            <div key={li} className="border border-edge/70 bg-night/30 p-5">
              <h4 className="text-[13px] font-bold text-teal flex items-center gap-2">
                <Ic.mortar className="w-4 h-4" />
                {l.title}
              </h4>
              <ul className="mt-3 space-y-2.5">
                {l.items.map((it) => (
                  <li key={it} className="flex items-start gap-3 text-[14px] leading-7 text-dim">
                    <span className="mt-3 w-1.5 h-1.5 rotate-45 bg-gold shrink-0" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {b.tip && (
            <div className="border border-gold/40 bg-gold/5 p-5 flex items-start gap-3.5">
              <span className="shrink-0 w-9 h-9 border border-gold/50 bg-gold/10 text-gold flex items-center justify-center">
                <Ic.scroll className="w-4 h-4" />
              </span>
              <div>
                <div className="text-[11.5px] font-bold text-gold mb-1">نکتهٔ درس</div>
                <p className="text-[13.5px] leading-7 text-dim">{b.tip}</p>
              </div>
            </div>
          )}
          {b.warn && (
            <div className="border border-madder/40 bg-madder/5 p-5 flex items-start gap-3.5">
              <Ic.warn className="w-5 h-5 text-madder shrink-0 mt-0.5" />
              <p className="text-[13.5px] leading-7 text-dim">
                <strong className="text-madder">هشدار:</strong> {b.warn}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------- مطالعه‌گر دوره ---------- */
function CourseReader({
  course,
  lessonIdx,
  setLessonIdx,
  read,
  toggleRead,
  onBack,
}: {
  course: FullCourse;
  lessonIdx: number;
  setLessonIdx: (n: number) => void;
  read: number[];
  toggleRead: (i: number) => void;
  onBack: () => void;
}) {
  const lesson = course.lessons[lessonIdx];
  const done = read.length >= course.lessons.length;
  const color = LEVEL_COLOR[course.level];
  const { push } = useToast();

  const go = (n: number) => {
    if (n < 0 || n >= course.lessons.length) return;
    if (n > lessonIdx && !read.includes(lessonIdx)) toggleRead(lessonIdx);
    setLessonIdx(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* سربرگ دوره */}
      <button onClick={onBack} className="inline-flex items-center gap-2 text-[13px] font-semibold text-faint hover:text-gold transition-colors group">
        <span className="transition-transform duration-300 group-hover:translate-x-1"><Ic.arrowLeft className="w-4 h-4" /></span>
        بازگشت به فهرست دوره‌ها
      </button>

      <div className="mt-5 border border-edge bg-deep p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3 text-[12px]">
          <span className="font-bold px-3 py-1 border" style={{ color, borderColor: `${color}55`, background: `${color}12` }}>{course.level}</span>
          <span className="text-dim flex items-center gap-1.5"><Ic.cap className="w-4 h-4" />{course.instructor}</span>
          <span className="text-faint">{fa(course.lessons.length)} درس</span>
          <span className="text-faint">{fa(course.hours)} ساعت</span>
          <span className="flex items-center gap-1 text-faint"><Stars value={course.rating} />{fa(course.rating)}</span>
          {done && <span className="font-bold text-teal border border-teal/40 bg-teal/10 px-3 py-1">✓ دوره کامل شد</span>}
        </div>
        <h1 className="mt-4 font-display text-3xl sm:text-4xl text-ivory leading-[1.35]">{course.title}</h1>
        <p className="mt-3 text-[13.5px] text-dim leading-7 max-w-3xl">{course.intro}</p>
        {/* نوار پیشرفت */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-[11.5px] mb-2">
            <span className="text-faint">پیشرفت مطالعهٔ شما (بدون نیاز به ثبت‌نام — در مرورگر ذخیره می‌شود)</span>
            <span className="font-bold text-goldsoft">{fa(read.length)} از {fa(course.lessons.length)} درس</span>
          </div>
          <div className="h-2 bg-night border border-edge/60">
            <div className="h-full bg-gradient-to-l from-teal to-gold transition-all duration-700" style={{ width: `${(read.length / course.lessons.length) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-[320px_1fr] gap-6 items-start">
        {/* فهرست درس‌ها */}
        <aside className="lg:sticky lg:top-24">
          <div className="border border-edge bg-deep p-4 hidden lg:block">
            <h3 className="text-[12px] font-bold text-faint mb-3">فهرست درس‌ها</h3>
            <ul className="space-y-1.5">
              {course.lessons.map((l, i) => {
                const isRead = read.includes(i);
                const isActive = i === lessonIdx;
                return (
                  <li key={l.id}>
                    <button
                      onClick={() => go(i)}
                      className={`w-full text-start flex items-center gap-3 p-3 border transition-all duration-300 ${
                        isActive ? "border-gold/60 bg-gold/10" : "border-transparent hover:border-edge hover:bg-pane/60"
                      }`}
                    >
                      <span className={`shrink-0 w-7 h-7 border flex items-center justify-center text-[12px] font-bold transition-colors ${
                        isActive ? "border-gold text-gold" : isRead ? "border-teal/50 text-teal" : "border-edge text-faint"
                      }`}>
                        {isRead && !isActive ? <Ic.check className="w-4 h-4" /> : fa(i + 1)}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className={`block text-[13px] font-semibold leading-6 truncate ${isActive ? "text-goldsoft" : isRead ? "text-dim" : "text-ivory/85"}`}>{l.title}</span>
                        <span className="block text-[10.5px] text-faint mt-0.5">{fa(l.duration)} دقیقه</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 pt-4 border-t border-edge/60">
              <h4 className="text-[11.5px] font-bold text-teal mb-2">در این دوره می‌آموزید</h4>
              <ul className="space-y-1.5">
                {course.objectives.map((o) => (
                  <li key={o} className="flex items-start gap-2 text-[11.5px] leading-5 text-faint">
                    <span className="mt-1.5 w-1 h-1 rotate-45 bg-teal shrink-0" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* گزینشگر درس در موبایل */}
          <div className="lg:hidden border border-edge bg-deep p-3">
            <select
              value={lessonIdx}
              onChange={(e) => go(Number(e.target.value))}
              className="w-full bg-night/60 border border-edge text-sm text-ivory py-3 px-3 outline-none focus:border-gold"
            >
              {course.lessons.map((l, i) => (
                <option key={l.id} value={i}>
                  درس {fa(i + 1)} — {l.title}{read.includes(i) ? " ✓" : ""}
                </option>
              ))}
            </select>
          </div>
        </aside>

        {/* متن درس */}
        <div className="border border-edge bg-deep p-6 sm:p-9">
          <div className="flex flex-wrap items-center gap-3 text-[11.5px] text-faint border-b border-edge/60 pb-4">
            <span className="font-display text-lg text-gold">درس {fa(lessonIdx + 1)} از {fa(course.lessons.length)}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Ic.eye className="w-4 h-4" />{fa(lesson.duration)} دقیقه مطالعه</span>
          </div>
          <div key={lesson.id} className="toast-in">
            <h2 className="mt-5 font-display text-2xl sm:text-3xl text-ivory leading-[1.45]">{lesson.title}</h2>
            <div className="mt-5">
              <LessonContent lesson={lesson} />
            </div>
          </div>

          {/* پانوشت درس */}
          <div className="mt-9 pt-5 border-t border-edge/60 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => toggleRead(lessonIdx)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 border text-[13px] font-bold transition-all duration-300 ${
                read.includes(lessonIdx) ? "border-teal text-teal bg-teal/10" : "border-edge text-dim hover:border-teal hover:text-teal"
              }`}
            >
              <Ic.check className="w-4 h-4" />
              {read.includes(lessonIdx) ? "خوانده شد — لغو نشان" : "نشان‌گذاری به‌عنوان خوانده‌شده"}
            </button>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => go(lessonIdx - 1)}
                disabled={lessonIdx === 0}
                className="border border-edge px-4 py-2.5 text-[13px] font-semibold text-dim hover:border-gold hover:text-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                درس پیشین
              </button>
              {lessonIdx < course.lessons.length - 1 ? (
                <button
                  onClick={() => go(lessonIdx + 1)}
                  className="bg-gold text-night px-6 py-2.5 text-[13px] font-bold hover:bg-goldsoft transition-colors"
                >
                  درس بعدی ←
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (!read.includes(lessonIdx)) toggleRead(lessonIdx);
                    push("🎓 آفرین! مطالعهٔ این دوره کامل شد.");
                  }}
                  className="bg-teal text-night px-6 py-2.5 text-[13px] font-bold hover:brightness-110 transition-all"
                >
                  پایان دوره ✓
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- صفحهٔ آکادمی ---------- */
export default function Academy() {
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("همه");
  const [openId, setOpenId] = useState<string | null>(null);
  const [lessonIdx, setLessonIdx] = useState(0);
  const [readMap, setReadMap] = useState<Record<string, number[]>>(loadRead);
  const [seats, setSeats] = useState<Record<string, number>>(() => Object.fromEntries(WORKSHOPS.map((w) => [w.id, w.seats])));
  const [reminders, setReminders] = useState<string[]>([]);
  const { push } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem("tibb-read", JSON.stringify(readMap));
    } catch { /* ignore */ }
  }, [readMap]);

  useEffect(() => {
    if (openId) window.scrollTo({ top: 0 });
  }, [openId]);

  const stats = useMemo(() => {
    const totalLessons = FULL_COURSES.reduce((s, c) => s + c.lessons.length, 0);
    const totalHours = FULL_COURSES.reduce((s, c) => s + c.hours, 0);
    const students = FULL_COURSES.reduce((s, c) => s + c.students, 0);
    return { totalLessons, totalHours, students };
  }, []);

  const filtered = FULL_COURSES.filter((c) => level === "همه" || c.level === level);
  const openCourse = FULL_COURSES.find((c) => c.id === openId) ?? null;

  const toggleRead = (courseId: string, li: number) => {
    setReadMap((prev) => {
      const cur = prev[courseId] ?? [];
      const next = cur.includes(li) ? cur.filter((x) => x !== li) : [...cur, li];
      const course = FULL_COURSES.find((c) => c.id === courseId);
      if (course && next.length === course.lessons.length && cur.length < course.lessons.length) {
        push(`🎓 تبریک! دورهٔ «${course.title}» کامل شد.`);
      }
      return { ...prev, [courseId]: next };
    });
  };

  /* ---------- نمای مطالعهٔ دوره ---------- */
  if (openCourse) {
    return (
      <CourseReader
        course={openCourse}
        lessonIdx={lessonIdx}
        setLessonIdx={setLessonIdx}
        read={readMap[openCourse.id] ?? []}
        toggleRead={(li) => toggleRead(openCourse.id, li)}
        onBack={() => setOpenId(null)}
      />
    );
  }

  const featured = FULL_COURSES[0];
  const showFeatured = level === "همه" || featured.level === level;
  const rest = showFeatured ? filtered.filter((c) => c.id !== featured.id) : filtered;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <Reveal>
        <SectionHead
          kicker="آکادمی آموزش مجازی"
          title="دوره‌های باز طب ایرانی؛ بدون ثبت‌نام، بدون پرداخت"
          desc="هر دوره، متن آموزشی کامل و درس‌به‌درس است — مستقیم بگشایید و بخوانید. پیشرفت مطالعه در مرورگر شما ذخیره می‌شود و هر زمان می‌توانید ادامه دهید."
        />
      </Reveal>

      <Reveal delay={100}>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 border border-edge bg-deep/60">
          {[
            { v: FULL_COURSES.length, l: "دورهٔ باز و کامل", s: "" },
            { v: stats.totalLessons, l: "درس با متن تفصیلی", s: "" },
            { v: stats.totalHours, l: "ساعت محتوای آموزشی", s: "" },
            { v: stats.students, l: "دانش‌پذیر همراه", s: "+" },
          ].map((s, i) => (
            <div key={s.l} className={`p-5 text-center ${i > 0 ? "border-s border-edge/60" : ""}`}>
              <div className="font-display text-3xl text-goldsoft"><CountUp to={s.v} suffix={s.s} /></div>
              <div className="mt-1 text-[11px] text-faint">{s.l}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* دورهٔ شاخص */}
      {showFeatured && <Reveal delay={140}>
        <div className="mt-10 border border-gold/40 bg-deep overflow-hidden grid lg:grid-cols-[1.25fr_1fr]">
          <div className="p-7 sm:p-9">
            <div className="flex flex-wrap items-center gap-3 text-[11.5px]">
              <span className="font-bold px-3 py-1 bg-gold text-night">دورهٔ شاخص</span>
              <span className="text-teal font-semibold border border-teal/40 bg-teal/5 px-3 py-1">کاملاً رایگان</span>
              <span className="text-faint">{fa(featured.lessons.length)} درس • {fa(featured.hours)} ساعت</span>
            </div>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl text-ivory leading-[1.35]">{featured.title}</h2>
            <p className="mt-3 text-[13.5px] text-dim leading-7">{featured.intro}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {featured.objectives.slice(0, 3).map((o) => (
                <span key={o} className="text-[11.5px] px-3 py-1.5 border border-edge/80 bg-night/40 text-dim flex items-center gap-2">
                  <Ic.check className="w-3.5 h-3.5 text-teal" />
                  {o}
                </span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                onClick={() => { setOpenId(featured.id); setLessonIdx((readMap[featured.id]?.length ?? 0) >= featured.lessons.length ? 0 : readMap[featured.id]?.length ?? 0); }}
                className="group inline-flex items-center gap-3 bg-gold text-night font-bold px-7 py-3.5 hover:bg-goldsoft transition-all duration-300"
              >
                {(readMap[featured.id]?.length ?? 0) > 0 ? "ادامهٔ مطالعه" : "شروع مطالعهٔ دوره"}
                <span className="transition-transform duration-300 group-hover:-translate-x-1"><Ic.arrow className="w-4 h-4" /></span>
              </button>
              <span className="text-[12px] text-faint flex items-center gap-2">
                <Ic.cap className="w-4 h-4 text-teal" />
                {featured.instructor}
              </span>
            </div>
          </div>
          <div className="border-t lg:border-t-0 lg:border-s border-edge/70 bg-night/30 p-7 sm:p-9">
            <h3 className="font-display text-lg text-goldsoft">فهرست درس‌های این دوره</h3>
            <ul className="mt-4 space-y-3">
              {featured.lessons.map((l, i) => {
                const isRead = (readMap[featured.id] ?? []).includes(i);
                return (
                  <li key={l.id} className="flex items-center gap-3.5">
                    <span className={`shrink-0 w-8 h-8 border flex items-center justify-center text-[12.5px] font-bold ${isRead ? "border-teal/50 text-teal" : "border-edge text-faint"}`}>
                      {isRead ? <Ic.check className="w-4 h-4" /> : fa(i + 1)}
                    </span>
                    <span className="flex-1 text-[13px] text-dim leading-6">{l.title}</span>
                    <span className="text-[10.5px] text-faint shrink-0">{fa(l.duration)} دقیقه</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-5 text-[11px] text-faint leading-5 border-t border-edge/60 pt-4">
              بدون ثبت‌نام — پیشرفت مطالعه در مرورگر شما ذخیره می‌شود.
            </p>
          </div>
        </div>
      </Reveal>}

      {/* فهرست دوره‌ها */}
      <Reveal delay={120}>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-2xl text-ivory flex items-center gap-3">
            <span className="w-8 h-[2px] bg-gradient-to-l from-gold to-transparent" />
            همهٔ دوره‌ها
          </h2>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`shrink-0 px-4 py-2 text-[13px] font-semibold border transition-all duration-300 ${
                  level === l ? "bg-gold text-night border-gold" : "border-edge text-dim hover:border-gold/60 hover:text-goldsoft"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="mt-6 space-y-3">
        {rest.map((c, i) => {
          const read = readMap[c.id] ?? [];
          const pct = Math.round((read.length / c.lessons.length) * 100);
          const color = LEVEL_COLOR[c.level];
          return (
            <Reveal key={c.id} delay={Math.min(i * 60, 240)}>
              <button
                onClick={() => { setOpenId(c.id); setLessonIdx(read.length >= c.lessons.length ? 0 : read.length); }}
                className="group w-full text-start border border-edge bg-deep p-5 sm:p-6 flex items-center gap-5 transition-all duration-400 hover:border-gold/60 hover:bg-pane/50 hover:-translate-y-0.5"
              >
                <span className="shrink-0 font-display text-4xl sm:text-5xl text-edge group-hover:text-gold transition-colors duration-300 w-16 text-center">
                  {fa(FULL_COURSES.indexOf(c) + 1)}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="flex flex-wrap items-center gap-2.5">
                    <span className="text-[10.5px] font-bold px-2.5 py-0.5 border" style={{ color, borderColor: `${color}55`, background: `${color}12` }}>{c.level}</span>
                    <span className="text-[11px] text-faint">{fa(c.lessons.length)} درس • {fa(c.hours)} ساعت</span>
                    <span className="text-[11px] text-faint hidden sm:inline flex items-center gap-1"><Stars value={c.rating} />{fa(c.rating)}</span>
                  </span>
                  <span className="block mt-1.5 font-display text-xl sm:text-2xl text-ivory group-hover:text-goldsoft transition-colors duration-300">{c.title}</span>
                  <span className="block mt-1 text-[12.5px] text-dim leading-6 truncate">{c.desc}</span>
                  {read.length > 0 && (
                    <span className="mt-2.5 flex items-center gap-3">
                      <span className="h-1.5 w-40 bg-night border border-edge/60">
                        <span className="block h-full bg-gradient-to-l from-teal to-gold" style={{ width: `${pct}%` }} />
                      </span>
                      <span className="text-[10.5px] text-teal font-bold">{fa(pct)}٪ خوانده شده</span>
                    </span>
                  )}
                </span>
                <span className="shrink-0 flex flex-col items-end gap-2">
                  <span className={`text-[12.5px] font-bold px-5 py-2.5 border transition-all duration-300 ${read.length > 0 ? "border-teal/60 text-teal" : "bg-gold text-night border-gold group-hover:bg-goldsoft"}`}>
                    {read.length >= c.lessons.length ? "مرور دوره" : read.length > 0 ? "ادامهٔ مطالعه" : "شروع مطالعه"}
                  </span>
                  <span className="text-faint group-hover:text-gold group-hover:-translate-x-1 transition-all duration-300"><Ic.arrow className="w-5 h-5" /></span>
                </span>
              </button>
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
              کارگاه‌های حضوری
            </h3>
            <p className="mt-2 text-[12px] text-faint leading-6">بخش عملی دوره‌ها؛ رزرو صندلی برای حضور در آزمایشگاه و آشپزخانهٔ کارگاه.</p>
          </Reveal>
          <div className="mt-4 flex flex-col gap-3">
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
