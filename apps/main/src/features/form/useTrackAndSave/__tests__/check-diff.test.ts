import { checkDiff } from '../check-diff';

describe('checkDiff function', () => {
  it('should return false if there are no diff between the provided values', () => {
    const trackedValue = { a: 1, b: 2, c: 3 };
    const newValue = { a: 1, b: 2, c: 3 };
    const { isDiff } = checkDiff({ trackedValue, newValue });
    expect(isDiff).toBe(false);
  });

  it('should return true and an object with the difference between the provided values', () => {
    const trackedValue = { a: 1, b: 2, c: 3 };
    const newValue = { a: 1, b: 2, c: 4 };
    const { isDiff, diff } = checkDiff({ trackedValue, newValue });
    expect(isDiff).toBe(true);
    expect(diff).toEqual({ c: 4 });
  });

  it('should return true and an object with the difference when the values are deeper in the tree', () => {
    const trackedValue = { a: 1, b: 2, c: 3, d: { e: 5, f: { g: 6, i: 7 } } };
    const newValue = { a: 1, b: 2, c: 4, d: { e: 6, f: { g: 6, i: null } } };
    const { isDiff, diff } = checkDiff({ trackedValue, newValue });
    expect(isDiff).toBe(true);
    expect(diff).toEqual({ c: 4, d: { e: 6, f: { i: null } } });
  });

  it('should return the object tree with the differences', () => {
    const products = [
      { id: '1', name: 'prod-1', prices: [{ id: '1', value: 10 }, { id: '2', value: 20 }] },
    ];
    const nextProducts = [
      { id: '1', name: 'prod-1', prices: [{ id: '1', value: 15 }, { id: '2', value: 20 }] },
    ];

    const { isDiff, diff } = checkDiff({ trackedValue: products, newValue: nextProducts,idField: 'id' });
    console.log(JSON.stringify(diff));
    expect(isDiff).toBe(true);
    expect(diff).toEqual([{ id: '1', prices: [{ id: '1', value: 15 }] }]);
  });

  it('should return true when the values are arrays and have different content', () => {
    const trackedValue = [{ a: 1 }, { b: 2 }, { c: 3 }];
    const newValue = [{ a: 1 }, { b: 2 }, { c: 4 }];
    const { isDiff, diff } = checkDiff({ trackedValue, newValue });
    expect(isDiff).toBe(true);
    expect(diff).toEqual([{ c: 4 }]);
  });

  it('should return false if the arrays only have different lengths', () => {
    const trackedValue = [{ a: 1 }, { b: 2 }, { c: 3 }];
    const newValue = [{ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }];
    const { isDiff } = checkDiff({ trackedValue, newValue });
    expect(isDiff).toBe(false);
  });

  it('should return false if the arrays only have different lengths (w/ the new one being shorter)', () => {
    const trackedValue = [{ a: 1 }, { b: 2 }, { c: 3 }];
    const newValue = [{ a: 1 }, { b: 2 }];
    const { isDiff } = checkDiff({ trackedValue, newValue });
    expect(isDiff).toBe(false);
  });

  it('should return true if the objects inside are different', () => {
    const trackedValue = [{ a: 1 }, { b: 2 }, { c: 3, d: 4 }];
    const newValue = [{ a: 1 }, { b: 2 }, { c: 4 }];
    const { isDiff, diff } = checkDiff({ trackedValue, newValue });
    expect(isDiff).toBe(true);
    expect(diff).toEqual([{ c: 4 }]);
  });

  it('should return true if the objects inside are different (when using idField)', () => {
    const trackedValue = [{ id: 1, a: 1 }, { id: 2, b: 2 }, { id: 3, c: 3, d: 4 }];
    const newValue = [{ id: 1, a: 1 }, { id: 2, b: 2 }, { id: 3, c: 4, f: 6 }];
    const { isDiff, diff } = checkDiff({ trackedValue, newValue, idField: 'id' });
    expect(isDiff).toBe(true);
    expect(diff).toEqual([{ id: 3, c: 4 }]);
  });
});
