let days = [];

// let days = document.getElementById("action_item_completion_days");
// days.addEventListener("change", (event) => {
//   completionDays = event.target.value;
// });
// console.log(completionDays);

// console.log("2", startDate);

$(function () {
  $("#datetimepicker1").on("change.datetimepicker", ({ date }) => {
    startDate = $("#datetimepicker1").find("input").val();
    days.push([...startDate]);
  });
  $("#action_item_completion_days").on("change", function () {
    completionDays = $(this).val();
    days.push(completionDays);
  });
});
console.log("1", days);
