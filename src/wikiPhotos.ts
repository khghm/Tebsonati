/* ===== نگاشت هر مدخل به عکس واقعیِ همان موضوع =====
   گیاهان: نام علمی (پوشش دقیق برای هر گونه)
   غذاها: نام → مقالهٔ دقیق (Pomegranate برای انار و…)
   مرکب‌ها: نام/مادهٔ اصلی → مقالهٔ دقیق (سکنجبین → Oxymel)
   بیماری‌ها: تطبیق نام سنتی با معادل مدرن (میگرن → Migraine)
   عکس‌ها از تصویر شاخص مقالات ویکی‌پدیا (Wikimedia Commons) با کش ماندگار گرفته می‌شود. */
import { useEffect, useState } from "react";

const norm = (s: string) =>
  s
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/ة/g, "ه")
    .replace(/\u200c/g, "") // نیم‌فاصله
    .trim();

/* ---------- گیاهان: اصلاح نام‌های علمی ---------- */
const LATIN_FIX: Record<string, string> = {
  "foeniculum vulare": "Foeniculum vulgare",
  "lavandula angustifolia": "Lavandula angustifolia",
};

export function herbWikiTitle(h: { name: string; latin: string }): string | null {
  const n = norm(h.latin).toLowerCase();
  const fixed = LATIN_FIX[n] ?? h.latin.trim();
  const t = fixed.replace(/\s+/g, "_");
  return t.length > 2 ? t : null;
}

