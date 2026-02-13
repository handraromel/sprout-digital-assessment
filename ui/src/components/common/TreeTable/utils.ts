import type { FlattenedRow } from "@/types";

export function flattenTree<TData>(
  nodes: TData[],
  getChildren: (row: TData) => TData[],
  getRowId: (row: TData) => string,
  expandedIds: Set<string>,
  getRowLevel: (row: TData) => number,
  parentConnectors: boolean[] = [],
  isParentLastChild: boolean[] = [],
): FlattenedRow<TData>[] {
  const result: FlattenedRow<TData>[] = [];

  nodes.forEach((node, index) => {
    const children = getChildren(node);
    const hasChildren = children.length > 0;
    const isExpanded = expandedIds.has(getRowId(node));
    const isLastChild = index === nodes.length - 1;
    const level = getRowLevel(node);

    result.push({
      data: node,
      level,
      isExpanded,
      hasChildren,
      isLastChild,
      parentConnectors: [...parentConnectors],
    });

    if (hasChildren && isExpanded) {
      const childRows = flattenTree(
        children,
        getChildren,
        getRowId,
        expandedIds,
        getRowLevel,
        [...parentConnectors, !isLastChild],
        [...isParentLastChild, isLastChild],
      );
      result.push(...childRows);
    }
  });

  return result;
}
