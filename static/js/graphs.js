d3.json("/data", function (bsondata) {
	var ndx = crossfilter(bsondata);

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

	var crimeGroup = crimeTypeDim.group();
	var yearGroup = yearDim.group();
	var hourGroup = hourDim.group();
	var neighbourhoodGroup = neighbourhoodDim.group();
	var locationGroup = locationDim.group();
	var all = ndx.groupAll();

	var firstX = yearDim.bottom(1)[0]['YEAR'];
	var lastX = yearDim.top(1)[0]['YEAR'];
	console.log(lastX);

	var numberRecordsND = dc.numberDisplay("#number-records-nd");
	var chartByYear = dc.barChart("#time-chart");
	var timeOfDayChart = dc.rowChart("#age-segment-row-chart");
	var crimeChart = dc.rowChart("#phone-brand-row-chart");
	//var areaChart = dc.rowChart("#phone-brand-row-chart");
	var locationChart = dc.rowChart("#location-row-chart");	

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
    .x(d3.time.scale().domain([2013, 2017]))
    .elasticY(true)
    .yAxis().ticks(4);

	timeOfDayChart
	.width(300)
	.height(310)
	.dimension(hourDim)
	.group(hourGroup)
	.ordering(function(d) { return -d.value })
	.elasticX(true)
	.xAxis().ticks(4);

	crimeChart
    .width(300)
    .height(310)
        .dimension(crimeTypeDim)
        .group(crimeGroup)
        .ordering(function(d) { return -d.value })
        .elasticX(true)
        .xAxis().ticks(6);

	locationChart
		.width(200)
	  .height(510)
		  .dimension(neighbourhoodDim)
		  .group(neighbourhoodGroup)
		  .ordering(function(d) { return -d.value })
		  .elasticX(true)
		  .labelOffsetY(10)
		  .xAxis().ticks(4);

	dc.renderAll();
});