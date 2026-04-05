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

/**
 * יוצרת רשימת מילים אחת ומאוחדת למשחק.
 * השמות שהוזנו ידנית על ידי השחקנים (customWords) יופיעו תמיד ראשונים.
 */
export const getInitialShuffledPools = (customWords: any[] = []) => {
  const shuffledCelebs = shuffleArray(CELEBS_WORDS);
  
  // איחוד: מילים מותאמות אישית בראש, ואז כל השאר
  return [...customWords, ...shuffledCelebs];
};