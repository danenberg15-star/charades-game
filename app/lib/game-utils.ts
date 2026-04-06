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

// מילון תרגום קטגוריות שתואם בדיוק למפתחות בקובץ celebs.ts
const CATEGORY_MAP: Record<string, string> = {
  'singer': 'זמר/ת',
  'actor': 'שחקן/ית',
  'athlete': 'ספורטאי/ת',
  'politician': 'פוליטיקאי/ת',
  'businessperson': 'איש/ת עסקים',
  'model': 'דוגמן/ית',
  'presenter': 'מנחה/ת טלוויזיה',
  'artist': 'אמן/ית',
  'writer': 'סופר/ת',
  'scientist': 'מדען/ית',
  'comedian': 'קומיקאי/ת',
  'director': 'במאי/ת',
  'tv_personality': 'אישיות טלוויזיונית',
  'journalist': 'עיתונאי/ת',
  'reality_star': 'כוכב/ת ריאליטי',
  'cartoon_character': 'דמות מצוירת',
  'kids_star': 'כוכב/ת ילדים',
  'chef': 'שף/קולינריה',
  'superhero': 'גיבור על',
  // גיבוי למקרה של אותיות גדולות
  'Singer': 'זמר/ת',
  'Actor': 'שחקן/ית',
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
  const mappedCelebs = CELEBS_WORDS.map((c: any) => ({
    ...c,
    // מוודא התאמה גם אם יש אותיות גדולות או קטנות
    category: CATEGORY_MAP[c.category?.toLowerCase()] || CATEGORY_MAP[c.category] || c.category 
  }));
  
  const shuffledCelebs = shuffleArray(mappedCelebs);
  
  // איחוד: מילים מותאמות אישית בראש, ואז כל השאר
  return [...customWords, ...shuffledCelebs];
};