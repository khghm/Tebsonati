import { useState } from "react";
import { EVENTS, THREADS } from "../data";
import type { Thread } from "../data";
import { Ic, Modal, Reveal, SectionHead, fa, useToast } from "../ui";

type Tab = "forum" | "qa" | "events";
type Reply = { author: string; role: string; text: string; time: string };
type QA = { q: string; a: string; author: string; answered: boolean };

const DEMO_REPLIES: Reply[] = [
  { author: "دکتر پیمان رستگار", role: "پزشک طب سنتی", text: "پرسش خوبی است؛ در مآخذ کهن بر پرهیز از خوددرمانی تأکید شده و تجویز باید بر پایهٔ معاینهٔ حضوری باشد.", time: "۳ ساعت پیش" },
  { author: "سارا محمدی", role: "دانشجو", text: "من هم همین تجربه را داشتم؛ پیشنهاد می‌کنم فصل مربوطه در مخزن‌الادویه را با تصحیح دانشگاهی بخوانید.", time: "۵ ساعت پیش" },
];

const INITIAL_QA: QA[] = [
  { q: "مصرف همزمان زعفران با داروی فشار خون مشکلی دارد؟", a: "زعفران در دوز غذایی معمولاً بی‌خطر است، اما در دوز دارویی ممکن است با برخی داروها تداخل کند. حتماً با پزشک خود و متخصص طب سنتی مشورت کنید و دوز را خودسرانه افزایش ندهید.", author: "کاربر مهمان", answered: true },
  { q: "برای شروع مطالعهٔ مفردات، مخزن‌الادویه بهتر است یا تحفه‌المؤمنین؟", a: "تحفه‌المؤمنین برای آشنایی با تنوع نام‌های محلی و نگاه انتقادی عالی است؛ مخزن‌الادویه ساختار نظام‌مندتری دارد و منابع معاصر بیشتر به آن ارجاع می‌دهند. بهتر است با گزیده‌ای آموزشی آغاز و سپس به متن کامل بروید.", author: "امیر تهرانی", answered: true },
];

