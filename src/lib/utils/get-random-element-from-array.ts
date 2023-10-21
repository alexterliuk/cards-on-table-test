import { isArray } from './value-checkers';
import getRandomFloor from './get-random-floor';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getRandomElementFromArray = (arr: any[]) => {
  if (!isArray(arr)) return;

  const idx = getRandomFloor(0, arr.length);
  return arr[idx];
};

export default getRandomElementFromArray;
