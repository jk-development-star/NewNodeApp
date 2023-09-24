// masking on blur
const budget = document.querySelector("input#lead_budget");
budget.addEventListener("blur", (event) => {
  let budgetValue = event.target.value.replace(/,/g, "");
  event.target.value = Number(budgetValue).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    style: "currency",
    currency: "INR",
  });
});

var MainTaskList;

async function selectedValue() {
  let values = [];
  let taskList = [];
  const ids = document.getElementById("action_items").selectedOptions;
  [...ids].map((options) => values.push(options.value));
  let i = 0;
  if (values.length === 0) {
    document.getElementById("tasks").innerHTML = "";
  } else {
    values.forEach(function (id) {
      let url = "http://localhost:8081/tasks/list/" + id;
      fetch(url)
        .then(function (response) {
          if (response.status === 200) {
            return response.json();
          } else {
            throw new Error("Error: " + response.status);
          }
        })
        .then(function (data) {
          // Process the response data here

          const details = data.task.tasks_id;
          taskList = [...taskList, ...details];
          let functionExecutionStatus = myFilter(taskList);
          if (functionExecutionStatus) {
            ++i;
            if (i === values.length) {
              finalMain();
            }
          }
        })
        .catch(function (error) {
          // Handle any errors that occurred during the request
          console.log(error);
        });
    });
  }
}

function myFilter(array) {
  let newTaskList = [];
  array.forEach((element) => {
    newTaskList[element._id] = element.task_name;
  });
  MainTaskList = newTaskList;
  return true;
}
function finalMain(key) {
  let element = document.getElementById("tasks");
  element.innerHTML = "";
  let html = "";
  for (key in MainTaskList) {
    html += `
    <div class="form-check form-check-inline">
    <input class="form-check-input" type="checkbox" checked id="tasks_${key}" name="tasks[]" value="${key}">
    <label class="form-check-label" for="tasks">${MainTaskList[key]}</label>
    </div>
      `;
  }
  element.innerHTML = html;
}

$(function () {
  // Summernote
  $(".summernote").summernote();
});
function displayActionItemDiv(status) {
  const element = document.getElementById("action_item_and_task");
  status === "In-Process" || status === "Completed"
    ? (element.style.display = "block")
    : (element.style.display = "none");
}
window.addEventListener("load", () => {
  let status = document.getElementById("lead_status");
  displayActionItemDiv(status.value);
  status.addEventListener("change", function (event) {
    displayActionItemDiv(status.value);
  });
});

const userName = [];
$.each(usersData, function (i, v) {
  userName.push(v["_id"]);
  $(document).ready(function () {
    $(".select2").select2().val(userName);
  });
});

// display work category selected
$(document).ready(function () {
  let workCategory = lead.work_category;
  $("#work_category").select2("val", [workCategory]);
});
// display work category selected
$(document).ready(function () {
  $("#action_items").select2({
    placeholder: "Select Action Item(s)",
  });
});
