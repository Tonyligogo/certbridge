"use client";

import React, { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Calendar,
  Building2,
  Clock,
  ShieldCheck,
  Edit,
  Trash2,
  UploadCloud,
  Check,
  X,
  Loader2,
  FileUp,
  Download,
  AlertTriangle,
} from "lucide-react";
import { useReplaceTrainerCertificationFile, useUpdateTrainerCertification } from "../hooks/use-trainers";
import { TrainerCertification } from "../services/trainer-service";


interface CertificationDetailCardProps {
  certification: TrainerCertification | null;
  onDelete?: (certificationId: string) => void;
  className?: string;
    onClose: () => void;
}

export function CertificationDetails({
  certification,
  onDelete,
  className = "",
  onClose
}: CertificationDetailCardProps) {
  // Local state for inline metadata editing
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    issuedBy: "",
    issuedAt: "",
    expiresAt: "",
  });

  // Local state for file replacement
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mutations
  const updateMutation = useUpdateTrainerCertification();
  const replaceFileMutation = useReplaceTrainerCertificationFile();

  if (!certification) {
    return (
      <div className={`p-8 border border-dashed rounded-xl text-center text-xs text-muted-foreground ${className}`}>
        Select a certification to view details
      </div>
    );
  }

  // Initialize edit form values
  const handleStartEdit = () => {
    setFormData({
      name: certification.name || "",
      issuedBy: certification.issuedBy || "",
      issuedAt: certification.issuedAt ? certification.issuedAt.split("T")[0] : "",
      expiresAt: certification.expiresAt ? certification.expiresAt.split("T")[0] : "",
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // Submit Metadata Update
  const handleSaveMetadata = () => {
    updateMutation.mutate(
      {
        trainerId: certification.trainerId,
        certificationId: certification.id,
        data: {
          name: formData.name,
          issuedBy: formData.issuedBy,
          issuedAt: formData.issuedAt ? new Date(formData.issuedAt) : undefined,
          expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : null,
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  // File Select Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Submit Separate File Replacement Mutation
  const handleUploadNewFile = () => {
    if (!selectedFile) return;

    replaceFileMutation.mutate(
      {
        trainerId: certification.trainerId,
        certificationId: certification.id,
        file: selectedFile,
      },
      {
        onSuccess: () => {
          setSelectedFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        },
      }
    );
  };

  const isExpired = certification.expiresAt
    ? new Date(certification.expiresAt) < new Date()
    : false;

  const getStatusBadge = () => {
    if (certification.status === 'VALID') {
      return (
        <Badge variant="default" className="text-[10px] gap-1 px-2 py-0.5">
          <ShieldCheck className="h-3 w-3" /> Approved
        </Badge>
      );
    }
    if (certification.status === "REJECTED" || isExpired) {
      return (
        <Badge variant="destructive" className="text-[10px] gap-1 px-2 py-0.5">
          <AlertTriangle className="h-3 w-3" /> {isExpired ? "Expired" : "Rejected"}
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="text-[10px] gap-1 px-2 py-0.5">
        <Clock className="h-3 w-3" /> Pending Review
      </Badge>
    );
  };

  return (
    <div className={`w-full border text-[#2C7DA0] rounded-xl bg-card overflow-hidden flex flex-col md:flex-row ${className}`}>
      {/* Hidden File Input for Replace Operation */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
      />

      {/* ================= LEFT COLUMN: SUMMARY & STATUS ================= */}
      <div className="w-full md:w-[320px] bg-muted/10 border-b md:border-b-0 md:border-r flex flex-col justify-between shrink-0">
        <div className="p-5 space-y-5">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 flex-wrap">
            {getStatusBadge()}
          </div>
            <Button onClick={onClose} size='icon' variant='outline'>x</Button>
            </div>
          {/* Top Status */}
          

          {/* Identity & Title */}
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {certification.name}
            </h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-0.5">
              <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
              {certification.issuedBy}
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 pt-1">
            {!isEditing ? (
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs gap-1.5 flex-1"
                onClick={handleStartEdit}
              >
                <Edit className="h-3.5 w-3.5" /> Edit Details
              </Button>
            ) : (
              <div className="flex items-center gap-1.5 w-full">
                <Button
                  size="sm"
                  className="h-8 text-xs gap-1 flex-1"
                  onClick={handleSaveMetadata}
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs gap-1"
                  onClick={handleCancelEdit}
                  disabled={updateMutation.isPending}
                >
                  <X className="h-3.5 w-3.5" /> Cancel
                </Button>
              </div>
            )}

            {onDelete && !isEditing && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive shrink-0"
                onClick={() => onDelete(certification.id)}
                title="Delete Certification"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>

          <Separator />

          {/* Key Dates Card */}
          <div className="p-3.5 rounded-xl border bg-card/60 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Issued Date
              </span>
              <span className="font-medium text-foreground">
                {certification.issuedAt
                  ? new Date(certification.issuedAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Expiry Date
              </span>
              <span className={`font-medium ${isExpired ? "text-destructive" : "text-foreground"}`}>
                {certification.expiresAt
                  ? new Date(certification.expiresAt).toLocaleDateString()
                  : "No Expiry"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT MAIN PANEL: DETAILS & FILE OPERATIONS ================= */}
      <div className="flex-1 flex flex-col bg-background overflow-hidden min-h-[450px]">
        <div className="p-5 pb-3 border-b flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Trainer ID: <span className="font-mono text-foreground">{certification.trainerId}</span>
          </div>
          <div className="text-[11px] text-muted-foreground">
            Updated {new Date(certification.updatedAt).toLocaleDateString()}
          </div>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {/* 1. METADATA SECTION / EDIT FORM */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Certification Information
              </h3>

              {!isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl border bg-muted/20 text-xs">
                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground">Certification Name</span>
                    <div className="font-medium text-foreground">{certification.name}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground">Issuing Authority</span>
                    <div className="font-medium text-foreground">{certification.issuedBy}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground">Issued On</span>
                    <div className="font-medium text-foreground">
                      {certification.issuedAt ? new Date(certification.issuedAt).toLocaleDateString() : "—"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground">Expires On</span>
                    <div className="font-medium text-foreground">
                      {certification.expiresAt ? new Date(certification.expiresAt).toLocaleDateString() : "Never"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border bg-card space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-[11px]">Certification Name</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px]">Issuing Institution</Label>
                      <Input
                        value={formData.issuedBy}
                        onChange={(e) => setFormData({ ...formData, issuedBy: e.target.value })}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px]">Issued Date</Label>
                      <Input
                        type="date"
                        value={formData.issuedAt}
                        onChange={(e) => setFormData({ ...formData, issuedAt: e.target.value })}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px]">Expiry Date (Optional)</Label>
                      <Input
                        type="date"
                        value={formData.expiresAt}
                        onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* 2. FILE MANAGEMENT & REPLACEMENT SECTION */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Attachment & File Management
                </h3>
              </div>

              {/* File Info Box */}
              <div className="p-4 rounded-xl border bg-muted/20 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5 text-xs">
                      <div className="font-semibold text-foreground">Current File Path</div>
                      <div className="text-[11px] font-mono text-muted-foreground truncate max-w-[280px] sm:max-w-[360px]">
                        {certification.storagePath || "No file uploaded"}
                      </div>
                    </div>
                  </div>

                  {/* Placeholder for future signed URL download action */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-xs gap-1.5 text-muted-foreground"
                    disabled
                    title="Signed URL download feature pending"
                  >
                    <Download className="h-3.5 w-3.5" /> Download
                  </Button>
                </div>

                <Separator />

                {/* Separate Replace File Component Controls */}
                <div className="pt-1 space-y-2">
                  <div className="text-[11px] font-medium text-foreground flex items-center gap-1.5">
                    <FileUp className="h-3.5 w-3.5 text-primary" /> Replace Document File
                  </div>

                  {!selectedFile ? (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs gap-1.5"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <UploadCloud className="h-3.5 w-3.5" /> Choose New File
                      </Button>
                      <span className="text-[11px] text-muted-foreground">
                        Supports PDF, PNG, JPG
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg border bg-background text-xs">
                      <span className="font-mono truncate text-[11px] max-w-[250px]">
                        {selectedFile.name}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          className="h-7 text-xs gap-1"
                          onClick={handleUploadNewFile}
                          disabled={replaceFileMutation.isPending}
                        >
                          {replaceFileMutation.isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                          Upload Replacement
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => setSelectedFile(null)}
                          disabled={replaceFileMutation.isPending}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}