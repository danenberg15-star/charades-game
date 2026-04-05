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
 * פונקציה המקבלת את השמות שהוזנו ידנית על ידי השחקנים
 * ומחזירה מאגר שבו השמות הללו מופיעים ראשונים, ולאחריהם שאר המאגר המשורבל
 */
export const getInitialShuffledPools = (customWords: any[] = []) => {
  const shuffledCelebs = shuffleArray(CELEBS_WORDS);
  
  // השמות המותאמים אישית מוצבים בראש הרשימה
  const combinedPool = [...customWords, ...shuffledCelebs];
  
  return {
    KIDS: combinedPool,
    JUNIOR: combinedPool,
    TEEN: combinedPool,
    ADULT: combinedPool
  };
};