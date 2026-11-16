"use client";

import { Clock3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { AdminEnquiryDetail } from "../types";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Nairobi",
  }).format(new Date(value));
}

interface EnquiryActivityProps {
  enquiry: AdminEnquiryDetail;
  onAddNote?: () => void;
}

export function EnquiryActivity({ enquiry, onAddNote }: EnquiryActivityProps) {
  return (
    <div className="space-y-6 px-5 py-6">
              {/* Activity history */}
              <section className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold">Activity & notes</h3>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onAddNote}
                    disabled={!onAddNote}
                  >
                    <Plus className="size-4" />
                    Add note
                  </Button>
                </div>

                {enquiry.activities.length === 0 ? (
                  <p className="rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground">
                    No activity recorded yet.
                  </p>
                ) : (
                  <div className="space-y-0">
                    {enquiry.activities.map((activity, index) => (
                      <div key={activity.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="mt-1.5 size-2 rounded-full bg-primary" />
                          {index < enquiry.activities.length - 1 && (
                            <div className="my-1 w-px flex-1 bg-border" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1 pb-5">
                          <p className="wrap-break-word text-sm">
                            {activity.description}
                          </p>
                          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock3 className="size-3" />
                            {formatDateTime(activity.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {enquiry.adminNotes && (
                <>
                  <Separator />
                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold">Internal notes</h3>
                    <p className="whitespace-pre-wrap wrap-break-word rounded-lg bg-muted/40 p-4 text-sm">
                      {enquiry.adminNotes}
                    </p>
                  </section>
                </>
              )}
    </div>
  );
}
