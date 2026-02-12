import { TextField } from "@/components/inputs";
import type {
  TreeTableColumn,
  TreeTableConfig,
  TreeTableInlineAction,
} from "@/types";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { Button } from "../Button";
import { TreeTableSkeleton } from "./TreeTableSkeleton";
import { flattenTree } from "./utils";

interface TreeTableProps<TData> extends TreeTableConfig<TData> {
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  searchClassName?: string;
  onAdd?: () => void;
  addButtonLabel?: string;
  addButtonClassName?: string;
  headerActions?: ReactNode;
  isSystemRow?: (row: TData) => boolean;
  sectionGap?: boolean;
}

function InlineActions<TData>({
  actions,
  row,
  isSystem,
}: {
  actions: TreeTableInlineAction<TData>[];
  row: TData;
  isSystem: boolean;
}) {
  if (isSystem) {
    return (
      <span className="ml-2 inline-flex items-center">
        <LockClosedIcon className="h-4 w-4 text-gray-400" />
      </span>
    );
  }

  return (
    <span className="ml-2 inline-flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
      {actions
        .filter((action) => {
          if (typeof action.enabled === "function") {
            return action.enabled(row);
          }
          return action.enabled !== false;
        })
        .map((action, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick(row);
            }}
            className={`rounded p-1 transition-colors ${action.colorClass || "hover:bg-gray-200"}`}
            title={action.label}
          >
            {action.icon}
          </button>
        ))}
    </span>
  );
}

// Group flattened rows by sections (level 0)
function groupBySection<TData>(
  flatRows: {
    data: TData;
    level: number;
    isExpanded: boolean;
    hasChildren: boolean;
    isLastChild: boolean;
    parentConnectors: boolean[];
  }[],
  getRowLevel: (row: TData) => number,
): {
  data: TData;
  level: number;
  isExpanded: boolean;
  hasChildren: boolean;
  isLastChild: boolean;
  parentConnectors: boolean[];
}[][] {
  const sections: (typeof flatRows)[] = [];
  let currentSection: typeof flatRows = [];

  for (const row of flatRows) {
    if (getRowLevel(row.data) === 0) {
      if (currentSection.length > 0) {
        sections.push(currentSection);
      }
      currentSection = [row];
    } else {
      currentSection.push(row);
    }
  }
  if (currentSection.length > 0) {
    sections.push(currentSection);
  }
  return sections;
}

