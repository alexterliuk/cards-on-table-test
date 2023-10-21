import { areArrays } from './value-checkers';
import flatArrays from './flat-arrays';

/* eslint-disable @typescript-eslint/no-explicit-any */

const areAllValsInTarget = (
  expect: 'absent' | 'present',
  vals: any[],
  target: any[],
  flatToLevel?: number,
): boolean => {
  if (!areArrays(vals, target)) return false;
  const [valsFlat, targetFlat] = flatArrays(flatToLevel || null, vals, target);
  return expect === 'absent'
    ? targetFlat.every((v: any) => !valsFlat.includes(v))
    : valsFlat.every((v: any) => targetFlat.includes(v));
};

export default areAllValsInTarget;
