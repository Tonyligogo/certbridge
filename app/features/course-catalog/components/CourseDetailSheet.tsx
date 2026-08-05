/* eslint-disable @next/next/no-img-element */
'use client';

import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  Award,
  BookOpen,
  BarChart,
  MapPin,
  ArrowRight,
  CalendarCheck,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
import type { Course } from "../types/catalogue";
import { ShareCourseButton } from "./ShareCourseButton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface CourseDetailsSheetProps {
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
  onEnroll?: (course: Course) => void;
}

export function CourseDetailsSheet({
  course,
  open,
  onOpenChange,
  onEnroll,
}: CourseDetailsSheetProps) {
  if (!course) return null;

  const price = Number(course.pricing?.amount ?? 0);
  const currency = course.pricing?.currency;

  const imgUrl = course.thumbnailUrl || "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="p-0 h-full overflow-hidden border-l shadow-2xl flex flex-col">
        {/* Two-Column Split Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-auto md:overflow-hidden">
          
          {/* LEFT COLUMN: Course Identity & Primary Metadata (~4 cols) */}
          <div className="order-2 md:order-1 md:col-span-4 border-r p-4 flex flex-col justify-between md:overflow-y-auto space-y-6">
            <SheetTitle className="sr-only">Course Details</SheetTitle>
          <div className="space-y-6">
                <div className="aspect-video bg-slate-100 overflow-hidden rounded-lg">
                    <img src={imgUrl} alt={course.title} className="h-full w-full object-cover" />
                </div>
                <div className="border-b border-primary/20 pb-6">
                    <p className="font-display text-2xl font-bold">{`From ${currency} ${price.toLocaleString()}`}</p>
                    <p className="text-sm text-muted-foreground">per group</p>
                </div>
                    <ul className="space-y-3 text-sm text-text-secondary border-b border-primary/20 pb-6">
            <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-primary" /> Duration: {course.durationDays} days
            </li>
            <li className="flex items-center gap-3">
                <BarChart className="h-4 w-4 text-primary" /> {course.level}
            </li>
            <li className="flex items-center gap-3">
                <Award className="h-4 w-4 text-primary" /> Certificate Included
            </li>
            <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" /> Online · On-Site · At a Venue
            </li>
            </ul>
            <div>
                <Button
                onClick={() => onEnroll?.(course)}
                className="w-full inline-flex items-center py-6 rounded-xl justify-center gap-2 font-semibold hover:opacity-90 transition"
                >
                Book This Course <ArrowRight className="h-4 w-4" />
                </Button>

                <div className="my-6 flex items-center gap-3 text-xs text-text-muted">
                <span className="h-px flex-1 bg-primary/20" /> or <span className="h-px flex-1 bg-primary/20" />
                </div>

                <a
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 border border-primary/20 text-primary rounded-xl font-semibold hover:bg-blue-50 transition"
                >
                Request a Quote
                </a>
            </div>

            <ul className="space-y-3 text-sm text-text-secondary">
            <li className="flex items-center gap-3">
                <CalendarCheck className="h-4 w-4 text-primary" /> Confirmation within 2 hrs
            </li>
            <li className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-primary" /> Vetted & certified trainers
            </li>
            <li className="flex items-center gap-3">
                <BadgeCheck className="h-4 w-4 text-primary" /> Flexible scheduling
            </li>
            </ul>
          </div>

            {/* Footer Metadata */}
           <ShareCourseButton courseSlug={course.slug} />
          </div>

          {/* RIGHT COLUMN: Stepper Progress, Tabs, & Main Content (~8 cols) */}
          <div className="order-1 md:order-2 md:col-span-8 flex flex-col h-full md:overflow-hidden">
            
            <div className="p-4 pb-6 border-b border-primary/20">
                <span className="text-sm font-semibold uppercase tracking-wider">
            {course.category.name}
          </span>
          <h1 className="mt-3 text-4xl font-bold leading-tight max-w-3xl">
            {course.title}
          </h1>
          <p className="mt-5 text-base max-w-2xl leading-relaxed">
            {course.shortDescription}
          </p>
          <div className="mt-5">
          {course.audiences.map((audience) => (
              <span key={audience.id} className="px-5 mr-2 py-1.5 rounded-full bg-primary text-white text-xs font-semibold">
                {audience.name}
              </span>
            ))}
          </div>
            </div>

            {/* Main Tabs Navigation */}
            <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
              <div className="border-b border-primary/20 py-4 px-4">
                <TabsList className="bg-transparent p-0 gap-4">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-none border-none rounded"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="syllabus"
                    className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-none border-none rounded"
                  >
                    Modules
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Contents (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="m-0 space-y-6">
                  {/* Detailed Description */}
                  <div>
                    <h2 className="font-display text-xl font-bold mb-3">Course Description</h2>
                    <p className="text-base leading-relaxed">{course.description}</p>
                  </div>

                  {/* Audience */}
                  <h3 className="font-display text-xl font-bold mt-4 mb-4">Who this course is for</h3>
              <ul className="space-y-2 text-text-secondary">
                {course.audiences.map((audience) => (
                  <li key={audience.id} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {audience.name}
                  </li>
                ))}
              </ul>

                  {/* Delivery formats */}
            <div>
              <h2 className="font-display text-xl font-bold mb-5">Delivery Formats</h2>
               <ul className="space-y-2 text-text-secondary">
                {['Online', 'On-Site', 'Arranged Venue'].map((format) => (
                  <li key={format} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {format}
                  </li>
                ))}
              </ul>
            </div>
                {/* About the Trainer */}
             <div className="bg-white border border-blue-100 rounded-2xl p-4">
                <div>
                  <h3 className="font-display text-lg font-bold">About the Trainer</h3>
                  <p className="text-sm text-text-muted mb-3">Trained, Vetted facilitator</p>
                  <p className="text-text-secondary leading-relaxed">
                    Once you book a course, we match you with a trainer from our pre-vetted bench based on
                    your industry, team profile and learning goals. Every CertBridge Global facilitator
                    holds accredition from known bodies, has been peer-reviewed
                    by past clients, and is certified in adult learning methodologies.
                  </p>
                </div>
            </div>
                </TabsContent>

                {/* SYLLABUS TAB */}
                <TabsContent value="syllabus" className="m-0 space-y-4">
                  <h3 className="font-display text-xl font-bold mt-4 mb-4">Course Outline</h3>
                    <Accordion type="single" collapsible defaultValue="item-0" className="bg-white border border-blue-100 rounded-2xl px-6">
                {course.modules.map((m, i) => (
                  <AccordionItem key={m.title} value={`item-${i}`} className="border-blue-100">
                    <AccordionTrigger className="text-left text-base flex items-center gap-3 py-5">
                      <BookOpen className="w-5 h-5 text-primary" />
                        <span className="flex flex-col">
                      {`Module ${i + 1}: ${m.title}`}
                        <span className="text-[13px] tracking-wide font-normal text-muted-foreground">Estimated duration • {m.estimatedDuration} Mins</span> 
                        </span>
                    </AccordionTrigger>
                    <AccordionContent className="leading-relaxed pb-5 pl-8">
                      {m.description}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
                </TabsContent>
              </div>
            </Tabs>
          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
}