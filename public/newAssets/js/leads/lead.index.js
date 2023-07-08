function format(d) {
  // `d` is the original data object for the row
  return (
    '<table class="table table-bordered table-hover">' +
    "<tr>" +
    "<td>Customer Name</td>" +
    "<td>" +
    d.customer_name +
    "</td>" +
    "</tr>" +
    "<tr>" +
    "<td>Customer Email</td>" +
    "<td>" +
    d.customer_email +
    "</td>" +
    "</tr>" +
    "<tr>" +
    "<td>Customer Contact Number</td>" +
    "<td>" +
    d.customer_phone +
    "</td>" +
    "</tr>" +
    "<tr>" +
    "<td>Customer Address</td>" +
    "<td>" +
    d.customer_address +
    ", " +
    d.customer_city +
    ", " +
    d.customer_state +
    ", " +
    d.customer_zipcode +
    "</td>" +
    "</tr>" +
    "<tr>" +
    "<td>Customer Country</td>" +
    "<td>" +
    d.customer_country +
    "</td>" +
    "</tr>" +
    "<tr>" +
    "<td>Lead Follow Up</td>" +
    "<td>" +
    d.lead_remark_followup +
    "</td>" +
    "</tr>" +
    "<tr>" +
    "<td>Lead Description</td>" +
    "<td>" +
    d.description +
    "</td>" +
    "</tr>" +
    "<tr>" +
    "<td>Actions</td>" +
    "<td>" +
    '<a href="/edit/lead/' +
    d._id +
    '" class="btn-sm btn-primary"  data-toggle="tooltip" data-placement="bottom" title="Edit lead"><i class="fa fa-edit"></i></a>' +
    '<a href="/delete/lead/' +
    d._id +
    '" class="btn-sm btn-danger"  data-toggle="tooltip" data-placement="bottom" title="View lead"><i class="fa fa-trash"></i></a>' +
    '<a href="#" class="btn-sm btn-warning add_action_tasks" data-id="' +
    d._id +
    '"  data-toggle="tooltip" data-placement="bottom" title="Add Action Items and Tasks"><i class="fa fa-plus"></i></a>' +
    '<a href="/track/lead/' +
    d._id +
    '" class="btn-sm btn-success"  data-toggle="tooltip" data-placement="bottom" title="Track Lead" style="color: white">Track Lead <i class="fa fa-arrow-alt-circle-right"></i></a></td>' +
    "</tr>" +
    "</table>"
  );
}

$(document).ready(function () {
  const data = leadsData;
  const table = $("#example1").DataTable({
    responsive: true,
    lengthChange: false,
    autoWidth: false,
    data: data,
    columns: [
      {
        className: "details-control",
        orderable: false,
        defaultContent: "",
      },
      { data: "lead_id" },
      { data: "covered_area" },
      {
        data: "lead_budget",
      },

      {
        data: "lead_status",
        render: function (data, type, row) {
          let status = "";
          switch (data) {
            case "Active":
              status = '<span class="badge badge-primary">' + data + "</span>";
              break;
            case "Follow-Up":
              status = '<span class="badge badge-warning">' + data + "</span>";
              break;
            case "In-Process":
              status = '<span class="badge badge-info">' + data + "</span>";
              break;
            case "Completed":
              status = '<span class="badge badge-success">' + data + "</span>";
              break;
            case "Closed":
              status = '<span class="badge badge-danger">' + data + "</span>";
              break;
          }
          return status;
        },
      },
      { data: "generatedBy.full_name" },
      {
        data: "assignedTo",
        render: function (value, type, row) {
          var val = [];
          $.each(value, function (i, v) {
            val.push(v["full_name"]);
          });
          return val;
        },
      },
      {
        data: "createdAt",
        render: function (data) {
          return new Date(data).toDateString();
        },
      },
      {
        data: "updatedAt",
        render: function (data) {
          return new Date(data).toDateString();
        },
      },
    ],
  });

  // Add event listener for opening and closing details
  $("#example1 tbody").on("click", "td.details-control", function () {
    const tr = $(this).closest("tr");
    const row = table.row(tr);

    if (row.child.isShown()) {
      // This row is already open - close it
      row.child.hide();
      tr.removeClass("shown");
    } else {
      // Open this row
      row.child(format(row.data())).show();
      tr.addClass("shown");
    }
    document.querySelectorAll(".add_action_tasks").forEach((event) => {
      event.addEventListener("click", function () {
        document.querySelector(".right-panel").classList.add("open");
        const id = event.getAttribute("data-id");
      });
    });
    document
      .querySelector(".close-panel")
      .addEventListener("click", function () {
        document.querySelector(".right-panel").classList.remove("open");
      });
  });
});

function selectedValues() {
  let values = [];
  const ids = document.getElementById("action_item_id").selectedOptions;
  [...ids].map((options) => values.push(options.value));
  let taskList = [];
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
        return taskList;
      })
      .catch(function (error) {
        // Handle any errors that occurred during the request
        console.log(error);
      });
  });
}
