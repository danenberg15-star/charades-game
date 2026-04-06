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

// מילון מקיף הכולל בדיוק את המפתחות שקיימים בקובץ celebs.ts שלך
const CATEGORY_MAP: Record<string, string> = {
  // קטגוריות ישירות מתוך הקובץ שלך:
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

  // גיבויים למקרה שיש מילים נוספות שמנוסחות קצת אחרת
  'football player': 'כדורגלן/ית',
  'soccer player': 'כדורגלן/ית',
  'basketball player': 'כדורסלן/ית',
  'businessperson': 'איש/ת עסקים',
  'businessman': 'איש/ת עסקים',
  'businesswoman': 'אשת עסקים',
  'entrepreneur': 'יזם/ית',
  'presenter': 'מנחה/ת טלוויזיה',
  'host': 'מגיש/ה',
  'writer': 'סופר/ת',
  'author': 'סופר/ת',
  'scientist': 'מדען/ית',
  'philosopher': 'הוגה דעות',
  'comedian': 'קומיקאי/ת',
  'tv personality': 'אישיות טלוויזיונית',
  'chef': 'שף / קולינריה',
  'band': 'להקה / הרכב',
  'influencer': 'משפיען/ית רשת',
  'youtuber': 'יוטיובר/ית',
  'tiktoker': 'טיקטוקר/ית',
  'gamer': 'גיימר/ית',
  'rabbi': 'מנהיג דתי / רב',
  'royal': 'בן/בת מלוכה',
  'royalty': 'בן/בת מלוכה',
  'military leader': 'מנהיג צבאי',
  'military': 'איש צבא',
  'dancer': 'רקדן/ית',
  'magician': 'קוסם / אמן חושים',
  'athlete': 'ספורטאי/ת',
  'other': 'אחר'
};

// פונקציית תרגום חכמה שקודם בודקת התאמה מדויקת, ואז מנסה לנקות את הטקסט
const translateCategory = (cat?: string) => {
  if (!cat) return '';
  // בדיקה 1: התאמה מדויקת (המקרה הנפוץ ב-celebs.ts)
  if (CATEGORY_MAP[cat]) return CATEGORY_MAP[cat];
  
  // בדיקה 2: נירמול למקרה של חוסר תאימות (אותיות קטנות/גדולות, קו תחתון)
  const normalized = cat.toLowerCase().replace(/_/g, ' ').trim();
  return CATEGORY_MAP[normalized] || cat; 
};

/**
 * יוצרת רשימת מילים אחת ומאוחדת למשחק.
 * השמות שהוזנו ידנית על ידי השחקנים (customWords) יופיעו תמיד ראשונים.
 */
export const getInitialShuffledPools = (customWords: any[] = []) => {
  const mappedCelebs = CELEBS_WORDS.map((c: any) => ({
    ...c,
    category: translateCategory(c.category)
  }));
  
  const shuffledCelebs = shuffleArray(mappedCelebs);
  
  return [...customWords, ...shuffledCelebs];
};