exports.indianFormat = function (number) {
  return Number(number).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    style: "currency",
    currency: "INR",
  });
};

exports.addDaysToDate = function (date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
