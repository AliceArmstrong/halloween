import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function VoteChart({ votes, getOptionLabel }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) {
      return;
    }

    const width = 640;
    const height = 320;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("role", "img")
      .attr("aria-label", "Vote counts by option");

    svg.selectAll("*").remove();

    const x = d3
      .scaleBand()
      .domain(votes.map((d) => d.option))
      .range([margin.left, width - margin.right])
      .padding(0.25);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(votes, (d) => d.count + 1)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg
      .append("g")
      .attr("fill", "#1f8ef1")
      .selectAll("rect")
      .data(votes)
      .join("rect")
      .attr("x", (d) => x(d.option))
      .attr("y", (d) => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", (d) => y(0) - y(d.count))
      .attr("rx", 4);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0).tickFormat((d) => getOptionLabel(d)));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format("d")));

    svg
      .append("g")
      .attr("fill", "#0a0a0a")
      .selectAll("text")
      .data(votes)
      .join("text")
      .attr("x", (d) => x(d.option) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.count) - 8)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text((d) => d.count);
  }, [votes, getOptionLabel]);

  return <svg ref={svgRef} className="chart" />;
}
