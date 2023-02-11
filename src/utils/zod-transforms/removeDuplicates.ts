const removeDuplicatesFromArray = <T = unknown>(arr: T[]): T[] => {
  const set = new Set(arr);
  return Array.from(set);
};

export default removeDuplicatesFromArray;
