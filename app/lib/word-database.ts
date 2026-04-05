// app/lib/word-database.ts
import { CELEBS_WORDS } from "./words/celebs";

// אנו מייצאים את celebs עבור כל הקטגוריות כדי למנוע שגיאות ייבוא בשאר חלקי האפליקציה
export const KIDS_WORDS = CELEBS_WORDS;
export const JUNIOR_WORDS = CELEBS_WORDS;
export const TEEN_WORDS = CELEBS_WORDS;
export const ADULT_WORDS = CELEBS_WORDS;

export const WORD_DATABASE = {
  KIDS: KIDS_WORDS,
  JUNIOR: JUNIOR_WORDS,
  TEEN: TEEN_WORDS,
  ADULT: ADULT_WORDS,
};