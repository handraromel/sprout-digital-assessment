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
          <div className="relative flex-1 max-w-lg">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-300" />
            </div>
            <div className="h-10 w-full rounded-lg bg-gray-200 animate-pulse" />
          </div>
          <div className="h-10 w-44 rounded-lg bg-green-200 animate-pulse" />
        </div>
      )}

      {/* Section cards skeleton */}
      <div className="flex flex-col gap-4">
        {Array.from({ length: sections }).map((_, sectionIndex) => (
          <div
            key={sectionIndex}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm animate-pulse"
          >
            <div className="p-4 space-y-3">
              {/* Header row with wider content */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-16 bg-gray-300 rounded" />
                  <div className="h-4 w-32 bg-gray-300 rounded" />
                </div>
                <div className="h-4 w-40 bg-gray-300 rounded" />
              </div>

              {/* Sub-rows with indentation */}
              {Array.from({ length: rowsPerSection }).map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex items-center justify-between bg-purple-50/30 -mx-4 px-4 py-2.5"
                  style={{ paddingLeft: `${24 + 16}px` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-14 bg-gray-200 rounded" />
                    <div className="h-3 w-28 bg-gray-200 rounded" />
                  </div>
                  <div className="h-3 w-32 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