/* ---------- کلیدواژهٔ مواد → مقالهٔ دقیق گونه/موضوع ---------- */
const KEYWORDS: [string, string][] = [
  ["زعفران", "Crocus sativus"],
  ["گل‌محمدی", "Rosa damascena"],
  ["گل محمدی", "Rosa damascena"],
  ["گل سرخ", "Rosa damascena"],
  ["سنبل‌الطیب", "Valeriana officinalis"],
  ["اسطوخودوس", "Lavandula angustifolia"],
  ["اسفنده", "Peganum harmala"],
  ["اسپند", "Peganum harmala"],
  ["افسنتین", "Artemisia absinthium"],
  ["مریم‌گلی", "Salvia officinalis"],
  ["بابونه", "Matricaria chamomilla"],
  ["سیاهدانه", "Nigella sativa"],
  ["سیاه‌دانه", "Nigella sativa"],
  ["شنبلیله", "Fenugreek"],
  ["زیر سیاه", "Cuminum cyminum"],
  ["بادرنجبویه", "Melissa officinalis"],
  ["رزماری", "Rosemary"],
  ["باریجه", "Ferula gummosa"],
  ["انغوزه", "Ferula assa-foetida"],
  ["آنغوزه", "Ferula assa-foetida"],
  ["حنظل", "Citrullus colocynthis"],
  ["کژله", "Garcinia"],
  ["سورنجان", "Colchicum autumnale"],
  ["یبروح", "Mandragora officinarum"],
  ["بنج", "Hyoscyamus niger"],
  ["خاکشیر", "Descurainia sophia"],
  ["اسفرزه", "Plantago ovata"],
  ["بارهنگ", "Plantago major"],
  ["خرفه", "Portulaca oleracea"],
  ["بومادران", "Achillea millefolium"],
  ["ترنجبین", "Manna"],
  ["بیدمشک", "Salix aegyptiaca"],
  ["کاسنی", "Chicory"],
  ["شاتره", "Fumaria"],
  ["زنیان", "Ajwain"],
  ["بهارنارنج", "Orange flower water"],
  ["لیموعمانی", "Dried lime"],
  ["گلاب", "Rose water"],
  ["سکنجبین", "Oxymel"],
  ["تریاق", "Theriac"],
  ["طریفال", "Triphala"],
  ["هلیله", "Terminalia chebula"],
  ["بلیله", "Terminalia bellirica"],
  ["املج", "Phyllanthus emblica"],
  ["رواند", "Rhubarb"],
  ["سنامکی", "Senna alexandrina"],
  ["خروب", "Carob"],
  ["جوزبوا", "Nutmeg"],
  ["جوز بوا", "Nutmeg"],
  ["فالوذی", "Faluda"],
  ["خراطین", "Earthworm"],
  ["کندر", "Boswellia"],
  ["مصطکی", "Mastic (resin)"],
  ["کافور", "Camphor"],
  ["عنبر", "Ambergris"],
  ["مشک", "Musk"],
  ["کبر", "Capparis spinosa"],
  ["گاوی‌زبان", "Borage"],
  ["ختمی", "Althaea officinalis"],
  ["بنفشه", "Viola odorata"],
  ["نیلوفر", "Nymphaea"],
  ["سداب", "Ruta graveolens"],
  ["مرزنجوش", "Marjoram"],
  ["مروه", "Marjoram"],
  ["آویشن", "Thymus vulgaris"],
  ["رازیانه", "Fennel"],
  ["شاهتره", "Fumaria"],
  ["عناب", "Jujube"],
  ["انار", "Pomegranate"],
  ["به", "Quince"],
  ["کدو", "Pumpkin"],
  ["قرع", "Pumpkin"],
  ["خشخاش", "Papaver somniferum"],
  ["کتیرا", "Tragacanth"],
  ["فلفل", "Black pepper"],
  ["دارچین", "Cinnamon"],
  ["زنجبیل", "Ginger"],
  ["هل", "Cardamom"],
  ["شوید", "Dill"],
  ["کرفس", "Celery"],
  ["انیسون", "Anise"],
  ["زیره", "Cumin"],
  ["ترخون", "Tarragon"],
  ["ریحان", "Basil"],
  ["گشنیز", "Coriander"],
  ["جعفری", "Parsley"],
  ["نعناع", "Mentha"],
  ["پونه", "Mentha pulegium"],
  ["بادام", "Almond"],
  ["پسته", "Pistachio"],
  ["گردو", "Walnut"],
  ["کنجد", "Sesame"],
  ["کرچک", "Ricinus communis"],
  ["مورد", "Myrtus communis"],
  ["حنا", "Lawsonia inermis"],
  ["زردچوبه", "Turmeric"],
  ["صندل", "Santalum album"],
  ["صبر", "Aloe vera"],
  ["سنا", "Senna alexandrina"],
  ["عسل", "Honey"],
  ["خرما", "Date palm"],
  ["لیمو", "Lemon"],
  ["نارگیل", "Coconut"],
  ["نارنج", "Bitter orange"],
  ["سیب", "Apple"],
  ["انجیر", "Common fig"],
  ["انگور", "Grape"],
  ["کشمش", "Raisin"],
  ["مویز", "Raisin"],
  ["زرشک", "Barberry"],
  ["آبلیمو", "Lemonade"],
  ["غوره", "Verjuice"],
  ["جو", "Barley"],
  ["گندم", "Wheat"],
  ["برنج", "Rice"],
  ["ذرت", "Maize"],
  ["ارزن", "Millet"],
  ["چاودار", "Rye"],
  ["دوسر", "Oat"],
  ["عدس", "Lentil"],
  ["نخود", "Chickpea"],
  ["ماش", "Mung bean"],
  ["باقلی", "Fava bean"],
  ["لوبیا", "Common bean"],
  ["اسفناج", "Spinach"],
  ["کاهو", "Lettuce"],
  ["خیار", "Cucumber"],
  ["هویج", "Carrot"],
  ["چغندر", "Beetroot"],
  ["شلغم", "Turnip"],
  ["کلم", "Cabbage"],
  ["بادمجان", "Eggplant"],
  ["گوجه", "Tomato"],
  ["فلفل دلمه", "Bell pepper"],
  ["سیب‌زمینی", "Potato"],
  ["قارچ", "Edible mushroom"],
  ["پیاز", "Onion"],
  ["سیر", "Garlic"],
  ["زیتون", "Olive"],
  ["آلو", "Plum"],
  ["گلابی", "Pear"],
  ["هلو", "Peach"],
  ["زردآلو", "Apricot"],
  ["گیلاس", "Cherry"],
  ["آلبالو", "Sour cherry"],
  ["توت", "Mulberry"],
  ["هندوانه", "Watermelon"],
  ["خربزه", "Muskmelon"],
  ["بلوط", "Acorn"],
  ["سنجد", "Elaeagnus angustifolia"],
  ["ازگیل", "Medlar"],
  ["زالزالک", "Hawthorn"],
  ["خرمالو", "Persimmon"],
  ["فندق", "Hazelnut"],
  ["هندی", "Cashew"],
  ["تخمه", "Sunflower seed"],
  ["شیر", "Milk"],
  ["ماست", "Yogurt"],
  ["پنیر", "Cheese"],
  ["کره", "Butter"],
  ["خامه", "Cream"],
  ["کشک", "Kashk"],
  ["دوغ", "Doogh"],
  ["شکر", "Sugar"],
  ["نبات", "Rock candy"],
  ["دبس", "Date syrup"],
  ["شیره", "Grape syrup"],
  ["چای", "Black tea"],
  ["قهوه", "Coffee"],
  ["ماءالشعیر", "Barley water"],
  ["بره", "Lamb and mutton"],
  ["گاو", "Beef"],
  ["مرغ", "Chicken as food"],
  ["بلدرچین", "Quail"],
  ["کبوتر", "Squab (food)"],
  ["بوقلمون", "Turkey as food"],
  ["ماهی", "Fish as food"],
  ["میگو", "Shrimp"],
  ["تخم مرغ", "Egg"],
  ["ارده", "Tahini"],
];

