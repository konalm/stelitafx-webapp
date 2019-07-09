import Moment from 'moment';
const parseTime = d3.timeParse('%H:%M');


/**
 *
 */
export const buildLineGraph = (data) => {
  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 1300 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // set the ranges
  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  // define the 1st line
  var valueline = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.rate); });

  // define the 2nd line
  var valueline2 = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.shortWMA); });

  // define the 3rd line
  var valueline3 = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.longWMA); });

  // append the svg object to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select(".line-graph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // format the data
    data.forEach(function(d) {
        const formattedDate = Moment(d.date).format("h:mm");
        d.date = parseTime(formattedDate);
    });

    const zz = d3.max(data, function(d) {
  	  return Math.max(d.rate, d.shortWMA); })

    const yy = d3.min(data, function(d) {
      return Math.min(d.rate, d.shortWMA, d.longWMA); })

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([yy, d3.max(data, function(d) {
  	  return Math.max(d.rate, d.shortWMA, d.longWMA); })]);

    // Add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline)
        .style('fill', 'none')
        .style('stroke', "grey");

    // Add the valueline2 path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline2)
        .style("stroke", "#007bff")
        .style('fill', 'none');

    // Add the valueline3 path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline3)
        .style("stroke", "#dc3545")
        .style('fill', 'none')


    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
}
