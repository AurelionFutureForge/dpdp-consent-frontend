"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetPurposesByFiduciary } from "@/services/sys-admin/purpose/hooks";
import { SearchBar } from "@/components/ui/search-bar";
import { Pagination } from "@/components/ui/pagination";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import {
  PurposeCard,
  PurposeSkeleton,
  PurposesEmptyState,
} from "./_components";

export default function CategoryPurposesPage() {
  const params = useParams();
  const router = useRouter();
  const dfId = params["df-id"] as string;
  const categoryId = params["category-id"] as string;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);

  // Fetch purposes
  const { data: purposesData, isLoading: isLoadingPurposes } =
    useGetPurposesByFiduciary(
      dfId,
      categoryId,
      page,
      limit,
      searchQuery
    );

  const purposes = purposesData?.data?.data || [];
  const pagination = purposesData?.data?.meta?.pagination;

  // Get category name from first purpose (if available)
  const categoryName = purposes.length > 0 ? purposes[0].category.name : "Category";

  const handleSearchChange = (value: string) => {
    setSearchQuery(value || undefined);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <ContentLayout title={`Purposes - ${categoryName}`}>
      <div className="container mx-auto py-6 px-4 space-y-6">
        {/* Back Button */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/sys-admin/purposes/${dfId}`)}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Categories
          </Button>
        </div>

        {/* Header */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">All Purposes</h2>
            <p className="text-muted-foreground mt-1">
              Browse all purposes in the {categoryName} category
            </p>
          </div>

          {/* Search Section */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <SearchBar
                onSearchChange={handleSearchChange}
                placeholder="Search purposes..."
              />
            </div>
          </div>
        </div>

        {/* Purposes List Section */}
        <div className="space-y-4">
          {isLoadingPurposes ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <PurposeSkeleton />
              <PurposeSkeleton />
              <PurposeSkeleton />
              <PurposeSkeleton />
              <PurposeSkeleton />
              <PurposeSkeleton />
            </div>
          ) : purposes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {purposes.map((purpose) => (
                  <PurposeCard key={purpose.purpose_id} purpose={purpose} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && (
                <Pagination
                  currentPage={pagination.current_page}
                  totalPages={pagination.total_pages}
                  totalItems={pagination.total_purposes}
                  limit={pagination.limit}
                  onPageChange={handlePageChange}
                  onLimitChange={handleLimitChange}
                  isLoading={isLoadingPurposes}
                />
              )}
            </>
          ) : (
            <PurposesEmptyState searchQuery={searchQuery} />
          )}
        </div>
      </div>
    </ContentLayout>
  );
}

