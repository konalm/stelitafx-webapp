
/**
 * 
 */
export const buildBarGraph = (data, domId, _width, _height) => {
  if (!data || data.length === 0) return;

  var margin = {top: 10, right: 0, bottom: 20, left: 50}
  const width = _width - margin.left - margin.right
  const height = _height - margin.top - margin.bottom

  // set the ranges
  var x = d3.scaleBand()
            .range([0, width])
            .padding(0.1);
  var y = d3.scaleLinear()
            .range([height, 0]);

  var svg = d3.select(`#${domId}`).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // Scale the range of the data in the domains
  x.domain(data.map(function(d) { return d.label; }));
  y.domain([0, d3.max(data, function(d) { return d.value; })]);

  // append the rectangles for the bar graph
  svg.selectAll(".bar")
     .data(data)
     .enter().append("rect")
     .attr("class", function(d) { return d.value >= 0 ? 'above' : 'below'})
     .attr("x", function(d) { return x(d.label); })
     .attr("width", x.bandwidth())
     .attr("y", function(d) { return y(d.absValue); })
     .attr("height", function(d) { return height - y(d.absValue); });

  // add the X Axis
  svg.append("g")
     .attr("transform", `translate(0, ${height})`)
     .attr("class", "x-axis")
     .call(d3.axisBottom(x));

  // add the Y Axis
  svg.append("g")
     .call(d3.axisLeft(y));
}


/**
 * 
 */
export const clearBarGraph = (domId) => {
  d3.select(`#${domId}`).select("svg").remove();
}
