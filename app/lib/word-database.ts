// app/lib/word-database.ts
import { KIDS_WORDS } from "./words/kids";
import { JUNIOR_WORDS } from "./words/junior";
import { TEEN_WORDS } from "./words/teen";
import { ADULT_WORDS } from "./words/adult";
import { WordItem, CategoryType } from "../game.config";

export const WORD_DATABASE: Record<CategoryType, WordItem[]> = {
  KIDS: KIDS_WORDS,
  JUNIOR: [...KIDS_WORDS, ...JUNIOR_WORDS],
  // נוער (גיל 11) רואה כעת את מילות הג'וניור בתוספת 500 מילות הנוער
  TEEN: [...JUNIOR_WORDS, ...TEEN_WORDS],
  // מבוגרים רואים 250 מילים מהנוער ו-250 מילים ייחודיות למבוגרים
  ADULT: [...TEEN_WORDS.slice(0, 250), ...ADULT_WORDS.slice(0, 250)]
};