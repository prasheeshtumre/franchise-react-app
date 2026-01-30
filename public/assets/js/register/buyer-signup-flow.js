//toggle category selection
function toggleBuyerCategorySelected(div) {
    div.classList.toggle('cg-selected');
    div.classList.toggle('buyer-category');
}

function onLoadBuyer() {
    buyerDetailsSkipStep1();
    
}

function buyerDetailsBackStep1(){
    document.getElementById("franchisee_buyer_main").style.cssText = "display: block !important";
    document.getElementById("buyer_main").style.cssText = "display: block !important";
    $("#main_options").addClass("d-none");
    $("#buyer_ones").removeClass("d-none");
    $("#buyer_two").addClass("d-none");
}

function buyerDetailsSkipStep1(){
    document.getElementById("franchisee_buyer_main").style.cssText = "display: block !important";
    document.getElementById("buyer_main").style.cssText = "display: block !important";
    $("#main_options").addClass("d-none");
    $("#buyer_one").addClass("d-none");
    $("#buyer_two").removeClass("d-none");
    $("#buyer_ones").addClass("d-none");
    $("#select_buyer_franchisee").addClass("d-none");
    
}

function buyerDetailsSkipStep2(){
    window.location.href = front_end_api_url + "user_profile/user-profile.php";
}

//buyer submit details
function submitBuyerDetails(button) {
    toggleLoader(true);

    var form = button.closest('form');
    var formId = form.id;
    var step = $("#" + formId).data('step');
    let formData = $("#" + formId).serialize();
    formData += '&role_id=' + encodeURIComponent(4);
    // Step 1: Franchise categories validation
    if (step == "step1") {
        var selectedFranchiseCategory = [];
        $("div .buyer-category").each(function () {
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
    if (step == "step2") {
        var franchise_name = $('#franchise-name').val();
        var franchise_location = $('#franchise-location').val();
        $("input[name='franchise_name']").val(franchise_name);
        $("input[name='franchise_location']").val(franchise_location);
    }

    // Get the auth-token
    var authToken = document.querySelector('meta[name="auth-token"]').getAttribute('content');

    // Send the form data via AJAX to the Laravel REST API
    $.ajax({
        url: api_url + "api/registration/store_buyer_details", // Update with the actual API URL
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
                    buyerDetailsSkipStep1();
                }
                if (step == "step2") {
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

