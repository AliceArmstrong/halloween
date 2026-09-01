import { useEffect, useId, useMemo, useRef } from "react";
import * as d3 from "d3";

function getCount(votes, optionKey) {
  return votes.find((item) => item.option === optionKey)?.count || 0;
}

export default function SpotlightBattleViz({ leftOption, rightOption, votes }) {
  const svgRef = useRef(null);
  const gradientIdBase = useId().replace(/:/g, "");
  const ringGradientId = `${gradientIdBase}-ring-gradient`;

  const leftCount = useMemo(() => getCount(votes, leftOption.key), [votes, leftOption.key]);
  const rightCount = useMemo(() => getCount(votes, rightOption.key), [votes, rightOption.key]);
  const total = leftCount + rightCount;

  useEffect(() => {
    if (!svgRef.current) {
      return;
    }

    const width = 440;
    const height = 440;
    const centerX = width / 2;
    const centerY = height / 2;

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("role", "img")
      .attr("aria-label", `${leftOption.label} versus ${rightOption.label} vote split`);

    svg.selectAll("*").remove();

    const root = svg.append("g").attr("transform", `translate(${centerX}, ${centerY})`);

    const defs = svg.append("defs");

    defs
      .append("linearGradient")
      .attr("id", ringGradientId)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 32)
      .attr("y1", centerY)
      .attr("x2", width - 32)
      .attr("y2", centerY)
      .selectAll("stop")
      .data([
        { offset: "0%", color: "rgba(103, 161, 222, 0.32)" },
        { offset: "50%", color: "rgba(168, 182, 212, 0.22)" },
        { offset: "100%", color: "rgba(214, 146, 91, 0.32)" },
      ])
      .join("stop")
      .attr("offset", (d) => d.offset)
      .attr("stop-color", (d) => d.color);

    root
      .append("circle")
      .attr("r", 188)
      .attr("fill", "none")
      .attr("stroke", `url(#${ringGradientId})`)
      .attr("stroke-width", 1);

    root
      .append("circle")
      .attr("r", 156)
      .attr("fill", "none")
      .attr("stroke", `url(#${ringGradientId})`)
      .attr("stroke-width", 1);

    root
      .append("circle")
      .attr("r", 124)
      .attr("fill", "none")
      .attr("stroke", `url(#${ringGradientId})`)
      .attr("stroke-width", 1);

    root
      .append("line")
      .attr("x1", -198)
      .attr("y1", 0)
      .attr("x2", 198)
      .attr("y2", 0)
      .attr("stroke", "rgba(180, 192, 219, 0.2)")
      .attr("stroke-width", 1);

    root
      .append("line")
      .attr("x1", 0)
      .attr("y1", -198)
      .attr("x2", 0)
      .attr("y2", 198)
      .attr("stroke", "rgba(180, 192, 219, 0.2)")
      .attr("stroke-width", 1);

    const radialTicks = d3.range(0, 360, 15);
    const tickGroup = root.append("g").attr("class", "radial-ticks");

    radialTicks.forEach((angle) => {
      const radians = (angle * Math.PI) / 180;
      const inner = angle % 45 === 0 ? 162 : 170;
      const outer = 176;

      tickGroup
        .append("line")
        .attr("x1", Math.cos(radians) * inner)
        .attr("y1", Math.sin(radians) * inner)
        .attr("x2", Math.cos(radians) * outer)
        .attr("y2", Math.sin(radians) * outer)
        .attr("stroke", "rgba(178, 191, 221, 0.16)")
        .attr("stroke-width", angle % 45 === 0 ? 1.2 : 0.8);
    });

    root
      .append("circle")
      .attr("r", 98)
      .attr("fill", "none")
      .attr("stroke", "rgba(156, 171, 201, 0.24)")
      .attr("stroke-width", 1);

    const startAngle = -Math.PI / 2;
    const fullCircle = Math.PI * 2;
    const leftRatio = total === 0 ? 0.5 : leftCount / total;
    const leftArcSpan = fullCircle * leftRatio;
    const splitAngle = startAngle + leftArcSpan;
    const blendWidth = fullCircle * 0.03;
    const blueColor = d3.rgb("#2f6cb1");
    const orangeColor = d3.rgb("#b46a32");

    function normalizeAngle(angle) {
      const relative = angle - startAngle;
      return ((relative % fullCircle) + fullCircle) % fullCircle;
    }

    function shortestSignedDelta(target, current) {
      const raw = current - target;
      const wrapped = ((raw + fullCircle / 2) % fullCircle) - fullCircle / 2;
      return wrapped < -fullCircle / 2 ? wrapped + fullCircle : wrapped;
    }

    function segmentColor(angleMidpoint) {
      if (total === 0) {
        return d3.interpolateRgb(blueColor, orangeColor)(0.5);
      }

      const normalized = normalizeAngle(angleMidpoint);
      const splitBoundary = leftArcSpan;
      const startBoundary = 0;
      const deltaFromSplit = shortestSignedDelta(splitBoundary, normalized);
      const deltaFromStart = shortestSignedDelta(startBoundary, normalized);

      if (Math.abs(deltaFromSplit) <= blendWidth) {
        const t = (deltaFromSplit + blendWidth) / (blendWidth * 2);
        return d3.interpolateRgb(blueColor, orangeColor)(t);
      }

      if (Math.abs(deltaFromStart) <= blendWidth) {
        const t = (deltaFromStart + blendWidth) / (blendWidth * 2);
        return d3.interpolateRgb(orangeColor, blueColor)(t);
      }

      return normalized < leftArcSpan ? blueColor.formatRgb() : orangeColor.formatRgb();
    }

    const segmentCount = 720;
    const segmentArc = d3.arc().innerRadius(106).outerRadius(152);
    const step = fullCircle / segmentCount;

    const segments = d3.range(segmentCount).map((index) => {
      const segmentStart = startAngle + index * step;
      const segmentEnd = segmentStart + step + 0.002;
      const midpoint = segmentStart + step / 2;

      return {
        startAngle: segmentStart,
        endAngle: segmentEnd,
        color: segmentColor(midpoint),
      };
    });

    root
      .append("g")
      .attr("class", "split-arcs")
      .selectAll("path")
      .data(segments)
      .join("path")
      .attr("d", (d) => segmentArc(d))
      .attr("fill", (d) => d.color)
      .attr("opacity", total === 0 ? 0.45 : 0.92);

    root
      .append("circle")
      .attr("r", 88)
      .attr("fill", "rgba(8, 11, 20, 0.92)")
      .attr("stroke", "rgba(171, 183, 209, 0.28)")
      .attr("stroke-width", 1.2);

    root
      .append("text")
      .attr("class", "battle-vs")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text("VS");

    root
      .append("text")
      .attr("class", "battle-total")
      .attr("x", 0)
      .attr("y", 31)
      .attr("text-anchor", "middle")
      .text(`${total} total`);
  }, [
    leftOption.key,
    leftOption.label,
    rightCount,
    leftCount,
    rightOption.key,
    rightOption.label,
    total,
    ringGradientId,
  ]);

  const leftShare = total > 0 ? Math.round((leftCount / total) * 100) : 0;
  const rightShare = total > 0 ? 100 - leftShare : 0;

  return (
    <div className="battle-viz-wrap">
      <svg ref={svgRef} className="battle-viz" />
      <div className="battle-stat battle-stat-left">
        {/* <span className="battle-stat-label">{leftOption.label}</span> */}
        <strong>{leftShare}%</strong>
      </div>
      <div className="battle-stat battle-stat-right">
        {/* <span className="battle-stat-label">{rightOption.label}</span> */}
        <strong>{rightShare}%</strong>
      </div>
    </div>
  );
}
