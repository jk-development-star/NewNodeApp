$(document).ready(function () {
  $(".delete").click(function (e) {
    e.preventDefault();
    const id = $(this).attr("value");
    const url = `/task/delete/${id}`;
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
