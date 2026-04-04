import { KIDS_WORDS } from "./words/kids";
import { JUNIOR_WORDS } from "./words/junior";
import { TEEN_WORDS } from "./words/teen";
import { ADULT_WORDS } from "./words/adult";

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

export const getInitialShuffledPools = () => ({
  KIDS: shuffleArray(KIDS_WORDS),
  JUNIOR: shuffleArray(JUNIOR_WORDS),
  TEEN: shuffleArray(TEEN_WORDS),
  ADULT: shuffleArray(ADULT_WORDS)
});