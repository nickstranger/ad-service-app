export const filterEmptyObjectValues = (values: {
  [p: string]: unknown;
}): { [p: string]: unknown } => {
  return Object.fromEntries(Object.entries(values).filter(([key, value]) => value));
};
