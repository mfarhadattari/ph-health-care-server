const peakObject = <T extends Record<string, unknown>, k extends keyof T>(
  obj: T,
  keys: k[]
): Partial<T> => {
  const peekedObj: Partial<T> = {};

  for (const key of keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      peekedObj[key] = obj[key];
    }
  }

  return peekedObj;
};

export default peakObject;
