"use client";

import { useState } from "react";
import { Loader2, Save, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  AdminEnquiryDetail,
  EnquiryDeliveryMode,
  UpdateEnquiryDetailsInput,
} from "../types";
import { useUpdateEnquiryDetails } from "../hooks/use-enquiry";
import { CourseSelector } from "./CourseSelector";

interface EditEnquiryDetailsProps {
  enquiry: AdminEnquiryDetail;
  onCancel: () => void;
  onSuccess: () => void;
}

function toDateInput(value: string | null) {
  if (!value) return "";
  return value.slice(0, 10);
}

export function EditEnquiryDetails({
  enquiry,
  onCancel,
  onSuccess,
}: EditEnquiryDetailsProps) {
  const updateMutation = useUpdateEnquiryDetails();

  const [form, setForm] = useState({
    fullName: enquiry.fullName,
    email: enquiry.email,
    phone: enquiry.phone ?? "",
    organization: enquiry.organization ?? "",
    courseId: enquiry.courseId,
    courseName: enquiry.courseName ?? enquiry.course?.title ?? "",
    participantCount: enquiry.participantCount?.toString() ?? "",
    deliveryMode: enquiry.deliveryMode ?? "",
    preferredDate: toDateInput(enquiry.preferredDate),
    message: enquiry.message ?? "",
    adminNotes: enquiry.adminNotes ?? "",
  });

  //   useEffect(() => {
  //     setForm({
  //       fullName: enquiry.fullName,
  //       email: enquiry.email,
  //       phone: enquiry.phone ?? "",
  //       organization: enquiry.organization ?? "",
  //       courseName: enquiry.courseName ?? "",
  //       participantCount: enquiry.participantCount?.toString() ?? "",
  //       deliveryMode: enquiry.deliveryMode ?? "",
  //       preferredDate: toDateInput(enquiry.preferredDate),
  //       message: enquiry.message ?? "",
  //       adminNotes: enquiry.adminNotes ?? "",
  //     });
  //   }, [enquiry.id]);

  function setField<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  const commercialChanged =
    form.courseName !== (enquiry.courseName ?? "") ||
    form.participantCount !== (enquiry.participantCount?.toString() ?? "") ||
    form.deliveryMode !== (enquiry.deliveryMode ?? "") ||
    form.preferredDate !== toDateInput(enquiry.preferredDate);

  const isSaving = updateMutation.isPending;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!form.fullName.trim() || !form.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }

    const courseChanged =
      form.courseId !== enquiry.courseId ||
      form.courseName !== (enquiry.courseName ?? enquiry.course?.title ?? "");

    const input: UpdateEnquiryDetailsInput = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      organization: form.organization.trim() || null,

      participantCount: form.participantCount
        ? Number(form.participantCount)
        : null,
      deliveryMode: form.deliveryMode
        ? (form.deliveryMode as EnquiryDeliveryMode)
        : null,
      preferredDate: form.preferredDate
        ? new Date(`${form.preferredDate}T00:00:00.000Z`).toISOString()
        : null,
      message: form.message.trim() || null,
      adminNotes: form.adminNotes.trim() || null,
    };

    if (courseChanged) {
      input.courseId = form.courseId;
      input.courseName = form.courseName.trim() || null;
    }

    try {
      await updateMutation.mutateAsync({
        id: enquiry.id,
        input,
      });

      toast.success("Enquiry details updated successfully.");
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update enquiry.",
      );
    }
  }

  return (
    <form
      id="edit-enquiry-form"
      onSubmit={handleSubmit}
      className="space-y-7 px-5 py-6"
    >
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold">Customer information</h3>
          <p className="text-xs text-muted-foreground">
            Update the customer&apos;s contact details.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="enquiry-fullName">Full name</Label>
          <Input
            id="enquiry-fullName"
            value={form.fullName}
            onChange={(e) => setField("fullName", e.target.value)}
            required
            disabled={isSaving}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="enquiry-email">Email address</Label>
            <Input
              id="enquiry-email"
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              required
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="enquiry-phone">Phone number</Label>
            <Input
              id="enquiry-phone"
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
              disabled={isSaving}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="enquiry-organization">Organization</Label>
          <Input
            id="enquiry-organization"
            value={form.organization}
            onChange={(e) => setField("organization", e.target.value)}
            disabled={isSaving}
          />
        </div>
      </section>

      <Separator />

      {enquiry.type === "QUOTE" && (
        <>
          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">Training requirements</h3>
              <p className="text-xs text-muted-foreground">
                Update the requested training information.
              </p>
            </div>

            {commercialChanged && (
              <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                <p className="text-xs leading-relaxed">
                  Changing training requirements may void outstanding
                  quotations. Accepted quotations cannot be modified through
                  this form.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label>Requested course</Label>

              <CourseSelector
                value={{
                    courseId: form.courseId,
                    courseName: form.courseName || null,
                }}
                originalCourse={{
                    courseId: enquiry.courseId,
                    courseName:
                    enquiry.courseName ?? enquiry.course?.title ?? null,
                }}
                onChange={({ courseId, courseName }) => {
                    setForm((previous) => ({
                    ...previous,
                    courseId,
                    courseName: courseName ?? "",
                    }));
                }}
                disabled={isSaving}
                />

              {!form.courseId && (
                <div className="space-y-2 pt-2">
                  <Label htmlFor="custom-course">Custom course name</Label>

                  <Input
                    id="custom-course"
                    value={form.courseName}
                    onChange={(event) =>
                      setField("courseName", event.target.value)
                    }
                    placeholder="Enter the requested course"
                    disabled={isSaving}
                  />
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="enquiry-participants">Participants</Label>
                <Input
                  id="enquiry-participants"
                  type="number"
                  min={1}
                  step={1}
                  value={form.participantCount}
                  onChange={(e) => setField("participantCount", e.target.value)}
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label>Delivery mode</Label>
                <Select
                  value={form.deliveryMode || "NONE"}
                  onValueChange={(value) =>
                    setField("deliveryMode", value === "NONE" ? "" : value)
                  }
                  disabled={isSaving}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select delivery mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">Not specified</SelectItem>
                    <SelectItem value="ONLINE">Online</SelectItem>
                    <SelectItem value="CLIENT_SITE">Client site</SelectItem>
                    <SelectItem value="ARRANGED_VENUE">
                      Arranged venue
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="enquiry-preferredDate">Preferred date</Label>
              <Input
                id="enquiry-preferredDate"
                type="date"
                value={form.preferredDate}
                onChange={(e) => setField("preferredDate", e.target.value)}
                disabled={isSaving}
              />
            </div>
          </section>

          <Separator />
        </>
      )}

      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold">Additional information</h3>
          <p className="text-xs text-muted-foreground">
            Customer request and internal administrative notes.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="enquiry-message">Customer message</Label>
          <Textarea
            id="enquiry-message"
            rows={4}
            value={form.message}
            onChange={(e) => setField("message", e.target.value)}
            disabled={isSaving}
            className="resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="enquiry-adminNotes">Internal notes</Label>
          <Textarea
            id="enquiry-adminNotes"
            rows={4}
            value={form.adminNotes}
            onChange={(e) => setField("adminNotes", e.target.value)}
            disabled={isSaving}
            className="resize-none"
            placeholder="Add internal information..."
          />
        </div>
      </section>

      <div className="flex justify-end gap-2 border-t pt-5">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          Save changes
        </Button>
      </div>
    </form>
  );
}
