const countriesContainer = document.querySelector(".countries-container");
const searchInput = document.getElementById("search");
const regionSelect = document.getElementById("region-filter");
const themeToggle = document.getElementById('theme-toggle');

let allCountries = [];

document.addEventListener('DOMContentLoaded' ,() => {
  // i am checking my local storage for the theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
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











// Fetch all countries

async function getCountries() {
  const res = await fetch("https://restcountries.com/v3.1/all");
  const data = await res.json();
  allCountries = data;
  displayCountries(data);
}

getCountries();


   // Display countries

function displayCountries(countries) {
  countriesContainer.innerHTML = "";

  countries.forEach(country => {
    const card = document.createElement("div");
    card.classList.add("country-card");

    card.innerHTML = `
      <img src="${country.flags.png}" alt="${country.name.common}">
      <div class="info">
        <h3>${country.name.common}</h3>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
      </div>
    `;

    countriesContainer.appendChild(card);
  });
}

   // Search feature

searchInput.addEventListener("input", e => {
  const value = e.target.value.toLowerCase();

  const filtered = allCountries.filter(country =>
    country.name.common.toLowerCase().includes(value)
  );

  displayCountries(filtered);
});

   // Region filter

regionSelect.addEventListener("change", e => {
  const region = e.target.value;

  const filtered =
    region === "all"
      ? allCountries
      : allCountries.filter(country => country.region === region);

  displayCountries(filtered);
});



