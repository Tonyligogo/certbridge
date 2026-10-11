-- CreateEnum
CREATE TYPE "ProfileType" AS ENUM ('INDIVIDUAL', 'ORGANIZATION', 'GROUP');

-- CreateEnum
CREATE TYPE "CourseLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS');

-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DeliveryMode" AS ENUM ('ONLINE', 'CLIENT_SITE', 'ARRANGED_VENUE');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'QUOTED', 'CONFIRMED', 'TRAINER_ASSIGNED', 'SCHEDULED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TrainerStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "TrainerCertificationStatus" AS ENUM ('PENDING', 'VALID', 'EXPIRED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TrainerAssignmentRole" AS ENUM ('LEAD', 'ASSISTANT');

-- CreateEnum
CREATE TYPE "VenueStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "BookingVenueStatus" AS ENUM ('CONSIDERING', 'CONTACTED', 'AVAILABLE', 'UNAVAILABLE', 'CONFIRMED', 'REPLACED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BookingActivityType" AS ENUM ('CREATED', 'STATUS_CHANGED', 'TRAINER_ASSIGNED', 'TRAINER_REMOVED', 'VENUE_ADDED', 'VENUE_CONFIRMED', 'VENUE_REPLACED', 'QUOTE_CREATED', 'QUOTE_UPDATED', 'INVOICE_CREATED', 'PAYMENT_RECEIVED', 'CLIENT_CONTACTED', 'NOTE_ADDED', 'CANCELLED', 'COMPLETED');