/* ---------- غذاها: نگاشت مستقیم نام → مقاله ---------- */
const FOOD_WIKI: Record<string, string> = {
  عسل: "Honey",
  خرما: "Date palm",
  "انار شیرین": "Pomegranate",
  "کدو حلوایی": "Pumpkin",
  عدس: "Lentil",
  جو: "Barley",
  گردو: "Walnut",
  ماست: "Yogurt",
  "گوشت بره": "Lamb and mutton",
  "کشمش و مویز": "Raisin",
  سیب: "Apple",
  انجیر: "Common fig",
  آبغوره: "Verjuice",
  "شیرهٔ انگور": "Grape syrup",
  آلبالو: "Sour cherry",
  ترخون: "Tarragon",
  دارچین: "Cinnamon",
  زنجبیل: "Ginger",
  "ارده و شیره": "Tahini",
  عناب: "Jujube",
  "انگور سیاه": "Grape",
  هندوانه: "Watermelon",
  خربزه: "Muskmelon",
  گیلاس: "Cherry",
  "توت سفید": "White mulberry",
  هلو: "Peach",
  زردآلو: "Apricot",
  بلوط: "Acorn",
  سنجد: "Elaeagnus angustifolia",
  ازگیل: "Medlar",
  زالزالک: "Hawthorn",
  خرمالو: "Persimmon",
  گلابی: "Pear",
  به: "Quince",
  "کدو خورشتی": "Zucchini",
  اسفناج: "Spinach",
  کلم: "Cabbage",
  "گل‌کلم": "Cauliflower",
  کاهو: "Lettuce",
  خیار: "Cucumber",
  هویج: "Carrot",
  چغندر: "Beetroot",
  شلغم: "Turnip",
  تره: "Leek",
  شوید: "Dill",
  جعفری: "Parsley",
  گشنیز: "Coriander",
  ریحان: "Basil",
  بادمجان: "Eggplant",
  "گوجه‌فرنگی": "Tomato",
  "فلفل دلمه": "Bell pepper",
  "کدو تنبل": "Pumpkin",
  "سیب‌زمینی": "Potato",
  قارچ: "Edible mushroom",
  "لوبیا سبز": "Green bean",
  "لوبیا قرمز": "Kidney bean",
  "لوبیا چیتی": "Pinto bean",
  ماش: "Mung bean",
  باقلی: "Fava bean",
  نخود: "Chickpea",
  "لوبیا چشم‌بلبلی": "Black-eyed pea",
  گندم: "Wheat",
  برنج: "Rice",
  ذرت: "Maize",
  ارزن: "Millet",
  "جو دوسر": "Oat",
  چاودار: "Rye",
  "بادام درختی": "Almond",
  فندق: "Hazelnut",
  پسته: "Pistachio",
  "بادام هندی": "Cashew",
  نارگیل: "Coconut",
  "تخمه کدو": "Pumpkin seed",
  "تخمه آفتابگردان": "Sunflower seed",
  شیر: "Milk",
  "پنیر تازه": "Cheese",
  کره: "Butter",
  خامه: "Cream",
  کشک: "Kashk",
  دوغ: "Doogh",
  "گوشت گاو": "Beef",
  "گوشت مرغ": "Chicken as food",
  "گوشت بلدرچین": "Quail",
  "گوشت کبوتر": "Squab (food)",
  "گوشت بوقلمون": "Turkey as food",
  ماهی: "Fish as food",
  میگو: "Shrimp",
  "تخم مرغ": "Egg",
  شکر: "Sugar",
  نبات: "Rock candy",
  "شیرهٔ خرما": "Date syrup",
  دبس: "Molasses",
  "چای سیاه": "Black tea",
  قهوه: "Coffee",
  "ماءالشعیر طبی": "Barley water",
  "عرق بیدمشک": "Salix aegyptiaca",
  "عرق کاسنی": "Chicory",
  "عرق شاتره": "Fumaria",
  "عرق نعناع": "Mentha",
  "عرق زنیان": "Ajwain",
  "عرق آویشن": "Thymus vulgaris",
  "عرق گل محمدی": "Rose water",
  "عرق بهارنارنج": "Orange flower water",
};

