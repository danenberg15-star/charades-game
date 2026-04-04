// app/game.config.ts

export type CategoryType = "KIDS" | "JUNIOR" | "TEEN" | "ADULT";

export interface WordItem {
  word: string;
  en: string;
  img?: string;
}

export const HEBREW_ROOM_CODES = [
  "עומר", "אריה", "בלון", "גמל", "דוב", "הרים", "וילון", "זמיר", "חלוץ", "טירה", "יונה",
  "כדור", "לחם", "מפתח", "נחש", "סוס", "ענן", "פרח", "צפור", "קפה", "רכב",
  "שעון", "תמר", "בית", "גינה", "חלון", "סולם", "מתנה", "דגל", "שוקו"
];