export default function Community() {
  const [tab, setTab] = useState<Tab>("forum");
  const [threads, setThreads] = useState<Thread[]>(THREADS);
  const [openThread, setOpenThread] = useState<Thread | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyText, setReplyText] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newTag, setNewTag] = useState("پرسش همگانی");
  const [qaList, setQaList] = useState<QA[]>(INITIAL_QA);
  const [newQ, setNewQ] = useState("");
  const [regs, setRegs] = useState<Record<string, boolean>>({});
  const [taken, setTaken] = useState<Record<string, number>>({});
  const { push } = useToast();

  const openThreadModal = (t: Thread) => {
    setOpenThread(t);
    setReplies(DEMO_REPLIES.slice(0, t.replies > 30 ? 2 : 1));
  };

  const submitThread = () => {
    if (newTitle.trim().length < 8) {
      push("عنوان گفت‌وگو باید دست‌کم ۸ حرف باشد");
      return;
    }
    setThreads((prev) => [
      { id: `t-${Date.now()}`, title: newTitle.trim(), author: "شما", role: "کاربر", tag: newTag, replies: 0, views: 1, time: "همین حالا" },
      ...prev,
    ]);
    setNewTitle("");
    push("گفت‌وگوی شما در تالار ثبت شد");
  };

  const submitReply = () => {
    if (replyText.trim().length < 4) return;
    setReplies((r) => [...r, { author: "شما", role: "کاربر", text: replyText.trim(), time: "همین حالا" }]);
    setReplyText("");
    push("پاسخ شما ثبت شد");
  };

  const submitQ = () => {
    if (newQ.trim().length < 10) {
      push("پرسش باید دست‌کم ۱۰ حرف باشد");
      return;
    }
    setQaList((prev) => [{ q: newQ.trim(), a: "", author: "شما", answered: false }, ...prev]);
    setNewQ("");
    push("پرسش شما برای متخصصان ارسال شد — پاسخ تا ۴۸ ساعت");
  };

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "forum", label: "تالار گفت‌وگو", icon: <Ic.chat className="w-4 h-4" /> },
    { id: "qa", label: "پرسش و پاسخ", icon: <Ic.reply className="w-4 h-4" /> },
    { id: "events", label: "رویدادها و همایش‌ها", icon: <Ic.calendar className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <Reveal>
        <SectionHead
          kicker="انجمن و شبکهٔ تخصصی"
          title="انجمن؛ جایی که دانش گفت‌وگو می‌شود"
          desc="پزشکان، پژوهشگران، دانشجویان و علاقه‌مندان در تالارها تبادل نظر می‌کنند، پرسش‌ها به متخصصان می‌رسد و رویدادها شکل می‌گیرند."
        />
      </Reveal>

      <Reveal delay={110}>
        <div className="mt-8 flex gap-2 overflow-x-auto no-scrollbar">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 flex items-center gap-2 px-5 py-3 text-[13px] font-bold border transition-all duration-300 ${
                tab === t.id ? "bg-teal text-night border-teal" : "border-edge text-dim hover:border-teal/60 hover:text-teal"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </Reveal>

      {/* ---------- تالار ---------- */}
      {tab === "forum" && (
        <div className="mt-7 grid lg:grid-cols-[1fr_300px] gap-6 items-start">
          <div className="space-y-3">
            {[...threads].sort((a, b) => Number(b.pinned ?? false) - Number(a.pinned ?? false)).map((t, i) => (
              <Reveal key={t.id} delay={Math.min(i * 50, 200)}>
                <button onClick={() => openThreadModal(t)} className="card-lift w-full text-start border border-edge bg-deep p-4 sm:p-5 flex items-center gap-4 group">
                  <span className="shrink-0 w-11 h-11 border border-edge/70 bg-pane flex items-center justify-center text-gold"><Ic.user className="w-5 h-5" /></span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {t.pinned && <span className="text-[9.5px] font-bold bg-gold text-night px-1.5 py-0.5">سنجاق‌شده</span>}
                      <span className="text-[10.5px] text-teal border border-teal/30 px-2 py-0.5">{t.tag}</span>
                    </div>
                    <h4 className="mt-1.5 font-bold text-[14.5px] text-ivory leading-6 group-hover:text-goldsoft transition-colors">{t.title}</h4>
                    <p className="text-[11px] text-faint mt-1">{t.author} — {t.role} • {t.time}</p>
                  </div>
                  <div className="shrink-0 hidden sm:flex flex-col items-end gap-1.5 text-[11px] text-faint">
                    <span className="flex items-center gap-1.5"><Ic.reply className="w-3.5 h-3.5" />{fa(t.replies)} پاسخ</span>
                    <span className="flex items-center gap-1.5"><Ic.eye className="w-3.5 h-3.5" />{fa(t.views)} بازدید</span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>

          <Reveal delay={140} className="lg:sticky lg:top-24">
            <div className="border border-edge bg-deep p-5">
              <h3 className="font-display text-lg text-ivory">گفت‌وگوی تازه</h3>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="عنوان پرسش یا موضوع بحث…"
                className="mt-3 w-full bg-night/60 border border-edge focus:border-teal outline-none text-sm text-ivory placeholder:text-faint py-3 px-4 transition-colors"
              />
              <select value={newTag} onChange={(e) => setNewTag(e.target.value)} className="mt-3 w-full bg-night/60 border border-edge text-sm text-dim py-3 px-3 outline-none focus:border-teal">
                {["پرسش همگانی", "بحث تخصصی", "کتب مرجع", "تداخلات", "رویداد"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <button onClick={submitThread} className="mt-3 w-full bg-teal text-night font-bold py-3 text-sm hover:brightness-110 transition-all">
                انتشار در تالار
              </button>
              <p className="mt-3 text-[10.5px] text-faint leading-5">پیش از انتشار، راهنمای گفت‌وگوی علمی و ممنوعیت تجویز بدون معاینه را بپذیرید.</p>
            </div>
          </Reveal>
        </div>
      )}

      {/* ---------- پرسش و پاسخ ---------- */}
      {tab === "qa" && (
        <div className="mt-7 max-w-3xl mx-auto">
          <div className="border border-edge bg-deep p-5">
            <h3 className="font-display text-lg text-ivory">پرسش خود را از متخصصان بپرسید</h3>
            <textarea
              value={newQ}
              onChange={(e) => setNewQ(e.target.value)}
              rows={3}
              placeholder="پرسش تخصصی خود را بنویسید… (مثلاً دربارهٔ تداخل یک گیاه با داروی مصرفی)"
              className="mt-3 w-full bg-night/60 border border-edge focus:border-teal outline-none text-sm text-ivory placeholder:text-faint p-4 resize-none transition-colors"
            />
            <div className="mt-2 flex items-center justify-between gap-3 flex-wrap">
              <p className="text-[10.5px] text-madder flex items-center gap-1.5"><Ic.warn className="w-4 h-4" />پرسش‌های اورژانسی را فقط با اورژانس ۱۱۵ مطرح کنید.</p>
              <button onClick={submitQ} className="bg-gold text-night font-bold px-6 py-2.5 text-sm hover:bg-goldsoft transition-colors">ارسال پرسش</button>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {qaList.map((item, i) => (
              <Reveal key={i} delay={Math.min(i * 60, 240)}>
                <div className="border border-edge bg-deep p-5">
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 font-display text-2xl text-teal">پ</span>
                    <div>
                      <p className="font-bold text-[14.5px] text-ivory leading-7">{item.q}</p>
                      <p className="text-[11px] text-faint mt-1">{item.author}</p>
                    </div>
                  </div>
                  {item.answered ? (
                    <div className="mt-4 border-s-2 border-gold ps-4 ms-3">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-gold"><Ic.shield className="w-4 h-4" />پاسخ متخصص — تأیید هیئت علمی</div>
                      <p className="mt-1.5 text-[13.5px] text-dim leading-7">{item.a}</p>
                    </div>
                  ) : (
                    <div className="mt-4 ms-3 flex items-center gap-2 text-[12px] text-faint">
                      <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                      در انتظار پاسخ متخصص — معمولاً تا ۴۸ ساعت
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      )}

      {/* ---------- رویدادها ---------- */}
      {tab === "events" && (
        <div className="mt-7 grid md:grid-cols-2 gap-4">
          {EVENTS.map((e, i) => {
            const isReg = !!regs[e.id];
            const cap = e.capacity;
            const nowTaken = (taken[e.id] ?? Math.round(cap * 0.7)) + (isReg ? 1 : 0);
            return (
              <Reveal key={e.id} delay={Math.min(i * 70, 240)}>
                <div className="card-lift frame h-full border border-edge bg-deep p-5 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2.5 py-1 bg-lapis/20 text-[#9cc0ea] border border-lapis/40">{e.type}</span>
                    <Ic.calendar className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="mt-3 font-display text-xl text-ivory leading-[1.5]">{e.title}</h3>
                  <p className="mt-2 text-[12.5px] text-dim">{e.date}</p>
                  <p className="mt-1 text-[12px] text-faint flex items-center gap-1.5"><Ic.pin className="w-4 h-4" />{e.place}</p>
                  {cap > 0 && (
                    <div className="mt-4">
                      <div className="flex justify-between text-[10.5px] text-faint mb-1.5">
                        <span>ظرفیت ثبت‌نام</span>
                        <span>{fa(nowTaken)} از {fa(cap)}</span>
                      </div>
                      <div className="h-1.5 bg-night border border-edge/60">
                        <div className="h-full bg-gradient-to-l from-gold to-madder transition-all duration-700" style={{ width: `${Math.min(100, (nowTaken / cap) * 100)}%` }} />
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      if (!isReg && cap > 0 && nowTaken >= cap) {
                        push("ظرفیت این رویداد تکمیل شده است");
                        return;
                      }
                      setRegs((r) => ({ ...r, [e.id]: !r[e.id] }));
                      if (!isReg) setTaken((t) => ({ ...t, [e.id]: (t[e.id] ?? Math.round(cap * 0.7)) + 1 }));
                      push(isReg ? "ثبت‌نام شما لغو شد" : `برای «${e.title}» ثبت‌نام شدید`);
                    }}
                    className={`mt-auto pt-4 ${""}`}
                  >
                    <span className={`block w-full text-center font-bold py-3 text-sm transition-all duration-300 ${isReg ? "border border-teal text-teal bg-teal/10" : "bg-gold text-night hover:bg-goldsoft"}`}>
                      {isReg ? "✓ ثبت‌نام شده — لغو" : cap > 0 && nowTaken >= cap ? "تکمیل ظرفیت" : "ثبت‌نام در رویداد"}
                    </span>
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>
      )}

      {/* مودال گفت‌وگو */}
      <Modal open={!!openThread} onClose={() => setOpenThread(null)} title={openThread?.title ?? ""} wide>
        {openThread && (
          <div>
            <div className="flex items-center gap-2 text-[11px] text-faint border-b border-edge/60 pb-4">
              <span className="text-teal font-bold">{openThread.tag}</span>
              <span>آغازگر: {openThread.author}</span>
              <span>•</span>
              <span>{fa(openThread.replies)} پاسخ</span>
              <span>•</span>
              <span>{fa(openThread.views)} بازدید</span>
            </div>
            <div className="mt-4 space-y-4">
              {replies.map((r, i) => (
                <div key={i} className="border border-edge/70 bg-night/30 p-4">
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="font-bold text-goldsoft">{r.author}</span>
                    <span className="text-teal">{r.role}</span>
                    <span className="text-faint">• {r.time}</span>
                  </div>
                  <p className="mt-2 text-[13.5px] text-dim leading-7">{r.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={3}
                placeholder="پاسخ علمی خود را بنویسید…"
                className="w-full bg-night/60 border border-edge focus:border-teal outline-none text-sm text-ivory placeholder:text-faint p-4 resize-none transition-colors"
              />
              <button onClick={submitReply} className="mt-2 bg-teal text-night font-bold px-6 py-2.5 text-sm hover:brightness-110 transition-all">
                ارسال پاسخ
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
