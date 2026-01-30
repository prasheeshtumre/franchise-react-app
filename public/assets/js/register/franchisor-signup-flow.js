document
    .getElementById("franchisor_step")
    .addEventListener("click", function () {
        // Hide all sections
        document.getElementById("franchisor_step_main").style.display = "block";
        document.getElementById("franchisee_buyer_main").style.display = "none";
        document.getElementById("buyer_main").style.display = "none";
        document.getElementById("consultant_main").style.display = "none";
        document.getElementById("main_options").style.display = "none";

        // Show franchisor_one with !important, hide the others
        document.getElementById("franchisor_one").classList.add("d-flex");
        document.getElementById("franchisor_two").classList.add("d-none");
        document.getElementById("franchisor_three").classList.add("d-none");
        document.getElementById("search_franchisor_input").classList.add("d-none");
    });

function searchFranchisor(select) {
    let name = select.name;
    let value = $("select[name='search_franchisor']").val();
    //  console.log(value);
    if (value == 0) {
        document.getElementById("search_franchisor_input").classList.remove("d-none");
        document.getElementsByClassName("flash-errors").classList.add("d-none");
    }
    if (value != 0) {
        document.getElementById("search_franchisor_input").classList.add("d-none");
        document.getElementById("franchisor-name").value = '';
        document.getElementById("franchisor-location").value = '';
        document.getElementsByClassName("flash-errors").classList.add("d-none");
    }
}


function onLoadFranchisor() {
    franchisorBackStep1();
    searchFranchisor('search_franchisor');
}



function franchisorBackStep1(){    
    $("#franchisor_one").removeClass("d-none");
    $("#franchisor_two").addClass("d-none");
    $("#franchisor_three").addClass("d-none");
    document.getElementById("main_options").style.display = "none";
    document.getElementById("franchisor_step_main").style.display = "block";
    document.getElementById("buyer_main").style.display = "none";
    document.getElementById("consultant_main").style.display = "none";
    document.getElementById("main_options").style.display = "none";
}
function franchisorSkipStep1(){    
    $("#franchisor_one").addClass("d-none");
    $("#franchisor_two").removeClass("d-none");
    $("#franchisor_three").addClass("d-none");
}

function franchisorBackStep2(){
    $("#franchisor_one").addClass("d-none");
    $("#franchisor_two").removeClass("d-none");
    $("#franchisor_three").addClass("d-none");
}


function toggleSelected(button) {
    button.classList.toggle('selected');
}

function submitUserFranchiseDetails(button) {
    toggleLoader(true);
    var form = button.closest('form');
    var formId = form.id;
    // console.log(formId);
    var step = $("#" + formId).data('step');

    let formData = $("#" + formId).serialize();

    // Step 2 Handling
    if (step == "step2") {
        var franchise_name = $('#franchise-name').val();
        var franchise_location = $('#franchise-location').val();
        $("input[name='franchise_name']").val(franchise_name);
        $("input[name='franchise_location']").val(franchise_location);
    }
    // Step 3 Handling (Hashtags)
    if (step == "step3") {
        var selectedHashtags = [];
        $("#" + formId + " button.selected").each(function () {
            var hashtagValue = $(this).attr("data-hastag");
            // console.log(hashtagValue);
            // Ensure that the data-hastag is not empty or undefined
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
        // Append the selected hashtags to the serialized form data
        formData += '&hashtag_ids=' + encodeURIComponent(hashtagIds);
    }
    // Get the auth-token
    var authToken = document.querySelector('meta[name="auth-token"]').getAttribute('content');
    //  console.log(authToken);
    // console.log(formData);

    // Send the form data via AJAX to the CodeIgniter REST API
    $.ajax({
        url: api_url + "api/registration/store_franchisor_details", // Update with the actual API URL
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
                    franchisorSkipStep1();
                }
                if (step == "step2") {
                    showFranchisorThreeSkip();
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

// Show franchisor_three when the second button is clicked
function showFranchisorThreeSkip() {
    $("#franchisor_one").addClass("d-none");
    $("#franchisor_two").addClass("d-none");
    $("#franchisor_three").removeClass("d-none");
}