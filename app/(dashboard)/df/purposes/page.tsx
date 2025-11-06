"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  useGetPurposeCategoriesByFiduciary,
  useGetPurposeCategoriesSummaryByFiduciary,
  useCreatePurposeCategory,
  useUpdatePurposeCategory,
  useTogglePurposeCategory,
  useDeletePurposeCategory,
} from "@/services/df/purpose-categories/hooks";
import type { PurposeCategorySortBy, SortOrder, PurposeCategoryItem } from "@/services/df/purpose-categories/types";
import { SearchBar } from "@/components/ui/search-bar";
import { Pagination } from "@/components/ui/pagination";
import { FilterComponent, type AppliedFilter } from "@/components/ui/filter";
import { ContentLayout } from "@/components/df-panel/content-layout";
import { Button } from "@/components/ui/button";
import { FolderKanban, CheckCircle2, XCircle, Clock, Plus } from "lucide-react";
import {
  SummaryAnalyticsCard,
  SummaryAnalyticsSkeleton,
  PurposeCategoryCard,
  PurposeCategorySkeleton,
  CategoriesEmptyState,
  SortDropdown,
  DetailedAnalysisModal,
  CategoryFormModal,
  DeleteConfirmationDialog,
} from "./_components";

export default function PurposeCategoriesPage() {
  const { data: session } = useSession();
  const dfId = session?.user?.dataFiduciaryId || "";

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<PurposeCategorySortBy>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PurposeCategoryItem | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  // Get is_active filter value
  const isActiveFilter = appliedFilters.find((f) => f.key === "is_active");
  const isActive = isActiveFilter
    ? isActiveFilter.value === "true"
      ? true
      : isActiveFilter.value === "false"
      ? false
      : undefined
    : undefined;

  // Fetch summary analytics
  const { data: summaryData, isLoading: isLoadingSummary } =
    useGetPurposeCategoriesSummaryByFiduciary(dfId);

  // Fetch purpose categories
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetPurposeCategoriesByFiduciary(
      dfId,
      page,
      limit,
      searchQuery,
      isActive,
      sortBy,
      sortOrder
    );

  // Mutations
  const createMutation = useCreatePurposeCategory();
  const updateMutation = useUpdatePurposeCategory();
  const toggleMutation = useTogglePurposeCategory();
  const deleteMutation = useDeletePurposeCategory();

  const summary = summaryData?.data;
  const categories = categoriesData?.data?.data || [];
  const pagination = categoriesData?.data?.meta?.pagination;

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

  const handleSortChange = (newSortBy: PurposeCategorySortBy, newSortOrder: SortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPage(1);
  };

  const handleFiltersChange = (filters: AppliedFilter[]) => {
    setAppliedFilters(filters);
    setPage(1);
  };

  const handleCreateNew = () => {
    setSelectedCategory(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (category: PurposeCategoryItem) => {
    setSelectedCategory(category);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (data: { name: string; description: string }) => {
    if (selectedCategory) {
      // Update
      updateMutation.mutate(
        {
          dataFiduciaryId: dfId,
          purposeCategoryId: selectedCategory.purpose_category_id,
          data,
        },
        {
          onSuccess: () => {
            setIsFormModalOpen(false);
            setSelectedCategory(null);
          },
        }
      );
    } else {
      // Create
      createMutation.mutate(
        {
          dataFiduciaryId: dfId,
          data,
        },
        {
          onSuccess: () => {
            setIsFormModalOpen(false);
          },
        }
      );
    }
  };

  const handleToggle = (categoryId: string) => {
    toggleMutation.mutate({
      dataFiduciaryId: dfId,
      purposeCategoryId: categoryId,
    });
  };

  const handleDelete = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      deleteMutation.mutate(
        {
          dataFiduciaryId: dfId,
          purposeCategoryId: categoryToDelete,
        },
        {
          onSuccess: () => {
            setIsDeleteDialogOpen(false);
            setCategoryToDelete(null);
          },
        }
      );
    }
  };

  const filterConfigs = [
    {
      key: "is_active",
      label: "Status",
      options: [
        { value: "true", label: "Active" },
        { value: "false", label: "Inactive" },
      ],
    },
  ];

  const hasActiveFilters = appliedFilters.length > 0;

  return (
    <ContentLayout title="Purpose Categories">
      <div className="container mx-auto py-6 px-4 space-y-6">
        {/* Create Button and Detailed Analysis */}
        <div className="flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold tracking-tight">All Categories</h2>
            <p className="text-muted-foreground mt-1">
              Manage your purpose categories
            </p>
          </div>
          {summary && <DetailedAnalysisModal data={summary} />}
        </div>

        {/* Summary Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoadingSummary ? (
            <>
              <SummaryAnalyticsSkeleton />
              <SummaryAnalyticsSkeleton />
              <SummaryAnalyticsSkeleton />
              <SummaryAnalyticsSkeleton />
            </>
          ) : summary ? (
            <>
              <SummaryAnalyticsCard
                title="Total Categories"
                value={summary.category_counts.total_categories}
                icon={<FolderKanban className="h-5 w-5 text-blue-500" />}
                description="All purpose categories"
              />
              <SummaryAnalyticsCard
                title="Active Categories"
                value={summary.category_counts.active_categories}
                icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
                description="Currently active"
              />
              <SummaryAnalyticsCard
                title="Inactive Categories"
                value={summary.category_counts.inactive_categories}
                icon={<XCircle className="h-5 w-5 text-red-500" />}
                description="Currently inactive"
              />
              <SummaryAnalyticsCard
                title="Recently Created"
                value={summary.category_counts.recently_created}
                icon={<Clock className="h-5 w-5 text-purple-500" />}
                description="In the last 30 days"
              />
            </>
          ) : null}
        </div>

        {/* Search, Filter, and Sort Section */}
        <div className="space-y-4">


          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="flex-1">
              <SearchBar
                onSearchChange={handleSearchChange}
                placeholder="Search categories..."
              />
            </div>
            <div className="flex gap-2 items-center">
              <FilterComponent
                filters={filterConfigs}
                onFiltersChange={handleFiltersChange}
                appliedFilters={appliedFilters}
              />
              <SortDropdown
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
            </div>
            <Button onClick={handleCreateNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Category
          </Button>
          </div>
        </div>

        {/* Categories List Section */}
        <div className="space-y-4">
          {isLoadingCategories ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <PurposeCategorySkeleton />
              <PurposeCategorySkeleton />
              <PurposeCategorySkeleton />
              <PurposeCategorySkeleton />
              <PurposeCategorySkeleton />
              <PurposeCategorySkeleton />
            </div>
          ) : categories.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <PurposeCategoryCard
                    key={category.purpose_category_id}
                    category={category}
                    onEdit={handleEdit}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
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
                  isLoading={isLoadingCategories}
                />
              )}
            </>
          ) : (
            <CategoriesEmptyState
              searchQuery={searchQuery}
              hasFilters={hasActiveFilters}
              onCreateNew={handleCreateNew}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <CategoryFormModal
        open={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleFormSubmit}
        category={selectedCategory}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
      />
    </ContentLayout>
  );
}

