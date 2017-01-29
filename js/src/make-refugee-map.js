import * as L from "leaflet";
import "leaflet-providers";
import {scaleSqrt} from 'd3-scale';
import {max} from 'd3-array';
import {format} from 'd3-format';


function makeRefugeeMap(illinoisContainer, chicagoContainer, cities){

	// make scale
    const maxCircleDiameter = 100;
	const dataMax = max(cities, city => parseInt(city.REFUGEES));
    const rScale = scaleSqrt()
        .domain([0, dataMax])
        .range([0, maxCircleDiameter]);


	// Make a new map
	let illinoisMap =  L.map(illinoisContainer,
		{
			center: [40.171886, -88.974864],
			zoom: 6,
			scrollWheelZoom:false,
			maxZoom:16
			// maxBounds:L.latLngBounds(L.latLng(36.590379, -92.133247),L.latLng(42.478624, -87.015605))
		}
	);

	// This is using an npm plugin. Can be adjusted for many map types.
	L.tileLayer.provider('Hydda.Full').addTo(illinoisMap);

	// Make a new map
	let chicagoMap =  L.map(chicagoContainer,
		{
			center: [41.743423, -88.154341],
			zoom: 9,
			scrollWheelZoom:false,
			maxZoom:16
			// maxBounds:L.latLngBounds(L.latLng(36.590379, -92.133247),L.latLng(42.478624, -87.015605))
		}
	);

	// This is using an npm plugin. Can be adjusted for many map types.
	L.tileLayer.provider('Hydda.Full').addTo(chicagoMap);

	// Define the marker for each project
	
	function getIcon(refugees){
		const width = rScale(refugees);
		return L.divIcon({
			className:'city-marker',
			html:`<span class='dot' style='margin:${width/-2}px 0 0 ${width/-2}px;height:${width}px;width:${width}px'></span>`
		});
	}

	// Dots on said map. This is the container.
	let tempMakers = L.layerGroup();
	
	// This is the array of elements from which the marker data will be plucked.
	
	cities.forEach((city, index) => {
		if (index > 0){
			// console.log(city, index);
			let lat = city.COORDINATES.split(',')[0],
				lng = city.COORDINATES.split(',')[1],
				name = city.CITY,
				refugees = parseInt(city.REFUGEES);

			let cityMarker = L.marker(
				{
					lat:parseFloat(lat), 
					lng:parseFloat(lng)
				},
				{
					icon: getIcon(refugees)
				}
			)
			cityMarker.bindTooltip(`<strong>${name}</strong>: ${format(',')(refugees)}`);
			cityMarker.addTo(tempMakers);
		}
	});

	let cityMarkers = tempMakers;
	cityMarkers.addTo(illinoisMap);

	let detailMarkers = tempMakers;
	detailMarkers.addTo(chicagoMap);
}


module.exports = makeRefugeeMap;