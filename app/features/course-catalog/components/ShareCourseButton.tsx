'use client';

import { useState } from "react";
import { Share2, Link2, Check } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  courseSlug?: string;
}

export function ShareCourseButton({ courseSlug }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      // Build full URL (uses current location in browser)
      const url = `${window.location.origin}/courses/${courseSlug}`;
      
      await navigator.clipboard.writeText(url);
      
      setCopied(true);
      toast.success("Course link copied");

      setTimeout(() => setCopied(false), 2000);
    } catch{
      toast.error("Failed to copy link");
    }
  };

  return (
    <button
      onClick={handleShare}
      type="button"
      className="mt-6 pt-5 cursor-pointer border-t border-blue-100 flex items-center gap-3 text-text-muted w-full hover:opacity-80 transition-opacity"
    >
      <Share2 className="h-4 w-4 text-primary" />
      <span className="text-xs font-semibold uppercase tracking-wider">Share</span>
      <div className="ml-auto flex items-center gap-2">
        <div className="h-8 w-8 rounded-full border border-primary/20 flex items-center justify-center transition-colors">
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <Link2 className="h-3.5 w-3.5 text-primary" />
          )}
        </div>
      </div>
    </button>
  );
}