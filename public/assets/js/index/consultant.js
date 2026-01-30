// TOP CONSULTANTS


function get_top_consultants() {
    var settings = {
      url: front_end_api_url + "consultants-api.php",
      method: "POST",
    };
  
    $.ajax(settings)
      .done(function (response) {
        var responseData;
        if (typeof response === "string") {
          try {
            responseData = JSON.parse(response);
          } catch (error) {
            console.error("Error parsing JSON:", error);
            return;
          }
        } else {
          responseData = response;
        }
  
        if (Array.isArray(responseData)) {
          let main_container = $("#top-consl-main");
          main_container.empty();
  
          // Shuffle consultants
          const shuffledConsultants = responseData.sort(
            () => 0.5 - Math.random()
          );
  
          // Populate slides
          shuffledConsultants.forEach((card) => {
            let consultantHTML = `<div class="lp-consultant-card p-3 d-flex flex-column justify-content-center item">
                <img
                  src="${card.image}"
                  alt="Consultant"/>
                <div class="lp-consultant-content text-center mt-2">
                  <p>${card.name}</p>
                  <div>${card.assisted}<span>.</span> Assisted</div>
                  <button id="${card.buttonId}">Connect</button>
                </div>
              </div>`;
            main_container.append(consultantHTML);
          });
  
          // Initialize Owl Carousel
          $(".owl-carousel").owlCarousel({
            loop: true,
            margin: 10,
            nav: false,
            dots: false,
            autoplay: true,
            autoplayHoverPause: true,
            autoplayTimeout: 3000, // 3 seconds interval
            autoplaySpeed: 1000, // Move slower
            responsive: {
              0: { items: 1 },
              600: { items: 2 },
              1000: { items: 5 },
            },
          });
  
          // On hover, slow down the autoplay speed
          $("#top-consl-main").hover(
            function () {
              $(this).trigger("play.owl.autoplay", [5000]); // Slow speed
            },
            function () {
              $(this).trigger("play.owl.autoplay", [3000]); // Normal speed
            }
          );
        } else {
          console.error("Response is not an array:", responseData);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error("AJAX request failed:", textStatus, errorThrown);
      });
  }
  
  // Fetch franchises and populate carousel
  get_top_consultants();