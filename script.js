const themeToggle = document.getElementById('theme-toggle');
let allCountriesData = [];

document.addEventListener('DOMContentLoaded' ,() => {
  // i am checking my local storage for the theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }

  //Determine which page we are on
  if (document.getElementById('countries-grid')) {
        // We are on index.html
        initHomePage();
    } else if (document.getElementById('country-detail')) {
        // We are on detail.html
        initDetailPage();
    }
})

// Theme toggle (Light/Dark)

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  // Saving what mode we are in to local storage
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem('theme', 'dark')
  } else {
    localStorage.setItem('theme', 'light')
  }
});

// Create components so the homepage can function
// create a function for initHomepage (async so i can give the script time to gather the data)

async function initHomePage() {
  try{
    const reponse = await fetch('data.json');
    allCountriesData = await reponse.json();
    // render of all countries ( where all raw data and facts  make a complete version of it (make it look good))
    renderCountries(allCountriesData);

    // variables for the seach and filter event listener
    const searchInput = document.getElementById ('search-input');
    const regionFilter = document.getElementById ('region-filter');

    // search event listener
    searchInput.addEventListener('input',(e) => {
      const searchTerm = e.target.value.toLowerCase();
      const regionValue = regionFilter.value;
      filterCountries(searchTerm, regionValue);
    });
    
    // filter event listener
    regionFilter.addEventListener('change',(e) => {
      const searchTerm = searchInput.value.toLowerCase();
      const regionValue = e.target.value;
      filterCountries(searchTerm, regionValue);
    });

  } catch(error) {
    console.error('Error fecthing data:', error);
  }
  
}

// create a function to render county cards to the grid

function renderCountries(countries) {
    // find the container where this belong which is referenced in my html file with the countries-grid id
    const grid = document.getElementById('countries-grid');
    grid.innerHTML = ''; // Clear existing content

    // loop through all all the countries
    countries.forEach(country => {
        //create the card element
        const card = document.createElement('div');
        card.classList.add('country-card');
        
        // When clicked, navigate to detail.html with the country name as a URL parameter
        card.addEventListener('click', () => {
            // Encode the name to handle special characters or spaces safely 
            window.location.href = `detail.html?name=${encodeURIComponent(country.name)}`;
        });

        // fill each card with this html
        card.innerHTML = `
            <img src="${country.flags.png}" alt="${country.name} Flag" class="country-flag">
            <div class="card-body">
                <h2 class="country-name">${country.name}</h2>
                <div class="card-info">
                    <p>Population: <span>${country.population.toLocaleString()}</span></p>
                    <p>Region: <span>${country.region}</span></p>
                    <p>Capital: <span>${country.capital || 'N/A'}</span></p>
                </div>
            </div>
        `;

        //add the card to the page
        grid.appendChild(card);
    });
}


//function to filter countries based on search term and region
function filterCountries(searchTerm, region) {
    const filtered = allCountriesData.filter(country => {
        const matchesSearch = country.name.toLowerCase().includes(searchTerm);
        const matchesRegion = region === '' || country.region === region;
        return matchesSearch && matchesRegion;
    });
    renderCountries(filtered);
}


// create components for detail page

//create initDetail page (async so i can give the script time to gather the data)
async function initDetailPage() {
    try {

        const response = await fetch('data.json');
        allCountriesData = await response.json();

        // Get the country name from the URL query string
        const urlParams = new URLSearchParams(window.location.search);
        const countryName = urlParams.get('name');
        // once it get the country name it will find the data for that country and if its there it will render the details by calling the render country detail
        if (countryName) {
            const country = allCountriesData.find(c => c.name === countryName);
            if (country) {
                renderCountryDetail(country);
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
// create render for detail page
function renderCountryDetail(country) {
    // find the container on the html
    const container = document.getElementById('country-detail');
    
    //This help with data variations incase the format changes. if its a string it uses the native name
    //if it is missing it will use the standard name so that the field isnt empty
    const nativeName = country.nativeName || country.name;
    
    // Currencies and languages mapping - in data json there are arrays of different items. This will map each item and only extract the name property from each
    //combine each item of the list into a single string seperated by commas if a country have multiple currencies (usd, euro)
    //if there is none then it return n/a
    const currencies = country.currencies ? country.currencies.map(c => c.name).join(', ') : 'N/A';
    const languages = country.languages ? country.languages.map(l => l.name).join(', ') : 'N/A';

    // Borders (bordering countries) mapping - convert the 3 letter alpha code from data.json convert it to a clickable button with the country name 
    // so it will get FRA look for it once it find a match pull the name and create a button with that name (France)
    // assume nothing is there
    let borderButtons = 'None';

    // it takes 3 letter code search through list for what matches and return the name for it
    if (country.borders && country.borders.length > 0) {
        borderButtons = country.borders.map(borderCode => {
            // Find full name from the alpha3Code
            const borderCountry = allCountriesData.find(c => c.alpha3Code === borderCode);
            const borderName = borderCountry ? borderCountry.name : borderCode;
            // Create a button that links to that country
            return `<button class="border-btn" onclick="window.location.href='detail.html?name=${encodeURIComponent(borderName)}'">${borderName}</button>`;
        }).join(' ');
    }

    container.innerHTML = `
        <div class="detail-flag">
            <img src="${country.flags.svg}" alt="${country.name} Flag">
        </div>
        <div class="detail-info">
            <h2 class="detail-name">${country.name}</h2>
            <div class="info-columns">
                <div class="info-col">
                    <p>Native Name: <span>${nativeName}</span></p>
                    <p>Population: <span>${country.population.toLocaleString()}</span></p>
                    <p>Region: <span>${country.region}</span></p>
                    <p>Sub Region: <span>${country.subregion}</span></p>
                    <p>Capital: <span>${country.capital || 'N/A'}</span></p>
                </div>
                <div class="info-col">
                    <p>Top Level Domain: <span>${country.topLevelDomain}</span></p>
                    <p>Currencies: <span>${currencies}</span></p>
                    <p>Languages: <span>${languages}</span></p>
                </div>
            </div>
            <div class="border-countries">
                <strong>Border Countries:</strong>
                ${borderButtons}
            </div>
        </div>
    `;
}






