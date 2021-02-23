const breweries = document.querySelector('.breweries');

// retrieves brewery data and renders all breweries on webpage
const listAllBreweries = async () => {
  const results = await axios.get("https://api.openbrewerydb.org/breweries?by_state=virginia").then(({data}) => data);

  for (let i = 0; i < results.length; i++) {
    const content = `
    <div class='col-6 col-md-3 py-2'>
      <div class="card" style='height:100%'>
        <h5 class="card-header">${results[i].name}</h5>
        <div class="card-body d-flex flex-column justify-content-between">
          <h6>Address:</h6>
          <p>${results[i].street} ${results[i].city}, ${results[i].state}</p>
          <h6>Type: ${results[i].brewery_type.charAt(0).toUpperCase() + results[i].brewery_type.slice(1)}</h6>
          <a href="${results[i].website_url}" target="_blank" class="btn btn-success">Visit Website</a>
        </div>
      </div>
    </div>
    `;
    breweries.insertAdjacentHTML('beforeend', content);
  }
}

// renders brewery listings based on search passed
async function searchByName(search) {
  const results = await axios.get("https://api.openbrewerydb.org/breweries?by_state=virginia").then(({data}) => data);

  const list = [];
  const searchLower = search.toLowerCase();
  for (let i = 0; i < results.length; i++) {
    const name = results[i].name.toLowerCase();
    const type = results[i].brewery_type.toLowerCase();
    const city = results[i].city.toLowerCase();
    if ( name.includes(searchLower) || type.includes(searchLower) || city.includes(searchLower) ) {
      const content = `
        <div class='col-6 col-md-3 py-2'>
          <div class="card" style='height:100%'>
            <h5 class="card-header">${results[i].name}</h5>
            <div class="card-body d-flex flex-column justify-content-between">
              <h6>Address:</h6>
              <p>${results[i].street} ${results[i].city}, ${results[i].state}</p>
              <h6>Type: ${results[i].brewery_type.charAt(0).toUpperCase() + results[i].brewery_type.slice(1)}</h6>
              <a href="${results[i].website_url}" target="_blank" class="btn btn-success">Visit Website</a>
            </div>
          </div>
        </div>
      `;
      list.push(content);
    }
  }
  breweries.innerHTML = list.join('');
}

// selects search bar
const searchInput = document.querySelector('input');

// filters list of breweries by search input
searchInput.addEventListener('keyup', (event) => {
  const input = searchInput.value;
  searchByName(input);
})

function main() {
  listAllBreweries();
}

window.addEventListener("DOMContentLoaded", main);