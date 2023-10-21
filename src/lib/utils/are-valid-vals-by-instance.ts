import { isArray, isFunction } from './value-checkers';

/**
 * @param arr
 * @param klass - class to check whether val is instance of it
 * @param [allowEmptyArr] - whether return 'true' if arr is empty
 */
const areValidValsByInstance = (
  arr: unknown[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  klass: any,
  allowEmptyArr?: boolean,
): undefined | boolean => {
  if (!isArray(arr) || !isFunction(klass)) return;
  if (allowEmptyArr && !arr.length) return true;
  if (arr.length) {
    return arr.every(c => c instanceof klass);
  }
  // in case if arr is empty
  return false;
};

export default areValidValsByInstance;
