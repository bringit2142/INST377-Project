// Declare a variable to store the chart object
let universitiesChart = null;

// Add event listener to checkbox and input elements
const topCountriesButton = document.getElementById("top-countries-button");
const topCountriesInput = document.getElementById("top-countries-input");
const resetButton = document.getElementById("reset-button");

// Call fetchUniversities() function on page load
fetchUniversities();

// Add event listeners to load and reset buttons
topCountriesButton.addEventListener("click", handleClick);
resetButton.addEventListener("click", handleReset);

function handleClick() {
  const inputValue = topCountriesInput.value.trim();
  if (inputValue !== '') {
    fetchUniversities(inputValue);
  } else {
    fetchUniversities();
  }
}

function handleReset() {
  fetchUniversities();
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
      const sortedCountries = Object.keys(universitiesData).sort(
        (a, b) => universitiesData[b] - universitiesData[a]
      );
      const topCountriesData = {};
      for (let i = 0; i < topCountries; i++) {
        const country = sortedCountries[i];
        topCountriesData[country] = universitiesData[country];
      }
      universitiesData = topCountriesData;
    }

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
  } catch (error) {
    console.error(error);
  }
}