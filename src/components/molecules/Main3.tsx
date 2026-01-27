/* eslint-disable no-param-reassign */
import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import * as d3 from 'd3';
import type { SimulationNodeDatum, Simulation } from 'd3';
import { shallow } from 'zustand/shallow';
import { useGraphStore } from '@/store/graph';
import type { Vertex } from '@/types/graph';
import { useArrowStore, useShortestPathStore } from '@/store';
import { MAIN_COLOR, SECOND_COLOR } from '@/constants';
import { isShortestEdge } from '@/services';

const arrowMarkId = 'arrow';
const WIDTH = 542;
const HEIGHT = 542;

type SimulationNode = SimulationNodeDatum & Vertex;
type SimulationLink = {
  source: SimulationNode;
  target: SimulationNode;
  cost: number;
};

export default function App() {
  // svg ref element
  const svgRef = useRef<SVGSVGElement | null>(null);
  // d3 forceSimulation 반환값
  const simulationRef = useRef<Simulation<SimulationNode, undefined>>();
  // 현재 드래깅 되는 노드
  const draggingNodeRef = useRef<SimulationNode | null>(null);
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  const nodes = useGraphStore((state) => state.nodes, shallow) as SimulationNode[];
  const links = useGraphStore((state) => state.links, shallow) as unknown as SimulationLink[];

  // 마커 표시 여부
  const isArrow = useArrowStore((state) => state.isArrow);
  // 최단경로
  const shortestPathState = useShortestPathStore(({ from, to, shortestPath }) => ({ from, to, shortestPath }), shallow);

  // Simulation 초기화 - tick에서 forceUpdate만 호출
  useEffect(() => {
    simulationRef.current = d3
      .forceSimulation(nodes)
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
      .on('tick', forceUpdate);

    return () => {
      simulationRef.current?.stop();
    };
  }, [nodes, links]);

  // Pointer event handlers for drag
  // 실제 element size, viewbox 싱크를 위한 좌표 반환
  const getPointerPosition = useCallback((e: React.PointerEvent): { x: number; y: number } | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    return { x: svgP.x, y: svgP.y };
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent, node: SimulationNode) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    simulationRef.current?.alphaTarget(0.3).restart();
    node.fx = node.x;
    node.fy = node.y;
    draggingNodeRef.current = node;
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const node = draggingNodeRef.current;
      if (!node) return;
      const pos = getPointerPosition(e);
      if (pos) {
        node.fx = pos.x;
        node.fy = pos.y;
      }
    },
    [getPointerPosition],
  );

  const handlePointerUp = useCallback(() => {
    const node = draggingNodeRef.current;
    if (!node) return;
    simulationRef.current?.alphaTarget(0);
    node.fx = null;
    node.fy = null;
    draggingNodeRef.current = null;
  }, []);

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} ref={svgRef}>
      {/* Arrow marker 정의 */}
      <defs>
        <marker
          id={arrowMarkId}
          viewBox="0 0 10 10"
          refX="24"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={MAIN_COLOR} />
        </marker>
      </defs>

      {/* Links (edges) */}
      <g strokeOpacity={0.8} strokeLinecap="round">
        {links.map((link, index) => {
          const { source, target, cost } = link;
          const pathId = `edge-path-${index}`;
          const isShortestLink = isShortestEdge(source.value, target.value, shortestPathState.shortestPath);

          return (
            // eslint-disable-next-line react/no-array-index-key
            <React.Fragment key={`${source.value}-${target.value}-${index}`}>
              <path
                id={pathId}
                d={`M ${source.x ?? 0} ${source.y ?? 0} L ${target.x ?? 0} ${target.y ?? 0}`}
                strokeWidth={isShortestLink ? 9 : 2}
                stroke={isShortestLink ? SECOND_COLOR : MAIN_COLOR}
                fill="none"
              />
              {isShortestLink && (
                <path
                  d={`M ${source.x ?? 0} ${source.y ?? 0} L ${target.x ?? 0} ${target.y ?? 0}`}
                  strokeWidth={2}
                  stroke={MAIN_COLOR}
                  fill="none"
                  markerEnd={isArrow ? `url(#${arrowMarkId})` : ''}
                />
              )}
              {!isShortestLink && isArrow && (
                <path
                  d={`M ${source.x ?? 0} ${source.y ?? 0} L ${target.x ?? 0} ${target.y ?? 0}`}
                  strokeWidth={2}
                  stroke={MAIN_COLOR}
                  fill="none"
                  markerEnd={`url(#${arrowMarkId})`}
                />
              )}
              {cost !== undefined && (
                <text
                  className="pointer-events-none"
                  dy="-4"
                  dx="60"
                  fontSize="12"
                  fill={MAIN_COLOR}
                  textAnchor="middle"
                >
                  <textPath xlinkHref={`#${pathId}`}>{cost}</textPath>
                </text>
              )}
            </React.Fragment>
          );
        })}
      </g>

      {/* Nodes (circles) */}
      <g stroke={MAIN_COLOR} strokeOpacity={1} strokeWidth={2.5}>
        {nodes.map((node) => {
          const isShortestVertex = shortestPathState.shortestPath.some((vertex) => vertex === node.value);

          return (
            <circle
              key={node.value}
              className="cursor-pointer"
              cx={node.x ?? 0}
              cy={node.y ?? 0}
              r={17.5}
              fill={isShortestVertex ? SECOND_COLOR : MAIN_COLOR}
              onPointerDown={(e) => handlePointerDown(e, node)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onMouseEnter={(e) => {
                e.currentTarget.setAttribute('fill', SECOND_COLOR);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.setAttribute('fill', isShortestVertex ? SECOND_COLOR : MAIN_COLOR);
              }}
            />
          );
        })}
      </g>

      {/* Node labels */}
      <g className="pointer-events-none" fill="white" fontSize={12}>
        {nodes.map((node) => (
          <text key={`label-${node.value}`} x={node.x ?? 0} y={node.y ?? 0} textAnchor="middle" dy="6">
            {node.value}
          </text>
        ))}
      </g>
    </svg>
  );
}
