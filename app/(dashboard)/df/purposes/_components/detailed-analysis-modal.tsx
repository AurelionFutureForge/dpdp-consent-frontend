"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, PieChart, FolderKanban, ListChecks } from "lucide-react";
import type { PurposeCategorySummaryAnalyticsData } from "@/services/df/purpose-categories/types";

interface DetailedAnalysisModalProps {
  data: PurposeCategorySummaryAnalyticsData;
}

export function DetailedAnalysisModal({ data }: DetailedAnalysisModalProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long"
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <BarChart3 className="h-4 w-4" />
          Detailed Analysis
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Detailed Purpose Category Analytics
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Category Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Category Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.category_trends.new_categories_by_month.length > 0 ? (
                  data.category_trends.new_categories_by_month.map((trend, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <span className="font-medium">{formatDate(trend.month)}</span>
                      <Badge variant="default" className="text-sm">
                        {trend.count} new {trend.count === 1 ? "category" : "categories"}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No trend data available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="h-5 w-5 text-green-500" />
                Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {data.category_distributions.categories_by_status.map((status, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center p-4 rounded-lg border bg-card"
                  >
                    <span className="text-3xl font-bold text-primary mb-2">
                      {status.count}
                    </span>
                    <Badge
                      variant={status.status === "active" ? "default" : "secondary"}
                      className="capitalize"
                    >
                      {status.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Categories by Purposes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-purple-500" />
                Top Categories by Purposes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.category_distributions.top_categories_by_purposes.length > 0 ? (
                  data.category_distributions.top_categories_by_purposes.map((category) => (
                    <div
                      key={category.purpose_category_id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium truncate">{category.name}</span>
                          <Badge
                            variant={category.is_active ? "default" : "secondary"}
                            className="shrink-0"
                          >
                            {category.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {category.description || "No description"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4 shrink-0">
                        <ListChecks className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-semibold text-primary">
                          {category.total_purposes}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No categories available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

