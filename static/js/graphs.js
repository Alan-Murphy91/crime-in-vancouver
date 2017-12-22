d3.json("/data", function (bsondata) {
	var ndx = crossfilter(bsondata);

	var crimeTypeDim = ndx.dimension(function(d) {
		 return d["TYPE"] ? d["TYPE"] : "" });

	var yearDim = ndx.dimension(function(d) {
		 return d["YEAR"] ? d["YEAR"] : 0 });

	var neighbourhoodDim = ndx.dimension(function(d) {
		 return d["NEIGHBOURHOOD"] ? d["NEIGHBOURHOOD"] : "" });

	var locationDim = ndx.dimension(function(d) {
		 return d["location"] ? d["location"] : "" });

	var allDim = ndx.dimension(function(d) {
		return d;
	})

	var crimeGroup = crimeTypeDim.group();
	var yearGroup = yearDim.group();
	var neighbourhoodGroup = neighbourhoodDim.group();
	var locationGroup = locationDim.group();
	var all = ndx.groupAll();

	var firstX = yearDim.bottom(1)[0]['YEAR'];
	var lastX = yearDim.top(1)[0]['YEAR'];


	var numberRecordsND = dc.numberDisplay("#number-records-nd");
	var chartByYear = dc.barChart("#time-chart");
	//var timeOfDayChart = dc.rowChart("#age-segment-row-chart");
	//var areaChart = dc.rowChart("#phone-brand-row-chart");
	//var locationChart = dc.rowChart("#location-row-chart");	

	numberRecordsND
    .formatNumber(d3.format("d"))
    .valueAccessor(function(d){return d; })
    .group(all);


  	chartByYear
    .width(650)
    .height(140)
    .margins({top: 10, right: 50, bottom: 20, left: 20})
    .dimension(yearDim)
    .group(yearGroup)
    .transitionDuration(500)
    .x(d3.time.scale().domain([firstX, lastX]))
    .elasticY(true)
    .yAxis().ticks(4);


	dc.renderAll();
});