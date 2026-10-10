// Build the screen-technology buttons and connect them to histogram filtering.
const populateFilters = (data) => {
    // Step 7.3 Set up buttons and event listeners
    d3.select("#filter_screen")
        .selectAll(".filter")
        .data(filter_screen)
        .join("button")
        .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
        .text(d => d.label)

        .on("click", (e, d) => {
            if (!d.isActive) {
                filter_screen.forEach(filter => {
                    filter.isActive = d.id === filter.id ? true : false;
                });
                d3.selectAll("#filter_screen .filter")
                    .classed("active", filter => filter.id === d.id ? true : false);

                updateHistogram(d.id, data);
            }
        });
};

const updateHistogram = (filterId, data) => {
    // Step 7.4 Update the histogram
    const updatedData = filterId === "all"
        ? data
        : data.filter(d => d.screenTech === filterId);

    const updatedBins = binGenerator(updatedData);

    d3.selectAll("#histogram rect")
        .data(updatedBins)
        .transition()
        .duration(500)
        .ease(d3.easeCubicInOut)
        .attr("y", d => yScale(d.length))
        .attr("height", d => innerHeight - yScale(d.length));
};

// T06-2 Step 3: Creating a tooltip and adding function call to load-data.js
const createTooltip = () => {
    // Step 3.2 Append (a hidden) tooltip to innerChart
    const tooltip = innerChartS.append("g")
        .attr("class", "tooltip")
        .style("opacity", 0);
    // Step 3.3 Append tooltip background rectangle
    tooltip.append("rect")
        .attr("width", tooltipWidth)
        .attr("height", tooltipHeight)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("fill", barColor)
        .attr("fill-opacity", 0.75);
    // Step 3.4 Apped tooltip text
    tooltip.append("text")
        .text("NA")
        .attr("x", tooltipWidth / 2)
        .attr("y", tooltipHeight / 2 + 2)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("fill", "white")
        .style("font-weight", 900);
};

// T06-2 Step 3.5 Add functions to react to mouse events
const handleMouseEvents = () => {
    const tooltip = innerChartS.select(".tooltip");

    innerChartS.selectAll("circle")
        .on("mouseenter", (event, d) => {
            tooltip.select("text")
                .text(`${d.screenSize} inches`);

            const cx = +event.target.getAttribute("cx");
            const cy = +event.target.getAttribute("cy");

            tooltip
                .interrupt()
                .attr("transform", `translate(${cx - tooltipWidth / 2}, ${cy - 1.5 * tooltipHeight})`)
                .transition()
                .duration(200)
                .style("opacity", 1);
        })
        .on("mouseleave", () => {
            tooltip
                .interrupt()
                .transition()
                .duration(200)
                .style("opacity", 0)
                .attr("transform", "translate(0, 500)");
        });
};