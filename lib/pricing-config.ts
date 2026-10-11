import { DeliveryMode } from "@/generated/prisma/enums";

const COMPANY_FEE_ANCHORS = [
  { participants: 1, dailyFee: 10_000 },
  { participants: 5, dailyFee: 18_000 },
  { participants: 10, dailyFee: 25_000 },
  { participants: 15, dailyFee: 35_000 },
  { participants: 20, dailyFee: 45_000 },
  { participants: 25, dailyFee: 55_000 },
  { participants: 30, dailyFee: 65_000 },
] as const;

function getCompanyDailyFee(participants: number): number {
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

type PricingInput = {
  basePricePerParticipant: number;
  participants: number;
  durationDays: number;
  currency: string;
  deliveryMode: DeliveryMode;
};

export function calculateBookingPrice({
  basePricePerParticipant,
  participants,
  durationDays,
  deliveryMode,
  currency,
}: PricingInput) {
  if (
    !Number.isFinite(basePricePerParticipant) ||
    basePricePerParticipant < 0
  ) {
    throw new Error("Invalid base price");
  }

  if (!Number.isInteger(durationDays) || durationDays < 1) {
    throw new Error("Invalid course duration");
  }

  const venuePerPersonDaily = 4_000; // Fixed cost per participant per day for arranged venue

  // The stored price is for ONE participant.
  const referenceParticipants = 1;

  // Company contribution adjustment
  const companyAdjustment =
    (
      getCompanyDailyFee(participants) -
      getCompanyDailyFee(referenceParticipants)
    ) * durationDays;

  // Venue adjustment: charge only for additional participants.
  const venueAdjustment =
    deliveryMode === DeliveryMode.ARRANGED_VENUE
      ? (participants - referenceParticipants) *
        venuePerPersonDaily *
        durationDays
      : 0;

  // The stored amount already includes all costs for one person.
  const totalPrice = Math.round(
    basePricePerParticipant +
    companyAdjustment +
    venueAdjustment
  );

  if (totalPrice < 0) {
    throw new Error("Calculated price cannot be negative");
  }

  return {
    participants,
    currency,
    totalPrice,
    pricePerParticipant: Math.round(
      totalPrice / participants
    ),
  };
}

