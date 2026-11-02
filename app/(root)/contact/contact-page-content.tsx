"use client";

import { useEffect, useState } from "react";
import type { SubmitEventHandler } from "react";
import { ArrowUpRight, Check, ChevronDown, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreateEnquiryInput } from "@/app/features/enquiry/types";
import { useCreateEnquiry } from "@/app/features/enquiry/hooks/use-enquiry";
import { useSearchParams } from "next/navigation";

type EnquiryType = "QUOTE" | "GENERAL";

type DeliveryMode = "ONLINE" | "CLIENT_SITE" | "ARRANGED_VENUE";

type CourseOption = {
  id: string;
  title: string;
  slug: string;
};

type ContactFormData = {
  enquiryType: EnquiryType;
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  courseId: string;
  customCourseTitle: string;
  participants: string;
  deliveryMode: DeliveryMode;
  preferredDate: string;
  message: string;
};

const initialForm: ContactFormData = {
  enquiryType: "QUOTE",
  fullName: "",
  email: "",
  phone: "",
  organization: "",
  courseId: "",
  customCourseTitle: "",
  participants: "10",
  deliveryMode: "ONLINE",
  preferredDate: "",
  message: "",
};

// Replace these with CertBridge's actual contact details.
const CONTACT = {
  email: "info@certbridgeglobal.com",
  phoneDisplay: "+254 XXX XXX XXX",
  phoneHref: "",
  whatsappHref: "",
  linkedinHref: "",
  facebookHref: "",
  instagramHref: "",
};

// Temporary catalogue data.
// Replace with your actual course data/API later.
const COURSES: CourseOption[] = [];

