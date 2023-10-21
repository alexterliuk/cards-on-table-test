/* eslint-disable @typescript-eslint/no-explicit-any */

const flatArrays = (toLevel: number | null, ...arrs: any[]) => {
  return arrs.map(arr => arr.flat(toLevel || 1));
};

export default flatArrays;
