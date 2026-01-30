$(document).ready(function () {
  $("#login-form").submit(function (event) {
    event.preventDefault(); // Prevent the default form submission
    toggleLoader(true);
    // Extract username and password from the form
    var username = $("#login-email").val();
    var password = $("#login-password").val();

    var settings = {
      url: api_url + "api/login", // Use the PHP script directly
      method: "POST",
      data: {
        email: username,
        password: password,
      },
      dataType: "json",
    };

    // Send AJAX request
    $.ajax(settings)
      .done(function (response) {
        // console.log(response);
        toggleLoader(false);
        // Store status and user ID in local storage

        // Redirect to dashboard page if login is successful
        if (response.status === "success") {
          localStorage.setItem("status", response.status);
          localStorage.setItem("auth_token", response.data.access_token);
          localStorage.setItem("user_id", response.data.user_details.id);
          window.location.href =
            front_end_api_url +
            "login/login.php?email=" +
            username +
            "&user_id=" +
            response.data.user_details.id +
            "&auth_token=" +
            response.data.access_token;
        } else {
          showErrorAlert(response.message);
        }
      })
      .fail(function (xhr, textStatus, errorThrown) {
        // console.log(xhr);
        toggleLoader(false);
        handleAjaxError(xhr);
      });
  });
});

// resend verify link
function resendVerficationLink() {
  toggleLoader(true);
  // Extract username and password from the form
  var username = $("#resend-verification-email").val();

  var settings = {
    url: api_url + "api/resend-verification-link", // Use the PHP script directly
    method: "POST",
    data: {
      email: username,
    },
    dataType: "json",
  };

  // Send AJAX request
  $.ajax(settings)
    .done(function (response) {
      // console.log(response);
      toggleLoader(false);
      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Verification link sent successfully!",
          text: "Please check your email to verify it.",
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

// User icon menu for sign out
function userProfileIcon() {
  let menu = document.getElementById("userMenu");

  menu.classList.toggle("d-none");
}
