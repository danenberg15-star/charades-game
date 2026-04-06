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

// מילון מקיף שמכסה את כל סוגי המפורסמים והקטגוריות האפשריות במשחק
const CATEGORY_MAP: Record<string, string> = {
  'singer': 'זמר/ת',
  'actor': 'שחקן/ית',
  'athlete': 'ספורטאי/ת',
  'footballer': 'כדורגלן',
  'football player': 'כדורגלן',
  'soccer player': 'כדורגלן',
  'basketball player': 'כדורסלן',
  'tennis player': 'טניסאי/ת',
  'olympic athlete': 'ספורטאי/ת אולימפי/ת',
  'racing driver': 'נהג/ת מרוצים',
  'politician': 'פוליטיקאי/ת',
  'businessperson': 'איש/ת עסקים',
  'businessman': 'איש/ת עסקים',
  'businesswoman': 'אשת עסקים',
  'entrepreneur': 'יזם/ית',
  'model': 'דוגמן/ית',
  'presenter': 'מנחה/ת טלוויזיה',
  'host': 'מגיש/ה',
  'artist': 'אמן/ית',
  'painter': 'צייר/ת',
  'writer': 'סופר/ת',
  'author': 'סופר/ת',
  'scientist': 'מדען/ית',
  'philosopher': 'הוגה דעות',
  'comedian': 'קומיקאי/ת',
  'director': 'במאי/ת',
  'tv personality': 'אישיות טלוויזיונית',
  'journalist': 'עיתונאי/ת',
  'reality star': 'כוכב/ת ריאליטי',
  'cartoon character': 'דמות מצוירת',
  'movie character': 'דמות קולנועית',
  'kids star': 'כוכב/ת ילדים',
  'chef': 'שף/קולינריה',
  'superhero': 'גיבור/ת על',
  'historical figure': 'דמות היסטורית',
  'band': 'להקה/הרכב',
  'influencer': 'משפיען/ית רשת',
  'youtuber': 'יוטיובר/ית',
  'tiktoker': 'טיקטוקר/ית',
  'gamer': 'גיימר/ית',
  'rabbi': 'מנהיג דתי / רב',
  'religious leader': 'מנהיג דתי',
  'biblical figure': 'דמות מקראית',
  'royal': 'בן/בת מלוכה',
  'royalty': 'בן/בת מלוכה',
  'military leader': 'מנהיג צבאי',
  'military': 'איש צבא',
  'dancer': 'רקדן/ית',
  'magician': 'קוסם/אמן חושים',
  'other': 'אחר'
};

// פונקציית נרמול: מוודאת ששום דבר לא נופל בין הכיסאות
const translateCategory = (cat?: string) => {
  if (!cat) return '';
  // מנרמל את המחרוזת: הופך הכל לאותיות קטנות ומחליף קווים תחתונים ברווחים
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
    // מעביר כל קטגוריה דרך פונקציית התרגום ההרמטית
    category: translateCategory(c.category)
  }));
  
  const shuffledCelebs = shuffleArray(mappedCelebs);
  
  // איחוד: מילים מותאמות אישית בראש, ואז כל השאר
  return [...customWords, ...shuffledCelebs];
};