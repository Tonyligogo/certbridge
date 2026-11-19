
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, ChevronRight } from "lucide-react";

const faqCategories = [
  {
    id: "general",
    title: "General Questions",
    questions: [
      {
        question: "What is CertBridge Global?",
        answer:
          "CertBridge Global connects organisations with professional training programmes and coordinates the arrangements needed to deliver training that meets their needs.",
      },
      {
        question: "Who can book training through CertBridge?",
        answer:
          "Our training services are intended for organisations looking to develop the knowledge and skills of their employees and teams.",
      },
      {
        question: "What types of training programmes do you offer?",
        answer:
          "We offer a range of professional and corporate training programmes across different subject areas. You can explore the available programmes in our course catalogue.",
      },
      {
        question: "What if I cannot find the training programme I'm looking for?",
        answer:
          "You can submit an enquiry describing the training you need. Tell us about the programme or skills your organisation wants to develop, and we'll explore how we can help make it available.",
      },
    ],
  },
  {
    id: "courses",
    title: "Courses & Training",
    questions: [
      {
        question: "Can we book a course directly from the catalogue?",
        answer:
          "Yes. You can select an available programme and proceed directly to the booking form. You do not need to submit an enquiry first.",
      },
      {
        question: "Can we request training tailored to our organisation?",
        answer:
          "If you have specific training requirements that aren't covered by the listed programmes, you can submit an enquiry outlining your needs so we can explore the available options.",
      },
      {
        question: "How long do training programmes take?",
        answer:
          "Training duration varies depending on the programme. Each course listing provides its expected duration.",
      },
      {
        question: "Do participants receive certificates after training?",
        answer:
          "Yes. Certificates of participation are offered upon successful completion of the relevant programme requirements. Awarding-body certificates may also be available for programmes where applicable.",
      },
    ],
  },
  {
    id: "bookings",
    title: "Bookings & Payments",
    questions: [
      {
        question: "How do I book a training programme?",
        answer:
          "Browse the course catalogue, select your preferred programme and complete the booking form. You'll provide your preferred dates, delivery mode, participant count, organisation details and any additional requirements.",
      },
      {
        question: "What happens after I submit a booking?",
        answer:
          "Our team reviews your booking, coordinates the necessary training arrangements and selects an appropriate trainer for your programme. Where a physical venue is required, the venue arrangements are also coordinated.",
      },
      {
        question: "When will I receive my quotation?",
        answer:
          "Your quotation is sent after the necessary trainer and venue arrangements have been made, where applicable.",
      },
      {
        question: "Is an advance payment required?",
        answer:
          "Yes. An advance payment is required to confirm your booking. The payment details and applicable amount will be provided with your quotation.",
      },
      {
        question: "What payment methods does CertBridge accept?",
        answer:
          "CertBridge accepts payments through various payment methods. The applicable payment instructions will be shared with you alongside your quotation.",
      },
      {
        question: "When is my booking considered confirmed?",
        answer:
          "Your booking is confirmed once the required advance payment has been received and the necessary arrangements have been confirmed.",
      },
      {
        question: "Can I change my booking after submitting it?",
        answer:
          "If you need to make changes to your booking, please contact our team directly. We'll review your request and guide you through the available options.",
      },
      {
        question: "What happens if we need to cancel a booking?",
        answer:
          "If you need to cancel, please contact us as soon as possible. CertBridge may recover costs that have already been committed or reasonably incurred in preparing for your training, in accordance with our Terms & Conditions.",
      },
    ],
  },
  {
    id: "delivery",
    title: "Training Delivery",
    questions: [
      {
        question: "What training delivery options are available?",
        answer:
          "We offer three delivery options: online training, training at your organisation's premises, and training at a venue arranged by CertBridge.",
      },
      {
        question: "Can we have training conducted at our offices?",
        answer:
          "Yes. Select Client-Site Training when completing your booking, and we'll coordinate the arrangements for training at your organisation's premises.",
      },
      {
        question: "Who selects the trainer for our programme?",
        answer:
          "CertBridge selects a trainer with the relevant expertise and experience to deliver your chosen programme effectively.",
      },
      {
        question: "Do we need to arrange a training venue ourselves?",
        answer:
          "Not if you choose the Arranged-Venue option. CertBridge coordinates the venue arrangements for your training.",
      },
    ],
  },
  {
    id: "partners",
    title: "Trainers & Venue Partners",
    questions: [
      {
        question: "Can I become a trainer with CertBridge Global?",
        answer:
          "We welcome enquiries from qualified and experienced professionals interested in delivering training programmes through CertBridge Global.",
      },
      {
        question: "What qualifications or experience do I need to become a trainer?",
        answer:
          "Trainer requirements depend on the subject area and programme. Relevant professional qualifications, practical experience and demonstrated subject-matter expertise are important considerations.",
      },
      {
        question: "Can my training venue partner with CertBridge?",
        answer:
          "Yes. We welcome enquiries from suitable training venues interested in partnering with us to support the delivery of corporate training programmes.",
      },
      {
        question: "How can I become a trainer or venue partner with CertBridge?",
        answer:
          "If you're interested in working with CertBridge as a trainer or venue partner, please contact our team. We'd be happy to learn more about your experience, services and facilities.",
      },
    ],
  },
];

export function FaqsContent() {
  const [activeCategory, setActiveCategory] = useState("general");

  const selectedCategory =
    faqCategories.find((category) => category.id === activeCategory) ??
    faqCategories[0];

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16">
          {/* Category navigation */}
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <p className="mb-4 hidden text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground lg:block">
              Browse by topic
            </p>

            <nav
              aria-label="FAQ categories"
              className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0"
            >
              {faqCategories.map((category) => {
                const isActive = activeCategory === category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={`flex shrink-0 items-center justify-between gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors lg:w-full ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {category.title}

                    <ChevronRight
                      className={`hidden h-4 w-4 lg:block ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Questions */}
          <div className="min-w-0">
            <div className="mb-8 flex items-end justify-between gap-4 border-b border-border pb-6">
              <div>
                <p className="mb-2 text-sm font-medium text-primary">
                  Frequently asked questions
                </p>

                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {selectedCategory.title}
                </h2>
              </div>

              <span className="shrink-0 text-sm text-muted-foreground">
                {selectedCategory.questions.length} questions
              </span>
            </div>

            <Accordion type="multiple" className="w-full">
              {selectedCategory.questions.map((faq, index) => (
                <AccordionItem
                  key={faq.question}
                  value={`${selectedCategory.id}-${index}`}
                  className="border-b border-border"
                >
                  <AccordionTrigger className="gap-6 py-6 text-left text-sm font-semibold leading-7 text-foreground hover:no-underline sm:text-base">
                    {faq.question}
                  </AccordionTrigger>

                  <AccordionContent className="max-w-3xl pb-7 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-muted/30">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-16 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12 lg:py-20">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Still have questions?
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              We&apos;re happy to help.
            </h2>

            <p className="mt-4 text-base leading-8 text-muted-foreground">
              If you couldn&apos;t find the answer you were looking for, get in
              touch with our team. We&apos;ll be glad to assist you with your
              training requirements.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Contact Us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