-- AlterTable
ALTER TABLE "session" ADD COLUMN     "impersonatedBy" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "banExpires" TIMESTAMPTZ(3),
ADD COLUMN     "banReason" TEXT,
ADD COLUMN     "banned" BOOLEAN;

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ProfileType" NOT NULL,
    "phone" TEXT,
    "country" TEXT,
    "city" TEXT,
    "displayName" TEXT NOT NULL,
    "logoUrl" TEXT,
    "website" TEXT,
    "kraPin" TEXT,
    "address" TEXT,
    "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseAudience" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseAudience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "level" "CourseLevel" NOT NULL,
    "status" "CourseStatus" NOT NULL DEFAULT 'DRAFT',
    "thumbnailUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "certificateProvided" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "shortDescription" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoursePricing" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "deliveryMode" "DeliveryMode" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoursePricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseModule" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estimatedDuration" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "profileId" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "profileId" TEXT,
    "courseId" TEXT NOT NULL,
    "deliveryMode" "DeliveryMode" NOT NULL,
    "preferredStartDate" TIMESTAMP(3),
    "preferredEndDate" TIMESTAMP(3),
    "scheduledStartDate" TIMESTAMP(3),
    "scheduledEndDate" TIMESTAMP(3),
    "contactName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "participantCount" INTEGER NOT NULL,
    "specialRequirements" TEXT,
    "quotedAmount" DECIMAL(10,2),
    "finalAmount" DECIMAL(10,2),
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "locationAddress" TEXT,
    "locationCity" TEXT,
    "locationCountry" TEXT,
    "locationNotes" TEXT,
    "organizationName" TEXT,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingParticipant" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "participantId" TEXT,
    "attended" BOOLEAN NOT NULL DEFAULT false,
    "certificateIssued" BOOLEAN NOT NULL DEFAULT false,
    "feedbackSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "BookingParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trainer" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "primaryCountry" TEXT,
    "primaryCity" TEXT,
    "expertise" TEXT,
    "yearsOfExperience" INTEGER,
    "languages" TEXT,
    "status" "TrainerStatus" NOT NULL DEFAULT 'ACTIVE',
    "certified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainerCourse" (
    "id" TEXT NOT NULL,
    "trainerId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainerCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainerCertification" (
    "id" TEXT NOT NULL,
    "trainerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuedBy" TEXT,
    "issuedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "status" "TrainerCertificationStatus" NOT NULL DEFAULT 'PENDING',
    "storagePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainerCertification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingTrainer" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "trainerId" TEXT NOT NULL,
    "role" "TrainerAssignmentRole" NOT NULL DEFAULT 'LEAD',
    "agreedAmount" DECIMAL(10,2),
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "BookingTrainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Venue" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "capacity" INTEGER,
    "notes" TEXT,
    "status" "VenueStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingVenue" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "status" "BookingVenueStatus" NOT NULL DEFAULT 'CONSIDERING',
    "agreedAmount" DECIMAL(10,2),
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "notes" TEXT,
    "assignedAt" TIMESTAMP(3),
    "confirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookingVenue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingActivity" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "type" "BookingActivityType" NOT NULL,
    "description" TEXT NOT NULL,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CourseToCourseAudience" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CourseToCourseAudience_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseCategory_slug_key" ON "CourseCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CourseAudience_slug_key" ON "CourseAudience"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CoursePricing_courseId_key" ON "CoursePricing"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_reference_key" ON "Booking"("reference");

-- CreateIndex
CREATE INDEX "Booking_profileId_idx" ON "Booking"("profileId");

-- CreateIndex
CREATE INDEX "Booking_courseId_idx" ON "Booking"("courseId");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "Booking_createdAt_idx" ON "Booking"("createdAt");

-- CreateIndex
CREATE INDEX "BookingParticipant_bookingId_idx" ON "BookingParticipant"("bookingId");

-- CreateIndex
CREATE INDEX "Trainer_status_idx" ON "Trainer"("status");

-- CreateIndex
CREATE INDEX "Trainer_primaryCity_idx" ON "Trainer"("primaryCity");

-- CreateIndex
CREATE INDEX "Trainer_certified_idx" ON "Trainer"("certified");

-- CreateIndex
CREATE INDEX "TrainerCourse_trainerId_idx" ON "TrainerCourse"("trainerId");

-- CreateIndex
CREATE INDEX "TrainerCourse_courseId_idx" ON "TrainerCourse"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "TrainerCourse_trainerId_courseId_key" ON "TrainerCourse"("trainerId", "courseId");

-- CreateIndex
CREATE INDEX "TrainerCertification_trainerId_idx" ON "TrainerCertification"("trainerId");

-- CreateIndex
CREATE INDEX "TrainerCertification_status_idx" ON "TrainerCertification"("status");

-- CreateIndex
CREATE INDEX "TrainerCertification_expiresAt_idx" ON "TrainerCertification"("expiresAt");

-- CreateIndex
CREATE INDEX "BookingTrainer_bookingId_idx" ON "BookingTrainer"("bookingId");

-- CreateIndex
CREATE INDEX "BookingTrainer_trainerId_idx" ON "BookingTrainer"("trainerId");

-- CreateIndex
CREATE UNIQUE INDEX "BookingTrainer_bookingId_trainerId_key" ON "BookingTrainer"("bookingId", "trainerId");

-- CreateIndex
CREATE INDEX "Venue_status_idx" ON "Venue"("status");

-- CreateIndex
CREATE INDEX "Venue_country_idx" ON "Venue"("country");

-- CreateIndex
CREATE INDEX "Venue_city_idx" ON "Venue"("city");

-- CreateIndex
CREATE INDEX "BookingVenue_bookingId_idx" ON "BookingVenue"("bookingId");

-- CreateIndex
CREATE INDEX "BookingVenue_venueId_idx" ON "BookingVenue"("venueId");

-- CreateIndex
CREATE INDEX "BookingVenue_status_idx" ON "BookingVenue"("status");

-- CreateIndex
CREATE UNIQUE INDEX "BookingVenue_bookingId_venueId_key" ON "BookingVenue"("bookingId", "venueId");

-- CreateIndex
CREATE INDEX "BookingActivity_bookingId_idx" ON "BookingActivity"("bookingId");

-- CreateIndex
CREATE INDEX "BookingActivity_createdAt_idx" ON "BookingActivity"("createdAt");

-- CreateIndex
CREATE INDEX "_CourseToCourseAudience_B_index" ON "_CourseToCourseAudience"("B");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CourseCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursePricing" ADD CONSTRAINT "CoursePricing_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseModule" ADD CONSTRAINT "CourseModule_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingParticipant" ADD CONSTRAINT "BookingParticipant_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingParticipant" ADD CONSTRAINT "BookingParticipant_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerCourse" ADD CONSTRAINT "TrainerCourse_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerCourse" ADD CONSTRAINT "TrainerCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerCertification" ADD CONSTRAINT "TrainerCertification_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingTrainer" ADD CONSTRAINT "BookingTrainer_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingTrainer" ADD CONSTRAINT "BookingTrainer_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingVenue" ADD CONSTRAINT "BookingVenue_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingVenue" ADD CONSTRAINT "BookingVenue_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingActivity" ADD CONSTRAINT "BookingActivity_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToCourseAudience" ADD CONSTRAINT "_CourseToCourseAudience_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToCourseAudience" ADD CONSTRAINT "_CourseToCourseAudience_B_fkey" FOREIGN KEY ("B") REFERENCES "CourseAudience"("id") ON DELETE CASCADE ON UPDATE CASCADE;
