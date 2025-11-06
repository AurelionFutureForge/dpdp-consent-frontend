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
import type { PurposeCategorySortBy, SortOrder } from "@/services/sys-admin/purpose-categories/types";

interface SortDropdownProps {
  sortBy: PurposeCategorySortBy;
  sortOrder: SortOrder;
  onSortChange: (sortBy: PurposeCategorySortBy, sortOrder: SortOrder) => void;
}

export function SortDropdown({ sortBy, sortOrder, onSortChange }: SortDropdownProps) {
  const currentSort = `${sortBy}_${sortOrder}`;

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split("_") as [PurposeCategorySortBy, SortOrder];
    onSortChange(newSortBy, newSortOrder);
  };

  const getSortLabel = () => {
    const labels: Record<string, string> = {
      name_asc: "Name (A-Z)",
      name_desc: "Name (Z-A)",
    };
    return labels[currentSort] || "Sort";
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
        <DropdownMenuRadioGroup value={currentSort} onValueChange={handleSortChange}>
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground px-2 py-1">
            Name
          </DropdownMenuLabel>
          <DropdownMenuRadioItem value="name_asc">Name (A-Z)</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="name_desc">Name (Z-A)</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