function formatCourseSlug(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function ContactPageContent() {
  const searchParams = useSearchParams();
  const courseSlug = searchParams.get("course");

  const matchingCourse = courseSlug
    ? COURSES.find((course) => course.slug === courseSlug)
    : undefined;

  const [form, setForm] = useState<ContactFormData>(() => ({
    ...initialForm,
    enquiryType: "QUOTE",
    courseId: matchingCourse?.id ?? "",
    customCourseTitle:
      courseSlug && !matchingCourse ? formatCourseSlug(courseSlug) : "",
  }));

  const createEnquiry = useCreateEnquiry();

  const [submittedReference, setSubmittedReference] = useState<string | null>(
    null,
  );

  const isSubmitting = false;

  const [courseSearch, setCourseSearch] = useState(
    () => matchingCourse?.title ?? "",
  );

  const [showCourseResults, setShowCourseResults] = useState(false);

  const [useCustomCourse, setUseCustomCourse] = useState(() =>
    Boolean(courseSlug && !matchingCourse),
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  function updateField<K extends keyof ContactFormData>(
    key: K,
    value: ContactFormData[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setErrors((current) => {
      if (!current[key]) return current;

      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  const filteredCourses = COURSES.filter((course) =>
    course.title.toLowerCase().includes(courseSearch.toLowerCase()),
  ).slice(0, 6);

  function selectCourse(course: CourseOption) {
    updateField("courseId", course.id);
    updateField("customCourseTitle", "");
    setCourseSearch(course.title);
    setShowCourseResults(false);
    setUseCustomCourse(false);
  }

  function validate() {
    const nextErrors: Record<string, string> = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = "Please enter your name.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (form.enquiryType === "QUOTE") {
      if (!form.courseId && !form.customCourseTitle.trim()) {
        nextErrors.courseId = "Please specify a training topic.";
      }

      if (
        form.participants &&
        (!Number.isInteger(Number(form.participants)) ||
          Number(form.participants) < 1)
      ) {
        nextErrors.participants = "Enter a valid participant count.";
      }
    }

    if (form.enquiryType === "GENERAL" && !form.message.trim()) {
      nextErrors.message = "Please enter your message.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (!validate() || createEnquiry.isPending) return;

    const isQuote = form.enquiryType === "QUOTE";

    const payload: CreateEnquiryInput = {
      type: form.enquiryType,
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      organization: form.organization.trim() || undefined,

      ...(isQuote && {
        courseId: form.courseId || undefined,
        courseName: form.courseId
          ? undefined
          : form.customCourseTitle.trim() || undefined,

        participantCount: form.participants
          ? Number(form.participants)
          : undefined,

        deliveryMode: form.deliveryMode || undefined,
        preferredDate: form.preferredDate || undefined,
      }),

      message: form.message.trim() || undefined,
    };

    try {
      const response = await createEnquiry.mutateAsync(payload);

      if (response.success && response.data) {
        setSubmittedReference(response.data.reference);
      }
    } catch (error) {
      console.error("Failed to submit enquiry:", error);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-950">
      <div className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20 xl:gap-28">
          {/* LEFT SIDE */}
          <div className="flex flex-col lg:min-h-[760px]">
            <div className="mb-10 flex items-center gap-3">
              <span className="size-1.5 rounded-full bg-blue-600" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Let&apos;s talk training
              </span>
            </div>

            <h1 className="font-display max-w-[600px] text-[clamp(3.8rem,6.3vw,7rem)] font-bold leading-[0.98] tracking-[-0.065em] text-slate-950">
              Let&apos;s make
              <br />
              <span className="text-blue-600">progress.</span>
            </h1>

            <p className="mt-9 max-w-md text-base leading-8 text-slate-700">
              Every great team starts with the right skills. Tell us what
              you&apos;re looking to achieve, and we&apos;ll help you find the
              right training solution.
            </p>

            <div className="mt-12 space-y-8">
              <div>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Email us
                </p>

                <a
                  href={`mailto:${CONTACT.email}`}
                  className="group inline-flex items-center gap-5 border-b border-slate-300 pb-2 text-lg font-medium transition-colors hover:border-blue-600 hover:text-blue-600"
                >
                  {CONTACT.email}
                  <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </div>

              {CONTACT.phoneHref && (
                <div>
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Call us
                  </p>

                  <a
                    href={CONTACT.phoneHref}
                    className="text-lg font-medium transition-colors hover:text-blue-600"
                  >
                    {CONTACT.phoneDisplay}
                  </a>
                </div>
              )}

              {CONTACT.whatsappHref && (
                <div>
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Prefer a quick conversation?
                  </p>

                  <a
                    href={CONTACT.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border-b border-slate-300 pb-1 text-sm font-medium transition-colors hover:border-blue-600 hover:text-blue-600"
                  >
                    Chat with us on WhatsApp
                    <ArrowUpRight className="size-4" />
                  </a>
                </div>
              )}
            </div>

            <div className="mt-16 lg:mt-auto lg:pt-16">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Connect with us
              </p>

              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {[
                  { label: "LinkedIn", href: CONTACT.linkedinHref },
                  { label: "Facebook", href: CONTACT.facebookHref },
                  { label: "Instagram", href: CONTACT.instagramHref },
                ]
                  .filter((social) => Boolean(social.href))
                  .map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-slate-600 transition-colors hover:text-blue-600"
                    >
                      {social.label}
                      <ArrowUpRight className="size-3.5" />
                    </a>
                  ))}
              </div>

              <p className="mt-12 text-[10px] uppercase tracking-[0.16em] text-slate-400">
                Building capability. Bridging opportunity.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:border-l lg:border-slate-200 lg:pl-12 xl:pl-16">
            <div className="mb-10 flex items-center justify-between gap-4">
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em]">
                Tell us what you need
              </h2>

              <span className="text-[10px] uppercase tracking-wider text-slate-400">
                * Required
              </span>
            </div>

            {/* Enquiry type */}
            <div className="mb-10">
              <p className="mb-4 text-sm font-medium text-slate-800">
                What can we help you with?
              </p>

              <div className="flex flex-wrap gap-3">
                {[
                  { value: "QUOTE", label: "Request a quote" },
                  { value: "GENERAL", label: "General enquiry" },
                ].map((option) => {
                  const selected = form.enquiryType === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        updateField("enquiryType", option.value as EnquiryType)
                      }
                      className={`rounded-lg border px-5 py-3 text-sm font-medium transition-colors ${
                        selected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-300 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="grid gap-x-7 gap-y-9 sm:grid-cols-2">
                <ContactInput
                  label="Your name"
                  required
                  placeholder="Your full name"
                  value={form.fullName}
                  onChange={(value) => updateField("fullName", value)}
                  error={errors.fullName}
                />

                <ContactInput
                  label="Email address"
                  required
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(value) => updateField("email", value)}
                  error={errors.email}
                />

                <ContactInput
                  label="Organisation"
                  placeholder="Company or organisation"
                  value={form.organization}
                  onChange={(value) => updateField("organization", value)}
                />

                <ContactInput
                  label="Phone number"
                  type="tel"
                  placeholder="+254..."
                  value={form.phone}
                  onChange={(value) => updateField("phone", value)}
                />
              </div>

              {form.enquiryType === "QUOTE" && (
                <div className="mt-10 space-y-9">
                  {/* Course selection */}
                  <div>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <label className="text-sm font-medium text-slate-700">
                        Training course or topic
                        <span className="ml-1 text-blue-600">*</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          setUseCustomCourse(!useCustomCourse);
                          updateField("courseId", "");
                          updateField("customCourseTitle", "");
                          setCourseSearch("");
                        }}
                        className="text-xs font-medium text-blue-600 hover:underline"
                      >
                        {useCustomCourse
                          ? "Choose from catalogue"
                          : "Enter custom topic"}
                      </button>
                    </div>

                    {useCustomCourse ? (
                      <input
                        type="text"
                        value={form.customCourseTitle}
                        onChange={(event) =>
                          updateField("customCourseTitle", event.target.value)
                        }
                        placeholder="Enter the training topic"
                        className="w-full border-0 border-b border-slate-300 bg-transparent px-0 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-600"
                      />
                    ) : (
                      <div className="relative">
                        <Input
                          type="text"
                          value={courseSearch}
                          onChange={(event) => {
                            setCourseSearch(event.target.value);
                            updateField("courseId", "");
                            setShowCourseResults(true);
                          }}
                          onFocus={() => setShowCourseResults(true)}
                          placeholder="Search available courses"
                        />

                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-600" />
                        {showCourseResults &&
                          courseSearch.trim() &&
                          filteredCourses.length > 0 && (
                            <div className="absolute z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-md border border-slate-200 bg-white p-1 shadow-lg">
                              {filteredCourses.map((course) => (
                                <button
                                  key={course.id}
                                  type="button"
                                  onClick={() => selectCourse(course)}
                                  className="flex w-full items-center justify-between rounded px-3 py-2.5 text-left text-sm hover:bg-slate-50"
                                >
                                  <span>{course.title}</span>

                                  {form.courseId === course.id && (
                                    <Check className="size-4 text-blue-600" />
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                      </div>
                    )}

                    {errors.courseId && (
                      <p className="mt-2 text-xs text-red-600">
                        {errors.courseId}
                      </p>
                    )}

                    {!useCustomCourse && COURSES.length === 0 && (
                      <p className="mt-2 text-xs text-slate-400">
                        Catalogue search will be connected to your course data.
                        You can use {"Enter custom topic"} for now.
                      </p>
                    )}
                  </div>

                  <div className="grid gap-x-7 gap-y-9 sm:grid-cols-2">
                    <ContactInput
                      label="Number of participants"
                      type="number"
                      min="1"
                      placeholder="Estimated group size"
                      value={form.participants}
                      onChange={(value) => updateField("participants", value)}
                      error={errors.participants}
                    />

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-800">
                        Preferred delivery method
                      </label>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        {[
                          {
                            value: "ONLINE",
                            label: "Online",
                          },
                          {
                            value: "CLIENT_SITE",
                            label: "Client site",
                          },
                          {
                            value: "ARRANGED_VENUE",
                            label: "Arranged venue",
                          },
                        ].map((option) => {
                          const selected = form.deliveryMode === option.value;

                          return (
                            <button
                              key={option.value}
                              type="button"
                              aria-pressed={selected}
                              onClick={() =>
                                updateField(
                                  "deliveryMode",
                                  option.value as DeliveryMode,
                                )
                              }
                              className={`min-h-12 rounded-lg border px-3 py-3 text-center text-sm font-medium transition-all ${
                                selected
                                  ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                                  : "border-slate-300 bg-white text-slate-700 hover:border-blue-400 hover:bg-slate-50"
                              }`}
                            >
                              {option.label}
                            </button>
                          );
                        })}
                      </div>

                      <p className="text-xs leading-relaxed text-slate-600">
                        Choose your preferred training format. We can confirm
                        the arrangements when preparing your quotation.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-x-7 gap-y-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="preferred-date"
                        className="mb-2 block text-sm font-medium text-slate-800"
                      >
                        Preferred training date
                      </label>

                      <div className="relative">
                        <Input
                          id="preferred-date"
                          type="date"
                          value={form.preferredDate}
                          min={new Date().toLocaleDateString("en-CA")}
                          onChange={(event) =>
                            updateField("preferredDate", event.target.value)
                          }
                          className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-10">
                <label
                  htmlFor="contact-message"
                  className="mb-3 block text-sm font-medium text-slate-700"
                >
                  {form.enquiryType === "QUOTE"
                    ? "Tell us about your training needs"
                    : "Your message"}

                  <span className="ml-1 text-blue-600">*</span>
                </label>

                <Textarea
                  id="contact-message"
                  rows={5}
                  value={form.message}
                  onChange={(event) =>
                    updateField("message", event.target.value)
                  }
                  placeholder={
                    form.enquiryType === "QUOTE"
                      ? "Share your objectives, requirements, or anything we should know..."
                      : "How can we help you?"
                  }
                  className="w-full resize-y border-0 border-b border-slate-300 bg-transparent px-0 py-3 text-sm leading-7 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-600"
                />

                {errors.message && (
                  <p className="mt-2 text-xs text-red-600">{errors.message}</p>
                )}
              </div>

              <div className="mt-10 flex flex-col gap-6 border-t border-slate-200 pt-6 sm:flex-row sm:items-end sm:justify-between">
                <p className="max-w-xs text-xs leading-6 text-slate-400">
                  By submitting this form, you agree that CertBridge Global may
                  contact you regarding your enquiry.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex shrink-0 items-center justify-center gap-8 bg-blue-600 px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      Sending...
                      <Loader2 className="size-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      {form.enquiryType === "QUOTE"
                        ? "Request quotation"
                        : "Send enquiry"}

                      <ArrowUpRight className="size-4" />
                    </>
                  )}
                </button>
              </div>

              <p className="mt-3 text-right text-xs text-slate-400">
                Submission will be enabled when the backend is connected.
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

function ContactInput({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
  min,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  min?: string;
  error?: string;
}) {
  const id = `contact-${label.toLowerCase().replace(/\W+/g, "-")}`;

  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-slate-800"
      >
        {label}
        {required && <span className="ml-1 text-blue-600">*</span>}
      </label>

      <input
        id={id}
        type={type}
        min={min}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 aria-invalid:border-red-500"
      />

      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
