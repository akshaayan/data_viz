async function scatterPlot(ran_data, ran_data_rh){
	console.log("scatterPlot");


	const ranData = ran_data
	const ranData_rh = ran_data_rh

	const xAccessor = d => d[0];
	const yAccessor = d => d[1];


	const xAccessor_rh = r => r[0];
	const yAccessor_rh = r => r[1];

	const rAccessor = d => d;

	let dimensions = {
		width : window.innerWidth  *0.5, 
		height: 300, 
		margin: {
			top: 30, 
			right: 30, 
			bottom: 30, 
			left: 30
		}
	};

	dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right; 
	dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom; 

	let wrapper = d3.select("#wrapper").append("svg");
	wrapper.attr("width", dimensions.width); 
	wrapper.attr("height", dimensions.height);

	let container = wrapper.append("g"); 
	container.append("transform", `translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`);

	let xScale = d3.scaleLinear()
					.domain(d3.extent(ranData, xAccessor))
					.range([dimensions.margin.left, dimensions.boundedWidth]);

	let yScale = d3.scaleLinear()
					.domain(d3.extent(ranData, yAccessor))
					.range([dimensions.boundedHeight, dimensions.margin.top]);

	let xScale_rh = d3.scaleLinear()
		.domain(d3.extent(ranData_rh, xAccessor_rh))
		.range([dimensions.margin.left, dimensions.boundedWidth]);

	let yScale_rh = d3.scaleLinear()
		.domain(d3.extent(ranData_rh, yAccessor_rh))
		.range([dimensions.boundedHeight, dimensions.margin.top]);


	let rScale = d3.scaleLinear()
					.domain(d3.extent(ranData, rAccessor))
					.range([dimensions.boundedHeight*0.01, dimensions.boundedHeight*0.03])

	var xScaler;

	if (xScale_rh > xScale) {
		xScaler = xScale_rh
	} else {
		xScaler = xScale
	}

	var yScaler;

	if (yScale_rh > yScale) {
		yScaler = yScale_rh
	} else {
		yScaler = yScale
	}

	let xAxisGen = d3.axisBottom().scale(xScaler);
	let yAxisGen = d3.axisLeft().scale(yScaler);

	const axisX = container.append("g").call(xAxisGen).style("transform",`translateY(${dimensions.boundedHeight}px)`); 
	const axisY = container.append("g").call(yAxisGen).style("transform", `translateX(${dimensions.margin.left}px)`);

	const graph = container.append("g").selectAll("circle")
		.data(ran_data)
		.enter()
		.append("circle")
		.attr("cx",d=>xScale(xAccessor(d)))
		.attr("cy", d=>yScale(yAccessor(d)))
		.attr("r", 5)


	const graph_rh = container.append('g')
		.attr('id', 'rhombuses')
		.selectAll("dot")
		.data(ran_data_rh)
		.enter()
		.append("rect")
		.attr("class", "rhombus")
		.attr("x", r=>xScale_rh(xAccessor_rh(r)))
		.attr("y", r=>yScale_rh(yAccessor_rh(r)))
		.attr('width', 5)
		.attr('height', 5)
		.style("fill", "#8F00FF")
		.style("transform", "rotate(45deg)")
    // container.style("transform", "rotate(45)")

	// let incline = document.getElementsByClassName("rhombus");
	// for (let i = 0; i < incline.length; i++) {
	// 	let xPx = r => xScale_rh(xAccessor_rh(r));
	// 	let yPx = r => yScale_rh(yAccessor_rh(r)) - Math.sqrt(2) * 5 / 2;
	// 	incline[i].style.transform = 'translate(' + xPx + 'px, ' + yPx + 'px) rotate(45)';
	// }

	console.log(ran_data_rh);

}


function newData() {
	let ran_data = [];
	for (var i = 0; i < 25; i++) {
		ran_data.push([Math.random() * 20, Math.random() * 20])
	}
	return ran_data
}

function newData_rh() {
	let ran_data_rh = [];
	for (var i = 0; i < 25; i++) {
		ran_data_rh.push([Math.random() * 20, Math.random() * 20])
	}
	return ran_data_rh
}



scatterPlot(newData(), newData_rh());

function update() {
	document.querySelector("svg").remove()
	scatterPlot(newData(), newData_rh())
}


// document.querySelector("#clear").addEventListener("click"){
// 	document.querySelector("#wrapper > svg > g > g:nth-child(4)").remove();
// }
function cl1() {
	document.querySelector("#wrapper > svg > g > g:nth-child(4)").remove()
	document.querySelector("#rhombuses").remove()
}