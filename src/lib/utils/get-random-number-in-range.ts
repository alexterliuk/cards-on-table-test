import { areNumbers } from './value-checkers';

/**
 * Creates a number within specified range.
 * Automatically defines which num is min, and which is max.
 * @returns floating number from min to max (excluding min and max), or 0.
 */
function getRandomNumberInRange(num1: number, num2: number) {
  if (!areNumbers(num1, num2)) return 0;

  const min = Math.min(num1, num2),
    max = min === num1 ? num2 : num1;
  const range = max - min;

  return min + Math.random() * range;
}

export default getRandomNumberInRange;
