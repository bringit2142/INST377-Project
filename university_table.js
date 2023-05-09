// Get reference to country select element and add change event listener
const countrySelect = document.getElementById("country-select");
countrySelect.addEventListener("change", handleCountrySelect);

// Function to handle country select change event
async function handleCountrySelect(event) {
  // Get the selected country value
  const selectedCountry = event.target.value;
  // If selected country is empty, clear the table and return
  if (selectedCountry === "") {
    clearTable();
    return;
  }

  // Declare variable to hold universities data
  let universities;
  // Check if universities data exists in localStorage, if yes, parse it
  const localStorageData = localStorage.getItem("universities");
  if (localStorageData) {
    universities = JSON.parse(localStorageData);
  } else {
    // If no, fetch universities data from the API and set it in localStorage
    const url = "http://universities.hipolabs.com/search";
    try {
      const response = await fetch(url);
      universities = await response.json();
      localStorage.setItem("universities", JSON.stringify(universities));
    } catch (error) {
      console.error(error);
      return;
    }
  }

  // Filter universities by selected country and update the table with filtered data
  const filteredUniversities = universities.filter(
    (university) =>
      university.country &&
      university.country.toLowerCase() === selectedCountry.toLowerCase()
  );
  updateTable(filteredUniversities);
}

// This function populates a dropdown menu with a list of countries that have universities, using data from an external API and the browser's local storage
async function populateCountries() {
  const url = "http://universities.hipolabs.com/search";
  let universities;

  // Check if data is already stored in local storage
  const localStorageData = localStorage.getItem("universities");
  if (localStorageData) {
    universities = JSON.parse(localStorageData);
  } else {
    // Fetch data from external API if not in local storage and save it in local storage for future use
    try {
      const response = await fetch(url);
      universities = await response.json();
      localStorage.setItem("universities", JSON.stringify(universities));
    } catch (error) {
      console.error(error);
      return;
    }
  }

  // Create a Set of unique country names from the universities data
  const countries = new Set();
  universities.forEach((university) => {
    if (university.country) {
      countries.add(university.country.toLowerCase());
    }
  });

  // Populate the dropdown menu with options for each country
  const countrySelect = document.getElementById("country-select");
  for (let country of countries) {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country.toUpperCase();
    countrySelect.appendChild(option);
  }
}

// This function clears the content of the table body.
function clearTable() {
  const tbody = document.querySelector("#university-table tbody");
  tbody.innerHTML = "";
}

// This function updates the content of the table with the provided universities.
function updateTable(universities) {
  const tbody = document.querySelector("#university-table tbody");
  tbody.innerHTML = "";

  // Log the universities being added to the table.
  console.log("Updating table with universities:", universities);

  universities.forEach((university) => {
    // Log the university being added to the table.
    console.log("Adding row for university:", university);

    // Create new table row and table data cells for name and web page.
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    const webPageCell = document.createElement("td");

    // Log the name and webpage of the university.
    console.log("University name:", university.name);
    console.log("University webpage:", university.web_pages[0]);

    // Add the university's name and webpage to the corresponding cells.
    nameCell.textContent = university.name || "-";
    webPageCell.textContent = university.web_pages[0] || "-";

    // Append the cells to the row and the row to the table body.
    row.appendChild(nameCell);
    row.appendChild(webPageCell);
    tbody.appendChild(row);
  });
}

// Call populateCountries function to initialize the page.
populateCountries();
