var dataURL =
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

var width = 1180;
var height = 720;
var margin = {
  header: { x: 375, y: 50 },
  subtitle: { x: 50, y: 30 },
  chart: { x: 125, y: 120 },
  legend: { x: 700, y: 440 },
  legendND: { x: 0, y: 25 },
  legendtext: { x: 10, y: 5 },
  nametext: { x: 10, y: 4 },
  xtext: { x: 360, y: 570 },
  ytext: { x: -60, y: -300 },
  tooltip: { x: 20, y: 20 }
};

var x = d3.scaleTime();
var y = d3.scaleLinear();

var axisX = d3
  .axisBottom(x)
  .ticks(d3.timeSecond.every(30))
  .tickFormat(d3.timeFormat("%M:%S"));

var axisY = d3.axisLeft(y);

var canvas = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var header = canvas
  .append("g")
  .attr(
    "transform",
    "translate(" + margin.header.x + "," + margin.header.y + ")"
  );

//Title
header
  .append("text")
  .attr("class", "title")
  .text("Doping in Professional Biking");

//Sub-Title
header
  .append("text")
  .attr(
    "transform",
    "translate(" + margin.subtitle.x + "," + margin.subtitle.y + ")"
  )
  .attr("class", "subtitle")
  .text("(Alpe d'Huez - Top 35 Cyclists)");

//Create chart group
var chart = canvas
  .append("g")
  .attr(
    "transform",
    "translate(" + margin.chart.x + "," + margin.chart.y + ")"
  );

//Axes label text
var axisLabel = chart.append("g");

//Axis x label
axisLabel
  .append("text")
  .attr("class", "textsize")
  .attr("x", margin.xtext.x)
  .attr("y", margin.xtext.y)
  .text("Minutes Behind Fastest Time");

//Axis y label
axisLabel
  .append("text")
  .attr("class", "textsize")
  .attr("transform", "rotate(-90)")
  .attr("x", margin.ytext.y)
  .attr("y", margin.ytext.x)
  .text("Ranking");

//Legend
var legend = chart
  .append("g")
  .attr(
    "transform",
    "translate(" + margin.legend.x + "," + margin.legend.y + ")"
  );

var legendDope = legend.append("g");

//Legend: dope icon
legendDope.append("circle").attr("class", "dope").attr("r", 5);

//Legend: dope text
legendDope
  .append("text")
  .attr(
    "transform",
    "translate(" + margin.legendtext.x + "," + margin.legendtext.y + ")"
  )
  .text("With doping allegations");

var legendNoDope = legend
  .append("g")
  .attr(
    "transform",
    "translate(" + margin.legendND.x + "," + margin.legendND.y + ")"
  );

//Legend: no dope icon
legendNoDope.append("circle").attr("class", "nodope").attr("r", 5);

//Legend: no dope text
legendNoDope
  .append("text")
  .attr(
    "transform",
    "translate(" + margin.legendtext.x + "," + margin.legendtext.y + ")"
  )
  .text("Without doping allegations");

//Tooltip
var tooltip = d3.select("body").append("text").attr("class", "tooltip");
var tipName = tooltip.append("div");
var tipTime = tooltip.append("div").attr("class", "tiptime");
var tipDope = tooltip.append("div");

//Data parsing and processing
d3.json(dataURL, function(data) {
  var chartLength = 900;
  var chartHeight = 500;

  var timeOffset = 10;
  var rankOffset = 3;
  var msPerSec = 1000;

  //Using the fastest time as a base, get the difference between the fastest time and all other time
  var minTime = Number(data[0].Seconds - data[0].Seconds);
  var maxTime =
    Number(data[data.length - 1].Seconds - data[0].Seconds) + timeOffset;

  //Spacing between scatterplot
  var spacingX = chartLength / maxTime; //seconds
  var spacingY = chartHeight / (data.length + rankOffset);

  //Set x axis
  x
    .domain([new Date(maxTime * msPerSec), new Date(minTime * msPerSec)])
    .range([0, chartLength]);

  //Set y axis
  y
    .domain([data[0].Place, data[data.length - 1].Place + rankOffset])
    .range([0, chartHeight]);

  //X axis
  chart
    .append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + chartHeight + ")")
    .call(axisX);

  //Y axis
  chart.append("g").attr("class", "axis").call(axisY);

  //Scatterplot
  var plot = chart
    .append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", function(d) {
      var color = "dope";
      if (d.Doping === "") {
        color = "nodope";
      }
      return color;
    })
    .attr("r", 5)
    .attr("cx", function(d) {
      return chartLength - (d.Seconds - data[0].Seconds) * spacingX;
    })
    .attr("cy", function(d) {
      return d.Place * spacingY;
    });

  //Scatterplot name label
  chart
    .append("g")
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "name")
    .attr("x", function(d) {
      return (
        chartLength -
        (d.Seconds - data[0].Seconds) * spacingX +
        margin.nametext.x
      );
    })
    .attr("y", function(d) {
      return d.Place * spacingY + margin.nametext.y;
    })
    .text(function(d) {
      return d.Name;
    });

  //Scatterplot tooltip text
  plot
    .on("mouseover", function(d) {
      tipName.text(function() {
        return d.Name + " (" + d.Nationality + ")";
      });
      tipTime.text(function() {
        return "Year: " + d.Year + ", " + "Time: " + d.Time;
      });
      tipDope.text(function() {
        return d.Doping;
      });
      tooltip.style("opacity", "1");
    })
    .on("mousemove", function(d) {
      tooltip
        .style("left", d3.event.pageX + margin.tooltip.x + "px")
        .style("top", d3.event.pageY + margin.tooltip.y + "px");
    })
    .on("mouseout", function(d) {
      tooltip.style("opacity", "0");
    });
});