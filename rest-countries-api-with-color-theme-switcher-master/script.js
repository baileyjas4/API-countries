const themeToggle = document.getElementById('theme-toggle');
let allCountriesData = [];

document.addEventListener('DOMContentLoaded' ,() => {
  // i am checking my local storage for the theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
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
// create a function for initHomepage

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

//create initDetail page

// create render for detail page







