interface HierarchyTree {
  name: string;
  children: HierarchyTree[];
}

interface Params {
  root: string;
  rawInput: string;
}

export const createTree = ({ root, rawInput }: Params): HierarchyTree => {
  const lines = rawInput.trim().split('\n').filter(Boolean);

  const adjacencyMap = lines.reduce((acc, line) => {
    const [a, b] = line.trim().split(/\s+/);
    if (!acc.has(a)) acc.set(a, []);
    if (!acc.has(b)) acc.set(b, []);
    acc.get(a)?.push(b);
    acc.get(b)?.push(a);
    return acc;
  }, new Map<string, string[]>());

  const visited = new Set<string>();

  const buildTree = (nodeName: string): HierarchyTree => {
    visited.add(nodeName);
    const neighbors = adjacencyMap.get(nodeName) ?? [];
    const children = neighbors.filter((neighbor) => !visited.has(neighbor)).map(buildTree);

    return {
      name: nodeName,
      children,
    };
  };

  return buildTree(root);
};
