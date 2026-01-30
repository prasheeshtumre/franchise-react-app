// Fetch franchises and populate carousel
get_top_franchises();
function get_top_franchises() {
    var settings = {
      url: 'https://khaki-dotterel-350411.hostingersite.com/' + "api/franchise_search",
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
          let main_container = $("#tfmain-container"); // Correct jQuery selector
          let carousel = $("#top-franchises");
          let dotsContainer = $(".dots-container");
  
          // Shuffle and divide into slides
          const shuffledFranchises = responseData.sort(() => 0.5 - Math.random());
          const chunkSize = 6; // 6 items per slide
          const slidesData = [];
          for (let i = 0; i < shuffledFranchises.length; i += chunkSize) {
            slidesData.push(shuffledFranchises.slice(i, i + chunkSize));
          }
  
          // Limit to only 3 slides
          const limitedSlidesData = slidesData.slice(0, 3);
  
          // Populate slides
          limitedSlidesData.forEach((slideData, index) => {
            const slide = $("<div>").addClass("slide row");
  
            slideData.forEach((franchise) => {
              const franchiseCard = `
                <div class="col-6 col-md-4 mb-4">
                  <div class="lp-franchise-card">
                    <img
                      src="https://www.allusafranchises.com/${franchise.imagesrc}"
                      alt="${franchise.name}"
                    />
                    <div class="lp-category-tag">${franchise.category}</div>
                  </div>
                </div>`;
              slide.append(franchiseCard); // Append HTML to slide
            });
  
            carousel.append(slide); // Add slide to carousel
  
            // Add dot for each slide
            const dot = $("<div>")
              .addClass(`dot ${index === 0 ? "active" : ""}`)
              .attr("data-index", index);
            dotsContainer.append(dot);
          });
  
          initializeCarousel(); // Initialize the carousel
        } else {
          console.error("Response is not an array:", responseData);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error("AJAX request failed:", textStatus, errorThrown);
      });
  }