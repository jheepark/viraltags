<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>d3 Scatter Plot</title>
         <script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
        <!-- Styles for our vis  -->
        <style>
        body {
            font: 15px sans-serif;
        }

        .axis path,
        .axis line {
            fill: none;
            stroke: #000;
            shape-rendering: crispEdges;
        }

        .dot {
            stroke: none;
        }
        .tooltip {
            position: absolute;
            font-size: 12px;
            width:  auto;
            height: auto;
            pointer-events: none;
            background-color: white;
        }
         </style>
    </head>
    <body>
        <div id="vis-container"></div>
        <script type="text/javascript">
            d3.json('/data/data.json', function(error, json) {
              root = json
              makeVis(json);
            });

          var makeVis = function(data) {
              // Common pattern for defining vis size and margins
              var margin = { top: 20, right: 20, bottom: 30, left: 40 },
                  width  = 960 - margin.left - margin.right,
                  height = 500 - margin.top - margin.bottom;

              // Add the visualization svg canvas to the vis-container <div>
              var canvas = d3.select("#vis-container").append("svg")
                  .attr("width",  width  + margin.left + margin.right)
                  .attr("height", height + margin.top  + margin.bottom)
                .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

              // Define our scales
              var colorScale = d3.scale.category10();
              var xScale = d3.scale.linear()
                  .domain([ d3.min(data, function(d) { return d.screen_name.length; }) - 1,
                            d3.max(data, function(d) { return d.screen_name.length; }) + 1 ])
                  .range([0, width]);

              var yScale = d3.scale.linear()
                  .domain([ d3.min(data, function(d) { return d.text.length; }) - 1,
                            d3.max(data, function(d) { return d.text.length; }) + 1 ])
                  .range([height, 0]); // flip order because y-axis origin is upper LEFT

              // Define our axes
              var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient('bottom');

              var yAxis = d3.svg.axis()
                  .scale(yScale)
                  .orient('left');

              // Add x-axis to the canvas
              canvas.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + height + ")") // move axis to the bottom of the canvas
                  .call(xAxis)
                .append("text")
                  .attr("class", "label")
                  .attr("x", width) // x-offset from the xAxis, move label all the way to the right
                  .attr("y", -6)    // y-offset from the xAxis, moves text UPWARD!
                  .style("text-anchor", "end") // right-justify text
                  .text("screenName.length");

              // Add y-axis to the canvas
              canvas.append("g")
                  .attr("class", "y axis") // .orient('left') took care of axis positioning for us
                  .call(yAxis)
                .append("text")
                  .attr("class", "label")
                  .attr("transform", "rotate(-90)") // although axis is rotated, text is not
                  .attr("y", 15) // y-offset from yAxis, moves text to the RIGHT because it's rotated, and positive y is DOWN
                  .style("text-anchor", "end")
                  .text("Text length");

              // Add the tooltip container to the vis container
              // it's invisible and its position/contents are defined during mouseover
              var tooltip = d3.select("#vis-container").append("div")
                  .attr("class", "tooltip")
                  .style("opacity", 0);

              // tooltip mouseover event handler
              var tipMouseover = function(d) {
                  var html  = d.text
                  tooltip.html(html)
                      .style("left", (d3.event.pageX + 15) + "px")
                      .style("top", (d3.event.pageY - 28) + "px")
                    .transition()
                      .duration(200) // ms
                      .style("opacity", .9) // started as 0!

              };
              // tooltip mouseout event handler
              var tipMouseout = function(d) {
                  tooltip.transition()
                      .duration(300) // ms
                      .style("opacity", 0); // don't care about position!
              };

              // Add data points!
              canvas.selectAll(".dot")
                .data(data)
              .enter().append("circle")
                .attr("class", "dot")
                .attr("r", 5.5) // radius size, could map to another data dimension
                .attr("cx", function(d) { return xScale( d.screen_name.length ); })     // x position
                .attr("cy", function(d) { return yScale(d.text.length);})  // y position
                .on("mouseover", tipMouseover)
                .on("mouseout", tipMouseout);
          };
        </script>
    </body>
</html>
