// Declare a variable to store the chart object
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

function handleClick() {
  const inputValue = topCountriesInput.value.trim();
  if (inputValue !== '') {
    const universitiesData = JSON.parse(localStorage.getItem('universitiesData'));
    if (universitiesData) {
      const filteredData = filterUniversities(universitiesData, inputValue);
      createChart(filteredData);
    } else {
      fetchUniversities(inputValue);
    }
  } else {
    const universitiesData = JSON.parse(localStorage.getItem('universitiesData'));
    if (universitiesData) {
      createChart(universitiesData);
    } else {
      fetchUniversities();
    }
  }
}

function handleReset() {
  localStorage.removeItem('universitiesData');
  loadUniversities();
}

function loadUniversities() {
  const universitiesData = JSON.parse(localStorage.getItem('universitiesData'));
  if (universitiesData) {
    createChart(universitiesData);
  } else {
    fetchUniversities();
  }
}

function filterUniversities(universitiesData, inputValue) {
  const sortedCountries = Object.keys(universitiesData).sort((a, b) => universitiesData[b] - universitiesData[a]);
  const filteredData = {};
  for (let i = 0; i < inputValue; i++) {
    const country = sortedCountries[i];
    if (country) {
      filteredData[country] = universitiesData[country];
    }
  }
  return filteredData;
}

async function fetchUniversities(topCountries) {
  const url = "http://universities.hipolabs.com/search";

  try {
    const response = await fetch(url);
    const universities = await response.json();
    let universitiesData = universities.reduce((acc, curr) => {
      const country = curr.country;
      acc[country] = acc[country] || 0;
      acc[country]++;
      return acc;
    }, {});

    if (topCountries) {
      universitiesData = filterUniversities(universitiesData, topCountries);
    }

    localStorage.setItem('universitiesData', JSON.stringify(universitiesData));
    console.log(localStorage);
    createChart(universitiesData);
  } catch (error) {
    console.error(error);
  }
}

function createChart(universitiesData) {
  // Destroy the previous chart before creating a new one
  if (universitiesChart !== null) {
    universitiesChart.destroy();
  }

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