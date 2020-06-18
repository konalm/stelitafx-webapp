import Moment from 'moment';
const parseTime = d3.timeParse('%Y-%m-%d %H:%M');

// set the dimensions and margins of the graph
const margin = {top: 20, right: 20, bottom: 30, left: 40};


/**
 *
 */
export const buildLineGraph = (data, domClassName, _width, _height, xTicks = 50, x2, y2) => {
  const width = _width - margin.left - margin.right;
  const height = _height - margin.top - margin.bottom;

  const dataPoints = data.dataPoints;
  const svg = buildSvg(domClassName, width, height);

  // const startDate = '2020-06-15T13:30:00.000Z'
  // const endDate = '2020-06-15T16:35:00.000Z'

  // const startDateIndex = data.dataPoints.findIndex((x) => x.date === startDate )
  // const percentageOfDate = (startDateIndex / data.dataPoints.length) * 100

  // console.log(`start date index .. ${startDateIndex}`)
  // console.log(`dates .. ${dates.length}`)
  // console.log(`percentage of date .. ${ percentageOfDate }`)

  

  // svg.append("rect")
  //   .attr("x", 0).attr("y", 0).attr("width", 200).attr("height", height)
  //   .style("fill", "#28a745");

  // svg.append("rect")
  // .attr("x", 270).attr("y", 0).attr("width", 200).attr("height", height)
  // .style("fill", "#dc3545");


  // svg.append("rect")
  // .attr("x", width - 200).attr("y", 0).attr("width", 200).attr("height", height)
  // .style("fill", "#dc3545");

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
    const date = d.date.replace("Z", "")
    const formattedDate = Moment(date).format("YYYY-MM-DD HH:mm");

    d.date = parseTime(formattedDate);
  });

  // Scale the range of the data
  x.domain(d3.extent(dataPoints, (d) => d.date));
  y.domain([
    d3.min(dataPoints, (d) => {
      let keyValues = [];
      data.details.forEach((detail) => keyValues.push(d[detail.key]) )
      return Math.min(...keyValues)
    }),
    d3.max(dataPoints, (d) =>  {
      let keyValues = [];
      data.details.forEach((detail) => keyValues.push(d[detail.key]) )

      console.log('key values -->')
      console.log(keyValues)

      return Math.max(...keyValues)
    })
  ]);

  console.log('DELTA -->')
  console.log(
    d3.max(dataPoints, (d) =>  {
      let keyValues = [];
      data.details.forEach((detail) => keyValues.push(d[detail.key]) )

      return Math.max(...keyValues)
    })
  );

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
      .attr("class", "dates")
      .call(
        d3.axisBottom(x).ticks(20)
      );

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));


  // add the X gridlines
  svg.append("g")
      .attr("class", "x-grid")
      .attr("transform", "translate(0," + height + ")")
      .call(make_x_gridlines(x, xTicks)
          .tickSize(-height)
          .tickFormat("")
      )

  // add the Y gridlines
  svg.append("g")
      .attr("class", "grid")
      .call(make_y_gridlines(y)
          .tickSize(-width)
          .tickFormat("")
      )
}

// gridlines in x axis function
const make_x_gridlines = (x, ticks) => {
  return d3.axisBottom(x).ticks(ticks)
}


// gridlines in y axis function
const make_y_gridlines = (y) => d3.axisLeft(y).ticks(20)

/**
 *
 */
const buildSvg = (domId, width, height) =>
  d3.select(`#${domId}`)
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

export const clearLineGraph = (domId) => {
  d3.select(`#${domId}`).select("svg").remove()
}
