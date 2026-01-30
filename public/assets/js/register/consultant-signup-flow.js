document
    .getElementById("Consultant_step")
    .addEventListener("click", function () {
        consultantSkipStep1();
    });

function onLoadConsultant() {
    consultantSkipStep1();
}

function submitConsultantDetails(button) {
    toggleLoader(true);
    var form = button.closest('form');
    // console.log(form);
    var formId = form.id;
    var step = $("#" + formId).data('step');
    let formData = $("#" + formId).serialize();
    // Step 3: Get selected hashtags and append to formData
    if (step === "step3") {
        var selectedHashtags = [];
        $("#" + formId + " button.selected").each(function () {
            var hashtagValue = $(this).attr("data-hastag");
            if (hashtagValue && hashtagValue.trim() !== "") {
                selectedHashtags.push(hashtagValue);
            }
        });
        if (selectedHashtags.length < 3) {
            // console.log(selectedFranchiseCategory.length)
            toggleLoader(false);
            showErrorAlert('Please Select atleast 1 Hashtag');
            return;
        }
        var hashtagIds = selectedHashtags.join(',');
        formData += '&hashtag_ids=' + encodeURIComponent(hashtagIds);
    }

    // Get the auth-token
    var authToken = document.querySelector('meta[name="auth-token"]').getAttribute('content');
    //  console.log(authToken);
    // console.log(formData);

    // Send the form data via AJAX to the CodeIgniter REST API
    $.ajax({
        url: api_url + "api/registration/store_consultant_details", // Update with the actual API URL
        type: "POST",
        headers: {
            'Authorization': 'Bearer ' + authToken, // Add the token
        },
        dataType: "json",
        data: formData,
        success: function (response) {
            toggleLoader(false);
            $('.flash-errors').removeClass('input-error');
            if (response.status === "success") {
                // toastr.success(response.message);
                // console.log(step);
                if (step == "step1") {
                    consultantSkipStep1();
                }
                if (step == "step2") {
                    consultantSkipStep2();
                }
                if (step == "step3") {
                    window.location.href = front_end_api_url + "user_profile/user-profile.php"; // Redirect to user page after successful registration
                }
            } else {
                showErrorAlert(response.message);
            }
        },
        error: function (xhr, status, error) {
            toggleLoader(false);
            handleAjaxError(xhr);
        },
    });

}
function consultantSkipStep1(){
    document.getElementById("consultant_main").style.display = "block";
    document.getElementById("franchisee_buyer_main").style.display = "none";
    document.getElementById("buyer_main").style.display = "none";
    document.getElementById("franchisor_step_main").style.display = "none";
    document.getElementById("main_options").style.display = "none";
    document.getElementById("consultant_one").classList.add("d-flex");
    document.getElementById("consultant_two").classList.add("d-none");
}

function consultantSkipStep2() {
    document.getElementById("consultant_one").classList.add("d-none");
    document.getElementById("consultant_two").classList.remove("d-none");
}

function consultantBackStep2(){
    document.getElementById("consultant_one").classList.remove("d-none");
    document.getElementById("consultant_two").classList.add("d-none");
}