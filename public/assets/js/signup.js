$(".lp-submit-btn").click(function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form data
    var firstName = $("#first-name").val();
    var lastName = $("#last-name").val();
    var email = $("#email").val();
    var password = $("#Password").val();
    var confirmPassword = $("#confirm-password").val();
    var phone = $("#Password").val(); // Corrected phone field selector
    var terms = $('input[name="terms"]:checked').val();

    // Validate required fields
    if (
        !firstName ||
        !lastName ||
        !email ||
        !password ||
        !confirmPassword ||
        !phone
    ) {
        Swal.fire({
            icon: "error",
            title: "Validation Error",
            text: "Please fill in all the fields.",
        });
        return;
    }

    // Validate email format
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        Swal.fire({
            icon: "error",
            title: "Invalid Email",
            text: "Please enter a valid email address.",
        });
        return;
    }

    // Validate phone format (optional: adjust the regex based on your requirements)
    // var phonePattern = /^[0-9]{10}$/; // Simple validation for 10 digits
    // if (!phonePattern.test(phone)) {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Invalid Phone Number',
    //     text: 'Please enter a valid phone number (10 digits).'
    //   });
    //   return;
    // }

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

    // Validate terms and conditions checkbox
    if (!terms) {
        Swal.fire({
            icon: "error",
            title: "Terms and Conditions",
            text: "You must agree to the terms and conditions.",
        });
        return;
    }

    // Prepare data to send in AJAX request
    var formData = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        phone: phone,
        password_confirmation: confirmPassword,
    };
    toggleLoader(true);
    // Send the form data via AJAX to the CodeIgniter REST API
    $.ajax({
        url: api_url + "api/register", // Update with the actual API URL
        type: "POST",
        dataType: "json",
        data: formData,
        success: function (response) {
            toggleLoader(false);
            if (response.status === "success") {
                Swal.fire({
                    icon: "success",
                    title: "Registration successful!",
                    text: "Please check your email to verify it.",
                }).then(function () {
                    // Redirect after the user clicks "OK"
                    window.location.href = front_end_api_url + "index.php"; // Redirect to login page after successful registration
                });
            } else {
                showErrorAlert(response.message);
            }
        },
        error: function (xhr, status, error) {
            toggleLoader(false);
            // console.log(obj);
            handleAjaxError(xhr);            
        },
    });
});
