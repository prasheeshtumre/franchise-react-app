// RESOURCES ON LANDING PAGE
function get_articles() {
    var settings = {
      url: 'https://khaki-dotterel-350411.hostingersite.com/' + "api/get_resources",
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
          var article_main = $(".article-main");
  
          // Clear the previous articles
          article_main.empty();
          var shuffledArticles = responseData.sort(() => 0.5 - Math.random());
          var articlesToShow = shuffledArticles.slice(0, 3);
  
          articlesToShow.forEach(function (article) {
            // Truncate content to 4 lines and add 'Read more' link
            var truncatedContent =
              article.Content.length > 200
                ? article.Content.substring(0, 200) + "..."
                : article.Content;
  
            // Create the HTML structure for each article dynamically
            var articleHTML = `
              <div class="col-12 col-md-4">
                <div class="lp-news-card">
                  <div class="news-img">
                    <img src=https://khaki-dotterel-350411.hostingersite.com/${article.Image_URL} alt="News Image" />
                  </div>
                  <div class="lp-news-card-text p-3">
                    <h5>${article.Title}</h5>
                    <p class="truncate-content">${truncatedContent}</p> 
                    <a href="blog-detail.php?id=${article.id}" class="read-more-link">Read more</a> 
                    <div class="lp-news-card-author d-flex flex-row justify-content-start align-items-center mt-4">
                      <div class="lp-user-icon">
                        <img src="assets/images/blog-images/author-img.png" alt="Author Image" />
                      </div>
                      <div class="lp-user-name">
                        <h6>By Grace White</h6>
                        <p>${article.Date}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `;
  
            article_main.append(articleHTML);
          });
  
          // After appending the content, apply truncation dynamically using CSS
          $(".truncate-content").each(function () {
            $(this).css({
              display: "-webkit-box",
              "-webkit-line-clamp": "4", // Limit to 4 lines
              "-webkit-box-orient": "vertical",
              overflow: "hidden",
              "text-overflow": "ellipsis",
            });
          });
        } else {
          console.error("Response is not an array:", responseData);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error("AJAX request failed:", textStatus, errorThrown);
      });
  }
  
  get_articles();