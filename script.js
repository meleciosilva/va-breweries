const breweries = document.querySelector('.breweries');
const breweryListings = document.querySelector('.breweries').children;
const paginationDiv = document.querySelector(".pagination-buttons");
const perPage = 8; // number of breweries to display per page


async function allBreweries() {
  const results = await axios.get("https://api.openbrewerydb.org/breweries?by_state=virginia").then(({data}) => data);
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
  <div class='col-12 col-sm-6 col-md-4 col-lg-3 py-2'>
    <div class="card" style='height:100%'>
      <h5 class="card-header">${listing.name}</h5>
      <div class="card-body d-flex flex-column justify-content-between">
        <h6>Address:</h6>
        <p>${listing.street} ${listing.city}, ${listing.state}</p>
        <h6 id='type'>Type: ${listing.brewery_type.charAt(0).toUpperCase() + listing.brewery_type.slice(1)}</h6>
        <a href="${listing.website_url}" target="_blank" class="btn btn-success">Visit Website</a>
      </div>
    </div>
  </div>
  `;
  breweries.insertAdjacentHTML('beforeend', content);
}

// adds pagination buttons
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
  firstButton.classList.add('active-button');

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
      // renderBreweriesByPage(button.textContent);
      renderBreweries(list, button.textContent)
    })
  }
}

// renders brewery listings based on search passed
async function searchEntry(search) {
  const searchLower = search.toLowerCase();

  // filters brewery listings based on search input and re-renders matches
  const filteredBreweries = (await allBreweries()).filter(brewery => {
    if (
      brewery.name.toLowerCase().includes(searchLower) || 
      brewery.street.toLowerCase().includes(searchLower) || 
      brewery.city.toLowerCase().includes(searchLower) || 
      brewery.brewery_type.toLowerCase().includes(searchLower)
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

// renders all breweries, pagination buttons, and activates filterSearch function/event listener
async function main() {
  renderBreweries((await allBreweries()), 1);
  addPagination(await allBreweries());
  filterSearch();
}

// invokes main function upon DOM content loading
window.addEventListener("DOMContentLoaded", main);