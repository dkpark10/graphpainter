/* eslint-disable no-param-reassign */

import * as d3 from 'd3-hierarchy';
import React, { useCallback, useMemo, useRef, useReducer } from 'react';
import { useGraphStore, useTreeRoot } from '@/shared/lib';
import { sizes } from '../config';
import { createTree } from '../model';

const { WIDTH, HEIGHT, nodeRadius, fontSize } = sizes;
interface TreeNode {
  name: string;
  children: TreeNode[];
}

interface HierarchyNode extends d3.HierarchyPointNode<TreeNode> {
  fx?: number | null;
  fy?: number | null;
}

export default function TreeCanvas() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const draggingNodeRef = useRef<HierarchyNode | null>(null);
  const prevTreeDataRef = useRef<TreeNode | null>(null);
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  const rawInput = useGraphStore((state) => state.tree.rawInputData);
  const nodes = useGraphStore((state) => state.tree.nodes);
  const root = useTreeRoot((state) => state.root);

  const isValidRoot = useMemo(() => nodes.some((node) => node.value === root), [nodes, root]);

  const treeData = useMemo(() => {
    // root가 유효하지 않으면 이전 트리 데이터 유지
    if (!isValidRoot) {
      return prevTreeDataRef.current;
    }

    const newTreeData = createTree({ root, rawInput });
    prevTreeDataRef.current = newTreeData;
    return newTreeData;
  }, [rawInput, root, isValidRoot]);

  const { treeNodes, treeLinks } = useMemo(() => {
    if (!treeData) {
      return { treeNodes: [], treeLinks: [] };
    }

    const hierarchyRoot = d3.hierarchy(treeData);
    const treeLayout = d3.tree<TreeNode>().size([WIDTH - 60, HEIGHT - 80]);
    const layoutRoot = treeLayout(hierarchyRoot);

    const descendantNodes = layoutRoot.descendants() as HierarchyNode[];
    descendantNodes.forEach((node) => {
      node.y += 40;
      node.x += 30;
    });

    return {
      treeNodes: descendantNodes,
      treeLinks: layoutRoot.links(),
    };
  }, [treeData]);

  const getPointerPosition = useCallback((e: React.PointerEvent): { x: number; y: number } | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    return { x: svgP.x, y: svgP.y };
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent, node: HierarchyNode) => {
    e.currentTarget.setPointerCapture(e.pointerId);
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
        node.x = pos.x;
        node.y = pos.y;
        forceUpdate();
      }
    },
    [getPointerPosition],
  );

  const handlePointerUp = useCallback(() => {
    const node = draggingNodeRef.current;
    if (!node) return;
    node.fx = null;
    node.fy = null;
    draggingNodeRef.current = null;
  }, []);

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} ref={svgRef}>
      {/* Links (edges) */}
      <g fill="none" stroke="var(--graph-main)" strokeWidth={2} strokeOpacity={0.8}>
        {treeLinks.map((link, index) => {
          const sourceNode = link.source as HierarchyNode;
          const targetNode = link.target as HierarchyNode;

          const pathD = `
            M ${sourceNode.x} ${sourceNode.y}
            C ${sourceNode.x} ${(sourceNode.y + targetNode.y) / 2},
              ${targetNode.x} ${(sourceNode.y + targetNode.y) / 2},
              ${targetNode.x} ${targetNode.y}
          `;

          return (
            <path
              // eslint-disable-next-line react/no-array-index-key
              key={`link-${index}`}
              d={pathD}
            />
          );
        })}
      </g>

      {/* Nodes (circles) */}
      <g stroke="var(--graph-main)" strokeWidth={2.5}>
        {treeNodes.map((node) => (
          <circle
            key={`node-${node.data.name}`}
            className="cursor-pointer"
            cx={node.x}
            cy={node.y}
            r={nodeRadius}
            fill="var(--graph-main)"
            onPointerDown={(e) => handlePointerDown(e, node)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onMouseEnter={(e) => {
              e.currentTarget.setAttribute('fill', 'var(--graph-accent)');
            }}
            onMouseLeave={(e) => {
              e.currentTarget.setAttribute('fill', 'var(--graph-main)');
            }}
          />
        ))}
      </g>

      {/* Node labels */}
      <g className="pointer-events-none" fill="white" fontSize={fontSize}>
        {treeNodes.map((node) => (
          <text key={`label-${node.data.name}`} x={node.x} y={node.y} textAnchor="middle" dy="4">
            {node.data.name}
          </text>
        ))}
      </g>
    </svg>
  );
}
