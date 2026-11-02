import { CourseLevel, DeliveryMode } from "@/generated/prisma/enums";

export const TRAINER_DAILY_RATES: Record<CourseLevel, number> = {
  BEGINNER: 7_000,
  INTERMEDIATE: 8_000,
  ADVANCED: 10_000,
  ALL_LEVELS: 9_000,
};

export const REFERENCE_PARTICIPANTS = 1;
export const CLIENT_SITE_TRAVEL_DAILY = 3_000;
export const VENUE_PER_PERSON_DAILY = 4_000;

const COMPANY_FEE_ANCHORS = [
  { participants: 1, dailyFee: 10_000 },
  { participants: 5, dailyFee: 18_000 },
  { participants: 10, dailyFee: 25_000 },
  { participants: 15, dailyFee: 35_000 },
  { participants: 20, dailyFee: 45_000 },
  { participants: 25, dailyFee: 55_000 },
  { participants: 30, dailyFee: 65_000 },
] as const;

export function getCompanyDailyFee(participants: number): number {
  if ( !Number.isInteger(participants) || participants < 1 || participants > 30 ) {
    throw new Error("Participants must be between 1 and 30");
  }

  for (let i = 1; i < COMPANY_FEE_ANCHORS.length; i++) {
    const previous = COMPANY_FEE_ANCHORS[i - 1];
    const current = COMPANY_FEE_ANCHORS[i];

    if (participants <= current.participants) {
      const progress =
        (participants - previous.participants) /
        (current.participants - previous.participants);

      return previous.dailyFee + progress * (current.dailyFee - previous.dailyFee);
    }
  }

  return COMPANY_FEE_ANCHORS.at(-1)!.dailyFee;
}

const MINIMUM_PARTICIPANT_DAILY_PRICE = 10_000;
const PARTICIPANTS_PER_TRAINER = 10;

type PricingInput = {
  basePricePerParticipantPerDay: number;
  participants: number;
  durationDays: number;
  currency: string;
  deliveryMode: DeliveryMode;
  // Use the same trainer rate used to seed the course price.
  trainerDailyRate: number;
};

export function calculateBookingPrice({
  basePricePerParticipantPerDay,
  participants,
  durationDays,
  currency,
  deliveryMode,
  trainerDailyRate,
}: PricingInput) {
  if (
    !Number.isFinite(basePricePerParticipantPerDay) ||
    basePricePerParticipantPerDay <= 0
  ) {
    throw new Error("Invalid daily base price");
  }

  if (
    !Number.isInteger(participants) ||
    participants < 1 ||
    participants > 30
  ) {
    throw new Error("Participants must be between 1 and 30");
  }

  if (!Number.isInteger(durationDays) || durationDays < 1) {
    throw new Error("Invalid duration");
  }

  if (!Number.isFinite(trainerDailyRate) || trainerDailyRate < 0) {
    throw new Error("Invalid trainer daily rate");
  }

  // 1. Company fee adjustment
  const companyAdjustmentDaily =
    getCompanyDailyFee(participants) -
    getCompanyDailyFee(REFERENCE_PARTICIPANTS);

  // 2. Additional venue allocation
  const venueAdjustmentDaily =
    deliveryMode === DeliveryMode.ARRANGED_VENUE
      ? (participants - REFERENCE_PARTICIPANTS) *
        VENUE_PER_PERSON_DAILY
      : 0;

  // 3. Additional trainers
  const requiredTrainers = Math.ceil(
    participants / PARTICIPANTS_PER_TRAINER
  );

  // The seeded base price already covers one trainer.
  const additionalTrainers = Math.max(0, requiredTrainers - 1);

  const additionalTrainerCostDaily =
    additionalTrainers * trainerDailyRate;

  // 4. Calculate the group daily price
  const calculatedDailyTotal =
    basePricePerParticipantPerDay +
    companyAdjustmentDaily +
    venueAdjustmentDaily +
    additionalTrainerCostDaily;

  // 5. Enforce minimum per-person daily pricing
  const minimumDailyTotal =
    participants * MINIMUM_PARTICIPANT_DAILY_PRICE;

  const dailyTotal = Math.max(
    calculatedDailyTotal,
    minimumDailyTotal
  );

  const totalPrice = Math.round(dailyTotal * durationDays);

  return {
    participants,
    durationDays,
    currency,
    deliveryMode,
    totalPrice,

    pricePerParticipant: totalPrice / participants,

    pricePerParticipantPerDay:
      totalPrice / participants / durationDays,

    requiredTrainers,
    additionalTrainers,

    // For internal use, not customer-facing
    breakdown: {
      calculatedDailyTotal,
      minimumDailyTotal,
      additionalTrainerCostDaily,
      minimumPriceApplied:
        minimumDailyTotal > calculatedDailyTotal,
    },
  };
}


