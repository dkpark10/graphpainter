import { createTree } from './createTree';

describe('createTree', () => {
  test('트리 생성', () => {
    const rawInput = `
      1 2
      1 3
      2 4
      2 5
      3 6
      3 7`;

    const result = createTree({ root: '1', rawInput });

    expect(result).toEqual({
      name: '1',
      children: [
        {
          name: '2',
          children: [
            { name: '4', children: [] },
            { name: '5', children: [] },
          ],
        },
        {
          name: '3',
          children: [
            { name: '6', children: [] },
            { name: '7', children: [] },
          ],
        },
      ],
    });
  });

  test('단일 노드 트리', () => {
    const rawInput = `1 2`;

    const result = createTree({ root: '1', rawInput });

    expect(result).toEqual({
      name: '1',
      children: [{ name: '2', children: [] }],
    });
  });

  test('깊은 트리', () => {
    const rawInput = `
      a b
      b c
      c d`;

    const result = createTree({ root: 'a', rawInput });

    expect(result).toEqual({
      name: 'a',
      children: [
        {
          name: 'b',
          children: [
            {
              name: 'c',
              children: [{ name: 'd', children: [] }],
            },
          ],
        },
      ],
    });
  });

  test('다른 root로 시작해도 모든 노드 포함', () => {
    const rawInput = `
      1 2
      1 3
      2 4`;

    const result = createTree({ root: '2', rawInput });

    // 2를 root로 하면: 2 -> [1, 4], 1 -> [3]
    expect(result).toEqual({
      name: '2',
      children: [
        {
          name: '1',
          children: [{ name: '3', children: [] }],
        },
        { name: '4', children: [] },
      ],
    });
  });
});