export const TreeTable = <TData,>({
  data,
  columns,
  getRowId,
  getChildren,
  getRowLevel,
  isRowExpandable,
  expandedIds,
  onToggleExpand,
  levelStyles = {},
  inlineActions,
  inlineActionsColumnIndex = 1,
  isLoading = false,
  emptyMessage = "Data tidak tersedia",
  showSearch = false,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Cari akun...",
  searchClassName,
  onAdd,
  addButtonLabel = "Tambah",
  addButtonClassName,
  headerActions,
  isSystemRow,
}: TreeTableProps<TData>) => {
  const flattenedRows = useMemo(() => {
    return flattenTree(data, getChildren, getRowId, expandedIds, getRowLevel);
  }, [data, getChildren, getRowId, expandedIds, getRowLevel]);

  const sections = useMemo(() => {
    return groupBySection(flattenedRows, getRowLevel);
  }, [flattenedRows, getRowLevel]);

  const defaultLevelStyles: Record<number, string> = {
    0: "bg-white font-bold",
    1: "bg-purple-50/60 font-semibold",
  };

  const mergedLevelStyles = { ...defaultLevelStyles, ...levelStyles };

  // Indent amount based on level
  const getIndent = (level: number) => level * 24;

  const renderCell = (
    column: TreeTableColumn<TData>,
    row: TData,
    level: number,
    columnIndex: number,
    hasChildren: boolean,
    isExpanded: boolean,
    isSystem: boolean,
  ) => {
    const content = column.cell(row, level);
    const isFirstColumn = columnIndex === 0;
    const showInlineActions =
      inlineActions &&
      inlineActions.length > 0 &&
      columnIndex === inlineActionsColumnIndex;

    return (
      <td
        key={column.id}
        className={`py-3 pr-16 pl-4 text-sm whitespace-nowrap ${
          column.align === "center"
            ? "text-center"
            : column.align === "right"
              ? "text-right"
              : "text-left"
        }`}
        style={column.width ? { width: column.width } : undefined}
      >
        <div
          className={`flex items-center ${
            column.align === "right" ? "justify-end" : ""
          }`}
          style={
            isFirstColumn ? { paddingLeft: `${getIndent(level)}px` } : undefined
          }
        >
          {isFirstColumn && hasChildren && (
            <span className="mr-2 flex h-5 w-5 shrink-0 items-center justify-center">
              {isExpanded ? (
                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRightIcon className="h-4 w-4 text-gray-500" />
              )}
            </span>
          )}
          {isFirstColumn && !hasChildren && level > 0 && (
            <span className="mr-2 w-5 shrink-0" />
          )}
          <span>{content}</span>
          {showInlineActions && inlineActions && (
            <InlineActions
              actions={inlineActions}
              row={row}
              isSystem={isSystem}
            />
          )}
        </div>
      </td>
    );
  };

  const searchAndActions = (showSearch || onAdd) && (
    <div className="mb-4 flex items-center justify-between gap-4">
      {showSearch && (
        <div className={searchClassName || "w-full max-w-md"}>
          <TextField
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
          />
        </div>
      )}
      <div className="flex items-center gap-2">
        {headerActions}
        {onAdd && (
          <Button
            variant="primary"
            onClick={onAdd}
            className={addButtonClassName}
            icon={<PlusIcon className="h-5 w-5" />}
          >
            {addButtonLabel}
          </Button>
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="w-full">
        <TreeTableSkeleton showSearch={showSearch} />
      </div>
    );
  }

  if (flattenedRows.length === 0) {
    return (
      <div className="w-full">
        {searchAndActions}
        <div className="border-border overflow-hidden rounded-lg border bg-white">
          <div className="text-foreground-muted px-4 py-12 text-center">
            {emptyMessage}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {searchAndActions}

      <div className="flex flex-col gap-4">
        {sections.map((sectionRows, sectionIndex) => (
          <div
            key={sectionIndex}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
          >
            <table className="w-full min-w-max table-auto">
              <tbody>
                {sectionRows.map((flatRow, rowIndex) => {
                  const rowId = getRowId(flatRow.data);
                  const rowLevel = flatRow.level;
                  const isExpandable = isRowExpandable
                    ? isRowExpandable(flatRow.data)
                    : flatRow.hasChildren;
                  const isSystem = isSystemRow
                    ? isSystemRow(flatRow.data)
                    : false;
                  const levelClassName = mergedLevelStyles[rowLevel] || "";
                  const isLastRow = rowIndex === sectionRows.length - 1;

                  const rowHoverClass =
                    rowLevel === 0
                      ? "hover:bg-gray-50"
                      : rowLevel === 1
                        ? "hover:bg-purple-100/50"
                        : "hover:bg-gray-50";

                  return (
                    <tr
                      key={rowId}
                      onClick={
                        isExpandable ? () => onToggleExpand(rowId) : undefined
                      }
                      className={`group text-foreground transition-colors ${levelClassName} ${rowHoverClass} ${
                        isExpandable ? "cursor-pointer" : ""
                      } ${!isLastRow ? "border-b border-gray-100" : ""}`}
                    >
                      {columns.map((column, colIndex) =>
                        renderCell(
                          column,
                          flatRow.data,
                          rowLevel,
                          colIndex,
                          isExpandable,
                          flatRow.isExpanded,
                          isSystem,
                        ),
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};
