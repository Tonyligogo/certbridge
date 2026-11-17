import { Suspense } from "react";
import { ContactPageContent } from "./contact-page-content";

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8fafc]" />}>
      <ContactPageContent />
    </Suspense>
  );
}