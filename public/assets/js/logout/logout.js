function userSignOut(user_id) {
    // var user_id = div;
    console.log(user_id);
    // Get the auth-token
    var authToken = document.querySelector('meta[name="auth-token"]').getAttribute('content');
    var settings = {
        url: api_url + "api/logout", // Use the PHP script directly
        method: "POST",
        headers: {
            'Authorization': 'Bearer ' + authToken, // Add the token
        },
        data: {
            user_id: user_id,
        },
        dataType: "json",
    };
    // Send AJAX request
    $.ajax(settings)
        .done(function (response) {
            console.log(response);
            toggleLoader(false);
            // Store status and user ID in local storage

            // Redirect to dashboard page if login is successful
            if (response.status === "success") {
                localStorage.removeItem("status", response.status);
                localStorage.removeItem("auth_token", response.data.access_token);
                localStorage.removeItem("user_id", response.data.id);
                window.location.href =
                    front_end_api_url +
                    "logout/logout.php?email=" +
                    response.data.email +
                    "&user_id=" +
                    response.data.id;
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
