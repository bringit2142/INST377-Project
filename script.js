/// Declare a variable to store the chart object
let universitiesChart = null;

// Add event listener to checkbox and input elements
const topCountriesButton = document.getElementById("top-countries-button");
const topCountriesInput = document.getElementById("top-countries-input");
const resetButton = document.getElementById("reset-button");

// Call loadUniversities() function on page load
loadUniversities();

// Add event listeners to load and reset buttons
topCountriesButton.addEventListener("click", handleClick);
resetButton.addEventListener("click", handleReset);

// Function to handle click event on the "Show Top Universities" button
function handleClick() {
  // Get the input value and remove any leading/trailing white space
  const inputValue = topCountriesInput.value.trim();

  // Check if input value is not empty
  if (inputValue !== "") {
    // Try to get universities data from localStorage
    const universitiesData = JSON.parse(
      localStorage.getItem("universitiesData")
    );
    if (universitiesData) {
      // Filter the universities data based on the input value
      const filteredData = filterUniversities(universitiesData, inputValue);
      // Create the chart using the filtered data
      createChart(filteredData);
    } else {
      // If universities data not found in localStorage, fetch it from the API
      fetchUniversities(inputValue);
    }
  } else {
    // If input value is empty, show all universities
    const universitiesData = JSON.parse(
      localStorage.getItem("universitiesData")
    );
    if (universitiesData) {
      // Create the chart using all universities data
      createChart(universitiesData);
    } else {
      // If universities data not found in localStorage, fetch it from the API
      fetchUniversities();
    }
  }
}

// Function to handle click event on the "Reset" button
function handleReset() {
  // Remove universities data from localStorage
  localStorage.removeItem("universitiesData");
  // Load universities data from API and create chart
  loadUniversities();
}

// Function to load universities data
function loadUniversities() {
  // Try to get universities data from localStorage
  const universitiesData = JSON.parse(localStorage.getItem("universitiesData"));
  if (universitiesData) {
    // If universities data found in localStorage, create chart using it
    createChart(universitiesData);
  } else {
    // If universities data not found in localStorage, fetch it from the API
    fetchUniversities();
  }
}

// This function filters universities data based on the number of top countries requested
function filterUniversities(universitiesData, inputValue) {
  // Sorts the countries in descending order based on the number of universities
  const sortedCountries = Object.keys(universitiesData).sort(
    (a, b) => universitiesData[b] - universitiesData[a]
  );
  // Creates a new object to store the filtered data
  const filteredData = {};
  // Iterates through the sorted list of countries and adds data to the filtered data object up to the input value
  for (let i = 0; i < inputValue; i++) {
    const country = sortedCountries[i];
    if (country) {
      filteredData[country] = universitiesData[country];
    }
  }
  // Returns the filtered data object
  return filteredData;
}

// Asynchronous function to fetch data from API
async function fetchUniversities(topCountries) {
  const url = "http://universities.hipolabs.com/search";

  try {
    const response = await fetch(url);
    const universities = await response.json();

    // Reduce array of universities to an object with countries as keys and counts of universities as values
    let universitiesData = universities.reduce((acc, curr) => {
      const country = curr.country;
      acc[country] = acc[country] || 0;
      acc[country]++;
      return acc;
    }, {});

    // If topCountries is specified, filter the universitiesData to only include the top countries
    if (topCountries) {
      universitiesData = filterUniversities(universitiesData, topCountries);
    }

    // Store the universitiesData in local storage as a JSON string
    localStorage.setItem("universitiesData", JSON.stringify(universitiesData));
    console.log(localStorage);

    // Create a chart using the universitiesData
    createChart(universitiesData);
  } catch (error) {
    console.error(error);
  }
}

// Function to create a chart using the given universitiesData object
function createChart(universitiesData) {
  // Destroy the previous chart before creating a new one
  if (universitiesChart !== null) {
    universitiesChart.destroy();
  }

  // Get the canvas element and create a new Chart object using the universitiesData
  const ctx = document.getElementById("universitiesChart").getContext("2d");
  universitiesChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(universitiesData),
      datasets: [
        {
          label: "Number of Universities",
          data: Object.values(universitiesData),
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        xAxes: [
          {
            ticks: {
              barPercentage: 0.9,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
}
