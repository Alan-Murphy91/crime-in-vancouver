d3.json("/data", function (bsondata) {
	var ndx = crossfilter(bsondata);

	var parseDate = d3.time.format("%m/%d/%Y").parse;
	
  	bsondata.forEach(function(d) {
		d.date = d["MONTH"].toString() + "/" + d["DAY"].toString() + "/" + d["YEAR"].toString();
	   	d.date = parseDate(d.date);
   });

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

	var numberOfCrimes = dc.numberDisplay("#numberOfCrimes");
	var chartByYear = dc.barChart("#chartByYear");
	var timeOfDayChart = dc.pieChart("#timeOfDayChart");
	var crimeChart = dc.rowChart("#crimeChart");
	var locationChart = dc.rowChart("#locationChart");	

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
	.colors(['#52FDE7'])
    .yAxis().ticks(4);

	timeOfDayChart
	.width(400)
	.height(360)
	.radius(160)
	.innerRadius(45)
	.dimension(hourDim)
	.group(hourGroup)
	//.ordering(function(d) { return -d.value })
	.colors(d3.scale.ordinal().range(['#FDB592','#FEE29E','#50EFDA', '#692D8D', '#D564AB']))
	// .label(function (d) {
	// 	if (timeOfDayChart.hasFilter() && !timeOfDayChart.hasFilter(d.key)) {
	// 		return d.key + '(0%)';
	// 	}
	// 	var label = d.key;
	// 	if (all.value()) {
	// 		label += '(' + Math.floor(d.value / all.value() * 100) + '%)';
	// 	}
	// 	return label;
	// })
	.on('renderlet', function (chart) {
		chart.select("svg > g").attr("transform", "translate(200,170)");
	})
	.drawPaths(true)
	.externalRadiusPadding(60)
	.minAngleForLabel(0)
	.externalLabels(40)
	.renderLabel(true);

	crimeChart
    .width(300)
    .height(360)
        .dimension(crimeTypeDim)
        .group(crimeGroup)
		.ordering(function(d) { return -d.value })
		.colors(d3.scale.ordinal().range(['#51F5E0']))
        .elasticX(true)
        .xAxis().ticks(6);

	locationChart
		.width(200)
	  .height(655)
		  .dimension(neighbourhoodDim)
		  .group(neighbourhoodGroup)
		  .ordering(function(d) { return -d.value })
		  .elasticX(true)
		  .colors(d3.scale.ordinal().range(['#FDB592','#FEE29E','#50EFDA', '#692D8D', '#D564AB']))
		  .labelOffsetY(10)
		  .xAxis().ticks(3);

	var map = L.map('map');
	var drawMap = function(){
		
			map.setView([49.25, -123.12], 12);
			mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
			L.tileLayer(
				'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					attribution: '&copy; ' + mapLink + ' Contributors',
					maxZoom: 15,
				}).addTo(map);
		
			var geoData = [];
			_.each(allDim.top(Infinity), function (d) {
				geoData.push([d["Latitude"], d["Longitude"], 1]);
			});
			var heat = L.heatLayer(geoData,{
				radius: 9,
				blur: 25, 
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