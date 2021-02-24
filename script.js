const breweries = document.querySelector('.breweries');
const breweryListings = document.querySelector('.breweries').children;

// retrieves brewery data and renders all breweries on webpage
async function renderAllBreweries() {
  const results = await axios.get("https://api.openbrewerydb.org/breweries?by_state=virginia");  
  results.data.forEach(brewery => {
    renderOneBrewery(brewery);
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

// renders brewery listings based on search passed
function searchByName(search) {
  const searchLower = search.toLowerCase();
  for (let brewery of breweryListings) {
    const breweryName = brewery.querySelector('.card-header').textContent.toLowerCase();
    const breweryAddress = brewery.querySelector('.card-body p').textContent.toLowerCase();
    const breweryType = brewery.querySelector('.card-body #type').textContent.toLowerCase();
    if ( !breweryName.includes(searchLower) && !breweryAddress.includes(searchLower) && !breweryType.includes(searchLower) ) {
      brewery.classList.add("hidden");
    } else {
      brewery.classList.remove("hidden");
    }
  }
}

function filterSearch() {
  // selects search bar
  const searchInput = document.querySelector('input');

  // filters list of breweries by search input
  searchInput.addEventListener('keyup', (event) => {
    const input = searchInput.value;
    searchByName(input);
  })
}

function main() {
  renderAllBreweries();
  filterSearch();
}

window.addEventListener("DOMContentLoaded", main);