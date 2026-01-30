function forgotPasswordLink(){
    toggleLoader(true);
    // Extract username and password from the form
    var username = $("#forgotp-email").val();

    var settings = {
        url: api_url+"api/password/forgot-password", // Use the PHP script directly
        method: "POST",
        data: {
            email: username,
        },
        dataType: "json"
    };

    // Send AJAX request
    $.ajax(settings)
        .done(function (response) {
            // console.log(response);
            toggleLoader(false);
            if (response.status === "success") {
                Swal.fire({
                    icon: "success",
                    title: "Forgot Password link sent successfully!",
                    text: "Please check your email to reset it.",
                }).then(function () {
                    // Redirect after the user clicks "OK"
                    window.location.href = front_end_api_url + "index.php"; // Redirect to login page after successful registration
                });
            } else {
                showErrorAlert(response.message);
            }
        })
        .fail(function (xhr, textStatus, errorThrown) {
            // console.log(xhr);
            toggleLoader(false);
            handleAjaxError(xhr);
        });
}