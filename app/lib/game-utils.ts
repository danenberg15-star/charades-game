import { CELEBS_WORDS } from "./words/celebs";

// יצירת קוד חדר המורכב מ-4 ספרות בדיוק (1000-9999)
export const generateRoomCode = () => Math.floor(1000 + Math.random() * 9000).toString();

export const shuffleArray = (array: any[]) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// מחזיר מאגרים שכולם מבוססים על קובץ ה-CELEBS כדי למנוע שגיאות ייבוא
export const getInitialShuffledPools = () => {
  const allCelebs = shuffleArray(CELEBS_WORDS);
  return {
    KIDS: allCelebs,
    JUNIOR: allCelebs,
    TEEN: allCelebs,
    ADULT: allCelebs
  };
};