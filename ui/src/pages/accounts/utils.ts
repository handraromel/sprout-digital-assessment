import type { AccountTreeNode, DropdownOption } from "@/types";

export function flattenAccountTreeForDropdown(
  nodes: AccountTreeNode[],
  level: number = 0,
): DropdownOption[] {
  const result: DropdownOption[] = [];

  for (const node of nodes) {
    const hasChildren = node.children && node.children.length > 0;
    const isFirstLevel = level === 0;
    const isLastLevel = level >= 2;

    result.push({
      value: node.id,
      label: `${node.code}  -  ${node.name}`,
      level,
      disabled: !hasChildren && !isFirstLevel && isLastLevel,
    });

    if (hasChildren) {
      result.push(...flattenAccountTreeForDropdown(node.children, level + 1));
    }
  }

  return result;
}
