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

// create a function for initHomepate

// create a function to render county cards to the grid


//function to filter countries based on search term and region



// create components for detail page

//create initDetail page

// create render for detail page







