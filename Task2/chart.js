// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Initialize the X axis
var x = d3.scaleBand()
    .range([ 0, width ])
    .padding(0.2);
var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")

// Initialize the Y axis
var y = d3.scaleLinear()
    .range([ height, 0]);
var yAxis = svg.append("g")
    .attr("class", "myYaxis")


// A function that create / update the plot for a given variable:
function update(selectedVar) {


    //console.table(data);
    const dateParser = d3.timeParse("%Y-%m-%d");

    // Parse the Data
    d3.json("my_weather_data.json", function(data) {

        // X axis
        x.domain(data.map(function(d) { return d[selectedVar]; }))
        xAxis.transition().duration(10).call(d3.axisBottom(x))

        // Add Y axis
        y.domain([0, d3.max(data, function(d) { return dateParser(d.date); }) ]);
        yAxis.transition().duration(10).call(d3.axisLeft(y));

        // variable u: map data to existing bars
        var u = svg.selectAll("rect")
            .data(data)

        // update bars
        u
            .enter()
            .append("rect")
            .merge(u)
            .transition()
            .duration(10)
            .attr("x", function(d) { return x(d[selectedVar]); })
            .attr("y", function(d) { return y(dateParser(d.date)); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - y(dateParser(d.date)); })
            .attr("fill", "#69b3a2")
    })

}

// Initialize plot
update('var1')


