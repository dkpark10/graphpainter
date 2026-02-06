/* eslint-disable no-param-reassign */

import React, { useCallback, useMemo, useRef, useReducer } from 'react';
import * as d3 from 'd3-hierarchy';
import { shallow } from 'zustand/shallow';
import { useGraphStore } from '@/store/graph';
import { useTreeRoot } from '@/store/tree-root';
import { BUILD_TARGET } from '@/utils';

const WIDTH = BUILD_TARGET === 'extension' ? 372 : 542;
const HEIGHT = BUILD_TARGET === 'extension' ? 372 : 542;
const nodeRadius = BUILD_TARGET === 'extension' ? 14 : 16;
const fontSize = BUILD_TARGET === 'extension' ? 10 : 12;

interface TreeNode {
  value: string;
  children?: TreeNode[];
}

interface HierarchyNode extends d3.HierarchyPointNode<TreeNode> {
  fx?: number | null;
  fy?: number | null;
}

function buildTree(rawInput: string, rootValue: string): TreeNode | null {
  const lines = rawInput.trim().split('\n').filter(Boolean);
  if (lines.length === 0) return null;

  const adjacency = new Map<string, Set<string>>();
  const allNodes = new Set<string>();

  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 2) {
      const [from, to] = parts;
      allNodes.add(from);
      allNodes.add(to);

      if (!adjacency.has(from)) adjacency.set(from, new Set());
      if (!adjacency.has(to)) adjacency.set(to, new Set());

      adjacency.get(from)!.add(to);
      adjacency.get(to)!.add(from);
    }
  }

  // root 결정
  let root: string | null = rootValue || null;

  if (!root || !allNodes.has(root)) {
    // root가 없거나 유효하지 않으면 첫 번째 노드
    root = allNodes.values().next().value ?? null;
  }

  if (!root) return null;

  // BFS로 트리 구조 생성
  const visited = new Set<string>();

  function buildNode(value: string): TreeNode {
    visited.add(value);
    const neighbors = adjacency.get(value) || new Set();
    const children: TreeNode[] = [];

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        children.push(buildNode(neighbor));
      }
    }

    if (children.length === 0) {
      return { value };
    }

    return { value, children };
  }

  return buildNode(root);
}

export default function Tree() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const draggingNodeRef = useRef<HierarchyNode | null>(null);
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  const rawInputData = useGraphStore((state) => state.tree.rawInputData);
  const root = useTreeRoot((state) => state.root);

  const treeData = useMemo(() => buildTree(rawInputData, root), [rawInputData, root]);

  const { treeNodes, treeLinks } = useMemo(() => {
    if (!treeData) {
      return { treeNodes: [], treeLinks: [] };
    }

    const hierarchyRoot = d3.hierarchy(treeData);
    const treeLayout = d3.tree<TreeNode>().size([WIDTH - 60, HEIGHT - 80]);
    const layoutRoot = treeLayout(hierarchyRoot);

    const nodes = layoutRoot.descendants() as HierarchyNode[];
    nodes.forEach((node) => {
      node.y += 40;
      node.x += 30;
    });

    return {
      treeNodes: nodes,
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

  if (!treeData) {
    return (
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        <text x={WIDTH / 2} y={HEIGHT / 2} textAnchor="middle" fill="var(--graph-main)" fontSize={14}>
          No tree data
        </text>
      </svg>
    );
  }

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
            key={`node-${node.data.value}`}
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
          <text key={`label-${node.data.value}`} x={node.x} y={node.y} textAnchor="middle" dy="4">
            {node.data.value}
          </text>
        ))}
      </g>
    </svg>
  );
}
