import * as d3 from 'd3';
import * as _ from 'underscore';


(function(window, d3, _){
	function sizeBars(nation, scale){
		
		// Find the specific container we need.
		const chart = d3.select(`.nation[data-nation="${nation}"] .nation__chart`);
		
		// Filter the data to just the row we need.
		const data = _.filter(window.data, num => {
			return num.NATION_ID == nation ? true : false;
		})[0]
		
		// console.log(nation, data);

		// Go through each of the years, append a bar and size it's width
		for (var i = 2007; i <= 2017; i++){
			 let width = scale(parseInt(data[`CY_${i}`]));
			 console.log();
			 chart.append('div')
			 	.classed('bar', true)
			 	.append('div')
				 	.attr('style', `width:${width}%`);
		}

	}

	window.onload = function(){

		// First, find the largest single year and use it to generate a d3 scale;
		const max = d3.max(window.data, nation => {
			let tempMax = 0;
			for (var i = 2007; i <= 2017; i++){
				if (nation[`CY_${i}`] > tempMax) tempMax = nation[`CY_${i}`];
			}
			return tempMax;
		})

		const scale = d3.scaleLinear()
			.range([0,100])
			.domain([0, max])

		const nations = document.querySelectorAll('.nation');

		nations.forEach( n => {
			const nation = n.dataset.nation;
			sizeBars(nation, scale);
		})	
	}
})(window, d3, _);