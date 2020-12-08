export const filterEmptyObjectValues = (values: {
  [p: string]: unknown;
}): { [p: string]: unknown } => {
  return Object.fromEntries(Object.entries(values).filter(([_key, value]) => value));
};
