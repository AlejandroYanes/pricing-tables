import type { DiffParams, TrackedValue } from './types';

export function checkDiff(params: DiffParams) {
  const { trackedValue, newValue, idField, keysToTrack } = params;
  let diff: TrackedValue;
  let isDiff = false;

  const bothAreArrays = Array.isArray(trackedValue) && Array.isArray(newValue);
  const bothAreObjects = !Array.isArray(trackedValue) && !Array.isArray(newValue);

  if (!bothAreArrays && !bothAreObjects) return { diff: {}, isDiff: true };

  if (bothAreArrays) {
    diff = [];

    trackedValue.forEach((value, i) => {
      const newItem = newValue.find((item, j) => idField ? item[idField] === value[idField] : i === j);
      if (newItem) {
        if (typeof value === 'object' && value !== null) {
          const recursiveValue = checkDiff({
            trackedValue: value,
            newValue: newItem,
            idField,
            keysToTrack,
          });

          if (recursiveValue.isDiff) {
            diff.push(recursiveValue.diff);
            isDiff = true;
          }
          return;
        }

        if (value !== newItem) {
          diff.push(newItem);
          isDiff = true;
        }
      }
    });

    return { diff, isDiff };
  }

  diff = {};
  for (const key in trackedValue) {
    if (keysToTrack && key !== idField && !keysToTrack.includes(key)) continue;

    if (key === idField) {
      diff[key] = trackedValue[key];
      continue;
    }

    if (typeof trackedValue[key] === 'object' && trackedValue[key] !== null) {
      const recursiveValue = checkDiff({
        trackedValue: trackedValue[key],
        newValue: newValue[key],
        idField,
        keysToTrack,
      });

      if (recursiveValue.isDiff) {
        diff[key] = recursiveValue.diff;
        isDiff = true;
      }
      continue;
    }

    if (trackedValue[key] !== newValue[key]) {
      diff[key] = newValue[key];
      isDiff = true;
    }
  }
  return { diff, isDiff };
}
