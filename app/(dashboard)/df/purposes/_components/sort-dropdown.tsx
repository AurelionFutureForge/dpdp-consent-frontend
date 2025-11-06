"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown } from "lucide-react";
import type { PurposeCategorySortBy, SortOrder } from "@/services/df/purpose-categories/types";

interface SortDropdownProps {
  sortBy: PurposeCategorySortBy;
  sortOrder: SortOrder;
  onSortChange: (sortBy: PurposeCategorySortBy, sortOrder: SortOrder) => void;
}

export function SortDropdown({ sortBy, sortOrder, onSortChange }: SortDropdownProps) {
  const handleSortByChange = (value: string) => {
    onSortChange(value as PurposeCategorySortBy, sortOrder);
  };

  const handleSortOrderChange = (value: string) => {
    onSortChange(sortBy, value as SortOrder);
  };

  const getSortByLabel = (sortByValue: PurposeCategorySortBy) => {
    const labels: Record<PurposeCategorySortBy, string> = {
      name: "Name",
      created_by: "Created By",
      updated_by: "Updated By",
    };
    return labels[sortByValue];
  };

  const getSortLabel = () => {
    return `${getSortByLabel(sortBy)} (${sortOrder?.toUpperCase() || "ASC"})`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4" />
          {getSortLabel()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={sortBy} onValueChange={handleSortByChange}>
          <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Sort Order</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={sortOrder} onValueChange={handleSortOrderChange}>
          <DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

