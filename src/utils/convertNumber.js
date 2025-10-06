export const convertNum = (num) => {
  if (typeof num === "number" && num % 1 !== 0) {
    return Math.floor(num) + 0.5;
  } else {
    return num;
  }
};
