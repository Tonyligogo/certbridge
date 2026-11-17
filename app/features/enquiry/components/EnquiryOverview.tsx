"use client";

import { MessageSquareText, Pencil, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CopyableField } from "@/components/web/copyableField";
import type { AdminEnquiryDetail } from "../types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium", timeZone: "Africa/Nairobi",
  }).format(new Date(value));
}

function InfoField({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="wrap-break-word text-sm font-medium">{value ?? "—"}</p>
    </div>
  );
}

interface EnquiryOverviewProps {
  enquiry: AdminEnquiryDetail;
  onEdit?: () => void;
  canEdit?: boolean;
}

export function EnquiryOverview({ enquiry, onEdit, canEdit = true }: EnquiryOverviewProps) {
  return (
    <div className="space-y-6 px-5 py-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">Enquiry overview</h2>
        {canEdit && onEdit && (
          <Button size="sm" variant="outline" onClick={onEdit}>
            <Pencil className="size-4" /> Edit details
          </Button>
        )}
      </div>
              {/* Customer */}
              <section className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <UserRound className="size-5 text-muted-foreground" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold">{enquiry.fullName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {enquiry.organization || "Individual enquiry"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <CopyableField label="Email address" value={enquiry.email} />

                  <CopyableField label="Phone number" value={enquiry.phone} />
                </div>
              </section>

              <Separator />

              {/* Training requirements */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold">
                  {enquiry.type === "QUOTE"
                    ? "Training requirements"
                    : "Enquiry information"}
                </h3>

                {enquiry.type === "QUOTE" && (
                  <>
                    <CopyableField
                      label="Requested course"
                      value={enquiry.courseName || enquiry.course?.title}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <InfoField
                        label="Participants"
                        value={enquiry.participantCount}
                      />
                      <InfoField
                        label="Delivery mode"
                        value={
                          enquiry.deliveryMode
                            ? {
                                ONLINE: "Online",
                                CLIENT_SITE: "Client site",
                                ARRANGED_VENUE: "Arranged venue",
                              }[enquiry.deliveryMode]
                            : null
                        }
                      />
                      <InfoField
                        label="Preferred date"
                        value={
                          enquiry.preferredDate
                            ? formatDate(enquiry.preferredDate)
                            : null
                        }
                      />
                      <InfoField label="Request type" value="Quotation" />
                    </div>
                  </>
                )}

                <div className="rounded-lg border bg-muted/30 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <MessageSquareText className="size-4" />
                    Customer message
                  </div>
                  <p className="whitespace-pre-wrap wrap-break-word text-sm leading-relaxed">
                    {enquiry.message || "No message provided."}
                  </p>
                </div>
              </section>
    </div>
  );
}
