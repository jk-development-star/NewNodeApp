$(document).ready(function () {
    $(".delete").click(function (e) {
        e.preventDefault();
        var url = $(this).attr("value");
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
                            text: "User has been deleted successfully!",
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




