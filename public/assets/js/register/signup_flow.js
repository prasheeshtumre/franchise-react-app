document.getElementById("franchisor_step_main").style.display = "none";
document.getElementById("franchisee_buyer_main").style.display = "none";
document.getElementById("buyer_main").style.display = "none";
document.getElementById("consultant_main").style.display = "none";


function franchisee_buyer_button(radioCheck) {
    // console.log(radioCheck.value);
    let value = radioCheck.value;
    if (value == 1) {
        $('#back_franchisee').addClass('d-none');
        document.getElementById("franchisee_buyer_main").style.cssText = "display: block !important";
        document.getElementById("franchisee_one").classList.remove("d-none");
        document.getElementById("search_franchisee").classList.remove("d-none");
        document.getElementById("specify_franchise").classList.add("d-none");
        document.getElementById("buyer_main").style.cssText = "display: none !important";
        document.getElementById("buyer_ones").classList.add("d-none");
        document.getElementById("buyer_two").classList.add("d-none");
    } else {
        $('#back_franchisee').addClass('d-none');
        document.getElementById("franchisee_buyer_main").classList.add("d-none");
        document.getElementById("franchisee_one").classList.add("d-none");
        document.getElementById("search_franchisee").classList.add("d-none");
        document.getElementById("specify_franchise").classList.add("d-none");
        document.getElementById("buyer_main").style.cssText = "display: block !important";
        document.getElementById("buyer_ones").classList.remove("d-none");
        document.getElementById("buyer_two").classList.add("d-none");
    }
}

function buyer_two_button() {
    document.getElementById("buyer_one").classList.add("d-none");
    document.getElementById("buyer_two").classList.remove("d-none");
    document.getElementById("buyer_ones").classList.add("d-none");
}

function pageReload(){
    window.location.reload(true);
}