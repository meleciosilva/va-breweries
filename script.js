// global variables
const breweries = document.querySelector('.breweries');
const breweryListings = document.querySelector('.breweries').children;
const paginationDiv = document.querySelector(".pagination-buttons");
const dropdownMenu = document.querySelectorAll(".dropdown-item");
const perPage = 8; // number of breweries to display per page

// retrieves data on all breweries in virginia
async function allBreweries() {
  const response = await axios.get("https://api.openbrewerydb.org/breweries?by_state=virginia");
  const results = response.data;
  return results;
}

// renders list of breweries by selected page number
function renderBreweries(list, page) {
  const startIndex = (page * perPage) - perPage;
  const endIndex = page * perPage - 1;
  list.forEach((brewery, index) => {
    if (index >= startIndex && index <= endIndex) {
      renderOneBrewery(brewery);
    }
  })
}

//renders one brewery listing
function renderOneBrewery(listing) {
  const content = `
  <div class='col-12 col-xs-12 col-md-6 col-lg-3 py-2'>
    <div class="card" style='height:100%'>
      <h5 class="card-header">${listing.name}</h5>
      <div class="card-body d-flex flex-column justify-content-between">
        <h6>Address:</h6>
        <p>${listing.street} ${listing.city}, ${listing.state}</p>
        <h6 id='type'>Type: ${listing.brewery_type.charAt(0).toUpperCase() + listing.brewery_type.slice(1)}</h6>
        <div>
          <a href="${listing.website_url}" target="_blank" class="btn btn-dark mt-1">Visit Website</a>
          <a href="https://maps.google.com/?q=${listing.street} ${listing.city} ${listing.state}" target="_blank" class="btn btn-success mt-1">Directions</a>
        </div>
      </div>
    </div>
  </div>
  `;
  breweries.insertAdjacentHTML('beforeend', content);
}

// ---------------------------------- Pagination Buttons ----------------------------------


// adds pagination buttons to page and assigns event listeners to each button
function addPagination(list) {
  let totalButtons = Math.ceil(list.length / perPage); 
  paginationDiv.innerHTML = '';
  
  // displays total number of buttons with correct page number
  for (let i = 0; i < totalButtons; i++) {
     let button = `<button type="button" class="btn btn-secondary mx-1">${i + 1}</button>`;
     paginationDiv.insertAdjacentHTML("beforeend", button);
  }
  
  // assigns first button active class to indicate page 1 selected
  const firstButton = paginationDiv.firstElementChild;
  if (firstButton) {
    firstButton.classList.add('active-button');
  }

  handlePaginationButtons(list);

}

// adds event listeners for pagination buttons
function handlePaginationButtons(list) {
  // assigns event listener for pagination buttons - reloads page with appropriate listings
  const paginationButtons = document.querySelectorAll("button");
  for (let button of paginationButtons) {
    button.addEventListener("click", () => {
      // removes selected class from previously active button
      const activeButton = document.querySelector('.active-button');
      activeButton.classList.remove('active-button');
      button.classList.add('active-button');
      // re-renders page with appropriate breweries
      breweries.innerHTML = '';
      renderBreweries(list, button.textContent)
    })
  }
}

// ---------------------------------- Search Bar ----------------------------------

// renders brewery listings based on search passed
async function searchEntry(search) {
  const searchLower = search.toLowerCase();

  // filters brewery listings based on search input and re-renders matches
  const filteredBreweries = (await allBreweries()).filter(brewery => {
    
    const name = brewery.name || "Not Available";
    const street = brewery.street || 'Not Available';
    const city = brewery.city || 'Not Available';
    const brewery_type = brewery.brewery_type || 'Not Available';

    if (
      name.toLowerCase().includes(searchLower) || 
      street.toLowerCase().includes(searchLower) || 
      city.toLowerCase().includes(searchLower) || 
      brewery_type.toLowerCase().includes(searchLower)
    ) return brewery;
  })
  // removes listings and re-renders matches
  breweries.innerHTML = "";
  renderBreweries(filteredBreweries, 1);
  // adds pagination buttons
  addPagination(filteredBreweries);
}

// selects search field and invokes searchEntry function with each change
function filterSearch() {
  const searchInput = document.querySelector('input');
  // filters list of breweries by search input
  searchInput.addEventListener('keyup', () => {
    const input = searchInput.value;
    searchEntry(input);
  })
}

// ---------------------------------- click handlers for sort dropdown bar ----------------------------------
const handleNameSort = async () => {
  const theBreweries = await allBreweries();
  const listByName = theBreweries.sort((a, b) => a.name.localeCompare(b.name));
  const pageNumber = document.querySelector(".active-button").textContent;
  breweries.innerHTML = "";
  renderBreweries(listByName, pageNumber);
  handlePaginationButtons(listByName);
}

const handleCitySort = async () => {
  const theBreweries = await allBreweries();
  const listByCity = theBreweries.sort((a, b) => a.city.localeCompare(b.city));
  const pageNumber = document.querySelector(".active-button").textContent;
  breweries.innerHTML = "";
  renderBreweries(listByCity, pageNumber);
  handlePaginationButtons(listByCity);
}

const handleTypeSort = async () => {
  const theBreweries = await allBreweries();
  const listByType = theBreweries.sort((a, b) => a.brewery_type.localeCompare(b.brewery_type));
  const pageNumber = document.querySelector(".active-button").textContent;
  breweries.innerHTML = "";
  renderBreweries(listByType, pageNumber);
  handlePaginationButtons(listByType);
}

// ---------------------------------- event listeners for sort dropdown bar ----------------------------------

// DOM selectors for dropdown menu items
const nameSort = document.querySelector("#name");
const citySort = document.querySelector("#city");
const typeSort = document.querySelector("#type");

// sorts breweries by name
function sortByName() {
  nameSort.addEventListener(("click"), handleNameSort) 
}

// sorts breweries by city
function sortByCity() {
  citySort.addEventListener(("click"), handleCitySort) 
}

// sorts breweries by type
function sortByType() {
  typeSort.addEventListener(("click"), handleTypeSort) 
}


// ---------------------------------- MAIN ----------------------------------

// renders breweries & pagination buttons and activates event listeners
async function main() {
  renderBreweries((await allBreweries()), 1);
  addPagination(await allBreweries());
  filterSearch();
  sortByName();
  sortByCity();
  sortByType();
}

// invokes main function upon DOM content loading
window.addEventListener("DOMContentLoaded", main);