let completionDays, startDate;
function addDaysToDate(startDate, completionDays) {
  var result = new Date(startDate);
  result.setDate(result.getDate() + completionDays);
  alert(result);
}

$(function () {
  $("#datetimepicker1").on("change.datetimepicker", ({ date }) => {
    let startDate = $("#datetimepicker1").find("input").val();
  });
});
