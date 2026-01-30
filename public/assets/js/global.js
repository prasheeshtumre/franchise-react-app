// var api_url = "http://127.0.0.1:8000/";
var api_url = "http://192.168.0.120:8000/";
// var api_url = "https://khaki-dotterel-350411.hostingersite.com/";
// var front_end_api_url = "https://darkgray-dotterel-292390.hostingersite.com/";
var front_end_api_url = "http://192.168.0.120/front_end/";

toastr.options = {
  closeButton: true,
  newestOnTop: false,
  progressBar: true,
  positionClass: "toast-top-right",
  preventDuplicates: false,
  onclick: null,
  showDuration: "5000",
  hideDuration: "1000",
  timeOut: "5000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};

function toggleLoader(show) {
  const overlay = document.getElementById('overlay');
    const loader = document.getElementById('loader');
    if (show) {
        overlay.style.display = 'flex'; // Show the overlay with loader
    } else {
        overlay.style.display = 'none'; // Hide the overlay
    }
}

// Handle AJAX error
function handleAjaxError(xhr) {
  $('.flash-errors').removeClass('input-error');
  if (xhr.status === 422) {
      var obj = JSON.parse(xhr.responseText);
      $.each(obj.errors, function (key, value) {
          toastr.error(value[0]);
          $('input[name="' + key + '"]').addClass('input-error flash-errors');
          $('select[name="' + key + '"]').addClass('input-error flash-errors');
          // $('<span class="input-error flash-errors" style="color: red">' + value[0] + '</span>')
          //     .insertAfter('input[name="' + key + '"]');
          // $('<span class="input-error flash-errors" style="color: red">' + value[0] + '</span>')
          //     .insertAfter('select[name="' + key + '"]');
          // $('.input-error-' + key).text(value[0]);
      });
  }else if(xhr.status === 401){
    var obj = JSON.parse(xhr.responseText);
    toastr.error(obj.message);
  } else {
    var obj = JSON.parse(xhr.responseText);
      Swal.fire({
          icon: "error",
          title: obj.message,
          text: "Please try again.",
      });
  }
}
// Display error alert (for AJAX failure)
function showErrorAlert(message) {
  Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error: " + message,
  });
}
