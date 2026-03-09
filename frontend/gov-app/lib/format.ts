export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-IN').format(num);
};

export const formatPercent = (num: number) => {
  return `${num}%`;
};
