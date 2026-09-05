/* ===== نگاشت مدخل‌ها به تصاویر واقعی =====
   هر مدخل بر اساس «بخش مصرفی» (گیاهان)، «دسته» (غذاها) یا «شکل دارویی» (مرکبات)
   به مرتبط‌ترین تصویر واقعی متصل می‌شود. */
import { IMG } from "./data";

export const PHOTO = {
  /* گل‌های دارویی خشک: زعفران، بابونه، گل‌محمدی، اسطوخودوس… */
  flowers: "https://image.qwenlm.ai/generated-images/7b9e959f-4283-4f11-9f2c-184ce007efce/_result.png",
  /* برگ‌ها و سرشاخه‌های تازهٔ معطر: نعناع، آویشن، بادرنجبویه… */
  leaves: "https://image.qwenlm.ai/generated-images/280ed72e-61ed-40b6-9ea2-803a3421602a/_result.png",
  /* دانه‌ها و میوه‌های خشک دارویی: سیاهدانه، رازیانه، زرشک… */
  seeds: "https://image.qwenlm.ai/generated-images/f66b520a-e2da-4b7c-8898-5189000d1137/_result.png",
  /* ریشه‌ها و ریزوم‌های دارویی: سنبل‌الطیب، زنجبیل، شیرین‌بیان… */
  roots: "https://image.qwenlm.ai/generated-images/13c09b53-cb3a-4453-a7c7-b241fbddc085/_result.png",
  /* میوه‌ها و سبزی‌های تازهٔ ایرانی: انار، انجیر، زرشک، سبزی خوردن */
  fresh: "https://image.qwenlm.ai/generated-images/693e9f5e-f064-4f0e-99d2-77d1ebe3ff27/_result.png",
  /* قفسهٔ سنتی: غلات، حبوبات، آجیل، عسل و میوه‌های خشک */
  pantry: "https://image.qwenlm.ai/generated-images/7be05b70-f5db-4626-a11b-49405aa59235/_result.png",
  /* حب‌ها، پودرها و معجون‌ها در هاون برنجی */
  solid: "https://image.qwenlm.ai/generated-images/1b3939b5-500d-4bf6-8280-40e6e2645afd/_result.png",
  /* روغن‌ها، شربت‌ها و عرقیات در شیشه‌های کهربایی */
  liquid: "https://image.qwenlm.ai/generated-images/230baf16-66a8-4f76-be98-bc8a32275da1/_result.png",
  /* نبض‌گیری طبیب سنتی */
  diagnosis: "https://image.qwenlm.ai/generated-images/e164bc4d-3d45-4a63-abb7-a39290830e1e/_result.png",
};

const HERB_PARTS: [RegExp, string][] = [
  [/گل|کلاله|کاپیتول|گلدار|شکوفه/, PHOTO.flowers],
  [/برگ|سرشاخه|پیکر|اندام هوایی|علف|سبوس/, PHOTO.leaves],
  [/دانه|میوه|تخم|بذر|کپسول|بلوط|مغز|دوغ/, PHOTO.seeds],
  [/ریشه|ریزوم|پیاز|قارچ|صمغ|شیره|پوست|چوب|ساقه|ژل/, PHOTO.roots],
];

const FOOD_CATS: [RegExp, string][] = [
  [/میوه|سبزی|نوشیدنی|عرقیات|عرق/, PHOTO.fresh],
  [/گوشت|ماهی|تخم‌مرغ|تخم مرغ|لبنیات/, PHOTO.pantry],
  [/غلات|حبوبات|آجیل|شیرین|دانه|روغن/, PHOTO.pantry],
];

const COMPOUND_KINDS: [RegExp, string][] = [
  [/روغن|مرهم|ضماد|شربت|لاوُق|لاوق|سکنجبین/, PHOTO.liquid],
  [/حب|قرص|سوف|طریفال|جوارش|معجون|خمیره|خمیر|تریاق/, PHOTO.solid],
];

function pick(table: [RegExp, string][], hint: string, id: string, fallbacks: string[]): string {
  for (const [re, url] of table) {
    if (re.test(hint)) return url;
  }
  const hash = [...id].reduce((s, c) => s + c.charCodeAt(0), 0);
  return fallbacks[hash % fallbacks.length];
}

export type EntryKind = "herb" | "food" | "compound" | "disease" | "mizaj";

export function entryPhoto(kind: EntryKind, hint: string, id: string): string {
  if (kind === "herb") return pick(HERB_PARTS, hint, id, [PHOTO.flowers, PHOTO.leaves, PHOTO.seeds, PHOTO.roots]);
  if (kind === "food") return pick(FOOD_CATS, hint, id, [PHOTO.fresh, PHOTO.pantry]);
  if (kind === "compound") return pick(COMPOUND_KINDS, hint, id, [PHOTO.solid, PHOTO.liquid]);
  if (kind === "disease") {
    const hash = [...id].reduce((s, c) => s + c.charCodeAt(0), 0);
    return hash % 3 === 0 ? IMG.attari : PHOTO.diagnosis;
  }
  return IMG.manuscript; /* مزاج‌ها: نسخهٔ خطی */
}
