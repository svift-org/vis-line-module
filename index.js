SVIFT.vis.line = (function (data, container) {

  // console.log(data)
 
  // Module object
  var module = SVIFT.vis.base(data, container);

  module.d3config = {
    // ease:d3.easeQuadOut, 
    // yInterpolate:[], 
    // hInterpolate:[],
    // oInterpolate:[],
    // steps:data.data.data.length,
    // animation:{
    //   duration: 3000,
    //   barPartPercent: .8
    // }
  };

 
  //Initialisation e.g. create svg object
  module.setup = function () {


  };

  //Data Processing, after module.data is set, module.process() should process the data
  module.process = function () {
  };

  //Update should do the drawing, similar to Bostock's general update pattern
  module.update = function () {
  };

  //After window resize events this is being called, in most cases, this should call the update event after setting width and height
  module.resize = function () {


    var width = module.container.node().offsetWidth - ((module.config.margin.left + module.config.margin.right)*2);
    var height =  module.container.node().offsetHeight - module.config.margin.top - module.config.margin.bottom - module.config.topTextHeight - module.config.bottomTextHeight;


    //Extents
    var xExtent = [1,data.data.data.length];
    var allYVals = [];
    for (var i = 0; i < data.data.data.length; i++) {
      allYVals = allYVals.concat(data.data.data[i].data);
    }
    var yExtent = d3.extent(allYVals, function(d, i) {return d; });


    var x = d3.scaleLinear()
        .domain(xExtent)
        .range([0, width])

    var y = d3.scaleLinear()
        .domain(yExtent)
        .range([height, 0]);



    var svg = module.g.append("g")
        .datum(data.data.data)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(0," + (module.config.margin.top + module.config.topTextHeight) + ")");

    //X Axis
    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(
          d3.axisBottom(x)
          .tickFormat(function(d,i){return data.data.data[i].label })
          .ticks(data.data.data.length-1)
        );

    //Y Axis
    svg.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
        .append("text")
          .attr("fill", "#000")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("Price ($)");


    //Add lines and animation

    for (var i = 0; i < data.data.data[0].data.length; i++) {

      var line = d3.line()
          .defined(function(d) {return d.data[i]; }) //for null values
          .x(function(d,i) { return x(i+1); })
          .y(function(d) { return y(d.data[i]); })
          // .curve(d3.curveCatmullRom.alpha(0.5)); //curve

      var lineDarwn = svg.append("path")
          .attr("fill", "none")
          .attr("stroke", data.data.colors[i])
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 3.5)
          .attr("d", line);

      //animation
      var totalLineLength = lineDarwn.node().getTotalLength();

      lineDarwn
        .attr("stroke-dasharray", totalLineLength + " " + totalLineLength)
        .attr("stroke-dashoffset", totalLineLength)
        .transition()
        .duration(2000)
          .ease(d3.easeCubicInOut)
          .attr("stroke-dashoffset", 0);

    }



    // svg.selectAll(".dot")
    //   .data(parsedData)
    //   .enter().append("circle")
    //     .attr("class", "dot")
    //     .attr("cx", line.x())
    //     .attr("cy", line.y())
    //     .attr("r", 0)
    //     .transition()
    //     .delay(2000)
    //     .duration(500)
    //     .ease(d3.easeCubicInOut)
    //     .attr("r", 6);
      


  };

  module.timeline = {};

  return module;
 });


//Linw with missing data
// https://bl.ocks.org/mbostock/0533f44f2cfabecc5e3a