import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface TreeTableSkeletonProps {
  sections?: number;
  rowsPerSection?: number;
  showSearch?: boolean;
}

/**
 * Skeleton loader for TreeTable
 * Displays animated placeholder while account tree data is being fetched
 */
export function TreeTableSkeleton({
  sections = 3,
  rowsPerSection = 4,
  showSearch = true,
}: TreeTableSkeletonProps) {
  return (
    <div className="w-full">
      {/* Search and Add Button skeleton */}
      {showSearch && (
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="relative max-w-lg flex-1">
            <div className="absolute top-1/2 left-3 -translate-y-1/2">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-300" />
            </div>
            <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
          </div>
          <div className="h-10 w-44 animate-pulse rounded-lg bg-green-200" />
        </div>
      )}

      {/* Section cards skeleton */}
      <div className="flex flex-col gap-4">
        {Array.from({ length: sections }).map((_, sectionIndex) => (
          <div
            key={sectionIndex}
            className="animate-pulse overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
          >
            <div className="space-y-3 p-4">
              {/* Header row with wider content */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-16 rounded bg-gray-300" />
                  <div className="h-4 w-32 rounded bg-gray-300" />
                </div>
                <div className="h-4 w-40 rounded bg-gray-300" />
              </div>

              {/* Sub-rows with indentation */}
              {Array.from({ length: rowsPerSection }).map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="-mx-4 flex items-center justify-between bg-purple-50/30 px-4 py-2.5"
                  style={{ paddingLeft: `${24 + 16}px` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-14 rounded bg-gray-200" />
                    <div className="h-3 w-28 rounded bg-gray-200" />
                  </div>
                  <div className="h-3 w-32 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