/* نسخهٔ نرمال‌سازی‌شدهٔ کلیدها (حذف نیم‌فاصله برای تطبیق مطمئن) */
const FOOD_WIKI_NORM: Record<string, string> = {};
for (const [k, v] of Object.entries(FOOD_WIKI)) FOOD_WIKI_NORM[norm(k)] = v;

export function foodWikiTitle(name: string): string | null {
  const n = norm(name);
  if (FOOD_WIKI_NORM[n]) return FOOD_WIKI_NORM[n].replace(/\s+/g, "_");
  for (const [k, t] of KEYWORDS) if (n.includes(norm(k))) return t.replace(/\s+/g, "_");
  return null;
}

/* ---------- مرکب‌ها ---------- */
const COMPOUND_WIKI: Record<string, string> = {
  سکنجبین: "Oxymel",
  "سکنجبین کبر": "Oxymel",
};

export function compoundWikiTitle(name: string, ingredients?: string[]): string | null {
  const n = norm(name);
  if (COMPOUND_WIKI[n]) return COMPOUND_WIKI[n].replace(/\s+/g, "_");
  for (const [k, t] of KEYWORDS) if (n.includes(norm(k))) return t.replace(/\s+/g, "_");
  if (ingredients) {
    for (const ing of ingredients) {
      const ni = norm(ing);
      for (const [k, t] of KEYWORDS) if (ni.includes(norm(k))) return t.replace(/\s+/g, "_");
    }
  }
  return null;
}

