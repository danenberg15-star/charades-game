import { CELEBRITIES } from "./words/celebrities";

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

// עדכון המאגרים כך שכולם יכילו סלבריטאים במקום מילים
export const getInitialShuffledPools = () => {
  const shuffled = shuffleArray(CELEBRITIES);
  return {
    KIDS: shuffled,
    JUNIOR: shuffled,
    TEEN: shuffled,
    ADULT: shuffled
  };
};