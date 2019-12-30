// set the dimensions and margins of the graph
const width = 75
const height = 75
const margin = 0

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
const radius = Math.min(width, height) / 2 - margin

export const buildPieGraph = (classId, gained, lost) => {
  const svg = buildSvg(classId);

  // Create dummy data
  const data = {a: gained, b: lost}

  // set the color scale
  const color = d3.scaleOrdinal()
    .domain(data)
    .range(["#28a745", "#dc3545"])

  // Compute the position of each group on the pie:
  const pie = d3.pie()
    .value(function(d) {return d.value; })
  const dateReady = pie(d3.entries(data))

  /* Build the pie chart: Basically, each part of the pie is a
    path that we build using the arc function. */
  svg.selectAll('whatever')
    .data(dateReady)
    .enter()
    .append('path')
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(radius)
    )
    .attr('fill', function(d) { return(color(d.data.key)) })
    .attr("stroke", "rgba(0,0,0.6)")
    .style("stroke-width", "1px")
    .style("opacity", 0.7)
}

const buildSvg = (classId) =>
  d3.select(`#pieGraph${classId}`)
    .append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


export const clearPieGraph = (classId) => {
  d3.select(`#pieGraph${classId}`).select("svg").remove()
}
