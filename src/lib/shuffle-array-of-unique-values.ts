import { isArray } from './utils/value-checkers';
import getRandomElementFromArray from './utils/get-random-element-from-array';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shuffleArrayOfUniqueValues = (arr: any[]): any[] => {
  if (!isArray(arr)) return [];
  const shuffled = [];

  while (arr.length) {
    const item = getRandomElementFromArray(arr);
    shuffled.push(item);
    arr = arr.filter(c => c !== item);
  }

  return shuffled;
};

export default shuffleArrayOfUniqueValues;
