function resetPassword(){
    var password = $("#new-password").val();
    var confirmPassword = $("#confirm-password").val();
    
     // Validate passwords match
     if (password !== confirmPassword) {
        Swal.fire({
            icon: "error",
            title: "Password Mismatch",
            text: "Passwords do not match!",
        });
        return;
    }
    // Validate password strength (optional)
    var passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\W_]{6,}$/;
    if (!passwordPattern.test(password)) {
        Swal.fire({
            icon: "error",
            title: "Weak Password",
            text: "Password must be at least 6 characters long and contain both letters and numbers.",
        });
        return;
    }
    var formData = $("#reset-password").serialize();

    var settings = {
        url: api_url+"api/password/reset", // Use the PHP script directly
        method: "POST",
        data: formData,
        dataType: "json"
    };
    
    toggleLoader(true);
    // Send AJAX request
    $.ajax(settings)
        .done(function (response) {
            // console.log(response);
            toggleLoader(false);
            if (response.status === "success") {
                Swal.fire({
                    icon: "success",
                    title: "Password Reset successfully!",
                    text: "Please Login.",
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