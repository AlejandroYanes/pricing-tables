import type { SimpleValue, TrackedValue } from './types';

export function checkDiff(trackedValue: TrackedValue, newValue: TrackedValue) {
  let diff: TrackedValue;
  let isDiff = false;

  const bothAreArrays = Array.isArray(trackedValue) && Array.isArray(newValue);
  const bothAreObjects = !Array.isArray(trackedValue) && !Array.isArray(newValue);

  if (!bothAreArrays && !bothAreObjects) return { diff: {}, isDiff: true };

  if (bothAreArrays) {
    diff = [];
    const minimumLength = Math.min(trackedValue.length, newValue.length);

    for (let i = 0; i < minimumLength; i++) {
      if (typeof trackedValue[i] === 'object' && trackedValue[i] !== null) {
        const recursiveValue = checkDiff(trackedValue[i], newValue[i]);
        if (recursiveValue.isDiff) {
          diff.push(recursiveValue.diff);
          isDiff = true;
        }
        continue;
      }

      if (trackedValue[i] !== newValue[i]) {
        diff.push(newValue[i]);
        isDiff = true;
      }
    }

    return { diff, isDiff };
  }

  diff = {};

  for (const key in trackedValue) {
    if (typeof trackedValue[key] === 'object' && trackedValue[key] !== null) {
      const recursiveValue = checkDiff(trackedValue[key], newValue[key]);
      if (recursiveValue.isDiff) {
        diff[key] = recursiveValue.diff;
        isDiff = true;
      }
      continue;
    }
    if (trackedValue[key] !== (newValue as SimpleValue)[key]) {
      diff[key] = (newValue as SimpleValue)[key];
      isDiff = true;
    }
  }
  return { diff, isDiff };
}
