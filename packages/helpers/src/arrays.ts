export const reorder = <T = any>(arr: T[], { from, to }: { from : number; to: number }): T[] => {
  if (arr.at(from) === undefined || arr.at(to) === undefined) {
    return arr;
  }

  if (from === to) {
    return arr;
  }

  const cloned = [...arr];
  const item = arr[from]!;
  cloned.splice(from, 1);
  cloned.splice(to, 0, item);
  return cloned;
};
