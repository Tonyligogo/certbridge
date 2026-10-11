/*
  Warnings:

  - The values [TRAINER_ASSIGNED] on the enum `BookingActivityType` will be removed. If these variants are still used in the database, this will fail.
  - The values [PENDING,QUOTED,TRAINER_ASSIGNED,SCHEDULED] on the enum `BookingStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `finalAmount` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `quotedAmount` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `assignedAt` on the `BookingTrainer` table. All the data in the column will be lost.
  - You are about to drop the column `assignedAt` on the `BookingVenue` table. All the data in the column will be lost.
  - The `status` column on the `BookingVenue` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `BookingTrainer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ResourceSourcingStatus" AS ENUM ('CONSIDERING', 'CONTACTED', 'AVAILABLE', 'UNAVAILABLE', 'CONFIRMED', 'REPLACED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'ISSUED', 'PAID', 'VOID');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('BANK_TRANSFER', 'MOBILE_MONEY', 'CARD', 'CASH', 'CHEQUE', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED');

-- AlterEnum
BEGIN;
CREATE TYPE "BookingActivityType_new" AS ENUM ('CREATED', 'STATUS_CHANGED', 'TRAINER_ADDED', 'TRAINER_CONTACTED', 'TRAINER_CONFIRMED', 'TRAINER_REMOVED', 'TRAINER_REPLACED', 'VENUE_ADDED', 'VENUE_CONTACTED', 'VENUE_CONFIRMED', 'VENUE_REMOVED', 'VENUE_REPLACED', 'QUOTE_CREATED', 'QUOTE_UPDATED', 'QUOTE_SENT', 'QUOTE_ACCEPTED', 'QUOTE_DECLINED', 'SCHEDULED', 'RESCHEDULED', 'CLIENT_CONTACTED', 'NOTE_ADDED', 'CANCELLED', 'COMPLETED', 'INVOICE_CREATED', 'PAYMENT_RECEIVED');
ALTER TABLE "BookingActivity" ALTER COLUMN "type" TYPE "BookingActivityType_new" USING ("type"::text::"BookingActivityType_new");
ALTER TYPE "BookingActivityType" RENAME TO "BookingActivityType_old";
ALTER TYPE "BookingActivityType_new" RENAME TO "BookingActivityType";
DROP TYPE "public"."BookingActivityType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "BookingStatus_new" AS ENUM ('OPEN', 'CONFIRMED', 'COMPLETED', 'CANCELLED');
ALTER TABLE "public"."Booking" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Booking" ALTER COLUMN "status" TYPE "BookingStatus_new" USING ("status"::text::"BookingStatus_new");
ALTER TYPE "BookingStatus" RENAME TO "BookingStatus_old";
ALTER TYPE "BookingStatus_new" RENAME TO "BookingStatus";
DROP TYPE "public"."BookingStatus_old";
ALTER TABLE "Booking" ALTER COLUMN "status" SET DEFAULT 'OPEN';
COMMIT;

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "finalAmount",
DROP COLUMN "quotedAmount",
ALTER COLUMN "status" SET DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "BookingActivity" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "BookingParticipant" ALTER COLUMN "attended" DROP NOT NULL,
ALTER COLUMN "attended" DROP DEFAULT;

-- AlterTable
ALTER TABLE "BookingTrainer" DROP COLUMN "assignedAt",
ADD COLUMN     "confirmedAt" TIMESTAMP(3),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "ResourceSourcingStatus" NOT NULL DEFAULT 'CONSIDERING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "BookingVenue" DROP COLUMN "assignedAt",
DROP COLUMN "status",
ADD COLUMN     "status" "ResourceSourcingStatus" NOT NULL DEFAULT 'CONSIDERING';

-- DropEnum
DROP TYPE "BookingVenueStatus";

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "quoteId" TEXT,
    "reference" TEXT NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "subtotal" DECIMAL(10,2) NOT NULL,
    "taxAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "issuedAt" TIMESTAMP(3),
    "dueAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceItem" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "transactionReference" TEXT,
    "paidAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_reference_key" ON "Invoice"("reference");

-- CreateIndex
CREATE INDEX "Invoice_bookingId_idx" ON "Invoice"("bookingId");

-- CreateIndex
CREATE INDEX "Invoice_status_idx" ON "Invoice"("status");

-- CreateIndex
CREATE INDEX "Invoice_dueAt_idx" ON "Invoice"("dueAt");

-- CreateIndex
CREATE INDEX "Invoice_createdAt_idx" ON "Invoice"("createdAt");

-- CreateIndex
CREATE INDEX "InvoiceItem_invoiceId_idx" ON "InvoiceItem"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_reference_key" ON "Payment"("reference");

-- CreateIndex
CREATE INDEX "Payment_invoiceId_idx" ON "Payment"("invoiceId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_paidAt_idx" ON "Payment"("paidAt");

-- CreateIndex
CREATE INDEX "BookingTrainer_status_idx" ON "BookingTrainer"("status");

-- CreateIndex
CREATE INDEX "BookingVenue_status_idx" ON "BookingVenue"("status");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
