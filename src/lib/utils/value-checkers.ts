/**
 * Collection of helper functions to check values.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export const isNull = (v: any) => v === null;

export const isArray = (v: any) => Array.isArray(v);

export const areArrays = (...data: any) =>
  !!data.length && data.every((v: any) => isArray(v));

export const isObject = (v: any) =>
  typeof v === 'object' && !isNull(v) && !isArray(v) && !isRegExp(v);

export const isRegExp = (v: any) =>
  typeof v !== 'undefined' && !isNull(v) && v.constructor.name === 'RegExp';

export const isString = (v: any) => typeof v === 'string';

export const areStrings = (...vals: any[]) =>
  !!vals.length && vals.every(v => isString(v));

export const isNumber = (v: any) => typeof v === 'number';

export const areNumbers = (...vals: any[]) =>
  !!vals.length && vals.every(v => isNumber(v));

export const isNaN = (v: any) => Number.isNaN(v);

export const isInfinity = (v: any) =>
  isNumber(v) && !isNaN(v) ? !Number.isFinite(v) : false;

export const isBoolean = (v: any) => typeof v === 'boolean';

export const isFunction = (v: any) => typeof v === 'function';

export const getType = (v: any) =>
  isNull(v)
    ? 'null'
    : isArray(v)
    ? 'array'
    : isNaN(v)
    ? 'NaN'
    : isInfinity(v)
    ? 'Infinity'
    : isRegExp(v)
    ? 'regexp'
    : typeof v;

export const getPositiveIntegerOrZero = (v: any) =>
  // Number(''...) is used to avoid -0
  isNumber(v) && !isNaN(v) && Number.isFinite(v) && v >= 0
    ? Number('' + Math.floor(v))
    : 0;
