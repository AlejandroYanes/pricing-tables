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

    if (trackedValue.length !== newValue.length) {
      return { diff: {}, isDiff: true };
    }

    trackedValue.forEach((value, i) => {
      const newItem = newValue.find((item, j) => idField ? item[idField] === value[idField] : i === j);
      if (newItem) {
        // if value is an object and not null, we recursively check for differences
        if (typeof value === 'object' && value !== null) {
          const recursiveValue = checkDiff({
            trackedValue: value,
            newValue: newItem,
            idField,
            keysToTrack,
          });

          // if there are deeper differences, we add the new item to the diff
          if (recursiveValue.isDiff) {
            diff.push(recursiveValue.diff);
            isDiff = true;
          }
          return;
        }

        // if value is not an object, we check for differences
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
    // skips keys that are not in the keysToTrack array
    if (keysToTrack && key !== idField && !keysToTrack.includes(key)) continue;

    // if the key is the idField, and it's not in the keysToTrack array, we add it to the diff
    if (key === idField && !keysToTrack?.includes(idField)) {
      diff[key] = trackedValue[key];
      continue;
    }

    // if value is an object and not null, we recursively check for differences
    if (typeof trackedValue[key] === 'object' && trackedValue[key] !== null) {
      const recursiveValue = checkDiff({
        trackedValue: trackedValue[key],
        newValue: newValue[key],
        idField,
        keysToTrack,
      });

      // if there are deeper differences, we add the new item to the diff
      if (recursiveValue.isDiff) {
        diff[key] = recursiveValue.diff;
        isDiff = true;
      }
      continue;
    }

    // if the value is not an object, we check for differences
    if (trackedValue[key] !== newValue[key]) {
      diff[key] = newValue[key];
      isDiff = true;
    }
  }
  return { diff, isDiff };
}
