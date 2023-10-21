import getRandomNumberInRange from './get-random-number-in-range';

const getRandomFloor = (start: number, end: number) => {
  return Math.floor(getRandomNumberInRange(start, end));
};

export default getRandomFloor;
