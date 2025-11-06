import { Building2, FolderKanban } from "lucide-react";

interface EmptyStateProps {
  searchQuery?: string;
}

export function EmptyState({ searchQuery }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="rounded-full bg-muted p-6 mb-4">
        {searchQuery ? (
          <FolderKanban className="h-12 w-12 text-muted-foreground" />
        ) : (
          <Building2 className="h-12 w-12 text-muted-foreground" />
        )}
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {searchQuery ? "No results found" : "No fiduciaries yet"}
      </h3>
      <p className="text-muted-foreground text-center max-w-md">
        {searchQuery
          ? `No fiduciaries match "${searchQuery}". Try adjusting your search.`
          : "There are no data fiduciaries with purpose categories yet."}
      </p>
    </div>
  );
}

