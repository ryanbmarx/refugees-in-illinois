import {append, select} from 'd3-selection';
import {max} from 'd3-array';
import {scaleLinear} from 'd3-scale';
import filter from 'lodash.filter';
import debounce from 'lodash.debounce';


(function(window, filter, debounce, max, scaleLinear, append, select){

	function formatYear(year){
		// Format a year into a two-digit format
		let formattedYear = year-2000;
		return formattedYear < 10 ? `'0${formattedYear}` : `'${formattedYear}`;
	}

	function sizeBars(nation, scale){
		
		// Find the specific container we need.
		const chart = select(`.nation[data-nation="${nation}"] .nation__chart`);
		
		// Filter the data to just the row we need.
		const data = filter(window.data, num => {
			return num.NATION_ID == nation ? true : false;
		})[0]
		

		// Go through each of the years, append a bar and size it's width
		for (var i = 2007; i <= 2017; i++){
			 let width = scale(parseInt(data[`CY_${i}`]));
			 
			 let tempBar = chart.append('div')
			 	.classed('bar', true)
			 	.append('div')
				 	.attr('style', `width:${width}%`);

				if (i % 2 != 0){
					tempBar.append('span')
						.text(formatYear(i))
						.classed('bar__year',true);
				}
		}

	}

	function resizeCharts(){

		// Since we're already using javascipt, let's add a little more finesse
		// to the chart sizing by monitoring the container width.

		const 	nations = document.getElementById('nations'),
				width = nations.getBoundingClientRect().width;

		if ( width < 475){
			nations.classList = 'nations nations--1-across';
		} else if (width < 700) { 
			nations.classList = 'nations nations--2-across';
		} else if (width < 975) { 
			nations.classList = 'nations nations--3-across';
		} else { 
			nations.classList = 'nations nations--4-across';

		} 
	}

	window.onload = function(){
		resizeCharts();
		// First, find the largest single year and use it to generate a d3 scale;
		const dataMax = max(window.data, nation => {
			let tempMax = 0;
			for (var i = 2007; i <= 2017; i++){
				if (nation[`CY_${i}`] > tempMax) tempMax = nation[`CY_${i}`];
			}
			return tempMax;
		})

		const scale = scaleLinear()
			.range([0,100])
			.domain([0, dataMax])

		const nations = document.querySelectorAll('.nation');

		nations.forEach( n => {
			const nation = n.dataset.nation;
			sizeBars(nation, scale);
		})	
	}

	let lazyLayout = debounce(resizeCharts, 400)
	window.onresize = lazyLayout;

})(window, filter, debounce, max, scaleLinear, append, select);