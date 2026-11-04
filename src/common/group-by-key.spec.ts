import { groupByKey } from './group-by-key';

describe('groupByKey', () => {
  const rows = [
    { id: 1, parentId: 10 },
    { id: 2, parentId: 20 },
    { id: 3, parentId: 10 },
  ];

  it('returns groups in the order of the requested keys', () => {
    const result = groupByKey([20, 10], rows, (row) => row.parentId);

    expect(result).toEqual([
      [{ id: 2, parentId: 20 }],
      [
        { id: 1, parentId: 10 },
        { id: 3, parentId: 10 },
      ],
    ]);
  });

  it('returns an empty array for keys without rows', () => {
    expect(groupByKey([30], rows, (row) => row.parentId)).toEqual([[]]);
  });

  it('preserves the order of rows inside a group', () => {
    const [group] = groupByKey([10], rows, (row) => row.parentId);
    expect(group.map((row) => row.id)).toEqual([1, 3]);
  });
});
