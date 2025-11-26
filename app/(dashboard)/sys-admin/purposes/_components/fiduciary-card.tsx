"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FolderKanban } from "lucide-react";

interface FiduciaryCardProps {
  fiduciary: {
    data_fiduciary_id: string;
    data_fiduciary_name: string;
    total_categories: number;
  };
}

export function FiduciaryCard({ fiduciary }: FiduciaryCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/sys-admin/purposes/${fiduciary.data_fiduciary_id}`);
  };

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-1">
                {fiduciary.data_fiduciary_name}
              </CardTitle>

            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Categories</span>
          </div>
          <span className="text-2xl font-bold text-primary">
            {fiduciary.total_categories}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

