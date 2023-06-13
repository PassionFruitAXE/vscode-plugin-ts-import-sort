export function mergeSection(arr: [number, number][]) {
  return arr.reduce(
    (prev, cur) => {
      const [prevStart, prevEnd] = prev;
      const [curStart, curEnd] = cur;
      if (prevEnd === curStart) {
        return [prevStart, curEnd];
      } else {
        return prev;
      }
    },
    [0, 0]
  );
}
