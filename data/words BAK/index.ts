import { KIDS_WORDS } from './kids';
import { JUNIOR_WORDS } from './junior';
import { TEEN_WORDS } from './teen';
import { ADULT_WORDS } from './adult';

export const WORD_DATABASE = {
  KIDS: KIDS_WORDS,
  JUNIOR: JUNIOR_WORDS,
  TEEN: TEEN_WORDS,
  ADULT: ADULT_WORDS
};

export type AgeGroupName = keyof typeof WORD_DATABASE;