"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  Plus,
  MoreHorizontal,
  Edit,
  CheckCircle2,
  FileText,
  ExternalLink,
  ShieldCheck,
  Briefcase,
} from "lucide-react";
import { Trainer, TrainerCertification } from "../services/trainer-service";

interface TrainerDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  trainer: Trainer | null;
  onEdit?: (trainer: Trainer) => void;
  onAssignCourse?: (trainer: Trainer) => void;
}

export function TrainerDetailSheet({
  isOpen,
  onClose,
  trainer,
  onEdit,
  onAssignCourse,
}: TrainerDetailSheetProps) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!trainer) return null;

  const initials =
    `${trainer.firstName?.[0] || ""}${trainer.lastName?.[0] || ""}`.toUpperCase() || "TR";

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetTitle>Trainer Details</SheetTitle>
      <SheetContent className="sm:max-w-[900px] w-full p-0 flex flex-col sm:flex-row gap-0 overflow-hidden">
        {/* ================= LEFT COLUMN: TRAINER PROFILE & CONTACTS ================= */}
        <div className="w-full sm:w-[320px] bg-muted/10 border-r flex flex-col justify-between shrink-0">
          <ScrollArea className="flex-1 p-5">
            <div className="space-y-5">
              {/* Top Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={trainer.status === "ACTIVE" ? "default" : "secondary"}
                  className="text-[10px] uppercase font-semibold px-2 py-0.5"
                >
                  {trainer.status || "ACTIVE"}
                </Badge>
                {trainer.certified && (
                  <Badge variant="outline" className="text-[10px] gap-1 px-2 py-0.5 bg-background">
                    <ShieldCheck className="h-3 w-3 text-primary" /> Verified
                  </Badge>
                )}
              </div>

              {/* Identity & Title */}
              <div className="space-y-1">
                <div className="text-[11px] font-mono text-muted-foreground">
                  ID #{trainer.id.slice(0, 8)}
                </div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  {trainer.firstName} {trainer.lastName}
                </h2>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-0.5">
                  <Briefcase className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                  {trainer.expertise || "General Corporate Trainer"}
                </p>
                {(trainer.primaryCity || trainer.primaryCountry) && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                    {[trainer.primaryCity, trainer.primaryCountry].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>

              {/* Primary Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <Button
                  size="sm"
                  className="h-8 text-xs gap-1.5 flex-1"
                  onClick={() => onAssignCourse?.(trainer)}
                >
                  <Plus className="h-3.5 w-3.5" /> Assign Course
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => onEdit?.(trainer)}
                  title="Edit Trainer Profile"
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Experience Summary Highlight Card */}
              <div className="p-3.5 rounded-xl border bg-card/60 space-y-1">
                <div className="text-[11px] font-medium text-muted-foreground">
                  Years of Experience
                </div>
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {trainer.yearsOfExperience || 0} <span className="text-xs font-normal text-muted-foreground">Years</span>
                </div>
              </div>

              <Separator />

              {/* Contact Details Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Contact Details
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 border shrink-0">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-[11px] font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col truncate">
                      <span className="font-medium text-foreground">
                        {trainer.firstName} {trainer.lastName}
                      </span>
                      <span className="text-[11px] text-muted-foreground truncate">
                        Trainer Partner
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="text-foreground truncate">{trainer.email || "—"}</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span className="text-foreground">{trainer.phone || "—"}</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="text-foreground">
                      {[trainer.primaryCity, trainer.primaryCountry].filter(Boolean).join(", ") || "—"}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Metadata Footer */}
              <div className="text-[11px] text-muted-foreground space-y-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  <span>Joined {trainer.createdAt ? new Date(trainer.createdAt).toLocaleDateString() : "N/A"}</span>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* ================= RIGHT MAIN PANEL: CONTENT & TABS ================= */}
        <div className="flex-1 flex flex-col bg-background overflow-hidden">
          {/* Header Bar */}
          <div className="p-5 pb-3 border-b space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Domain: <span className="font-medium text-foreground">{trainer.expertise || "Corporate Training"}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Qualified Courses: <span className="font-medium text-foreground">{trainer.courses?.length || 0}</span>
              </div>
            </div>

            {/* Stepper / Tabs Header Bar */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="h-9 w-full justify-start bg-transparent p-0 border-b rounded-none space-x-6">
                <TabsTrigger
                  value="overview"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="courses"
                >
                  Qualified Courses ({trainer.courses?.length || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="certs"
                >
                  Certifications ({trainer.certifications.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Main Scrollable Tab View */}
          <ScrollArea className="flex-1 p-6">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Qualification Quick Grid */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Specialization & Compliance
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl border bg-card space-y-1">
                      <div className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                        <Award className="h-3.5 w-3.5 text-primary" /> Primary Expertise
                      </div>
                      <div className="text-xs font-medium text-foreground">
                        {trainer.expertise || "N/A"}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl border bg-card space-y-1">
                      <div className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Compliance Status
                      </div>
                      <div className="text-xs font-medium text-foreground">
                        {trainer.certified ? "Verified & Compliant" : "Pending Verification"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* COURSES TAB */}
            {activeTab === "courses" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider">
                    Linked Courses Capability
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs gap-1"
                    onClick={() => onAssignCourse?.(trainer)}
                  >
                    <Plus className="h-3 w-3" /> Manage Courses
                  </Button>
                </div>

                {!trainer.courses || trainer.courses.length === 0 ? (
                  <div className="p-8 border border-dashed rounded-xl text-center text-xs text-muted-foreground space-y-2">
                    <BookOpen className="h-6 w-6 mx-auto text-muted-foreground/60" />
                    <div>No courses currently linked to this trainer.</div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {trainer.courses.map((course) => (
                      <div
                        key={course.id}
                        className="p-3.5 rounded-xl border bg-card hover:bg-muted/30 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                            <BookOpen className="h-4 w-4" />
                          </div>
                          <div className="space-y-0.5">
                            <div className="text-xs font-semibold text-foreground">
                              {course.course.title}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CERTIFICATIONS TAB */}
            {activeTab === "certs" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider">
                    Credentials & Documents
                  </h3>
                </div>

                {trainer.certifications.length === 0 
                ? (
                  <div className="p-8 border border-dashed rounded-xl text-center text-xs text-muted-foreground space-y-2">
                    <Award className="h-6 w-6 mx-auto text-muted-foreground/60" />
                    <div>No certifications attached to this profile.</div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {trainer.certifications.map((cert: TrainerCertification) => (
                      <div
                        key={cert.id}
                        className="p-3.5 rounded-xl border bg-card flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground">
                              {cert.name}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              {cert.issuedBy}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px]">
                            {cert.expiresAt
                              ? `Expires ${new Date(cert.expiresAt).toLocaleDateString()}`
                              : "No Expiry"}
                          </Badge>
                          {cert.storagePath && (
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}