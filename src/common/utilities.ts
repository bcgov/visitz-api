function enumTypeGuard<T>(
  object: T,
  possibleValue: any,
): possibleValue is T[keyof T] {
  return Object.values(object).includes(possibleValue);
}

export { enumTypeGuard };
