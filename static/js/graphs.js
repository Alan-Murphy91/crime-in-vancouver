d3.json("/data", function (bsondata) {
	var ndx = crossfilter(bsondata);

	var parseDate = d3.time.format("%m/%d/%Y").parse;
	
  	bsondata.forEach(function(d) {
		d.date = d["MONTH"].toString() + "/" + d["DAY"].toString() + "/" + d["YEAR"].toString();
	   	d.date = parseDate(d.date);
   });
	
	// var dateDim = ndx.dimension(function(d) {
	// 		return d.date ? d.date : ""
	// })

	var dateDim = ndx.dimension(function(d) {
		return d.date ? d.date : ""
	})

	var crimeTypeDim = ndx.dimension(function(d) {
		 return d["TYPE"] ? d["TYPE"] : "" });

	var yearDim = ndx.dimension(function(d) {
		 return d["YEAR"] ? d["YEAR"] : 0 });

	var hourDim = ndx.dimension(function(d) {
		return d["HOUR"] ? d["HOUR"] : 0 });	

	var neighbourhoodDim = ndx.dimension(function(d) {
		 return d["NEIGHBOURHOOD"] ? d["NEIGHBOURHOOD"] : "" });

	var locationDim = ndx.dimension(function(d) {
		 return d["location"] ? d["location"] : "" });

	var allDim = ndx.dimension(function(d) {
		return d;
	})

	var minDate = dateDim.bottom(1)[0].date;
	var maxDate = dateDim.top(1)[0].date;

	var crimeGroup = crimeTypeDim.group();
	var dateGroup = dateDim.group();
	var yearGroup = yearDim.group();
	var hourGroup = hourDim.group();
	var neighbourhoodGroup = neighbourhoodDim.group();
	var locationGroup = locationDim.group();
	var all = ndx.groupAll();

	var numberOfCrimes = dc.numberDisplay("#number-records-nd");
	var chartByYear = dc.barChart("#time-chart");
	var timeOfDayChart = dc.rowChart("#age-segment-row-chart");
	var crimeChart = dc.rowChart("#phone-brand-row-chart");
	//var areaChart = dc.rowChart("#phone-brand-row-chart");
	var locationChart = dc.rowChart("#location-row-chart");	

	numberOfCrimes
    .formatNumber(d3.format("d"))
    .valueAccessor(function(d){return d; })
    .group(all);


  	chartByYear
    .width(650)
    .height(240)
    .margins({top: 10, right: 50, bottom: 20, left: 20})
    .dimension(dateDim)
    .group(dateGroup)
    .transitionDuration(500)
    .x(d3.time.scale().domain([minDate, maxDate]))
    .elasticY(true)
    .yAxis().ticks(4);

	timeOfDayChart
	.width(300)
	.height(360)
	.dimension(hourDim)
	.group(hourGroup)
	.ordering(function(d) { return -d.value })
	.elasticX(true)
	.xAxis().ticks(4);

	crimeChart
    .width(300)
    .height(360)
        .dimension(crimeTypeDim)
        .group(crimeGroup)
        .ordering(function(d) { return -d.value })
        .elasticX(true)
        .xAxis().ticks(6);

	locationChart
		.width(200)
	  .height(660)
		  .dimension(neighbourhoodDim)
		  .group(neighbourhoodGroup)
		  .ordering(function(d) { return -d.value })
		  .elasticX(true)
		  .labelOffsetY(10)
		  .xAxis().ticks(3);


	var map = L.map('map');
	var drawMap = function(){
		
			map.setView([49.25, -123.12], 11);
			mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
			L.tileLayer(
				'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					attribution: '&copy; ' + mapLink + ' Contributors',
					maxZoom: 15,
				}).addTo(map);
		
			//HeatMap
			var geoData = [];
			_.each(allDim.top(Infinity), function (d) {
				geoData.push([d["Latitude"], d["Longitude"], 1]);
			});
			var heat = L.heatLayer(geoData,{
				radius: 10,
				blur: 20, 
				maxZoom: 1,
			}).addTo(map);
		
		};

	dcCharts = [numberOfCrimes, chartByYear, timeOfDayChart, crimeChart, locationChart];
		
		_.each(dcCharts, function (dcChart) {
			dcChart.on("filtered", function (chart, filter) {
				map.eachLayer(function (layer) {
				  map.removeLayer(layer)
				}); 
			drawMap();
			});
		});	

	drawMap();
	dc.renderAll();
});