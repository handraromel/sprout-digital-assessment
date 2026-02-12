import type { AccountTreeNode, DropdownOption } from "@/types";

/**
 * Flatten account tree for journal entry line's account dropdown.
 * For journal entries, parent accounts can be selected, but leaf accounts (last children) are disabled.
 */
export function flattenAccountTreeForJournal(
  nodes: AccountTreeNode[],
  level: number = 0,
): DropdownOption[] {
  const result: DropdownOption[] = [];

  for (const node of nodes) {
    const hasChildren = node.children && node.children.length > 0;

    result.push({
      value: node.id,
      label: `${node.code}  -  ${node.name}`,
      level,
      // Parents can be selected, leaf nodes are disabled
      disabled: !hasChildren,
    });

    if (hasChildren) {
      result.push(...flattenAccountTreeForJournal(node.children, level + 1));
    }
  }

  return result;
}

/**
 * Format date to YYYY-MM-DD for API
 */
export function formatDateForApi(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Parse date string to Date object
 */
export function parseDateString(dateString: string): Date {
  return new Date(dateString);
}
