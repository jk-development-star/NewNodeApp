// display the task associated with action item
window.addEventListener("load", function () {
  let html;
  document.querySelectorAll(".panel-trigger").forEach((event) =>
    event.addEventListener("click", function () {
      document.querySelector(".right-panel").classList.add("open");
      const id = event.getAttribute("data-id");
      const url = "http://localhost:8081/tasks/list/" + id;
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
          let i = 1;
          details.forEach(function (task) {
            let task_type =
              task.task_type === "1" ? "Informational" : "Checklist";
            html = `
              <tr id="details">
                <td>${i++}</td>
                <td>${task.task_name}</td>
                <td>${task_type}</td>
                <td>
                  <div class="progress progress-xs">
                    <div class="progress-bar progress-bar-danger" style="width: 55%">
                    </div>
                  </div>
                </td>
                <td><span class="badge bg-danger">55%</span></td>
              </tr>
              `;
            document
              .querySelector("#task-list")
              .insertAdjacentHTML("beforeend", html);
          });
        })
        .catch(function (error) {
          // Handle any errors that occurred during the request
          console.log(error);
        });
    })
  );
  document.querySelector(".close-panel").addEventListener("click", function () {
    document.querySelector("#task-list").textContent = "";
    document.querySelector(".right-panel").classList.remove("open");
  });
});

// delete the action item

$(document).ready(function () {
  $(".delete").click(function (e) {
    e.preventDefault();
    const id = $(this).attr("value");
    const url = `/actionItems/delete/${id}`;
    swal({
      title: "Are you sure?",
      text: "This record and it`s details will be deleted!",
      icon: "warning",
      buttons: ["Cancel", "Yes!"],
    }).then((willDelete) => {
      if (willDelete) {
        $.ajax({
          type: "post",
          url: url,
          data: {
            _method: "delete",
          },
          success: function (data) {
            swal({
              text: data.message,
              icon: "success",
              buttons: "OK",
            }),
              setTimeout(() => {
                window.location.reload();
              }, 2000);
          },
        });
      }
    });
  });
});
