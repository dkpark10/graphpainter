import { GraphData, Edge } from '@/shared/types';

/** @description 입력값을 d3 nodesimullink 타입으로 파싱하는 함수 */
export const createGraphData = (textAreaContent: string, LIMIT_INPUT_VALUE_LINE = 100): GraphData => {
  const inputValue = textAreaContent.split('\n');
  const nodeInfo = new Set<string>();

  const links = inputValue.reduce((acc, value, idx) => {
    const [source, target, cost] = value.split(' ');

    if (!source || idx >= LIMIT_INPUT_VALUE_LINE) {
      return acc;
    }

    nodeInfo.add(source);

    if (!target) {
      return acc;
    }

    nodeInfo.add(target);

    return [...acc, { source, target, cost: Number.isNaN(Number(cost)) ? undefined : cost }];
  }, [] as Array<Edge>);

  return {
    nodes: Array.from(nodeInfo).map((value) => ({ value })),
    links,
  };
};
