$('.grid-list-buttons-box').on('click', function () {
    $('.grid-list-buttons-box').removeClass('active'); 
    $(this).addClass('active');
});

$('#list-button').on('click',function(){
    displayFilteredData('list')
})

$('#grid-button').on('click',function(){
    displayFilteredData('grid')
})

//Slider ranges
let slider1Val={},slider2Val={},slider3Val={};//New slides can be added

function franchisesSlider(rangeInputDiv, priceInputDiv, slideiDiv, storageObj, priceGap = 10000, isYear = false) {
    const rangeInput = document.querySelectorAll(rangeInputDiv + " input"),
          priceInput = document.querySelectorAll(priceInputDiv + " input"),
          range = document.querySelector(slideiDiv + " .progress");

    rangeInput.forEach(input => {
        input.addEventListener("input", e => {
            let minVal = parseInt(rangeInput[0].value),
                maxVal = parseInt(rangeInput[1].value);
            // Prevent overlap of range
            if ((maxVal - minVal) < priceGap) {
                if (e.target.classList.contains("range-min")) {
                    rangeInput[0].value = maxVal - priceGap;
                } else {
                    rangeInput[1].value = minVal + priceGap;
                }
            } else {
                // Update input display values
                if (isYear) {
                    priceInput[0].value = minVal; // No formatting for years
                    priceInput[1].value = maxVal;
                } else {
                    priceInput[0].value = "$" + minVal.toLocaleString(); // Add $ symbol and format
                    priceInput[1].value = "$" + maxVal.toLocaleString();
                }
                // Update range progress bar
                range.style.left = ((minVal - rangeInput[0].min) / (rangeInput[0].max - rangeInput[0].min)) * 100 + "%";
                range.style.right = 100 - ((maxVal - rangeInput[1].min) / (rangeInput[1].max - rangeInput[1].min)) * 100 + "%";
            }
            // Update storage object
            storageObj.minPrice = isYear ? minVal : "$" + minVal.toLocaleString();
            storageObj.maxPrice = isYear ? maxVal : "$" + maxVal.toLocaleString();
        });
    });
}
// Initialize sliders and also cna add new sliders here
franchisesSlider("#range-input-1", "#price-input-1", "#slider-1", slider1Val, 10000, false); // Price slider 1
franchisesSlider("#range-input-2", "#price-input-2", "#slider-2", slider2Val, 10000, false); // Price slider 2
franchisesSlider("#range-input-3", "#price-input-3", "#slider-3", slider3Val, 1, true);      // Year slider