/* ---------- بیماری‌ها: نام سنتی → معادل مدرن ---------- */
const DISEASE_RULES: [string, string][] = [
  ["کیست تخمدان", "Polycystic ovary syndrome"],
  ["تنبلی تخمدان", "Polycystic ovary syndrome"],
  ["پلی‌کیستیک", "Polycystic ovary syndrome"],
  ["درد قاعدگی", "Dysmenorrhea"],
  ["قاعدگی", "Menstruation"],
  ["یائسگی", "Menopause"],
  ["ناباروری", "Infertility"],
  ["سقط", "Miscarriage"],
  ["بارداری", "Pregnancy"],
  ["شیردهی", "Breastfeeding"],
  ["پروستات", "Benign prostatic hyperplasia"],
  ["عفونت ادراری", "Urinary tract infection"],
  ["سنگ کلیه", "Kidney stone"],
  ["کم‌کاری تیروئید", "Hypothyroidism"],
  ["پرکاری تیروئید", "Hyperthyroidism"],
  ["تیروئید", "Thyroid"],
  ["آب‌مروارید", "Cataract"],
  ["آب‌سیاه", "Glaucoma"],
  ["وزوز گوش", "Tinnitus"],
  ["التهاب گوش", "Otitis externa"],
  ["گوش‌درد", "Earache"],
  ["دندان‌درد", "Toothache"],
  ["التهاب لثه", "Gingivitis"],
  ["بوی دهان", "Halitosis"],
  ["آفت دهان", "Aphthous stomatitis"],
  ["آپنه", "Sleep apnea"],
  ["خروپف", "Snoring"],
  ["سکسکه", "Hiccup"],
  ["آلزایمر", "Alzheimer's disease"],
  ["فراموشی", "Alzheimer's disease"],
  ["پارکینسون", "Parkinson's disease"],
  ["ام‌اس", "Multiple sclerosis"],
  ["صرع", "Epilepsy"],
  ["تشنج", "Seizure"],
  ["میگرن", "Migraine"],
  ["شقیقه", "Migraine"],
  ["سردرد", "Headache"],
  ["سرگیجه", "Vertigo"],
  ["بی‌خوابی", "Insomnia"],
  ["افسردگی", "Major depressive disorder"],
  ["اضطراب", "Anxiety disorder"],
  ["استرس", "Stress (biology)"],
  ["وسواس", "Obsessive–compulsive disorder"],
  ["مالیخولیا", "Melancholia"],
  ["ربو", "Asthma"],
  ["آسم", "Asthma"],
  ["زکام", "Common cold"],
  ["سرماخوردگی", "Common cold"],
  ["آنفلوانزا", "Influenza"],
  ["ذات‌الریه", "Pneumonia"],
  ["سینه‌پهلو", "Pneumonia"],
  ["برونشیت", "Bronchitis"],
  ["سرفه", "Cough"],
  ["سینوزیت", "Sinusitis"],
  ["فشار خون", "Hypertension"],
  ["تپش", "Palpitation"],
  ["سکته", "Stroke"],
  ["نارسایی قلب", "Heart failure"],
  ["دیابت", "Diabetes mellitus"],
  ["قند خون", "Diabetes mellitus"],
  ["کلسترول", "Hyperlipidemia"],
  ["کم‌خونی", "Anemia"],
  ["چاقی", "Obesity"],
  ["نقرس", "Gout"],
  ["آرتروز", "Osteoarthritis"],
  ["روماتیسم", "Arthritis"],
  ["درد مفاصل", "Arthralgia"],
  ["کمردرد", "Low back pain"],
  ["عرق‌النسا", "Sciatica"],
  ["سیاتیک", "Sciatica"],
  ["پوکی استخوان", "Osteoporosis"],
  ["دیسک", "Spinal disc herniation"],
  ["رفلاکس", "Gastroesophage reflux disease"],
  ["سوزش سر دل", "Gastroesophageal reflux disease"],
  ["زخم معده", "Peptic ulcer disease"],
  ["هموروئید", "Hemorrhoid"],
  ["بواسیر", "Hemorrhoid"],
  ["سوءهاضمه", "Dyspepsia"],
  ["نفخ", "Bloating"],
  ["قولنج", "Colic"],
  ["یبوست", "Constipation"],
  ["اسهال", "Diarrhea"],
  ["استفراغ", "Vomiting"],
  ["تهوع", "Nausea"],
  ["سنگ صفرا", "Gallstone"],
  ["آپاندیس", "Appendicitis"],
  ["فتق", "Hernia"],
  ["انگل", "Helminthiasis"],
  ["کرم", "Helminthiasis"],
  ["کبد چرب", "Fatty liver disease"],
  ["یرقان", "Jaundice"],
  ["زردی", "Jaundice"],
  ["هپاتیت", "Hepatitis"],
  ["واریس", "Varicose veins"],
  ["اگزما", "Eczema"],
  ["پسوریازیس", "Psoriasis"],
  ["صدف", "Psoriasis"],
  ["کهیر", "Urticaria"],
  ["آکنه", "Acne"],
  ["جوش", "Acne"],
  ["تب‌خال", "Herpes simplex"],
  ["زونا", "Shingles"],
  ["قارچ پوست", "Dermatophytosis"],
  ["خارش", "Pruritus"],
  ["شوره", "Dandruff"],
  ["ریزش مو", "Hair loss"],
  ["شپش", "Pediculosis"],
  ["تعریق", "Hyperhidrosis"],
  ["بوی بد", "Body odor"],
  ["تب", "Fever"],
  ["تب‌بر", "Fever"],
  ["گرمازدگی", "Heat stroke"],
  ["سرمازدگی", "Frostbite"],
  ["مسمومیت", "Foodborne illness"],
  ["آلرژی", "Allergy"],
  ["حساسیت", "Allergy"],
  ["خستگی", "Fatigue"],
  ["کم‌آبی", "Dehydration"],
  ["ورم", "Edema"],
  ["التهاب", "Inflammation"],
  ["زگیل", "Wart"],
  ["سوختگی", "Burn"],
  ["شکستگی", "Bone fracture"],
  ["دررفتگی", "Joint dislocation"],
  ["کوفتگی", "Bruise"],
];

