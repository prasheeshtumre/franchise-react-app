document
    .getElementById("Franchisee_step")
    .addEventListener("click", function () {
         // Hide all sections
         $('#select_buyer_franchisee').removeClass('d-none');
         document.getElementById("franchisor_step_main").style.cssText = "display: none !important";
         document.getElementById("consultant_main").style.cssText = "display: none !important";
         document.getElementById("main_options").style.cssText = "display: none !important";
    });

function searchFranchisee(select) {
    let value = $("select[name='search_franchisee']").val();
    // console.log(value);
    if (value == 0) {
        document.getElementById("specify_franchise").classList.remove("d-none");
        document.getElementById("submit_btn_franchisee").classList.remove("d-none");
    }
    if (value != 0) {
        document.getElementById("specify_franchise").classList.add("d-none");
        document.getElementById("submit_btn_franchisee").classList.remove("d-none");
    }
}
    

//toggle category selection
function toggleFranchiseeCategorySelected(div) {
    div.classList.toggle('cg-selected');
    div.classList.toggle('franchisee-category');
}
function onLoadFranchisee() {
    franchiseeDetailsSkipStep1();
}

function franchiseeDetailsBackStep1(){
    $('#select_buyer_franchisee').addClass('d-none');
    $('#franchisee_two').addClass('d-none');
    $('#franchisee_three').addClass('d-none');
    $('#franchisee_one').removeClass('d-none');
    $("#search_franchisee").removeClass("d-none");
    // $("#specify_franchise").removeClass("d-none");
    searchFranchisee();
}

function franchiseeDetailsBackStep2(){
    $("#select_buyer_franchisee").addClass("d-none");
    $("#franchisee_one").addClass("d-none");
    $("#franchisee_two").removeClass("d-none");
    $("#franchisee_three").addClass("d-none");
    $("#search_franchisee").addClass("d-none");
    $("#specify_franchise").addClass("d-none");
}

function franchiseeDetailsSkipStep1(){
    $("#select_buyer_franchisee").addClass("d-none");
    document.getElementById("franchisee_buyer_main").style.cssText = "display: block !important";
    $("#main_options").addClass("d-none");
    $("#franchisee_one").addClass("d-none");
    $("#franchisee_two").removeClass("d-none");
    $("#search_franchisee").addClass("d-none");
    $("#specify_franchise").addClass("d-none");

}
function franchiseeDetailsSkipStep2(){
    $("#select_buyer_franchisee").addClass("d-none");
    $("#franchisee_one").addClass("d-none");
    $("#franchisee_two").addClass("d-none");
    $("#franchisee_three").removeClass("d-none");
    $("#search_franchisee").addClass("d-none");
    $("#specify_franchise").addClass("d-none");
}

// franchisee submit details
function submitFranchiseeDetails(button) {
    toggleLoader(true);
    var form = button.closest('form');
    var formId = form.id;
    var step = $("#" + formId).data('step');
    let formData = $("#" + formId).serialize();
    let buyer_franchise = $("input[name='buyer_franchise']").val();
    // Add role_id based on buyer_franchise value
    formData += '&role_id=' + encodeURIComponent(buyer_franchise == 1 ? 3 : 4);
    // If step is 2, add additional data to form
    if (step == "step2") {
        var franchisee_name = $('#franchisee-name').val();
        var franchisee_location = $('#franchisee-location').val();
        $("input[name='franchisee_name']").val(franchisee_name);
        $("input[name='franchisee_location']").val(franchisee_location);
    }

    if(step == 'step3'){
        var selectedFranchiseCategory = [];
        $("div .franchisee-category").each(function () {
            var franchiseCategory = $(this).attr("data-franchiseCategory");

            // Ensure that the data-hastag is not empty or undefined
            if (franchiseCategory && franchiseCategory.trim() !== "") {
                selectedFranchiseCategory.push(franchiseCategory);
            }
        });
        if (selectedFranchiseCategory.length < 3) {
            // console.log(selectedFranchiseCategory.length)
            toggleLoader(false);
            showErrorAlert('Please Select atleast 3 categories');
            return;
        }

        var franchiseCategories = selectedFranchiseCategory.join(',');
        // console.log(hashtagIds);
        // Append the selected hashtags to the serialized form data
        formData += '&franchiseCategories=' + encodeURIComponent(franchiseCategories);
    }

    // Get the auth-token
    var authToken = document.querySelector('meta[name="auth-token"]').getAttribute('content');
    //  console.log(authToken);
    // console.log(formData); return;

    // Send the form data via AJAX to the laravel REST API
    $.ajax({
        url: api_url + "api/registration/store_franchisee_details", // Update with the actual API URL
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
                    franchiseeDetailsSkipStep1();
                }
                if (step == "step2") {
                    franchiseeDetailsSkipStep2();
                }
                if(step == "step3"){                    
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
