"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FolderKanban, CalendarDays, ListChecks, MoreVertical, Pencil, Power, Trash2 } from "lucide-react";
import type { PurposeCategoryItem } from "@/services/df/purpose-categories/types";

interface PurposeCategoryCardProps {
  category: PurposeCategoryItem;
  onEdit: (category: PurposeCategoryItem) => void;
  onToggle: (categoryId: string) => void;
  onDelete: (categoryId: string) => void;
}

export function PurposeCategoryCard({ category, onEdit, onToggle, onDelete }: PurposeCategoryCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/df/purposes/${category.purpose_category_id}`);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit"
    });
  };

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FolderKanban className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <CardTitle className="text-lg line-clamp-1">
                  {category.name}
                </CardTitle>
                <Badge variant={category.is_active ? "default" : "secondary"}>
                  {category.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <CardDescription className="text-xs line-clamp-2">
                {category.description || "No description provided"}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={handleMenuClick}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={handleMenuClick}>
              <DropdownMenuItem onClick={() => onEdit(category)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggle(category.purpose_category_id)}>
                <Power className="h-4 w-4 mr-2" />
                {category.is_active ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(category.purpose_category_id)}
                variant="destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ListChecks className="h-4 w-4" />
            <span>Total Purposes</span>
          </div>
          <span className="font-semibold text-primary">{category.total_purposes}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarDays className="h-3 w-3" />
          <span>Created: {formatDate(category.created_at)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

