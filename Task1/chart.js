async function buildPlot() {
    console.log("Hello world");
    const data = await d3.json("my_weather_data.json");
    //console.table(data);
    const dateParser = d3.timeParse("%Y-%m-%d");
    const yAccessor = (d) => d.temperatureMin;
    // const yAccessorH = (d) => d.temperatureHigh;
    const xAccessor = (d) => dateParser(d.date);
    // Функции для инкапсуляции доступа к колонкам набора данных

    var dimension = {
        width: window.innerWidth*0.8,
        height: 600,
        margin: {
            top: 40,
            left: 50,
            bottom: 10,
            right: 10
        }
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    const wrapper = d3.select("#wrapper");
    const svg = wrapper.append("svg")
        .attr("width", dimension.width + dimension.margin.left + dimension.margin.right)
        .attr("height", dimension.height + dimension.margin.top + dimension.margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + dimension.margin.left + "," + dimension.margin.top + ")");
    // svg.attr("margin_left", dimension.margin.left);


    const yScaler = d3.scaleLinear()
        .domain(d3.extent(data,yAccessor))
        // .domain(d3.extent(data, yAccessorH))
        .range([dimension.boundedHeight,0]);


    const xScaler = d3.scaleTime()
        .domain(d3.extent(data,xAccessor))
        .range([0,dimension.boundedWidth]);



    const bounded = svg.append("g");
    bounded.style("transform",`translate(${dimension.margin.left}px, ${dimension.margin.top+20}px)`);

    xAxis = d3.axisBottom()
        .scale(xScaler)

    d3.select("svg")
        .append("g")
        .attr("transform", "translate(" + dimension.margin.left + "," + dimension.margin.top + ")")
        .call(xAxis)
        .append("text")
        .text("Month")

    yAxis = d3.axisLeft()
        .scale(yScaler)

    d3.select('svg')
        .append("g")
        .attr("transform", "translate(" + dimension.margin.left + "," + dimension.margin.top + ")")
        .call(yAxis)
        .append("text")
        .text("Temperature")


    var lineGenerator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yScaler(yAccessor(d)));

    bounded.append("path")
        .attr("d",lineGenerator(data))
        .attr("fill","none")
        .attr("stroke","red")
        .attr("stroke-width", "2px");

}

buildPlot();1212