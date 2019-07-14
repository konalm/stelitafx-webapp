import Moment from 'moment';
const parseTime = d3.timeParse('%Y-%m-%d %H:%M');

// set the dimensions and margins of the graph
const margin = {top: 20, right: 20, bottom: 30, left: 50};
const width = 1300 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;


/**
 *
 */
export const buildLineGraph = (data) => {
  const dataPoints = data.dataPoints;
  const svg = buildSvg();

  // set the ranges
  const x = d3.scaleTime().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);

  const defineLine = defineLineHOF(x, y);

  const valueLines = [];
  data.details.forEach((detail) => {
    const valueLine = {
      line: defineLine(detail.key),
      colour: detail.colour,
      width: detail.width
    };
    valueLines.push(valueLine);
  });

  // format the data
  dataPoints.forEach((d) => {
    const formattedDate = Moment(d.date).format("YYYY-MM-DD HH:mm");
    d.date = parseTime(formattedDate);
  });

  // Scale the range of the data
  x.domain(d3.extent(dataPoints, (d) => d.date));
  y.domain([
    d3.min(dataPoints, (d) =>  Math.min(d.rate, d.shortWMA, d.longWMA) ),
    d3.max(dataPoints, (d) =>  Math.max(d.rate, d.shortWMA, d.longWMA) )
  ]);

  valueLines.forEach((valueLine) => {
    appendLineToGraph(
      dataPoints,
      svg,
      valueLine.line,
      valueLine.colour,
      valueLine.width
    );
  });

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));
}

/**
 *
 */
const buildSvg = () =>
  d3.select(".line-graph")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


/**
 *
 */
const defineLineHOF = (x, y, valueKey) => (valueKey) =>
  d3.line()
    .x((d) => x(d.date))
    .y((d) => y(d[valueKey]))

/**
 *
 */
const appendLineToGraph = (data, svg, valueLine, colour, width) => {
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueLine)
      .style('fill', 'none')
      .style('stroke', colour)
      .style('stroke-width', width);
}
