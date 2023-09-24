let html = "";
let valuesArray = [];
let finalData = [];
$("#action_items").on("change", function () {
  const selectedItems = $(this).val();
  if (selectedItems.length > 0) {
    selectedItems.forEach(function (id) {
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
          if (!valuesArray.includes(id)) {
            let element = document.getElementById("tasks");
            let cards = document.createElement("div");
            cards.setAttribute("class", "col-md-4");
            html = `<div id="actionItem${id}" class="card"><div><h4>${data.task.action_item_id.action_item_name}<h4></div>`;
            data.task.tasks_id.forEach((item) => {
              html += ` 
                  <div class="form-check table-row">
                  <input class="form-check-input" type="checkbox" checked id="tasks_${item._id}" name="tasks[]" value="${item._id}">
                  <label class="form-check-label" for="tasks">${item.task_name}</label>
                  </div> 
                      `;
            });
            cards.innerHTML += html + "</div>";
            element.appendChild(cards);
            valuesArray.push(id);
          }
          finalData[id] = data.task.tasks_id;
          finalData[id].action_item_name =
            data.task.action_item_id.action_item_name;
        })
        .catch(function (error) {
          // Handle any errors that occurred during the request
          console.log(error);
        });
    });

    valuesArray.forEach((id) => {
      if (!selectedItems.includes(id)) {
        let element = document.getElementById(`actionItem${id}`);
        element.parentElement.remove();
        valuesArray.splice(valuesArray.indexOf(id), 1);
      }
    });
  } else {
    document.getElementById("tasks").innerHTML = "";
    valuesArray = [];
  }
});
document.getElementById("actionItemValue").value = finalData;

const cost = document.querySelector("input#estimate_cost");
cost.addEventListener("blur", (event) => {
  let budgetValue = event.target.value.replace(/,/g, "");
  event.target.value = Number(budgetValue).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    style: "currency",
    currency: "INR",
  });
});
