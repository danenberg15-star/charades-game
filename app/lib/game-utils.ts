import { CELEBS_WORDS } from "./words/celebs";

/**
 * מייצר קוד חדר בן 4 ספרות בלבד (מספרים בלבד)
 */
export const generateRoomCode = () => Math.floor(1000 + Math.random() * 9000).toString();

export const shuffleArray = (array: any[]) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// מילון מקיף הכולל בדיוק את המפתחות שקיימים בקובץ celebs.ts
const CATEGORY_MAP: Record<string, string> = {
  'singer': 'זמר/ת',
  'actor': 'שחקן/ית',
  'director': 'במאי/ת',
  'movie_character': 'דמות קולנועית',
  'tv_character': 'דמות טלוויזיונית',
  'head_of_state': 'ראש מדינה / מנהיג',
  'politician': 'פוליטיקאי/ת',
  'thinker': 'מדען / הוגה דעות',
  'artist': 'אמן / צייר',
  'composer': 'מלחין/ה',
  'biblical': 'דמות מקראית',
  'religious_leader': 'מנהיג דתי',
  'footballer': 'כדורגלן/ית',
  'basketballer': 'כדורסלן/ית',
  'tennis_player': 'טניסאי/ת',
  'olympic_athlete': 'ספורטאי/ת אולימפי/ת',
  'racing_driver': 'נהג/ת מרוצים',
  'model': 'דוגמן/ית',
  'culinary': 'שף / קולינריה',
  'superhero': 'גיבור/ת על',
  'cartoon_character': 'דמות מצוירת',
  'kids_star': 'כוכב/ת ילדים',
  'journalist': 'עיתונאי/ת / מגיש/ה',
  'reality_star': 'כוכב/ת ריאליטי',
  'historical_figure': 'דמות היסטורית',
  'other': 'אחר'
};

const translateCategory = (cat?: string) => {
  if (!cat) return '';
  if (CATEGORY_MAP[cat]) return CATEGORY_MAP[cat];
  const normalized = cat.toLowerCase().replace(/_/g, ' ').trim();
  return CATEGORY_MAP[normalized] || cat; 
};

/**
 * יוצרת רשימת מילים אחת ומאוחדת למשחק.
 * השמות שהוזנו ידנית על ידי השחקנים יופיעו תמיד ראשונים.
 */
export const getInitialShuffledPools = (customWords: any[] = []) => {
  const mappedCelebs = CELEBS_WORDS.map((c: any) => ({
    ...c,
    category: translateCategory(c.category)
  }));
  
  const shuffledCelebs = shuffleArray(mappedCelebs);
  
  return [...customWords, ...shuffledCelebs];
};