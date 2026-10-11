import {
  Building2,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { DetailItem } from "./detail-item";
import type { AdminBookingDetailsResponse } from "../../types/admin-booking";

interface ClientCardProps {
  booking: AdminBookingDetailsResponse;
}

export function ClientCard({
  booking,
}: ClientCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">
          Client
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-5 sm:grid-cols-2">
          {booking.organizationName && (
            <DetailItem
              icon={Building2}
              label="Organization"
              value={
                booking.organizationName
              }
            />
          )}

          <DetailItem
            icon={UserRound}
            label="Contact person"
            value={booking.contactName}
          />

          <DetailItem
            icon={Mail}
            label="Email"
          >
            <a
              href={`mailto:${booking.contactEmail}`}
              className="break-all text-sm font-medium hover:underline"
            >
              {booking.contactEmail}
            </a>
          </DetailItem>

          <DetailItem
            icon={Phone}
            label="Phone"
          >
            <a
              href={`tel:${booking.contactPhone}`}
              className="text-sm font-medium hover:underline"
            >
              {booking.contactPhone}
            </a>
          </DetailItem>
        </div>
      </CardContent>
    </Card>
  );
}