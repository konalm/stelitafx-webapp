import Moment from 'moment';
import * as _ from 'lodash';

const parseDateTime = d3.timeParse('%Y-%m-%d %H:%M');

export const drawChart = (_prices, domId, xTicks = 70, trends) => {
  const prices = _.cloneDeep(_prices)

  for (var i = 0; i < prices.length; i++) {
    const date = prices[i]['date'] .replace("Z", "")
    const formattedDate = Moment(date).format("YYYY-MM-DD HH:mm");
    prices[i]['date'] = parseDateTime(formattedDate)
  }
  
  const margin = { top: 15, right: 65, bottom: 100, left: 50 }
  const w = 1350 - margin.left - margin.right
  const h = 625 - margin.top - margin.bottom;

  var svg = d3.select(`#${domId}`)
          .attr("width", w + margin.left + margin.right)
          .attr("height", h + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" +margin.left+ "," +margin.top+ ")");

  let dates = _.map(prices, 'date');

  const topHeight = Math.max(..._prices.map((x) => { return x.close }))
  const topHeight2 = d3.max(Math.max(..._prices.map((x) => { return x.close })))

  // d3.max(dataPoints, (d) =>  {
  //   let keyValues = [];
  //   data.details.forEach((detail) => keyValues.push(d[detail.key]) )
  //   return Math.max(...keyValues)
  // })

  // console.log(_prices[0])
  // d3.max()

  console.log(`top height .. ${topHeight}`)
  console.log(`top height 2 ... ${topHeight2}`)
    

  trends.forEach((trend) => {
    const startDateIndex = _prices.findIndex((x) => x.date === trend.timeline.start )
    const percentageOfStartDate = (startDateIndex / _prices.length) * 100

    const endDateIndex = _prices.findIndex((x) => x.date === trend.timeline.end)
    const percentageOfEndDate = (endDateIndex / _prices.length) * 100
    const scale = percentageOfEndDate - percentageOfStartDate 

    const trendXPos = ( w / 100 ) * percentageOfStartDate
    const trendXWidth = ( w / 100 ) * scale

    let colour 
    switch (trend.trend) {
      case 'up':
        colour = '#28a745';
        break;
      case 'down':
        colour = '#dc3545';
        break;
      case 'congestion':
        colour = '#286ca7';
    }

    svg.append("rect")
      .attr("x", trendXPos).attr("y", 0).attr("width", trendXWidth).attr("height", h)
      .style("fill", colour)
      .style("opacity", 0.4);
    
    if (trend.trend === 'congestion') {
      // console.log('congestion')
      // console.log(trend.ceiling)
      // console.log(trend.floor)



      // svg.append("line")          
      //   .style("stroke", colour)  
      //   .attr("x1", trendXPos)    
      //   .attr("y1", 50)     
      //   .attr("x2", trendXWidth)    
      //   .attr("y2", 50); 

      svg.append("rect")
        .attr("x", trendXPos).attr("y", 52).attr("width", trendXWidth).attr("height", 3)
        .style("fill", colour)
        .style("opacity", 1.0);

      // svg.append("line").attr("x1", 100).attr("y1", 100).attr("x2", 200).attr("y2", 200)
      
    }
  })
 

  // if (x) {
  //   const trendXPos = ( w / 100 ) * x
  //   const trendXWidth = ( w / 100 ) * y

  //   console.log(`trend x width .. ${ trendXWidth }`)
  //   console.log(`width .. ${y}`)
    
  //   svg.append("rect")
  //     .attr("x", trendXPos).attr("y", 0).attr("width", trendXWidth).attr("height", h)
  //     .style("fill", "#28a745");
  // }
  


  var xScale = d3.scaleLinear().domain([0, dates.length]).range([0, w])            
  var xDateScale = d3.scaleQuantize().domain([0, dates.length]).range(dates)
  let xBand = d3.scaleBand().domain(d3.range(-1, dates.length)).range([0, w]).padding(0.4)
  
  var xAxis = d3.axisBottom()
                .scale(xScale)
                .tickFormat(function(d) {
                  if (d < 100) return Moment(dates[d]).format("YYYY-MM-DD HH:mm");
                  else return Moment(dates[99]).format("YYYY-MM-DD HH:mm");
                });
  
  svg.append("rect")
        .attr("id","rect")
        .attr("width", w)
        .attr("height", h)
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr("clip-path", "url(#clip)")
  
  var gX = svg.append("g")
        .attr("class", "axis x-axis") //Assign "axis" class
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis)
  
  gX.selectAll(".tick text")
    .call(wrap, xBand.bandwidth())

  var ymin = d3.min(prices.map(r => r.low));
  var ymax = d3.max(prices.map(r => r.high));
  var yScale = d3.scaleLinear().domain([ymin, ymax]).range([h, 0]).nice();
  var yAxis = d3.axisLeft()
          .scale(yScale)
  
  var gY = svg.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis);
  
  var chartBody = svg.append("g")
        .attr("class", "chartBody")
        .attr("clip-path", "url(#clip)");
  
  // draw rectangles
  let candles = chartBody.selectAll(".candle")
      .data(prices)
      .enter()
      .append("rect")
      .attr('x', (d, i) => xScale(i) - xBand.bandwidth())
      .attr("class", "candle")
      .attr('y', d => yScale(Math.max(d.open, d.close)))
      .attr('width', xBand.bandwidth())
      .attr('height', d => (d.open === d.close) ? 1 : yScale(Math.min(d.open, d.close))-yScale(Math.max(d.open, d.close)))
      .attr("fill", d => (d.open === d.close) ? "silver" : (d.open > d.close) ? "red" : "green")
  
  // draw high and low
  let stems = chartBody.selectAll("g.line")
      .data(prices)
      .enter()
      .append("line")
      .attr("class", "stem")
      .attr("x1", (d, i) => xScale(i) - xBand.bandwidth()/2)
      .attr("x2", (d, i) => xScale(i) - xBand.bandwidth()/2)
      .attr("y1", d => yScale(d.high))
      .attr("y2", d => yScale(d.low))
      .attr("stroke", d => (d.open === d.close) ? "white" : (d.open > d.close) ? "red" : "green");
  
  svg.append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", w)
      .attr("height", h)
  
  // add the X gridlines
  svg.append("g")
      .attr("class", "x-grid")
      .attr("transform", "translate(0," + h + ")")
      .call(make_x_gridlines(xScale, xTicks)
          .tickSize(-h)
          .tickFormat("")
      )

  // add the Y gridlines
  svg.append("g")
      .attr("class", "grid")
      .call(make_y_gridlines(yScale)
          .tickSize(-w)
          .tickFormat("")
      )
  
  const extent = [[0, 0], [w, h]];
  
  var resizeTimer;
  var zoom = d3.zoom()
    .scaleExtent([1, 100])
    .translateExtent(extent)
    .extent(extent)
    .on("zoom", zoomed)
    .on('zoom.end', zoomend);
  
  svg.call(zoom)

  function zoomed() {
    
    var t = d3.event.transform;
    let xScaleZ = t.rescaleX(xScale);
    
    let hideTicksWithoutLabel = function() {
      d3.selectAll('.xAxis .tick text').each(function(d){
        if(this.innerHTML === '') {
        this.parentNode.style.display = 'none'
        }
      })
    }

    gX.call(
      d3.axisBottom(xScaleZ).tickFormat((d, e, target) => {
          if (d >= 0 && d <= dates.length-1) {
            return Moment(dates[d]).format("YYYY-MM-DD HH:mm");
        }
      })
    )

    candles.attr("x", (d, i) => xScaleZ(i) - (xBand.bandwidth()*t.k)/2)
          .attr("width", xBand.bandwidth()*t.k);
    stems.attr("x1", (d, i) => xScaleZ(i) - xBand.bandwidth()/2 + xBand.bandwidth()*0.5);
    stems.attr("x2", (d, i) => xScaleZ(i) - xBand.bandwidth()/2 + xBand.bandwidth()*0.5);

    hideTicksWithoutLabel();

    gX.selectAll(".tick text")
    .call(wrap, xBand.bandwidth())

  }

  function zoomend() {
    var t = d3.event.transform;
    let xScaleZ = t.rescaleX(xScale);
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(function() {

    var xmin = new Date(xDateScale(Math.floor(xScaleZ.domain()[0])))
    const xmax = new Date(xDateScale(Math.floor(xScaleZ.domain()[1])))
    const filtered = _.filter(prices, d => ((d.date >= xmin) && (d.date <= xmax)))
    const minP = +d3.min(filtered, d => d.low)
    const maxP = +d3.max(filtered, d => d.high)
    const buffer = Math.floor((maxP - minP) * 0.1)

    yScale.domain([minP - buffer, maxP + buffer])
    candles.transition()
          .duration(800)
          .attr("y", (d) => yScale(Math.max(d.open, d.close)))
          .attr("height",  d => (d.open === d.close) ? 1 : yScale(Math.min(d.open, d.close))-yScale(Math.max(d.open, d.close)));
          
    stems.transition().duration(800)
        .attr("y1", (d) => yScale(d.high))
        .attr("y2", (d) => yScale(d.low))
    
    gY.transition().duration(800).call(d3.axisLeft().scale(yScale));

    }, 500)
    
  }
}

function wrap(text, width) {
	text.each(function() {
	  var text = d3.select(this),
		  words = text.text().split(/\s+/).reverse(),
		  word,
		  line = [],
		  lineNumber = 0,
		  lineHeight = 1.1, // ems
		  y = text.attr("y"),
		  dy = parseFloat(text.attr("dy")),
		  tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
	  while (word = words.pop()) {
		line.push(word);
		tspan.text(line.join(" "));
		if (tspan.node().getComputedTextLength() > width) {
		  line.pop();
		  tspan.text(line.join(" "));
		  line = [word];
		  tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		}
	  }
	});
}


// gridlines in x axis function
const make_x_gridlines = (x, ticks) => d3.axisBottom(x).ticks(ticks)


// gridlines in y axis function
const make_y_gridlines = (y) => d3.axisLeft(y).ticks(20)


export const clearCandlestickGraph = (domId) => {
  d3.select(`#${domId}`).select("svg").remove()
}