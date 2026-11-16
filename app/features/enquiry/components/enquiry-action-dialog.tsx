"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EnquiryStatus } from "../types";

export type EnquiryDialogType =
  | "STATUS"
  | "NOTE"
  | "CLOSE"
  | "CONVERT"
  | null;

type ActiveEnquiryStatus = Extract<
  EnquiryStatus,
  "NEW" | "CONTACTED" | "IN_PROGRESS"
>;

interface EnquiryActionDialogsProps {
  type: EnquiryDialogType;
  onClose: () => void;
  currentStatus: EnquiryStatus;
  isSubmitting: boolean;
  onChangeStatus: (
    status: "NEW" | "CONTACTED" | "IN_PROGRESS"
  ) => Promise<void>;
  onAddNote: (note: string) => Promise<void>;
  onCloseEnquiry: (reason: string) => Promise<void>;
}

export function EnquiryActionDialogs({
  type,
  onClose,
  currentStatus,
  isSubmitting,
  onChangeStatus,
  onAddNote,
  onCloseEnquiry,
}: EnquiryActionDialogsProps) {
  const [status, setStatus] = useState<ActiveEnquiryStatus>(
  currentStatus === "CLOSED" || currentStatus === "CONVERTED"
    ? "NEW"
    : currentStatus
);

  const [note, setNote] = useState("");
  const [reason, setReason] = useState("");

  function handleOpenChange(open: boolean) {
    if (!open && !isSubmitting) {
      onClose();
    }
  }

  async function submitStatus() {
    if (status === currentStatus) return;

    await onChangeStatus(status);
  }

  async function submitNote() {
    if (!note.trim()) return;

    await onAddNote(note.trim());
    setNote("");
  }

  async function submitClose() {
    if (reason.trim().length < 5) return;

    await onCloseEnquiry(reason.trim());
    setReason("");
  }

  return (
    <>
      {/* Change status */}
      <Dialog
        open={type === "STATUS"}
        onOpenChange={handleOpenChange}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change enquiry status</DialogTitle>
            <DialogDescription>
              Update the current stage of this enquiry.
              The change will be recorded in its activity history.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Label>New status</Label>

            <Select
              value={status}
              onValueChange={(value) =>
                setStatus(
                  value as
                    | "NEW"
                    | "CONTACTED"
                    | "IN_PROGRESS"
                )
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="CONTACTED">
                  Contacted
                </SelectItem>
                <SelectItem value="IN_PROGRESS">
                  In progress
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              onClick={submitStatus}
              disabled={
                isSubmitting || status === currentStatus
              }
            >
              {isSubmitting && (
                <Loader2 className="size-4 animate-spin" />
              )}
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add internal note */}
      <Dialog
        open={type === "NOTE"}
        onOpenChange={handleOpenChange}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add internal note</DialogTitle>
            <DialogDescription>
              This note is only visible to administrators.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Label htmlFor="enquiry-note">Note</Label>

            <Textarea
              id="enquiry-note"
              placeholder="Enter your note..."
              rows={5}
              value={note}
              onChange={(event) =>
                setNote(event.target.value)
              }
              maxLength={5000}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              onClick={submitNote}
              disabled={!note.trim() || isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="size-4 animate-spin" />
              )}
              Save note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close enquiry */}
      <Dialog
        open={type === "CLOSE"}
        onOpenChange={handleOpenChange}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close enquiry</DialogTitle>
            <DialogDescription>
              This enquiry will be marked as closed.
              You can reopen it later if needed.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Label htmlFor="close-reason">
              Reason for closing
            </Label>

            <Textarea
              id="close-reason"
              placeholder="Why is this enquiry being closed?"
              rows={4}
              value={reason}
              onChange={(event) =>
                setReason(event.target.value)
              }
              maxLength={2000}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={submitClose}
              disabled={
                reason.trim().length < 5 ||
                isSubmitting
              }
            >
              {isSubmitting && (
                <Loader2 className="size-4 animate-spin" />
              )}
              Close enquiry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}