//Categories api call
let selectedCategories;//Storing selected categories
function getCategoriesCheckbox() {
    const settings = {
      url: 'https://khaki-dotterel-350411.hostingersite.com/' + "api/get_all_categories",
      method: "GET",
    };
    $.ajax(settings)
      .done(function (response) {
        let responseData = Array.isArray(response) ? response : JSON.parse(response || '{}');
        // console.log(responseData)
        if (Array.isArray(responseData)) {
          const checkBoxContainer = $("#f-category-checkbox");
          checkBoxContainer.empty(); // Clear existing options if any
          responseData.forEach(function (category) {
            if (category.status === "active") {
              // Create HTML for each active category
              const str = category.franchise_name;
              const modStr = str[0].toUpperCase() + str.slice(1);
              const categoryHTML = `
                <div class="fx-each-category">
                  <input type="checkbox" class="category-filter" id="${category.id}" value="${category.franchise_name}">
                  <label for="${category.id}">${modStr}</label>
                </div>`;
              checkBoxContainer.append(categoryHTML);
            }
          });
          // Attach change event listener after rendering the checkboxes
          attachCategoryChangeListener();
        } else {
          console.error("Expected an array but received:", responseData);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error("AJAX request failed:", textStatus, errorThrown);
      });
  }
// Function to attach change event listener to the checkboxes
function attachCategoryChangeListener() {
$('.fx-each-category input[type="checkbox"]').off('change').on('change', function () {
    selectedCategories = [];
    $('.fx-each-category input[type="checkbox"]:checked').each(function () {
    selectedCategories.push($(this).val());
    });
    applyFilters()
});
}
//Main Category function
getCategoriesCheckbox();

//To add sort filter
let selectedSortFilter='';  
$('#sort-by').on('change', function(){
    selectedSortFilter=$(this).val();
    console.log(selectedSortFilter);
    applyFilters();
});

//Filters Functions 
const franchises_main = $("#franchises-grid-main");
const layoutConfig={
    grid:{containerClass: 'col-xl-4',card:'fx-franchise-card',logo: 'fx-logo-section',header:'fx-card-header',actions:'fx-card-actions',details:'fx-card-details' ,cardLeft:'fx-left',cardRight:'fx-right',button:'read-more-btn',category:'fx-franchise-category'},
    list:{containerClass: 'col-xl-12',card:'fx-franchise-l-card',logo: 'fx-l-logo-section',header:'fx-l-card-header',actions:'fx-l-card-actions',details:'fx-l-card-details',cardLeft:'fx-l-left',cardRight:'fx-l-right',button:'l-read-more-btn',category:'fx-l-franchise-category'}
}
const filterApiUrl = 'https://khaki-dotterel-350411.hostingersite.com/' + "api/franchise_search"; // API endpoint
$('#loading-spinner').show();
$.ajax({
    url: filterApiUrl,
    method: "GET",
})
.done(function (response) {
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
    // console.log("API Response Data:", responseData);
    applyFilters();
})
.fail(function (error) {
    console.error("API request failed:", error);
    $('#loading-spinner').hide(); 
});

//HTML populating
let filteredData = [];

// Functions to filter
function filterByInvestment(data,minInvestmentPrice,maxInvestmentPrice){
    const reqData=data.General_Information.Total_Investment
    const seperator=reqData.includes("to")?"to":"-";
    const [dataMin, dataMax] = reqData.split(seperator).map(value =>parseFloat(value.replace(/[$,]/g, "")));
      return dataMin >= minInvestmentPrice && dataMax <= maxInvestmentPrice;
}

function filterByPrice(data, minPrice, maxPrice) {
    let cash = parseInt(data.mincash.replace('$', '').replace(',', ''));
    return cash > minPrice && cash <= maxPrice;
}

function filterByYear(data, minYear,maxYear) {
    let year=data.General_Information.Franchising_Since
    return  year>minYear && year<maxYear;
}

function filterByCategory(data, selectedCategories) {
    if (!selectedCategories || selectedCategories.length === 0) {return data; }
    const normalizedCategories = selectedCategories.map(category => category.toLowerCase());
    if (normalizedCategories.includes(data.General_Information.Industry.toLowerCase())) {
        return data;
    }
    return null;
}

function filterBySort(filteredData,selectedvalue){
    if(selectedvalue=='franchise_az'){
        filteredData.sort((a, b) => a.name.localeCompare(b.name));
    }
    else if(selectedvalue=='franchise_za'){
        filteredData.sort((a, b) => b.name.localeCompare(a.name));
    }
    else if(selectedvalue=='industry_az'){
        filteredData.sort((a, b) => a.General_Information.Industry.localeCompare(b.General_Information.Industry));
    }
    else if(selectedvalue=='industry_za'){
        filteredData.sort((a, b) => b.General_Information.Industry.localeCompare(a.General_Information.Industry));
    }
    else if(selectedvalue=='fee_high'){
        filteredData.sort((a, b) => {
            const cashA = parseInt(a.mincash.replace('$', '').replace(',', ''));
            const cashB = parseInt(b.mincash.replace('$', '').replace(',', ''));
            return cashB - cashA; // Sort high to low
        });
    }
    else if(selectedvalue=='fee_low'){
        filteredData.sort((a, b) => {
            const cashA = parseInt(a.mincash.replace('$', '').replace(',', ''));
            const cashB = parseInt(b.mincash.replace('$', '').replace(',', ''));
            return cashA - cashB; // Sort high to low
        });
    }
    else if(selectedvalue=='franchise_old'){
        filteredData.sort((a, b) => parseInt(a.General_Information.Year_Founded)-parseInt(b.General_Information.Year_Founded));
    }
    else if(selectedvalue=='franchise_new'){
        filteredData.sort((a, b) => parseInt(b.General_Information.Year_Founded)-parseInt(a.General_Information.Year_Founded));
    }
    else if(selectedvalue=='units_high'){
        filteredData.sort((a, b) => parseInt(b.General_Information.Total_Units)-parseInt(a.General_Information.Total_Units));
    }
    else if(selectedvalue=='units_low'){
        filteredData.sort((a, b) =>parseInt(a.General_Information.Total_Units)-parseInt(b.General_Information.Total_Units));
    }
    return filteredData;
}

// Main filtersfunction
function applyFilters() {
    $('#loading-spinner').show();
        //Investement variables
        const minInvestmentPrice = slider1Val && slider1Val.minPrice ? parseInt(slider1Val.minPrice.replace('$', '').replace(',', '')) : 0;
        const maxInvestmentPrice = slider1Val && slider1Val.maxPrice ? parseInt(slider1Val.maxPrice.replace(/[^0-9]/g, '')) : Number.MAX_SAFE_INTEGER;
        //Franchise variables
        const minPrice = slider2Val && slider2Val.minPrice ? parseInt(slider2Val.minPrice.replace('$', '').replace(',', '')) : 0;
        const maxPrice = slider2Val && slider2Val.maxPrice ? parseInt(slider2Val.maxPrice.replace(/[^0-9]/g, '')): Number.MAX_SAFE_INTEGER;
        //Year variables
        const minYear = slider3Val && slider3Val.minPrice ? parseInt(slider3Val.minPrice):0;
        const maxYear = slider3Val && slider3Val.maxPrice ? parseInt(slider3Val.maxPrice): Number.MAX_SAFE_INTEGER;

        filteredData = responseData.filter((data) => {
                        return filterByPrice(data, minPrice, maxPrice) && 
                                filterByCategory(data, selectedCategories) && 
                                filterByInvestment(data,minInvestmentPrice,maxInvestmentPrice) && 
                                filterByYear(data, minYear,maxYear) 
                        // &&   filterByCity(data, selectedCity);
                        });
        //Sorting Data
        filteredData = filterBySort(filteredData,selectedSortFilter);
         if ($('#list-button').hasClass('active')) {
            displayFilteredData('list');
        } 
        else{
            displayFilteredData('grid');
            }
}


 //function for adding K and M in investment range
 function formatRange(range) {
    const separator = range.includes(" to ") ? " to " : " - ";
    return range.split(separator).map(numberStr => {
        const cleanNumber = numberStr.replace(/[~$,]/g, "");
        const num = parseFloat(cleanNumber);
        if (isNaN(num)) return "Invalid";
        return num >= 1000000?`$${(num / 1000000).toFixed(1)}M`:`$${(num / 1000).toFixed(0)}K`;
      })
      .join(" - ");
  }

//Can add new classes here


// Function to display the filtered data

function displayFilteredData(layoutType) {
    franchises_main.html('');
    let res=document.getElementById('total-result');
    res.innerText=filteredData.length
    if (filteredData.length > 0) {
        const { containerClass,card,logo,header,actions,details,cardLeft,cardRight,button,category } = layoutConfig[layoutType];
        filteredData.forEach((franchise) => {   
            // const iconPath = franchiseIcons[franchise.General_Information.Industry];
            // <object data="${iconPath}" type="image/svg+xml"></object>
            const articleHTML =  `
            <div class="col-6 col-md-6 ${containerClass}" >
                <div class="${card} mb-4 mb-2">
                    <div class="${logo}">
                        <div class="${header}">
                        <div class="fx-verified">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.2747 4.11849C12.0952 4.06719 11.9048 4.06719 11.7253 4.11849L6.72528 5.54706C6.29598 5.66972 6 6.06211 6 6.50859V11.883C6 14.1437 7.09176 16.2652 8.93133 17.5792L11.4188 19.3559C11.7665 19.6043 12.2335 19.6043 12.5812 19.3559L15.0687 17.5792C16.9082 16.2652 18 14.1437 18 11.883V6.50859C18 6.06211 17.704 5.66972 17.2747 5.54706L12.2747 4.11849ZM11.1758 2.19545C11.7145 2.04154 12.2855 2.04154 12.8242 2.19545L17.8242 3.62402C19.1121 3.99199 20 5.16915 20 6.50859V11.883C20 14.7896 18.5963 17.5172 16.2311 19.2066L13.7437 20.9834C12.7006 21.7284 11.2994 21.7284 10.2563 20.9834L7.76886 19.2066C5.40369 17.5172 4 14.7896 4 11.883V6.50859C4 5.16915 4.88793 3.99199 6.17584 3.62402L11.1758 2.19545Z" fill="black"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.6839 8.27047C16.0869 8.6482 16.1073 9.28103 15.7295 9.68394L11.9795 13.6839C11.6213 14.0661 11.0289 14.107 10.6215 13.7778L8.37148 11.9596C7.94192 11.6125 7.87509 10.9829 8.22221 10.5533C8.56933 10.1237 9.19896 10.0569 9.62852 10.404L11.1559 11.6383L14.2705 8.31606C14.6482 7.91315 15.281 7.89274 15.6839 8.27047Z" fill="black"/>
                            </svg>
                            <span>Verified</span>
                        </div>
                        <div class="${actions}">
                            <a href="franchise-comparison.php" class="fx-compare-cardlink">
                               <div title="Compare">
                                <svg width="24"  height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 9.71429H8M8 9.71429L10.2857 11.4286M8 9.71429L10.2857 8" stroke="#828282" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 15.142H16M16 15.142L13.7143 16.8563M16 15.142L13.7143 13.4277" stroke="#828282" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="10" stroke="#828282" stroke-width="1.5"/></svg>
                                </div>
                            </a>
                                <svg class="filter-heart" width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.5013 9.57169L10.0013 16.9997L2.50128 9.57169C2.00658 9.0903 1.61692 8.5117 1.35683 7.87232C1.09673 7.23295 0.971839 6.54664 0.990015 5.85662C1.00819 5.1666 1.16904 4.48782 1.46244 3.86303C1.75583 3.23823 2.17541 2.68094 2.69476 2.22627C3.21411 1.77159 3.82198 1.42938 4.48009 1.22117C5.1382 1.01296 5.83228 0.943272 6.51865 1.01649C7.20501 1.08971 7.86878 1.30425 8.46815 1.64659C9.06753 1.98894 9.58953 2.45169 10.0013 3.00569C10.4148 2.45571 10.9374 1.99701 11.5364 1.65829C12.1353 1.31958 12.7978 1.10814 13.4822 1.03721C14.1666 0.966279 14.8584 1.03739 15.5141 1.24608C16.1697 1.45477 16.7753 1.79656 17.2928 2.25005C17.8104 2.70354 18.2287 3.25897 18.5217 3.88158C18.8147 4.50419 18.976 5.18057 18.9956 5.8684C19.0152 6.55622 18.8925 7.24068 18.6354 7.87894C18.3783 8.5172 17.9922 9.09551 17.5013 9.57769" stroke="#828282" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>  
                        </div>
                    </div>
                        <img src="${`https://www.allusafranchises.com/${franchise.imagesrc}`?`https://www.allusafranchises.com/${franchise.imagesrc}`:"assets/images/new-images/news-img-7.png"}" alt="Franchise Logo" class="fx-franchise-logo">
                        <div class="${category}">
                            
                            <span>${franchise.General_Information.Industry}</span>
                        </div>
                    </div>
                    <div class="${details}">
                        <div class="${cardLeft}">
                            <div>
                                <span class="detail-value">${franchise.General_Information.Year_Founded?franchise.General_Information.Year_Founded:"No data"}</span>
                                <span class="detail-label">Founded</span>
                            </div>
                            <div>
                                <span class="detail-value">${formatRange(franchise.General_Information.Total_Investment)}</span>
                                <span class="detail-label">Investment</span>
                            </div>
                        </div>
                        <div class="${cardRight}">
                            <div>
                                <span class="detail-value">${franchise.General_Information.Total_Units}</span>
                                <span class="detail-label">Units</span>
                            </div>
                            <div>
                                <span class="detail-value">${franchise.mincash}</span>
                                <span class="detail-label">Franchise Fee</span>
                            </div>
                        </div>
                    </div>
                    <div class="fx-card-footer">
                        <button class="${button}">Read more</button>
                    </div>
                </div>
            </div>`;   
            franchises_main.append(articleHTML);
    })}
    else {
        franchises_main.append('<div class="no-data-found">No Franchises Found</div>');
    }
}

// Event listeners for each filter
$('#range-input-1').on('change', applyFilters);
$('#range-input-2').on('change', applyFilters);
$('#range-input-3').on('change', applyFilters);
// $('#city-filter').on('change', applyFilters);

  
//Dynamic svgs addition
const franchiseIcons = {
    //Can add new SVGs here
    "Health & Wellness"      : "assets/images/icons/category/Health_care.svg",
    Food                     : "assets/images/icons/category/Food.svg",
    "Food and Restaurants"   : "assets/images/icons/category/Food.svg",
    "Health and Wellness"    : "assets/images/icons/category/Health_care.svg",
    Fitness                  : "assets/images/icons/category/fitness.svg",
    "Food Franchises"        : "assets/images/icons/category/Food.svg",
    "Financial Services"     : "assets/images/icons/category/financial.svg",
    Restaurants              : "assets/images/icons/category/Food.svg",
    "Food and Drink"         : "assets/images/icons/category/Food.svg",
    "Snacks & Treats"        : "assets/images/icons/category/Food.svg",
    Wellness                 : "assets/images/icons/category/Health_care.svg",
    Entertainment            : "assets/images/icons/category/Health_care.svg",
    Automotive               : "assets/images/icons/category/Automotive.svg",
    "Pet Care"               : "assets/images/icons/category/Health_care.svg",
    "Food Services"          : "assets/images/icons/category/Food.svg",
    "Food - Fast Casual"     : "assets/images/icons/category/Food.svg",
    "Home Services"          : "assets/images/icons/category/Health_care.svg",
    "Waste Management"       : "assets/images/icons/category/Health_care.svg",
    Energy                   : "assets/images/icons/category/Health_care.svg",
    "Pet Services Franchises": "assets/images/icons/category/Health_care.svg",
  };

$(document).on('click', '.filter-heart', function() {
    $(this).find('path').toggleClass('red-heart');
});

// // Function to open the modal
// function openModal() {
//     // Open the modal by adding the 'modal-open' class
//     $('#filter-franchises').addClass('modal-open');

//     // Add click event listener to detect clicks outside the modal
//     $(document).on('click.modal', function(event) {
//         // Check if the click is outside the modal element
//         if (!$(event.target).closest('#filter-franchises').length) {
//             // Close the modal only if it's currently open
//             if ($('#filter-franchises').hasClass('modal-open')) {
//                 $('#filter-franchises').removeClass('modal-open');
//                 // Remove the click event listener after closing the modal
//                 $(document).off('click.modal');
//             }
//         }
//     });
// }

// // Attach the event listener to the button using jQuery
// $('#filter-button').on('click', function(event) {
//     // Prevent the click from bubbling to the document
//     event.stopPropagation();
    
//     // Open the modal
//     openModal();
// });

$('#filter-button').on('click',(event)=>{
    event.stopPropagation();
    openModal('filter-franchises');
})

function openModal(className){
    $('.'+className).addClass('modal-open')
    $(document).on('click.event',(event)=>{
        if (!$(event.target).closest('.' + className).length){
            $('.'+className).removeClass('modal-open')
        }
    })
}