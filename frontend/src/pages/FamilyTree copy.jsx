import React, { useEffect } from "react";
import * as d3 from "d3";
import { hierarchy, tree } from "d3-hierarchy";

const FamilyTree = () => {
  useEffect(() => {
    const margin = { top: 100, right: 50, bottom: 100, left: 50 },
      width = 900 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    const svg = d3
      .select("#tree-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Use the 'parents' attribute to define the children
    const root = hierarchy(getData(), (d) => d.parents);
    const treeLayout = tree().size([width, height]);
    treeLayout(root);

    const nodes = root.descendants();
    const links = root.links();

    const node = svg
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x},${height - d.y})`);

    node
      .append("rect")
      .attr("width", 140)
      .attr("height", 80)
      .attr("fill", "tan")
      .attr("x", -70)
      .attr("y", -40);

    node
      .append("text")
      .attr("font-size", "16px")
      .attr("fill", "black")
      .attr("y", -15)
      .style("text-anchor", "middle")
      .text((d) => d.data.name);

    node
      .append("text")
      .attr("font-size", "12px")
      .attr("y", 10)
      .style("text-anchor", "middle")
      .text((d) => `${d.data.born}–${d.data.died}`);

    node
      .append("text")
      .attr("font-size", "11px")
      .attr("y", 28)
      .style("text-anchor", "middle")
      .text((d) => d.data.location);

    svg
      .selectAll(".link")
      .data(links)
      .enter()
      .insert("path", "g")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("shape-rendering", "crispEdges")
      .attr(
        "d",
        d3
          .linkVertical()
          .x((d) => d.x)
          .y((d) => height - d.y)
      );

    function getData() {
      return {
        name: "Clifford Shanks",
        born: 1862,
        died: 1906,
        location: "Petersburg, VA",
        parents: [
          {
            name: "James Shanks",
            born: 1831,
            died: 1884,
            location: "Petersburg, VA",
            parents: [
              {
                name: "Robert Shanks",
                born: 1781,
                died: 1871,
                location: "Ireland/Petersburg, VA",
              },
              {
                name: "Elizabeth Shanks",
                born: 1795,
                died: 1871,
                location: "Ireland/Petersburg, VA",
              },
            ],
          },
          {
            name: "Ann Emily Brown",
            born: 1826,
            died: 1866,
            location: "Brunswick/Petersburg, VA",
            parents: [
              {
                name: "Henry Brown",
                born: 1792,
                died: 1845,
                location: "Montgomery, NC",
              },
              {
                name: "Sarah Houchins",
                born: 1793,
                died: 1882,
                location: "Montgomery, NC",
              },
            ],
          },
        ],
      };
    }
  }, []);

  return <div id="tree-chart" style={{ backgroundColor: "#2c2c2c" }}></div>;
};

export default FamilyTree;
