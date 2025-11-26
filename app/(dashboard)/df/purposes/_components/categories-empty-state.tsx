import { FolderKanban, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoriesEmptyStateProps {
  searchQuery?: string;
  hasFilters?: boolean;
  onCreateNew?: () => void;
}

export function CategoriesEmptyState({ searchQuery, hasFilters, onCreateNew }: CategoriesEmptyStateProps) {
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
      <p className="text-muted-foreground text-center max-w-md mb-4">
        {hasActiveFilters
          ? "No purpose categories match your search or filter criteria. Try adjusting your filters."
          : "Get started by creating your first purpose category."}
      </p>
      {!hasActiveFilters && onCreateNew && (
        <Button onClick={onCreateNew}>
          Create Category
        </Button>
      )}
    </div>
  );
}

