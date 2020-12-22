/*Reference
        https://bl.ocks.org/mbostock/3757132
        https://github.com/topojson/world-atlas
        */

const geodata = "https://unpkg.com/world-atlas@1/world/110m.json";
const meteor =
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json";

var width = 1920;
var height = 1200;
var scale = 300;
var tooltipMargin = {
  x: 20,
  y: 0
};

var canvas = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

//map projection
var projection = d3
  .geoMercator()
  .scale(scale)
  .translate([width / 2, height / 2]);
var path = d3.geoPath().projection(projection);

//map zoom
var zoom = d3.zoom().on("zoom", zoomed);
canvas.call(zoom);

//meteorite radius
var radius = d3.scaleSqrt().domain([0, 1e6]).range([2, 11]);

var g = canvas.append("g");

// tooltip frame
var tooltip = d3.select("body").append("div").attr("class", "tooltip");

//generate worldmap
d3.json(geodata, function(error, data) {
  if (error) throw error;

  //continents
  g
    .append("path")
    .datum(topojson.feature(data, data.objects.land))
    .attr("class", "land")
    .attr("d", path);

  //countries
  g
    .append("path")
    .datum(
      topojson.mesh(data, data.objects.countries, function(a, b) {
        return a !== b;
      })
    )
    .attr("class", "boundary")
    .attr("d", path);

  //generate meteorites
  d3.json(meteor, function(error, mdata) {
    if (error) throw error;

    //meteorites
    var meteorite = g
      .attr("class", "meteorite")
      .selectAll("circle")
      .data(
        mdata.features.sort(function(a, b) {
          return b.properties.mass - a.properties.mass;
        })
      )
      .enter()
      .append("path")
      .attr(
        "d",
        path.pointRadius(function(d) {
          return radius(d.properties.mass);
        })
      )
      .style("opacity", 0.5);

    //meteorites tooltip
    meteorite
      .on("mouseover", function(d) {
        //tooltip text
        tooltip.html(function() {
          let year = d.properties.year.split("T");

          return (
            "Name: " +
            d.properties.name +
            "<br>" +
            "Class: " +
            d.properties.recclass +
            "<br>" +
            "Mass: " +
            d.properties.mass +
            "<br>" +
            "Latitude: " +
            d.properties.reclat +
            "<br>" +
            "Longitude: " +
            d.properties.reclong +
            "<br>" +
            "Year: " +
            year[0]
          );
        });

        //show tooltip
        tooltip.style("opacity", 1);
      })
      .on("mousemove", function(d) {
        //tooltip margin relative to mouse
        tooltip
          .style("left", d3.event.pageX + tooltipMargin.x + "px")
          .style("top", d3.event.pageY + tooltipMargin.y + "px");
      })
      .on("mouseout", function(d) {
        //hide tooltip
        tooltip.style("opacity", 0);
      });
  });
});

//zoom function
function zoomed() {
  g.attr("transform", d3.event.transform);
}