export function diseaseWikiTitle(name: string): string | null {
  const n = norm(name);
  for (const [k, t] of DISEASE_RULES) if (n.includes(norm(k))) return t.replace(/\s+/g, "_");
  return null;
}

/* =========================================================
   هوک دریافت تصویر شاخص مقاله با کش ماندگار و حذف درخواست تکراری
   ========================================================= */
const LS_KEY = "tibb-wiki-v1";
let disk: Record<string, string> | null = null;

function loadDisk(): Record<string, string> {
  if (disk) return disk;
  try {
    disk = JSON.parse(localStorage.getItem(LS_KEY) || "{}") as Record<string, string>;
  } catch {
    disk = {};
  }
  return disk!;
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;
function saveDisk(d: Record<string, string>) {
  disk = d;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(d));
    } catch { /* ignore */ }
  }, 600);
}

const mem = new Map<string, string | null>();
const inflight = new Map<string, Promise<string | null>>();

async function fetchThumb(title: string): Promise<string | null> {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), 6000);
  try {
    const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, {
      signal: ctrl.signal,
    });
    if (!r.ok) return null;
    const j = (await r.json()) as { thumbnail?: { source?: string }; originalimage?: { source?: string } };
    let t = j.thumbnail?.source;
    if (!t && j.originalimage?.source) t = j.originalimage.source;
    if (!t) return null;
    return t.replace(/\/\d+px-/, "/640px-");
  } catch {
    return null;
  } finally {
    clearTimeout(to);
  }
}

export function useWikiPhoto(title?: string | null): string | null {
  const [url, setUrl] = useState<string | null>(() => {
    if (!title) return null;
    if (mem.has(title)) return mem.get(title) ?? null;
    const d = loadDisk();
    if (title in d) return d[title] || null;
    return null;
  });

  useEffect(() => {
    if (!title) {
      setUrl(null);
      return;
    }
    let live = true;
    if (mem.has(title)) {
      setUrl(mem.get(title) ?? null);
      return;
    }
    const d = loadDisk();
    if (title in d) {
      const v = d[title] || null;
      mem.set(title, v);
      setUrl(v);
      return;
    }
    let p = inflight.get(title);
    if (!p) {
      p = fetchThumb(title).then((u) => {
        mem.set(title, u);
        const dd = loadDisk();
        dd[title] = u ?? "";
        saveDisk(dd);
        inflight.delete(title);
        return u;
      });
      inflight.set(title, p);
    }
    p.then((u) => {
      if (live) setUrl(u);
    });
    return () => {
      live = false;
    };
  }, [title]);

  return url;
}
