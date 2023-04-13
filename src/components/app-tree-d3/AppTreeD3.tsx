import React, {useEffect, useRef} from "react";
import {TreeData} from "../app-tree/AppTree";
import * as d3 from "d3";
import './app-tree-d3.css';
import {HierarchyCircularNode} from "d3";

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

        const svg = d3.select(svgRef.current);
        svg
            .selectAll(".node")
            .data(root.descendants())
            .join("circle")
            .attr("class", "node")
            .attr("r", 4)
            .attr("fill", "black")
            .attr("cx", node => (node as HierarchyCircularNode<TreeData>)?.x)
            .attr("cy", node => (node as HierarchyCircularNode<TreeData>)?.y);

        const linkGenerator = d3.linkVertical()
           // .source(link => link.source)
          //  .target(link => link.target)
            .x(node => node[0])
            .y(node => node[1]);

    }, [props.data]);

    return (
        <div ref={wrapperRef}
             className="app-tree">
            <svg ref={svgRef}></svg>
        </div>
    );
}