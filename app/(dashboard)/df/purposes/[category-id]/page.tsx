"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  useGetPurposesByFiduciary,
  useCreatePurpose,
  useUpdatePurpose,
  useTogglePurpose,
  useDeletePurpose,
} from "@/services/df/purpose/hooks";
import { useGetPurposeCategoriesByFiduciary } from "@/services/df/purpose-categories/hooks";
import type { PurposeItem, CreatePurposePayload } from "@/services/df/purpose/types";
import { ContentLayout } from "@/components/df-panel/content-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, Plus } from "lucide-react";
import { SearchBar } from "@/components/ui/search-bar";
import { Pagination } from "@/components/ui/pagination";
import { TagInput, PurposeCardSkeleton, PurposesEmptyState } from "./_components";

const getInitialFormData = (categoryId: string, selectedPurpose?: PurposeItem | null): CreatePurposePayload => {
  if (selectedPurpose) {
    return {
      purpose_category_id: selectedPurpose.purpose_category_id,
      title: selectedPurpose.title,
      description: selectedPurpose.description,
      legal_basis: selectedPurpose.legal_basis,
      data_fields: selectedPurpose.data_fields,
      processing_activities: selectedPurpose.processing_activities,
      retention_period_days: selectedPurpose.retention_period_days,
      is_mandatory: selectedPurpose.is_mandatory,
      requires_renewal: selectedPurpose.requires_renewal,
      renewal_period_days: selectedPurpose.renewal_period_days,
    };
  }
  return {
    purpose_category_id: categoryId,
    title: "",
    description: "",
    legal_basis: "",
    data_fields: [],
    processing_activities: [],
    retention_period_days: 365,
    is_mandatory: false,
    requires_renewal: false,
    renewal_period_days: null,
  };
};

export default function PurposesPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const categoryId = params["category-id"] as string;
  const dfId = session?.user?.dataFiduciaryId || "";

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedPurpose, setSelectedPurpose] = useState<PurposeItem | null>(null);
  const [formData, setFormData] = useState<CreatePurposePayload>(() => getInitialFormData(categoryId));

  // Fetch data
  const { data: purposesData, isLoading } = useGetPurposesByFiduciary(
    dfId,
    categoryId,
    page,
    limit,
    searchQuery
  );

  const { data: categoriesData } = useGetPurposeCategoriesByFiduciary(dfId, 1, 100);

  // Mutations
  const createMutation = useCreatePurpose();
  const updateMutation = useUpdatePurpose();
  const toggleMutation = useTogglePurpose();
  const deleteMutation = useDeletePurpose();

  const purposes = purposesData?.data?.data || [];
  const pagination = purposesData?.data?.meta?.pagination;
  const categories = categoriesData?.data?.data || [];

  const openFormModal = (purpose: PurposeItem | null) => {
    setSelectedPurpose(purpose);
    setFormData(getInitialFormData(categoryId, purpose));
    setIsFormModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPurpose) {
      updateMutation.mutate(
        {
          dataFiduciaryId: dfId,
          purposeId: selectedPurpose.purpose_id,
          data: { ...formData, display_order: selectedPurpose.display_order },
        },
        { onSuccess: () => { setIsFormModalOpen(false); setSelectedPurpose(null); } }
      );
    } else {
      createMutation.mutate(
        { dataFiduciaryId: dfId, data: formData },
        { onSuccess: () => { setIsFormModalOpen(false); } }
      );
    }
  };

  return (
    <ContentLayout title="Purposes">
      <div className="container mx-auto py-6 px-4 space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/df/purposes")}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Categories
          </Button>
          <Button onClick={() => openFormModal(null)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Purpose
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex-1">
            <SearchBar
              onSearchChange={(value) => { setSearchQuery(value || undefined); setPage(1); }}
              placeholder="Search purposes..."
            />
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PurposeCardSkeleton />
              <PurposeCardSkeleton />
              <PurposeCardSkeleton />
              <PurposeCardSkeleton />
              <PurposeCardSkeleton />
              <PurposeCardSkeleton />
            </div>
          ) : purposes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {purposes.map((purpose) => (
                  <Card key={purpose.purpose_id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{purpose.title}</CardTitle>
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant={purpose.is_active ? "default" : "secondary"}>
                              {purpose.is_active ? "Active" : "Inactive"}
                            </Badge>
                            {purpose.is_mandatory && <Badge variant="destructive">Mandatory</Badge>}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openFormModal(purpose)}>Edit</Button>
                          <Button variant="ghost" size="sm" onClick={() => toggleMutation.mutate({ dataFiduciaryId: dfId, purposeId: purpose.purpose_id })}>Toggle</Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate({ dataFiduciaryId: dfId, purposeId: purpose.purpose_id })}>Delete</Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">{purpose.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {pagination && (
                <Pagination
                  currentPage={pagination.current_page}
                  totalPages={pagination.total_pages}
                  totalItems={pagination.total_purposes}
                  limit={pagination.limit}
                  onPageChange={setPage}
                  onLimitChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
                  isLoading={isLoading}
                />
              )}
            </>
          ) : (
            <PurposesEmptyState
              searchQuery={searchQuery}
              onCreateNew={() => openFormModal(null)}
            />
          )}
        </div>
      </div>

      <Dialog open={isFormModalOpen} onOpenChange={(open) => { if (!open) { setIsFormModalOpen(false); setSelectedPurpose(null); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPurpose ? "Edit Purpose" : "Create Purpose"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formData.purpose_category_id} onValueChange={(value) => setFormData({ ...formData, purpose_category_id: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{categories.map((cat) => (<SelectItem key={cat.purpose_category_id} value={cat.purpose_category_id}>{cat.name}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Description *</Label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background" />
            </div>
            <div className="space-y-2">
              <Label>Legal Basis *</Label>
              <Input value={formData.legal_basis} onChange={(e) => setFormData({ ...formData, legal_basis: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Data Fields</Label>
              <TagInput tags={formData.data_fields} onChange={(tags: string[]) => setFormData({ ...formData, data_fields: tags })} />
            </div>
            <div className="space-y-2">
              <Label>Processing Activities</Label>
              <TagInput tags={formData.processing_activities} onChange={(tags: string[]) => setFormData({ ...formData, processing_activities: tags })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Retention Period (days) *</Label>
                <Input type="number" value={formData.retention_period_days} onChange={(e) => setFormData({ ...formData, retention_period_days: parseInt(e.target.value) || 0 })} required />
              </div>
              <div className="space-y-2">
                <Label>Renewal Period (days)</Label>
                <Input type="number" value={formData.renewal_period_days || ""} onChange={(e) => setFormData({ ...formData, renewal_period_days: e.target.value ? parseInt(e.target.value) : null })} />
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox id="mandatory" checked={formData.is_mandatory} onCheckedChange={(checked: boolean) => setFormData({ ...formData, is_mandatory: checked })} />
                <Label htmlFor="mandatory">Is Mandatory</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="renewal" checked={formData.requires_renewal} onCheckedChange={(checked: boolean) => setFormData({ ...formData, requires_renewal: checked })} />
                <Label htmlFor="renewal">Requires Renewal</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setIsFormModalOpen(false); setSelectedPurpose(null); }}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : selectedPurpose ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}

