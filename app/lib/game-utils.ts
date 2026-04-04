import { CELEBRITIES } from "./words/celebrities";

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
  KIDS: shuffleArray(CELEBRITIES),
  JUNIOR: shuffleArray(CELEBRITIES),
  TEEN: shuffleArray(CELEBRITIES),
  ADULT: shuffleArray(CELEBRITIES)
});