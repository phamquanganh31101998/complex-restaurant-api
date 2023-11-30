// format: 2023-11-30
export const getDateStr = (input: Date): string => {
  return `${input.getFullYear()}-${input.getMonth() + 1}-${input.getDate()}`;
};

// format: 18:00:00
export const getTime = (input: Date): string => {
  return `${input.getHours()}:${input.getMinutes()}:${input.getSeconds()}`;
};
