async function fetchUniversities() {
  const url = "http://universities.hipolabs.com/search";

  try {
    const response = await fetch(url);
    const universities = await response.json();
    const universitiesData = universities.reduce((acc, curr) => {
      const country = curr.country;
      acc[country] = acc[country] || 0;
      acc[country]++;
      return acc;
    }, {});

    const ctx = document.getElementById("universitiesChart").getContext("2d");
    const chart = new Chart(ctx, {
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

fetchUniversities();
