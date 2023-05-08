# INST377-Project
This repository contains my project for INST377: The University API Visualizations
Here is the link to the Github pages for this project: https://bringit2142.github.io/INST377-Project/

This site runs on most browsers, as well as iOS devices. The home page contains a bar chart of the number of universities in each country.
The about page contains more information about the project and visualizations, and the University Table page contains a dynamic table that 
updates based on the country chosen in the drop-down menu. This page utilizes CSS3 and flexbox, and has a similar layout to the previous labs in the course, providing a simple interface to house the visualizations.

The bar chart utilizes chart.js and the table uses a few event listeners and requests to the API to store the information into localStorage. 
Based on the countries in the API, the drop-down options will update based on the countries listed, and the user will be provided with the name
of each university in the country chosen, plus the website to that university, if applicable. 

This project makes it easier to visualize the different countries and number of universities within them. It provides a better idea of what each country has
to offer in terms of education, while also being able to filter results to fit the need of each user. 

NOTE: This project will not display on GH pages, as this API is from an unsecure site (HTTP) and GH pages only supports secure requests (HTTPS). However, this project will run locally, so it is reccomended to download all of the files and run it using Live Server or a similar application to be able to run HTML locally.
