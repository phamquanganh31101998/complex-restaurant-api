// format: 2023-11-30
export const getDateFromDateObj = (input: Date): string => {
  return input.toISOString().substring(0, 10);
};

// format: 18:00:00
export const getTimeFromDateObj = (input: Date): string => {
  return input.toISOString().substring(11, 19);
};
