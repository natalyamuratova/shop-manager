import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { HierarchyCircularLink, HierarchyCircularNode, HierarchyNode, Selection } from 'd3';
import './app-tree-d3.css';
import TreeData from '../../models/tree-data';

export type TreeNodeEventClickCallback = (node: HierarchyCircularNode<TreeData>, event: PointerEvent) => any;
export type TreeLinkEventClickCallback = (sourceNode: HierarchyCircularNode<TreeData>, targetNode: HierarchyCircularNode<TreeData>, event: PointerEvent) => any;

interface AppTreeProps {
    data: TreeData;
    nodeClickable: boolean;
    linkClickable: boolean;
    onNodeClick?: TreeNodeEventClickCallback;
    onLinkClick?: TreeLinkEventClickCallback;
}

const MEANINGLESS_COLOR = 'yellow';
const MEANINGFUL_COLOR = 'black';

export const AppTreeD3 = (props: AppTreeProps) => {
	const { data } = props;
	const wrapperRef = useRef<HTMLDivElement>(null);
	const svgRef = useRef<SVGSVGElement>(null);

	const buildNodes = (svg: Selection<Element | null, unknown, null, undefined>, root: HierarchyNode<TreeData>) => {
		const nodes = svg.selectAll('.node');
		nodes.data<HierarchyCircularNode<TreeData>>(root.descendants() as HierarchyCircularNode<TreeData>[])
			.join('circle')
			.attr('class', 'node')
			.attr('r', 10)
			.attr('fill', (node) => node.data.meaningful === false ? MEANINGLESS_COLOR : MEANINGFUL_COLOR)
			.attr('cx', node => node.y)
			.attr('cy', node => node.x)
			.attr('opacity', 0)
			.transition()
			.duration(500)
			.delay((node) => node.depth * 500)
			.attr('opacity', 1);

		if (props.nodeClickable) {
			nodes.attr('class', 'node node-clickable');
		}

		if (props.onNodeClick) {
			nodes.on('click', (event: PointerEvent, node: unknown) => {
				props?.onNodeClick?.((node as HierarchyCircularNode<TreeData>), event);
			});
		}
	};

	const buildLinks  = (svg: Selection<Element | null, unknown, null, undefined>, root: HierarchyNode<TreeData>) => {
		const linkGenerator = d3.linkHorizontal<HierarchyCircularLink<TreeData>, HierarchyCircularNode<TreeData>>()
			.x(node => node.y)
			.y(node => node.x);

		const links = svg.selectAll('.link');
		links.data<HierarchyCircularLink<TreeData>>(root.links() as HierarchyCircularLink<TreeData>[])
			.join('path')
			.attr('class', 'link')
			.attr('fill', 'none')
			.attr('stroke', (link) => link.target.data.meaningful === false ? MEANINGLESS_COLOR : MEANINGFUL_COLOR)
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
			links.attr('class', 'link link-clickable');
		}

		if (props.onLinkClick) {
			links.on('click', (event: PointerEvent, link: unknown) => {
				const { source, target } = link as HierarchyCircularLink<TreeData>;
				props?.onLinkClick?.(source, target, event);
			});
		}
	};

	const buildLabels = (svg: Selection<Element | null, unknown, null, undefined>, root: HierarchyNode<TreeData>) => {
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
	};

	const buildTree = () => {
		const root = d3.hierarchy(props.data);

		const rect = wrapperRef.current?.getBoundingClientRect();
		const width = rect?.width ?? 500;
		const height = rect?.height ?? 500;
		const treeLayout = d3.tree().size([height, width]);

		treeLayout(root);

		const svg = d3.select<Element | null, unknown>(svgRef.current);
		buildNodes(svg, root);
		buildLinks(svg, root);
		buildLabels(svg, root);
	};

	useEffect(() => {
		buildTree();
	}, [data]);

	return (
		<div ref={wrapperRef}
			className="app-tree">
			<svg ref={svgRef}></svg>
		</div>
	);
};
AppTreeD3.defaultProps = { nodeClickable: true, linkClickable: false };