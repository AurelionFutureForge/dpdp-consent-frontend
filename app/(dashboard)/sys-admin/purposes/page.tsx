"use client";

import { useState } from "react";
import { useGetGroupedPurposeCategories, useGetGroupedPurposeCategoriesAnalytics } from "@/services/sys-admin/purpose-categories/hooks";
import { SearchBar } from "@/components/ui/search-bar";
import { Pagination } from "@/components/ui/pagination";
import { Building2, FolderKanban, TrendingUp, Users } from "lucide-react";
import {
  AnalyticsCard,
  AnalyticsCardSkeleton,
  FiduciaryCard,
  FiduciaryCardSkeleton,
  EmptyState,
} from "./_components";
import { ContentLayout } from "@/components/admin-panel/content-layout";

export default function PurposesPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);

  // Fetch analytics
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useGetGroupedPurposeCategoriesAnalytics();

  // Fetch grouped purpose categories
  const { data: groupedData, isLoading: isLoadingData } = useGetGroupedPurposeCategories(page, limit, searchQuery);

  const analytics = analyticsData?.data;
  const fiduciaries = groupedData?.data?.data || [];
  const pagination = groupedData?.data?.meta?.pagination;

  const handleSearchChange = (value: string) => {
    setSearchQuery(value || undefined);
    setPage(1); // Reset to first page on search
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  return (
    <ContentLayout title="Purposes">
      <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoadingAnalytics ? (
          <>
            <AnalyticsCardSkeleton />
            <AnalyticsCardSkeleton />
            <AnalyticsCardSkeleton />
            <AnalyticsCardSkeleton />
          </>
        ) : analytics ? (
          <>
            <AnalyticsCard
              title="Total Fiduciaries"
              value={analytics.total_fiduciaries}
              icon={<Building2 className="h-5 w-5 text-blue-500" />}
              description="Registered data fiduciaries"
            />
            <AnalyticsCard
              title="Total Categories"
              value={analytics.total_categories}
              icon={<FolderKanban className="h-5 w-5 text-green-500" />}
              description="Purpose categories created"
            />
            <AnalyticsCard
              title="Average Categories"
              value={analytics.average_categories_per_fiduciary.toFixed(1)}
              icon={<TrendingUp className="h-5 w-5 text-purple-500" />}
              description="Per fiduciary"
            />
            <AnalyticsCard
              title="With Categories"
              value={analytics.fiduciaries_with_categories}
              icon={<Users className="h-5 w-5 text-orange-500" />}
              description={`${analytics.fiduciaries_without_categories} without`}
            />
          </>
        ) : null}
      </div>

      {/* Heading and Search Section */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Purpose Categories</h1>
          <p className="text-muted-foreground mt-2">
            View and manage purpose categories grouped by data fiduciaries
          </p>
        </div>

        <SearchBar
          onSearchChange={handleSearchChange}
          placeholder="Search fiduciaries..."
          className="max-w-md"
        />
      </div>

      {/* Fiduciary Cards Section */}
      <div className="space-y-4">
        {isLoadingData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FiduciaryCardSkeleton />
            <FiduciaryCardSkeleton />
            <FiduciaryCardSkeleton />
            <FiduciaryCardSkeleton />
            <FiduciaryCardSkeleton />
            <FiduciaryCardSkeleton />
          </div>
        ) : fiduciaries.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fiduciaries.map((fiduciary) => (
                <FiduciaryCard key={fiduciary.data_fiduciary_id} fiduciary={fiduciary} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && (
              <Pagination
                currentPage={pagination.current_page}
                totalPages={pagination.total_pages}
                totalItems={pagination.total_categories}
                limit={pagination.limit}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
                isLoading={isLoadingData}
              />
            )}
          </>
        ) : (
          <EmptyState searchQuery={searchQuery} />
        )}
      </div>
    </div>
    </ContentLayout>
  );
}
