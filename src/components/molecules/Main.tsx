/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { SimulationNodeDatum, Selection, BaseType, D3DragEvent } from 'd3';
import { shallow } from 'zustand/shallow';
import { useGraphStore } from '@/store/graph';
import { Vertex, AttrType } from '@/types/graph';
import { useArrowStore, useShortestPathStore } from '@/store';
import { MAIN_COLOR, SECOND_COLOR } from '@/constants';
import { isShortestEdge } from '@/services';

type DragEvent = D3DragEvent<Element, SimulationNodeDatum, SimulationNodeDatum>;

const arrowMarkId = 'arrow';
const WIDTH = 542;
const HEIGHT = 542;

/** @todo 선언형으로 바꿔보자.. */
export default function App() {
  const simulationRef = useRef<d3.Simulation<d3.SimulationNodeDatum & Vertex, undefined>>();

  const svgRef = useRef<SVGSVGElement | null>(null);

  const nodes = useGraphStore((state) => state.nodes, shallow);
  const links = useGraphStore((state) => state.links, shallow);
  const isArrow = useArrowStore((state) => state.isArrow);

  const shortestPathState = useShortestPathStore(({ from, to, shortestPath }) => ({ from, to, shortestPath }), shallow);

  useEffect(() => {
    if (!svgRef.current) return;
    if (svgRef.current) d3.selectAll('svg > *').remove();

    const svg = d3.select(svgRef.current);
    svg
      .append('defs')
      .append('marker')
      .attr('id', arrowMarkId)
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 24)
      .attr('refY', 5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto-start-reverse');

    const marker = d3.select(`#${arrowMarkId}`);
    marker.append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z').attr('fill', MAIN_COLOR);

    const link = svg
      .append('g')
      .attr('stroke-opacity', 0.8)
      .attr('stroke-linecap', 'round')
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('id', (_, i) => `edge-path-${i}`)
      .attr('stroke-width', 2)
      .attr('stroke', (l) => {
        const { source, target } = l;
        return isShortestEdge((source as Vertex).value, (target as Vertex).value, shortestPathState.shortestPath)
          ? SECOND_COLOR
          : MAIN_COLOR;
      })
      .attr('marker-end', isArrow ? `url(#${arrowMarkId})` : '');

    const costText = svg
      .append('g')
      .attr('class', 'pointer-events-none')
      .attr('fill', MAIN_COLOR)
      .attr('fontSize', 12)
      .selectAll('.cost-text')
      .data(links)
      .join('text')
      .attr('textAnchor', 'middle')
      .attr('dy', -4)
      .attr('dx', 60)
      .attr('id', (_, i) => `edge-path-${i}`);

    costText
      .append('textPath')
      .attr('xlink:href', (_, i) => `#edge-path-${i}`)
      .style('pointer-events', 'none')
      .text(({ cost }) => cost || '');

    const node = svg
      .append('g')
      .attr('class', 'cursor-pointer')
      .attr('stroke', MAIN_COLOR)
      .attr('stroke-opacity', 1)
      .attr('stroke-width', 2.5)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 17.5)
      .on('mouseenter', function hover() {
        d3.select(this).attr('fill', SECOND_COLOR);
      })
      .on('mouseleave', function hover() {
        d3.select(this).attr('fill', (d) => {
          return shortestPathState.shortestPath.some((vertex) => vertex === (d as Vertex).value)
            ? SECOND_COLOR
            : MAIN_COLOR;
        });
      })
      .attr('fill', (d) => {
        return shortestPathState.shortestPath.some((vertex) => vertex === d.value) ? SECOND_COLOR : MAIN_COLOR;
      })
      .call(
        d3
          .drag()
          .on('start', function dragStarted(e: DragEvent) {
            if (!e.active) simulationRef.current?.alphaTarget(0.3);
            e.subject.fx = e.subject.x;
            e.subject.fy = e.subject.y;
          })
          .on('drag', function dragged(e: DragEvent) {
            e.subject.fx = e.x;
            e.subject.fy = e.y;
          })
          .on('end', function dragEnded(e: DragEvent) {
            if (!e.active) simulationRef.current?.alphaTarget(0);
            e.subject.fx = null;
            e.subject.fy = null;
          }) as (
          selection: Selection<BaseType | SVGCircleElement, Vertex & SimulationNodeDatum, SVGGElement, unknown>,
        ) => void,
      );

    const nodeText = svg
      .append('g')
      .attr('class', 'pointer-events-none')
      .attr('fill', 'white')
      .attr('fontSize', 12)
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 6)
      .text((d) => d.value);

    simulationRef.current = d3
      .forceSimulation(nodes as Array<SimulationNodeDatum & Vertex>)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d: SimulationNodeDatum) => (d as Vertex).value)
          .distance(140),
      )
      .force('charge', d3.forceManyBody().strength(-240))
      .force('x', d3.forceX(WIDTH / 2))
      .force('y', d3.forceY(HEIGHT / 2))
      .on('tick', () => {
        link.attr(
          'd',
          (d: AttrType) =>
            `M ${d.source.x as number} ${d.source.y as number} L ${d.target.x as number} ${d.target.y as number}`,
        );

        node.attr('cx', (d: AttrType) => d.x as number).attr('cy', (d: AttrType) => d.y as number);
        nodeText.attr('x', (d: AttrType) => d.x as number).attr('y', (d: AttrType) => d.y as number);
      });
  }, [nodes, links, isArrow, shortestPathState]);

  return <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} ref={svgRef} />;
}
