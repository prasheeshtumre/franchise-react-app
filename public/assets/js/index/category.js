// CATEGORIES ON LANDING PAGE
function get_all_categories() {
    var settings = {
      url: api_url + "api/category/get",
      method: "GET",
    };
  
    $.ajax(settings)
      .done(function (response) {
        // Log the raw response to understand its structure
        // console.log("Raw Response:", response);
  
        // Check if response is a string and parse it
        var responseData;
        if (typeof response === "string") {
          try {
            responseData = JSON.parse(response['data']);
          } catch (error) {
            console.error("Error parsing JSON:", error);
            return;
          }
        } else {
          responseData = response['data']; // Assuming it's already parsed
        }

        // console.log(responseData);
  
        // Check if responseData is an array
        if (Array.isArray(responseData)) {
          var categoriesContainer = $(".lp-categories");
  
          // Clear existing options if any
          categoriesContainer.empty();
  
          // Iterate over each category and create HTML elements
          responseData.forEach(function (category, index) {
            // Only add active categories
            if (category.status === 1) {
              console.log(category.id);
              var categoryOption = $('<div class="lp-category-option"></div>');
              var categoryLink = $(
                '<a href="franchises.php?id=' + category.id + '"></a>'
              );
  
              // Add franchise name and inline CSS to the link
              categoryLink
                .append(category.icon + category.name)
                .attr(
                  "style",
                  "text-decoration: none; font-size: 12px; color: #828282;"
                );
  
              // Append the link to the category option
              categoryOption.append(categoryLink);
  
              // Append the category option to the container
              categoriesContainer.append(categoryOption);
  
              // Optional: Activate the first category
              // if (index === 0) {
              //   categoryOption.addClass("lp-option-active");
              // }
            }
          });
        } else {
          console.error("Expected an array but received:", responseData);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error("AJAX request failed:", textStatus, errorThrown);
      });
  }
  get_all_categories();