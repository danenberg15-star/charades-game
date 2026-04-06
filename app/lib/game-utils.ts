import { CELEBS_WORDS } from "./words/celebs";

export const generateRoomCode = () => Math.floor(1000 + Math.random() * 9000).toString();

export const shuffleArray = (array: any[]) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// מילון תרגום קטגוריות למקרה שהן באנגלית בקובץ המקור
const CATEGORY_MAP: Record<string, string> = {
  'Actor': 'שחקן/ית',
  'Singer': 'זמר/ת',
  'Athlete': 'ספורטאי/ת',
  'Politician': 'פוליטיקאי/ת',
  'Businessperson': 'איש/ת עסקים',
  'Model': 'דוגמן/ית',
  'Presenter': 'מנחה/ת טלוויזיה',
  'Artist': 'אמן/ית',
  'Writer': 'סופר/ת',
  'Scientist': 'מדען/ית',
  'Comedian': 'קומיקאי/ת',
  'Director': 'במאי/ת',
  'TV Personality': 'אישיות טלוויזיונית',
  'Journalist': 'עיתונאי/ת',
  'Reality Star': 'כוכב/ת ריאליטי'
};

/**
 * יוצרת רשימת מילים אחת ומאוחדת למשחק.
 * השמות שהוזנו ידנית על ידי השחקנים (customWords) יופיעו תמיד ראשונים.
 */
export const getInitialShuffledPools = (customWords: any[] = []) => {
  // מוודאים שכל מפורסם מקבל קטגוריה בעברית
  const mappedCelebs = CELEBS_WORDS.map((c: any) => ({
    ...c,
    category: CATEGORY_MAP[c.category] || c.category 
  }));
  
  const shuffledCelebs = shuffleArray(mappedCelebs);
  
  // איחוד: מילים מותאמות אישית בראש, ואז כל השאר
  return [...customWords, ...shuffledCelebs];
};