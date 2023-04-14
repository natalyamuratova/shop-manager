import React, {useEffect, useRef} from 'react';
import {TreeData} from '../app-tree/AppTree';
import * as d3 from 'd3';
import {HierarchyCircularLink, HierarchyCircularNode} from 'd3';
import './app-tree-d3.css';

export type TreeNodeEventClickCallback = (node: HierarchyCircularNode<TreeData>, event: PointerEvent) => any;
export type TreeLinkEventClickCallback = (sourceNode: HierarchyCircularNode<TreeData>, targetNode: HierarchyCircularNode<TreeData>, event: PointerEvent) => any;

interface AppTreeProps {
    data: TreeData;
    nodeClickable: boolean;
    linkClickable: boolean;
    onNodeClick?: TreeNodeEventClickCallback;
    onLinkClick?: TreeLinkEventClickCallback;
}

export const AppTreeD3 = (props: AppTreeProps) => {
	const wrapperRef = useRef(null);
	const svgRef = useRef(null);

	useEffect(() => {
		const root = d3.hierarchy(props.data);
		const treeLayout = d3.tree().size([500, 500]);

		treeLayout(root);

		const linkGenerator = d3.linkHorizontal<HierarchyCircularLink<TreeData>, HierarchyCircularNode<TreeData>>()
			.x(node => node.y)
			.y(node => node.x);

		const svg = d3.select(svgRef.current);

		const nodes = svg.selectAll('.node');
		nodes.data<HierarchyCircularNode<TreeData>>(root.descendants() as HierarchyCircularNode<TreeData>[])
			.join('circle')
			.attr('class', 'node')
			.attr('r', 10)
			.attr('fill', 'black')
			.attr('cx', node => node.y)
			.attr('cy', node => node.x)
			.attr('opacity', 0)
			.transition()
			.duration(500)
			.delay((node) => node.depth * 500)
			.attr('opacity', 1);

		if (props.nodeClickable) {
			nodes.attr('class', 'node-clickable');
		}

		if (props.onNodeClick) {
			nodes.on('click', (event: PointerEvent, node: unknown) => {
				props?.onNodeClick?.((node as HierarchyCircularNode<TreeData>), event);
			});
		}

		const links = svg.selectAll('.link');
		links.data<HierarchyCircularLink<TreeData>>(root.links() as HierarchyCircularLink<TreeData>[])
			.join('path')
			.attr('class', 'link')
			.attr('fill', 'none')
			.attr('stroke', 'black')
			.attr('d', linkGenerator)
			.attr('stroke-dasharray', function () {
				const length = (this as SVGGeometryElement).getTotalLength();
				return `${length} ${length}`;
			})
			.attr('stroke-dashoffset', function () {
				return (this as SVGGeometryElement).getTotalLength();
			})
			.transition()
			.duration(500)
			.delay((link) => link.source.depth * 500)
			.attr('stroke-dashoffset', 0);

		if (props.linkClickable) {
			links.attr('class', 'link-clickable');
		}

		if (props.onLinkClick) {
			links.on('click', (event: PointerEvent, link: unknown) => {
				const { source, target } = link as HierarchyCircularLink<TreeData>;
				props?.onLinkClick?.(source, target, event);
			});
		}

		svg
			.selectAll('.label')
			.data<HierarchyCircularNode<TreeData>>(root.descendants() as HierarchyCircularNode<TreeData>[])
			.join('text')
			.attr('class', 'label')
			.text(node => node.data.name)
			.attr('text-anchor', 'middle')
			.attr('font-size', 18)
			.attr('x', node => node.y)
			.attr('y', node => node.x - 15)
			.attr('opacity', 0)
			.transition()
			.duration(500)
			.delay((node) => node.depth * 500)
			.attr('opacity', 1);


	}, [props.data]);

	return (
		<div ref={wrapperRef}
			className="app-tree">
			<svg ref={svgRef}></svg>
		</div>
	);
};
AppTreeD3.defaultProps = { nodeClickable: true, linkClickable: false };