"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderKanban, CalendarDays, ListChecks } from "lucide-react";

interface PurposeCategoryCardProps {
  category: {
    purpose_category_id: string;
    name: string;
    description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    total_purposes: number;
    display_order: number;
  };
}

export function PurposeCategoryCard({ category }: PurposeCategoryCardProps) {
  const router = useRouter();
  const params = useParams();
  const dfId = params["df-id"] as string;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit"
    });
  };

  const handleClick = () => {
    router.push(`/sys-admin/purposes/${dfId}/${category.purpose_category_id}`);
  };

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FolderKanban className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
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

