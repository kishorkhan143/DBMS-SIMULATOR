import { Part, QuizQuestion } from '../types/sql';
import { PART_1, PART_1_QUIZ, PART_1_PRESETS } from './curriculumPart1';
import { PART_2, PART_2_QUIZ, PART_2_PRESETS } from './curriculumPart2';
import { PART_3, PART_4, PART_3_4_QUIZ, PART_3_4_PRESETS } from './curriculumParts3And4';
import { PART_5, PART_5_QUIZ, PART_5_PRESETS } from './curriculumPart5';
import { PART_6, PART_6_QUIZ, PART_6_PRESETS } from './curriculumPart6';
import { PART_7, PART_7_QUIZ, PART_7_PRESETS } from './curriculumPart7';

export { PART_1, PART_2, PART_3, PART_4, PART_5, PART_6, PART_7 };

export const CURRICULUM_PARTS: Part[] = [
  PART_1,
  PART_2,
  PART_3,
  PART_4,
  PART_5,
  PART_6,
  PART_7
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  ...PART_1_QUIZ,
  ...PART_2_QUIZ,
  ...PART_3_4_QUIZ,
  ...PART_5_QUIZ,
  ...PART_6_QUIZ,
  ...PART_7_QUIZ
];

export const PRESET_PRACTICE_QUERIES = [
  ...PART_1_PRESETS,
  ...PART_2_PRESETS,
  ...PART_3_4_PRESETS,
  ...PART_5_PRESETS,
  ...PART_6_PRESETS,
  ...PART_7_PRESETS
];
