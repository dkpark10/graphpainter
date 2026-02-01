/* eslint-disable no-param-reassign */
import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import * as d3 from 'd3-force';
import type { SimulationNodeDatum, Simulation } from 'd3-force';
import { shallow } from 'zustand/shallow';
import type { Vertex } from '@/types/graph';
import { useGraphStore } from '@/store/graph';
import { useArrowStore } from '@/store/node-arrow';
import { useShortestPathStore } from '@/store/shortestpath';
import { isShortestEdge } from '@/services';
import { BUILD_TARGET } from '@/utils';
import { useRunForce } from '@/store/run-force';

const arrowMarkId = 'arrow';
const WIDTH = BUILD_TARGET === 'extension' ? 372 : 542;
const HEIGHT = BUILD_TARGET === 'extension' ? 372 : 542;
const diameter = BUILD_TARGET === 'extension' ? 16 : 18;
const linkDistance = BUILD_TARGET === 'extension' ? 54 : 82;
const getTextDx = (d: number) => {
  return BUILD_TARGET === 'extension' ? d / 2 + d / 2 : d / 2 + d / 4;
};

type SimulationNode = SimulationNodeDatum & Vertex;
type SimulationLink = {
  source: SimulationNode;
  target: SimulationNode;
  cost: number;
};

export default function Svg() {
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
  // 시뮬레이션 실행 여부
  const runForce = useRunForce((state) => state.runForce);

  // Simulation 초기화 - tick에서 forceUpdate만 호출
  useEffect(() => {
    simulationRef.current = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d: SimulationNodeDatum) => (d as Vertex).value)
          .distance(linkDistance),
      )
      .force('charge', d3.forceManyBody().strength(-1200).distanceMin(linkDistance))
      .force('x', d3.forceX(WIDTH / 2))
      .force('y', d3.forceY(HEIGHT / 2))
      .on('tick', forceUpdate);

    return () => {
      simulationRef.current?.stop();
    };
  }, [nodes, links]);

  // 시뮬레이션 실행/정지 제어
  useEffect(() => {
    if (!simulationRef.current) return;
    if (runForce) {
      // 현재 온도를 0 이상으로 시뮬레이션 시작
      simulationRef.current.alpha(0.3).restart();
      return;
    }
    simulationRef.current.stop();
  }, [runForce]);

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

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, node: SimulationNode) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      if (runForce) {
        // 설정온도를 0 이상으로 드래그 이벤트 시작 시 시뮬레이션 움직이도록 0.3 설정
        simulationRef.current?.alphaTarget(0.3).restart();
      }
      node.fx = node.x;
      node.fy = node.y;
      draggingNodeRef.current = node;
    },
    [runForce],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const node = draggingNodeRef.current;
      if (!node) return;
      const pos = getPointerPosition(e);
      if (pos) {
        node.fx = pos.x;
        node.fy = pos.y;
        node.x = pos.x;
        node.y = pos.y;
        if (!runForce) {
          forceUpdate();
        }
      }
    },
    [getPointerPosition, runForce],
  );

  const handlePointerUp = useCallback(() => {
    const node = draggingNodeRef.current;
    if (!node) return;
    if (runForce) {
      // 드래그 이벤트 종료시 설정온도 0으로 시뮬레이션 정지하도록
      simulationRef.current?.alphaTarget(0);
      node.fx = null;
      node.fy = null;
    }
    draggingNodeRef.current = null;
  }, [runForce]);

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
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--graph-main)" />
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
                stroke={isShortestLink ? 'var(--graph-accent)' : 'var(--graph-main)'}
                fill="none"
              />
              {isShortestLink && (
                <path
                  d={`M ${source.x ?? 0} ${source.y ?? 0} L ${target.x ?? 0} ${target.y ?? 0}`}
                  strokeWidth={2}
                  stroke="var(--graph-main)"
                  fill="none"
                  markerEnd={isArrow ? `url(#${arrowMarkId})` : ''}
                />
              )}
              {!isShortestLink && isArrow && (
                <path
                  d={`M ${source.x ?? 0} ${source.y ?? 0} L ${target.x ?? 0} ${target.y ?? 0}`}
                  strokeWidth={2}
                  stroke="var(--graph-main)"
                  fill="none"
                  markerEnd={`url(#${arrowMarkId})`}
                />
              )}
              {cost !== undefined && (
                <text
                  className="pointer-events-none"
                  dy="-4"
                  dx={getTextDx(linkDistance)}
                  fontSize="12"
                  fill="var(--graph-main)"
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
      <g stroke="var(--graph-main)" strokeOpacity={1} strokeWidth={2.5}>
        {nodes.map((node) => {
          const isShortestVertex = shortestPathState.shortestPath.some((vertex) => vertex === node.value);

          return (
            <circle
              key={node.value}
              className="cursor-pointer"
              cx={node.x ?? 0}
              cy={node.y ?? 0}
              r={diameter}
              fill={isShortestVertex ? 'var(--graph-accent)' : 'var(--graph-main)'}
              onPointerDown={(e) => handlePointerDown(e, node)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onMouseEnter={(e) => {
                e.currentTarget.setAttribute('fill', 'var(--graph-accent)');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.setAttribute('fill', isShortestVertex ? 'var(--graph-accent)' : 'var(--graph-main)');
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
