"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PurposeItem } from "@/services/sys-admin/purpose/types";
import { CheckCircle2, XCircle, Calendar, Clock, RefreshCw, Info } from "lucide-react";

interface PurposeCardProps {
  purpose: PurposeItem;
}

export function PurposeCard({ purpose }: PurposeCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-2" title={purpose.title}>
              {purpose.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {purpose.description}
            </p>
          </div>
          <Badge
            variant={purpose.is_active ? "default" : "secondary"}
            className="shrink-0"
          >
            {purpose.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Legal Basis */}
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">Legal Basis</p>
            <p className="text-sm font-medium" title={purpose.legal_basis}>
              {purpose.legal_basis}
            </p>
          </div>
        </div>

        {/* Retention and Renewal */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Retention</p>
              <p className="text-sm font-medium">
                {purpose.retention_period_days} days
              </p>
            </div>
          </div>

          {purpose.requires_renewal && purpose.renewal_period_days && (
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Renewal</p>
                <p className="text-sm font-medium">
                  {purpose.renewal_period_days} days
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Requires Renewal Badge */}
        {purpose.requires_renewal && (
          <div>
            <Badge variant="outline" className="text-xs">
              Requires Renewal
            </Badge>
          </div>
        )}

        {/* Data Fields, Activities, Versions, Translations */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Data Fields</p>
            <p className="text-sm font-medium">{purpose.data_fields.length} fields</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Activities</p>
            <p className="text-sm font-medium">{purpose.processing_activities.length} activities</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Versions</p>
            <p className="text-sm font-medium">{purpose.total_versions}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Translations</p>
            <p className="text-sm font-medium">{purpose.total_translations}</p>
          </div>
        </div>

        {/* Created Date */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Created {formatDate(purpose.created_at)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

