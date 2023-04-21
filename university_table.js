const countrySelect = document.getElementById("country-select");
countrySelect.addEventListener("change", handleCountrySelect);

async function handleCountrySelect(event) {
  const selectedCountry = event.target.value;
  if (selectedCountry === ""){
    clearTable();
    return;
  }
  const url =
    selectedCountry === ""
      ? "http://universities.hipolabs.com/search"
      : `http://universities.hipolabs.com/search?country=${selectedCountry}`;

  try {
    const response = await fetch(url);
    const universities = await response.json();
    updateTable(universities);
  } catch (error) {
    console.error(error);
  }
}

async function populateCountries() {
  const url = "http://universities.hipolabs.com/search?country=";
  const response = await fetch(url);
  const universities = await response.json();
  const countries = new Set();
  universities.forEach((university) => {
    if (university.country) {
      countries.add(university.country.toLowerCase());
    }
  });
  const countrySelect = document.getElementById("country-select");
  for (let country of countries) {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country.toUpperCase();
    countrySelect.appendChild(option);
  }
}

function clearTable(){
  const tbody = document.querySelector("#university-table tbody");
  tbody.innerHTML = "";
}

function updateTable(universities) {
  const tbody = document.querySelector("#university-table tbody");
  tbody.innerHTML = "";

  console.log("Updating table with universities:", universities);

  universities.forEach((university) => {
    console.log("Adding row for university:", university);

    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    const webPageCell = document.createElement("td");

    console.log("University name:", university.name);
    console.log("University webpage:", university.web_pages[0]);

    nameCell.textContent = university.name || "-";
    webPageCell.textContent = university.web_pages[0] || "-";

    row.appendChild(nameCell);
    row.appendChild(webPageCell);



    tbody.appendChild(row);
  });
}

populateCountries();
