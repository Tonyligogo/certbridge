"use client";

import { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Loader2,
  User,
  BookOpen,
  Award,
  Upload,
  Check,
  Trash2,
  FileText,
  Plus,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Trainer, TrainerCertification } from "../services/trainer-service";
import { CreateTrainerInput } from "../lib/trainer-schema";
import { TrainerStatus } from "@/generated/prisma/enums";
import { useCreateTrainer, useCreateTrainerCertification, useDeleteTrainerCertification, useTrainerCertifications, useUpdateTrainer, useUpdateTrainerCourses, useUploadTrainerCertification } from "../hooks/use-trainers";
import { useAvailableCourses } from "@/hooks/course/use-course";
import { CertificationDetails } from "./CertificationDetails";

interface TrainerFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  trainer?: Trainer | null;
  onSuccess?: () => void;
}

type Step = 1 | 2 | 3;

export function TrainerFormDialog({
  isOpen,
  onClose,
  trainer,
  onSuccess,
}: TrainerFormDialogProps) {
  const isEditing = !!trainer;
  const initialDefaultValues: CreateTrainerInput = trainer
    ? {
        firstName: trainer.firstName || "",
        lastName: trainer.lastName || "",
        email: trainer.email || "",
        phone: trainer.phone || "",
        expertise: trainer.expertise || "",
        yearsOfExperience: trainer.yearsOfExperience ?? 0,
        courseIds: trainer.courses?.map((c) => c.id) || [],
        primaryCity: trainer.primaryCity || "",
        primaryCountry: trainer.primaryCountry || "",
        certified: trainer.certified ?? false,
        status: trainer.status || "ACTIVE",
      }
    : {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        expertise: "",
        yearsOfExperience: 0,
        courseIds: [],
        primaryCity: "",
        primaryCountry: "",
        certified: false,
        status: "ACTIVE",
      };
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [createdTrainerId, setCreatedTrainerId] = useState<string | null>(null);

  // Active trainer ID (either passed in edit mode or generated in create mode)
  const activeTrainerId = trainer?.id || createdTrainerId;

  // Selected Course IDs
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>(() =>
    trainer?.courses?.map((c) => c.id) || []
  );

  // Certification Form State (Step 3)
  const [certName, setCertName] = useState("");
  const [certIssuedBy, setCertIssuedBy] = useState("");
  const [certIssuedAt, setCertIssuedAt] = useState("");
  const [certExpiresAt, setCertExpiresAt] = useState("");
  const [certFile, setCertFile] = useState<File | null>(null);
  const [certToView, setCertToView] = useState<TrainerCertification | null>(null);

   const { mutateAsync: createTrainer, isPending: isCreating } = useCreateTrainer();
  const { mutateAsync: updateTrainer, isPending: isUpdating } = useUpdateTrainer();
  const { mutateAsync: updateCourses, isPending: isUpdatingCourses } =
    useUpdateTrainerCourses();

  // Certifications Queries & Mutations
  const { data: certsData, isLoading: isLoadingCerts } =
    useTrainerCertifications(activeTrainerId || "");
  const { mutateAsync: uploadFile, isPending: isUploading } =
    useUploadTrainerCertification();
  const { mutateAsync: createCert, isPending: isCreatingCert } =
    useCreateTrainerCertification();
  const { mutate: deleteCert, isPending: isDeletingCert } =
    useDeleteTrainerCertification();

  // Form setup for Personal Details (Step 1)
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateTrainerInput>({
    defaultValues: initialDefaultValues,
  });

  const expertise = useWatch({
  control,
  name: "expertise",
}) ?? "";

const expertiseTerms = expertise
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

const {
  data: availableCourses,
} = useAvailableCourses(
  expertiseTerms,
  currentStep === 2
);

useEffect(() => {
  if (isOpen) {
    reset(initialDefaultValues);
  }
}, [isOpen, trainer]);

  const certifications = certsData?.data || [];
  const isSubmitting =
    isCreating || isUpdating || isUpdatingCourses || isUploading || isCreatingCert;

  // Course Toggle Handler
  const handleCourseToggle = (courseId: string) => {
    setSelectedCourseIds((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  // Step 1 -> Step 2 transition
  const handleNextToCourses = handleSubmit(() => {
    setCurrentStep(2);
  });

  // Final Submit for Creation / Details Update
  const handleSaveDetailsAndCourses = async (formData?: CreateTrainerInput) => {
    try {
      if (isEditing && trainer) {
        // 1. Update Core Details
        if (formData) {
          await updateTrainer({
            id: trainer.id,
            data: {
              ...formData,
              yearsOfExperience: Number(formData.yearsOfExperience) || 0,
            },
          });
        }

        // 2. Sync Courses
        await updateCourses({
          id: trainer.id,
          data: { courseIds: selectedCourseIds },
        });

        toast.success("Trainer profile and courses updated.");
        onSuccess?.();
      } else if (formData) {
        const response = await createTrainer({
          ...formData,
          yearsOfExperience: Number(formData.yearsOfExperience) || 0,
          courseIds: selectedCourseIds,
        });

        const newId = response?.data?.id;
        if (newId) {
          setCreatedTrainerId(newId);
          toast.success("Trainer created! You can now add certifications.");
          onSuccess?.();
          setCurrentStep(3);
        }
      }
    } catch{
      toast.error("Failed to save trainer details.");
    }
  };

  // Step 3 Certification Addition
  const handleAddCertification = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!activeTrainerId) {
      toast.error("Trainer must be created before uploading certifications.");
      return;
    }
    if (!certName || !certIssuedBy) {
      toast.error("Please provide credential name and issuing organization.");
      return;
    }

    try {
      let storagePath = "";
      if (certFile) {
        const uploadRes = await uploadFile({
          trainerId: activeTrainerId,
          file: certFile,
        });
        storagePath = uploadRes.path;
      }

      await createCert({
        trainerId: activeTrainerId,
        data: {
          name: certName,
          issuedBy: certIssuedBy,
          issuedAt: certIssuedAt ? new Date(certIssuedAt) : undefined,
          expiresAt: certExpiresAt ? new Date(certExpiresAt) : undefined,
          storagePath: storagePath,
        },
      });

      toast.success("Certification added successfully.");
      setCertName("");
      setCertIssuedBy("");
      setCertIssuedAt("");
      setCertExpiresAt("");
      setCertFile(null);
    } catch {
      toast.error("Failed to attach certification.");
    }
  };

  // handle view certification details
  const handleViewCert = (certification: TrainerCertification) => {
    console.log(certification)
    setCertToView(certification);
  }

  // Delete Certification Handler
  const handleDeleteCert = (certificationId: string) => {
    if (!activeTrainerId) return;
    deleteCert(
      { trainerId: activeTrainerId, certificationId },
      {
        onSuccess: () => toast.success("Certification removed."),
        onError: (err: Error) =>
          toast.error(err?.message || "Failed to remove certification."),
      }
    );
  };

  return (
    <Dialog 
        open={isOpen} 
        onOpenChange={(open) => !open && onClose()} 
        key={isOpen ? trainer?.id || "new-trainer-dialog" : "closed-dialog"}
    >
      <DialogContent className="sm:max-w-[50vw]">
        {/* Header */}
        <DialogHeader className="pb-4 border-b">
          <DialogTitle>
            {isEditing ? "Edit Trainer Profile" : "Register Trainer"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Complete the steps below to configure trainer details, qualified courses, and certifications.
          </DialogDescription>

          {/* Stepper Navigation Bar */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => (isEditing || currentStep > 1) && setCurrentStep(1)}
              className={`flex items-center gap-2 text-xs font-medium pb-1 border-b-2 transition-colors ${
                currentStep === 1
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[11px]">
                1
              </div>
              <User className="h-3.5 w-3.5" /> Details
            </button>

            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />

            <button
              type="button"
              onClick={() => (isEditing || currentStep > 2) && setCurrentStep(2)}
              className={`flex items-center gap-2 text-xs font-medium pb-1 border-b-2 transition-colors ${
                currentStep === 2
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[11px]">
                2
              </div>
              <BookOpen className="h-3.5 w-3.5" /> Qualified Courses
              {selectedCourseIds.length > 0 && (
                <Badge variant="secondary" className="h-4 px-1 text-[10px]">
                  {selectedCourseIds.length}
                </Badge>
              )}
            </button>

            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />

            <button
              type="button"
              disabled={!isEditing && !createdTrainerId}
              onClick={() => (isEditing || createdTrainerId) && setCurrentStep(3)}
              className={`flex items-center gap-2 text-xs font-medium pb-1 border-b-2 transition-colors ${
                currentStep === 3
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
              } ${
                !isEditing && !createdTrainerId
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:text-foreground cursor-pointer"
              }`}
            >
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[11px]">
                3
              </div>
              <Award className="h-3.5 w-3.5" /> Certifications
            </button>
          </div>
        </DialogHeader>

        {/* Step Contents */}
        <ScrollArea className="flex-1 p-6">
          {/* STEP 1: PERSONAL DETAILS */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-xs font-medium">
                    First Name <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="e.g. Jane"
                    className="h-9 text-xs"
                    {...register("firstName", { required: "First name is required" })}
                  />
                  {errors.firstName && (
                    <p className="text-[11px] text-rose-500">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-xs font-medium">
                    Last Name <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="e.g. Doe"
                    className="h-9 text-xs"
                    {...register("lastName", { required: "Last name is required" })}
                  />
                  {errors.lastName && (
                    <p className="text-[11px] text-rose-500">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-medium">
                    Email Address <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane.doe@company.com"
                    className="h-9 text-xs"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-rose-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-medium">
                    Phone Number <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    placeholder="+254 700 000000"
                    className="h-9 text-xs"
                    {...register("phone", { required: "Phone number is required" })}
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-rose-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="primaryCity" className="text-xs font-medium">
                    Primary City
                  </Label>
                  <Input
                    id="primaryCity"
                    placeholder="e.g. Nairobi"
                    className="h-9 text-xs"
                    {...register("primaryCity")}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="primaryCountry" className="text-xs font-medium">
                    Primary Country
                  </Label>
                  <Input
                    id="primaryCountry"
                    placeholder="e.g. Kenya"
                    className="h-9 text-xs"
                    {...register("primaryCountry")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="expertise" className="text-xs font-medium">
                    Primary Expertise / Domain
                  </Label>
                  <Input
                    id="expertise"
                    placeholder="e.g. Corporate Governance, Financial Modeling"
                    className="h-9 text-xs"
                    {...register("expertise")}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="yearsOfExperience" className="text-xs font-medium">
                    Years of Exp.
                  </Label>
                  <Input
                    id="yearsOfExperience"
                    type="number"
                    min="0"
                    max="60"
                    className="h-9 text-xs"
                    {...register("yearsOfExperience", { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-xs font-medium">
                  Account Status
                </Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(val) => field.onChange(val as TrainerStatus)}
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="flex items-center space-x-2 pt-1">
                <Controller
                  name="certified"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="certified"
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(!!checked)}
                    />
                  )}
                />
                <Label htmlFor="certified" className="text-xs font-normal cursor-pointer">
                  Mark trainer as verified
                </Label>
              </div>
            </div>
          )}

          {/* STEP 2: QUALIFIED COURSES */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold">Select Course Capabilities</h2>
                  <p className="text-sm text-muted-foreground">
                    Choose courses this trainer is qualified to facilitate.
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {selectedCourseIds.length} Selected
                </Badge>
              </div>

              {availableCourses?.length === 0 ? (
                <div className="p-8 text-center border rounded-lg bg-muted/20 text-xs text-muted-foreground">
                  No courses available in the system catalog to link.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto p-1">
                  {availableCourses?.map((course, index) => {
                    const isSelected = selectedCourseIds.includes(course.id);
                    return (
                      <div
                        key={course.id}
                        onClick={() => handleCourseToggle(course.id)}
                        className={`p-3 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-all ${
                          isSelected
                            ? "bg-primary/10 border-primary text-primary font-medium "
                            : "bg-card hover:bg-muted/50 text-foreground border-border"
                        }`}
                      >
                        <div className="flex flex-col gap-0.5 truncate pr-2">
                          <span className="truncate">{index + 1}. {course.title}</span>
                          <span className="truncate text-muted-foreground">{course.category?.name}</span>
                        </div>
                        {isSelected && (
                          <Check className="h-4 w-4 shrink-0 text-primary" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: CERTIFICATIONS */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Form to attach new certification */}
              <form
                onSubmit={handleAddCertification}
                className="p-4 border rounded-lg bg-muted/20 space-y-3"
              >
                <h4 className="text-xs font-semibold flex items-center gap-1.5">
                  <Plus className="h-3.5 w-3.5 text-primary" /> Add Certification Record
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="certName" className="text-[11px]">
                      Certification Name *
                    </Label>
                    <Input
                      id="certName"
                      placeholder="e.g. Certified Corporate Governance Specialist"
                      value={certName}
                      onChange={(e) => setCertName(e.target.value)}
                      className="h-8 text-xs bg-background"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="certIssuedBy" className="text-[11px]">
                      Issuing Body / Authority *
                    </Label>
                    <Input
                      id="certIssuedBy"
                      placeholder="e.g. Institute of Directors"
                      value={certIssuedBy}
                      onChange={(e) => setCertIssuedBy(e.target.value)}
                      className="h-8 text-xs bg-background"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="certIssuedAt" className="text-[11px]">
                      Issue Date
                    </Label>
                    <Input
                      id="certIssuedAt"
                      type="date"
                      value={certIssuedAt}
                      onChange={(e) => setCertIssuedAt(e.target.value)}
                      className="h-8 text-xs bg-background"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="certExpiresAt" className="text-[11px]">
                      Expiration Date
                    </Label>
                    <Input
                      id="certExpiresAt"
                      type="date"
                      value={certExpiresAt}
                      onChange={(e) => setCertExpiresAt(e.target.value)}
                      className="h-8 text-xs bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="certFile" className="text-[11px]">
                    Upload Document (PDF / Image)
                  </Label>
                  <Input
                    id="certFile"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => setCertFile(e.target.files?.[0] || null)}
                    className="h-8 text-xs bg-background file:mr-2 file:py-0 file:px-2 file:h-6 file:text-[11px]"
                  />
                </div>

                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="h-8 text-xs gap-1.5 w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Upload className="h-3.5 w-3.5" />
                  )}
                  Upload & Attach Credential
                </Button>
              </form>

              <Separator />

              {/* List of existing certifications */}
              {certToView ? (
                <CertificationDetails certification={certToView} onDelete={handleDeleteCert} onClose={() => setCertToView(null)} />
              ) : (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold">Attached Certifications</h4>
                {isLoadingCerts ? (
                  <div className="p-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading documents...
                  </div>
                ) : certifications.length === 0 ? (
                  <div className="p-4 border border-dashed rounded-lg text-center text-xs text-muted-foreground">
                    No certifications uploaded for this trainer yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {certifications.map((cert: TrainerCertification) => (
                      <div
                        key={cert.id}
                        className="p-3 border rounded-lg flex items-center justify-between bg-card text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-primary shrink-0" />
                          <div className="flex flex-col">
                            <div className="space-x-2">
                            <span className="font-medium">{cert.name}</span>
                             <Badge variant="outline" className="text-[10px]">
                            {cert.status}
                          </Badge>
                            </div>
                            <span className="text-[11px] text-muted-foreground">
                              {cert.issuedBy}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            disabled={isDeletingCert}
                            onClick={() => handleViewCert(cert)}
                          >
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isDeletingCert}
                            onClick={() => handleDeleteCert(cert.id)}
                            className="h-7 w-7 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>)}
            </div>
          )}
        </ScrollArea>

        {/* Dialog Action Footer */}
        <DialogFooter>
          <div>
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep((prev) => (prev - 1) as Step)}
                disabled={isSubmitting}
                className="h-8 text-xs gap-1"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Back
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-8 text-xs"
            >
              {currentStep === 3 ? "Done" : "Cancel"}
            </Button>

            {currentStep === 1 && (
              <Button
                type="button"
                size="sm"
                onClick={handleNextToCourses}
                className="h-8 text-xs gap-1"
              >
                Next: Courses <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            )}

            {currentStep === 2 && (
              <Button
                type="button"
                size="sm"
                disabled={isSubmitting}
                onClick={handleSubmit((data) => handleSaveDetailsAndCourses(data))}
                className="h-8 text-xs gap-1.5"
              >
                {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {isEditing ? "Save Profile & Courses" : "Create Trainer & Continue"}
              </Button>
            )}

            {currentStep === 3 && (
              <Button
                type="button"
                size="sm"
                onClick={onClose}
                className="h-8 text-xs"
              >
                Finish & Close
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}