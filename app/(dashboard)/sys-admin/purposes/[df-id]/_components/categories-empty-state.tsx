import { FolderKanban, Search } from "lucide-react";

interface CategoriesEmptyStateProps {
  searchQuery?: string;
  hasFilters?: boolean;
}

export function CategoriesEmptyState({ searchQuery, hasFilters }: CategoriesEmptyStateProps) {
  const hasActiveFilters = searchQuery || hasFilters;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="rounded-full bg-muted p-6 mb-4">
        {hasActiveFilters ? (
          <Search className="h-12 w-12 text-muted-foreground" />
        ) : (
          <FolderKanban className="h-12 w-12 text-muted-foreground" />
        )}
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {hasActiveFilters ? "No categories found" : "No purpose categories yet"}
      </h3>
      <p className="text-muted-foreground text-center max-w-md">
        {hasActiveFilters
          ? "No purpose categories match your search or filter criteria. Try adjusting your filters."
          : "This fiduciary doesn't have any purpose categories yet."}
      </p>
    </div>
  );
}

