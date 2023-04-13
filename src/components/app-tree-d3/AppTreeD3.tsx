import React, {useEffect, useRef} from "react";
import {TreeData} from "../app-tree/AppTree";
import * as d3 from "d3";
import './app-tree-d3.css';
import {HierarchyCircularLink, HierarchyCircularNode} from "d3";

interface AppTreeProps {
    data: TreeData;
}

export const AppTreeD3 = (props: AppTreeProps) => {
    const wrapperRef = useRef(null);
    const svgRef = useRef(null);

    useEffect(() => {
        const root = d3.hierarchy(props.data);
        const treeLayout = d3.tree().size([500, 500]);

        treeLayout(root);

        const linkGenerator = d3.linkHorizontal<HierarchyCircularLink<TreeData>, HierarchyCircularNode<TreeData>>()
            // .source(link => link.source)
            //  .target(link => link.target)
            .x(node => node.y)
            .y(node => node.x);

        const svg = d3.select(svgRef.current);
        svg
            .selectAll(".node")
            .data<HierarchyCircularNode<TreeData>>(root.descendants() as HierarchyCircularNode<TreeData>[])
            .join("circle")
            .attr("class", "node")
            .attr("r", 4)
            .attr("fill", "black")
            .attr("cx", node => node.y)
            .attr("cy", node => node.x);

        svg
            .selectAll(".link")
            .data<HierarchyCircularLink<TreeData>>(root.links() as HierarchyCircularLink<TreeData>[])
            .join("path")
            .attr("class", "link")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("d", linkGenerator);

        svg
            .selectAll(".label")
            .data<HierarchyCircularNode<TreeData>>(root.descendants() as HierarchyCircularNode<TreeData>[])
            .join("text")
            .attr("class", "label")
            .text(node => node.data.name)
            .attr("text-anchor", "middle")
            .attr("font-size", 18)
            .attr("x", node => node.y)
            .attr("y", node => node.x - 10);


    }, [props.data]);

    return (
        <div ref={wrapperRef}
             className="app-tree">
            <svg ref={svgRef}></svg>
        </div>
    );
}