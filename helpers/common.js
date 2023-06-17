exports.indianFormat = function (number) {
  return Number(number).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    style: "currency",
    currency: "INR",
  });
};
