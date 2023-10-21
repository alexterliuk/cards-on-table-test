import { isArray } from './utils/value-checkers';

/* eslint-disable @typescript-eslint/no-explicit-any */
const findIndexOfMatchedArray = (searchIn: any[], arrToFind: any[]) => {
  let idx = -1;
  searchIn.some((valOrArr, i) => {
    const arr = isArray(valOrArr) && valOrArr;
    if (arr && arr.length === arrToFind.length) {
      const matched = arr.every((v: any) => arrToFind.includes(v));
      return matched ? ((idx = i), true) : false;
    }
  });
  return idx;
};

export default findIndexOfMatchedArray;
