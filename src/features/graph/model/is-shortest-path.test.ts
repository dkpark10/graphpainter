import { isShortestEdge } from './is-shortest-path';

describe('isShortestEdge', () => {
  describe('빈 경로 처리', () => {
    test('빈 배열일 때 false 반환', () => {
      expect(isShortestEdge('1', '2', [])).toBe(false);
    });
  });

  describe('최단경로에 포함된 엣지', () => {
    test('연속된 노드는 true 반환', () => {
      const shortestPath = ['1', '2', '3', '4'];

      expect(isShortestEdge('1', '2', shortestPath)).toBe(true);
      expect(isShortestEdge('2', '3', shortestPath)).toBe(true);
      expect(isShortestEdge('3', '4', shortestPath)).toBe(true);
    });

    test('역방향 연속 노드도 true 반환', () => {
      const shortestPath = ['1', '2', '3', '4'];

      expect(isShortestEdge('2', '1', shortestPath)).toBe(true);
      expect(isShortestEdge('3', '2', shortestPath)).toBe(true);
      expect(isShortestEdge('4', '3', shortestPath)).toBe(true);
    });
  });

  describe('최단경로에 포함되지 않은 엣지', () => {
    test('연속되지 않은 노드는 false 반환', () => {
      const shortestPath = ['1', '2', '3', '4'];

      expect(isShortestEdge('1', '3', shortestPath)).toBe(false);
      expect(isShortestEdge('1', '4', shortestPath)).toBe(false);
      expect(isShortestEdge('2', '4', shortestPath)).toBe(false);
    });

    test('경로에 없는 노드는 false 반환', () => {
      const shortestPath = ['1', '2', '3'];

      expect(isShortestEdge('1', '5', shortestPath)).toBe(false);
      expect(isShortestEdge('5', '6', shortestPath)).toBe(false);
      expect(isShortestEdge('4', '5', shortestPath)).toBe(false);
    });

    test('source만 경로에 있을 때 false 반환', () => {
      const shortestPath = ['1', '2', '3'];

      expect(isShortestEdge('1', '99', shortestPath)).toBe(false);
    });

    test('target만 경로에 있을 때 false 반환', () => {
      const shortestPath = ['1', '2', '3'];

      expect(isShortestEdge('99', '1', shortestPath)).toBe(false);
    });
  });

  describe('경계 케이스', () => {
    test('노드가 하나인 경로', () => {
      const shortestPath = ['1'];

      expect(isShortestEdge('1', '1', shortestPath)).toBe(true);
      expect(isShortestEdge('1', '2', shortestPath)).toBe(false);
    });

    test('노드가 두 개인 경로', () => {
      const shortestPath = ['A', 'B'];

      expect(isShortestEdge('A', 'B', shortestPath)).toBe(true);
      expect(isShortestEdge('B', 'A', shortestPath)).toBe(true);
    });

    test('문자열 노드 이름', () => {
      const shortestPath = ['start', 'middle', 'end'];

      expect(isShortestEdge('start', 'middle', shortestPath)).toBe(true);
      expect(isShortestEdge('middle', 'end', shortestPath)).toBe(true);
      expect(isShortestEdge('start', 'end', shortestPath)).toBe(false);
    });
  });
});
