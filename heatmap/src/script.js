var dataURL = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";

    const CANVAS = {
        WIDTH: 1300,
        HEIGHT: 770
    };
    const HEATBAR = {
        WIDTH: 4,
        HEIGHT: 40
    };
    const LEGEND = {WIDTH: 30, HEIGHT: 15};

    const MONTHS_PER_YEAR = 12;
    const COLORS = ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850', '#006837'];
    const LEGEND_DATA = [0, 1.3, 2.6, 3.8, 5.1, 6.4, 7.6, 8.9, 10.2, 11.4, 12.7];

    var margin = {
        header: {
            x: 300,
            y: 60
        },
        yeartext: {
            x: 280,
            y: 30
        },
        desctext1: {
            x: 70,
            y: 55
        },
        desctext2: {
            x: 150,
            y: 70
        },
        chart: {
            x: 160,
            y: 160
        },
        legend: {
            x: 882,
            y: 690
        },
        legendtext: {
            y: 25
        },
        tooltip: {
            x: 20,
            y: 0
        }
    };

    var x = d3.scaleLinear();
    var y = d3.scaleTime();

    var axisX = d3.axisBottom(x)
        .ticks(20)
        .tickFormat(d3.format(""));

    var axisY = d3.axisLeft(y)
        .tickFormat(d3.timeFormat("%B"))
        .tickSize(0)
        .tickPadding(10);

    var canvas = d3
        .select("body")
        .append("svg")
        .attr("width", CANVAS.WIDTH)
        .attr("height", CANVAS.HEIGHT);

    var chart = canvas.append("g")
        .attr("transform", "translate(" + margin.chart.x + "," + margin.chart.y + ")");

    // text block
    var header = canvas.append("g")
        .attr("transform", "translate(" + margin.header.x + "," + margin.header.y + ")")

    // chart title
    header.append("text")
        .attr("class", "text_title")
        .text("Monthly Global Land-Surface Temperature");

    // year
    header.append("text")
        .attr("class", "text_year")
        .attr("transform", "translate(" + margin.yeartext.x + "," + margin.yeartext.y + ")")
        .text("1753 - 2015");

    // description line 1
    header.append("text")
        .attr("class", "text_desc")
        .attr("transform", "translate(" + margin.desctext1.x + "," + margin.desctext1.y + ")")
        .text("Temperatures are in Celsius and reported as anomalies relative to the Jan 1951-Dec 1980 average.");

    // description line 2
    header.append("text")
        .attr("class", "text_desc")
        .attr("transform", "translate(" + margin.desctext2.x + "," + margin.desctext2.y + ")")
        .text("Estimated Jan 1951-Dec 1980 absolute temperature ℃: 8.66 +/- 0.07");

    // legend
    var legend = canvas.append("g")
        .attr("transform", "translate(" + margin.legend.x + "," + margin.legend.y + ")");

        // legend text
        legend.append("g")
        .selectAll("text")
        .data(LEGEND_DATA)
        .enter()
        .append("text")
        .attr("class", "text_legend")
        .attr("x", function(d, i) {
            return i * LEGEND.WIDTH;
        })
        .attr("y", margin.legendtext.y)
        .text(function(d){return d;});

    // tooltip frame
    var tooltip = d3.select("body")
        .append("g")
        .attr("class", "tooltip");

    // tooltip text
    var tipDate = tooltip.append("div")
        .attr("class", "text_tipdate");
    var tipTemp = tooltip.append("div")
        .attr("class", "text_tiptemp");
    var tipTempDiff = tooltip.append("div")
        .attr("class", "text_tiptemp");

    // retrieve data
    d3.json(dataURL, function(data) {

        // set data array
        var heatData = data.monthlyVariance;

        // heatmap dimensions
        var map_width = HEATBAR.WIDTH * Math.ceil(heatData.length / MONTHS_PER_YEAR);
        var map_height = HEATBAR.HEIGHT * MONTHS_PER_YEAR;

        // heatmap color range
        var colorRange = d3.scaleQuantile()
            .domain([0, d3.max(heatData, function(d) {
                return data.baseTemperature + d.variance;
            })])
            .range(COLORS);

        // axis x - years
        x.domain([heatData[0].year, heatData[heatData.length - 1].year])
            .range([0, map_width]);

        // axis y - months
        y.domain([new Date(98, 11, 31), new Date(99, 11, 31)])
            .range([0, map_height]);

        chart.append("g")
            .attr("class", "axisX")
            .attr("transform", "translate(0," + map_height + ")")
            .call(axisX);

        chart.append("g")
            .attr("class", "axisY")
            .call(axisY);

        // axis y text offset
        chart.selectAll(".axisY text")
            .attr("transform", "translate(0,20)");

        var heatmap = chart.append("g")
            .selectAll("rect")
            .data(heatData)
            .enter()
            .append("rect")
            .attr("width", HEATBAR.WIDTH - 0.3)
            .attr("height", HEATBAR.HEIGHT - 0.3)
            .attr("fill", function(d) {
                return colorRange(data.baseTemperature + d.variance);
            })
            .attr("x", function(d) {
                return (d.year - heatData[0].year) * HEATBAR.WIDTH;
            })
            .attr("y", function(d) {
                return (d.month - 1) * HEATBAR.HEIGHT;
            });

        // tooltip
        heatmap.on("mouseover", function(d) {
                tipDate.text(function() {
                    var date = d3.timeFormat("%B %Y");
                    return date(new Date(d.year, d.month - 1));
                });
                tipTemp.text(function() {
                    return (data.baseTemperature + d.variance).toFixed(3);
                });
                tipTempDiff.text(function() {
                    return (d.variance).toFixed(3);
                });
                tooltip.style("opacity", 1);
            })
            .on("mousemove", function(d) {
                tooltip.style("left", (d3.event.pageX + margin.tooltip.x) + "px")
                    .style("top", (d3.event.pageY + margin.tooltip.y) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.style("opacity", 0);
            });

        // legend color guide
        legend.append("g")
            .selectAll("rect")
            .data(LEGEND_DATA)
            .enter()
            .append("rect")
            .attr("width", LEGEND.WIDTH)
            .attr("height", LEGEND.HEIGHT)
            .attr("fill", function(d) {
                return colorRange(d);
            })
            .attr("x", function(d, i) {
                return i * LEGEND.WIDTH;
            });
    });