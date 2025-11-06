import { FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PurposesEmptyStateProps {
  searchQuery?: string;
  onCreateNew?: () => void;
}

export function PurposesEmptyState({ searchQuery, onCreateNew }: PurposesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="rounded-full bg-muted p-6 mb-4">
        {searchQuery ? (
          <Search className="h-12 w-12 text-muted-foreground" />
        ) : (
          <FileText className="h-12 w-12 text-muted-foreground" />
        )}
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {searchQuery ? "No purposes found" : "No purposes yet"}
      </h3>
      <p className="text-muted-foreground text-center max-w-md mb-4">
        {searchQuery
          ? `No purposes match "${searchQuery}". Try adjusting your search.`
          : "Get started by creating your first purpose for this category."}
      </p>
      {!searchQuery && onCreateNew && (
        <Button onClick={onCreateNew}>
          Create Purpose
        </Button>
      )}
    </div>
  );
}

