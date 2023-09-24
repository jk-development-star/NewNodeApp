exports.indianFormat = function (number) {
  return Number(number).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    style: "currency",
    currency: "INR",
  });
};

exports.timeSince = function (timestamp) {
  let time = Date.parse(timestamp);
  let now = Date.now();
  let secondsPast = (now - time) / 1000;
  let suffix = "ago";

  let intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (let i in intervals) {
    let interval = intervals[i];
    if (secondsPast >= interval) {
      let count = Math.floor(secondsPast / interval);
      return `${count} ${i}${count > 1 ? "s" : ""} ${suffix}`;
    }
  }
};
