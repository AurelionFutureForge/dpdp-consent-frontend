import { FileX, Search } from "lucide-react";

interface PurposesEmptyStateProps {
  searchQuery?: string;
}

export function PurposesEmptyState({ searchQuery }: PurposesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="rounded-full bg-muted p-6 mb-4">
        {searchQuery ? (
          <Search className="h-12 w-12 text-muted-foreground" />
        ) : (
          <FileX className="h-12 w-12 text-muted-foreground" />
        )}
      </div>

      <h3 className="text-xl font-semibold text-center mb-2">
        {searchQuery ? "No purposes found" : "No purposes in this category"}
      </h3>

      <p className="text-muted-foreground text-center max-w-md">
        {searchQuery
          ? "Try adjusting your search to find what you're looking for."
          : "This category doesn't have any purposes yet."}
      </p>
    </div>
  );
}

