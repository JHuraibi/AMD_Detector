// Look into transform (e.g. skewX). Possibly able to draw the chart normally then just scale it down.

/* globals Chart:false, feather:false */

(function () {
	'use strict'

	feather.replace()

	// Graphs
	var ctx = document.getElementById('myChart')
	// eslint-disable-next-line no-unused-vars
	var myChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: [
				'January', 'Februrary', 'March', 'April',
				'May', 'June', 'July', 'August',
				'September', 'October (Current)'
			],
			datasets: [{
				data: [
					202, 189, 163, 175, 144, 60, 45, 42, 37, 20
				],
				lineTension: 0,
				backgroundColor: 'transparent',
				borderColor: '#007bff',
				borderWidth: 4,
				pointBackgroundColor: '#007bff'
			}]
		},
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: false
					}
				}]
			},
			legend: {
				display: false
			}
		}
	})
}())

// fillRect(x, y, width, height)
function drawFullBars(chartID, parentSize) {
	let canvas = document.getElementById(chartID);
	let context = canvas.getContext('2d');

	let barW = 2;

	let xLocations = [25, 100];
	let yLocations = [50, 150];

	for (let i = 0; i < xLocations.length; i++) {
		let xPos = xLocations[i];
		context.fillRect(xPos, 0, barW, parentSize);
		// console.log("X: " + xPos);

	}
}