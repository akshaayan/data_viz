async function loadDataset() {
    data = await d3.json("./my_weather_data.json")
}

const tempLowAcc = d => d.temperatureLow;
const tempHighAcc = d => d.temperatureHigh;
const tempMinAcc = d => d.temperatureMin;
const tempMaxAcc = d => d.temperatureMax;

function clearBox(elementID)
{
    document.getElementById(elementID).innerHTML = "";
}

function initiate(tempAccessor) {
    //Accessor
    clearBox("histogram")
    var yAccessor = d => d.length;

    const width = document.getElementById("histogram").clientWidth;
    let dimensions = {
        width: width,
        height: width * 0.6,
        margin: {
            left: 50,
            right: 50,
            top: 30,
            bottom: 30,
        },
    }

    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;
    // 3. Draw canvas

    const wrapper = d3.select("#histogram").append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height);

    const bounds = wrapper.append("g")
        .style("translate",`translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`);

    const xScaler = d3.scaleLinear()
        .domain(d3.extent(data,tempAccessor))
        .range([dimensions.margin.left, dimensions.width - dimensions.margin.right])

    const binsGen = d3.bin()
        .domain(xScaler.domain())
        .value(tempAccessor)
        .thresholds(20);

    const bins = binsGen(data);

    const yScaler = d3.scaleLinear()
        .domain([0, d3.max(bins, yAccessor)])
        .range([dimensions.height - dimensions.margin.bottom - dimensions.margin.top, dimensions.margin.top])

    const binGroup = bounds.append("g");
    const binGroups = binGroup.selectAll("g")
        .data(bins)
        .enter()
        .append("g");


    const barPadding = 5
    const barRect = binGroups.append("rect")
        .attr("x", d => xScaler(d.x0) + barPadding/2)
        .attr("y", d => yScaler(yAccessor(d)))
        .attr("width", d => d3.max([0, xScaler(d.x1) - xScaler(d.x0) - barPadding]))
        .attr("height", d => dimensions.boundedHeight - yScaler(yAccessor(d)))
        .attr("fill", "#FFAC33");

    const mean = d3.mean(data,tempAccessor)
    const meanLine = bounds.append("line")
        .attr("x1", xScaler(mean))
        .attr("x2", xScaler(mean))
        .attr("y1", -15)
        .attr("y2", dimensions.boundedHeight)
        .attr("stroke","red")
        .attr("stroke-dasharray","2px 4px");

    const meanLabel = bounds.append("text")
        .attr("x",xScaler(mean))
        .attr("y",10)
        .text("Mean Point")
        .attr("font-size","12px")
        .attr("text-anchor","middle");

    const xAxisGen = d3.axisBottom()
        .scale(xScaler);
    const xAxis = bounds.append("g")
        .call(xAxisGen)
        .style("transform",`translateY(${dimensions.boundedHeight}px)`);

    const yAxisGen = d3.axisLeft()
        .scale(yScaler)
    const yAxis = bounds.append("g")
        .call(yAxisGen)

    const barText = binGroups.filter(yAccessor)
        .append("text")
        .attr("x", d => xScaler(d.x0) + (xScaler(d.x1)-xScaler(d.x0))/2)
        .attr("y", d => yScaler(yAccessor(d)) - 10)
        .text(yAccessor)
        .attr("fill","blue")
        .attr("font-size","10px")
        .attr("text-anchor","middle");

}


function TempLow() {
    initiate(tempLowAcc);
}
function TempHigh() {
    initiate(tempHighAcc);
}
function TempMin() {
    initiate(tempMinAcc);
}
function TempMax() {
    initiate(tempMaxAcc);
}

async function run(){
    await loadDataset();
    initiate(tempLowAcc);
}

run()
