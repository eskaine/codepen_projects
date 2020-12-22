/*Reference
        http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
        */

var dataURL = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";

var width = 1200;
var height = 750;
var margin = {
  title: {x: width / 2,y: 50},
  chart: { x: 75,y: 100 },
  ytext: {x: 30, y: -215},
  tooltip: {x: 10,y: 50},
  description: { x: 125,y: 680 }
};

var x = d3.scaleTime();
var y = d3.scaleLinear();

var axisX = d3.axisBottom(x)
  .ticks(d3.timeYear.every(5));

var axisY = d3.axisLeft(y);

var canvas = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var text = canvas.append("g");

//Chart Title
text.append("text")
  .attr("x", margin.title.x)
  .attr("y", margin.title.y)
  .attr("class", "title")
  .text("Gross Domestic Product");

//Chart description
var description = text.append("foreignObject")
  .attr("x", margin.description.x)
  .attr("y", margin.description.y)
  .attr("class", "description");

var chart = canvas.append("g")
  .attr("transform", "translate(" + margin.chart.x + "," + margin.chart.y + ")");

//Axis y label text
chart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", margin.ytext.y)
    .attr("y", margin.ytext.x)
    .text("Gross Domestic Product, USA");

var tooltip = d3.select("body")
  .append("text")
  .attr("class", "tooltip");

//Tooltip GDP text
var tipGDP = tooltip.append("div")
  .attr("class", "gdp-text");

//Tooltip date text
var tipDate = tooltip.append("div");

d3.json(dataURL, function(data) {

  var dataArray = data.data;
  var colWidth = 4;
  var colHeight = 35;
  var chartWidth = dataArray.length * colWidth;
  var chartHeight = dataArray[dataArray.length - 1][1] / colHeight;

  description.text(data.description);

  x.domain([new Date(dataArray[0][0]), new Date(dataArray[dataArray.length - 1][0])])
    .range([0, chartWidth]);

  y.domain([0, dataArray[dataArray.length - 1][1]])
    .range([chartHeight, 0]);

  chart.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + chartHeight + ")")
    .call(axisX);

  chart.append("g")
    .attr("class", "axis")
    .call(axisY);

  //Bar chart
  var bars = chart.selectAll("rect")
    .data(dataArray)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
      return i * colWidth;
    })
    .attr("y", function(d, i) {
      return y(d[1]);
    })
    .attr("width", colWidth + 1)
    .attr("height", function(d) {
      return chartHeight - y(d[1]);
    });

  //Bar chart mouseover functions
  bars.on("mouseover", function(d) {
      tipGDP.text(function() {
        return "$" + d[1] + "0 Billion";
      });
      tipDate.text(function() {
        var timeFormat = d3.timeFormat("%Y %B");
        return timeFormat(new Date(d[0]));
      });
      tooltip.style("opacity", "1");
    })
    .on("mousemove", function() {
      tooltip.style("left", (d3.event.pageX + margin.tooltip.x) + "px")
        .style("top", (d3.event.pageY - margin.tooltip.y) + "px");
    })
    .on("mouseout", function() {
      tooltip.style("opacity", "0");
    });

});