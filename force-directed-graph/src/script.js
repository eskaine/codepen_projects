/*Reference
        https://bl.ocks.org/mbostock/4062045
        */

const data =
  "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json";

var width = 850;
var height = 850;

var margin = {
  canvas: {
    x: 520,
    y: 100
  },
  tooltip: {
    x: 20,
    y: 0
  }
};

var canvas = d3.select("body");

var svg = canvas
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr(
    "transform",
    "translate(" + margin.canvas.x + "," + margin.canvas.y + ")"
  );

var simulation = d3
  .forceSimulation()
  .force(
    "link",
    d3.forceLink().id(function(d) {
      return d.index;
    })
  )
  .force("charge", d3.forceManyBody().strength(-80))
  .force("center", d3.forceCenter(width / 2, height / 2))
  .force("x", d3.forceX())
  .force("y", d3.forceY());

var tooltip = canvas.append("div").attr("class", "tooltip");

d3.json(data, function(error, graph) {
  if (error) throw error;

  var link = svg
    .selectAll("line")
    .data(graph.links)
    .enter()
    .append("line")
    .attr("class", "links");

  var node = canvas
    .append("div")
    .selectAll("img")
    .data(graph.nodes)
    .enter()
    .append("img")
    .attr("class", function(d) {
      return "flag flag-" + d.code;
    })
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

  simulation.nodes(graph.nodes).on("tick", ticked);

  simulation.force("link").links(graph.links);

  node
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseout", mouseout);

  function ticked() {
    link
      .attr("x1", function(d) {
        return d.source.x;
      })
      .attr("y1", function(d) {
        return d.source.y;
      })
      .attr("x2", function(d) {
        return d.target.x;
      })
      .attr("y2", function(d) {
        return d.target.y;
      });

    node
      .style("left", function(d) {
        return d.x + margin.canvas.x + "px";
      })
      .style("top", function(d) {
        return d.y + margin.canvas.y + "px";
      });
  }
});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

function mouseover(d) {
  tooltip.html(function() {
    return d.country;
  });
  tooltip
    .style("left", d3.event.pageX + margin.tooltip.x + "px")
    .style("top", d3.event.pageY + margin.tooltip.y + "px")
    .style("opacity", 1);
}

function mousemove(d) {
  tooltip
    .style("left", d3.event.pageX + margin.tooltip.x + "px")
    .style("top", d3.event.pageY + margin.tooltip.y + "px");
}

function mouseout() {
  tooltip.style("opacity", 0);
}
