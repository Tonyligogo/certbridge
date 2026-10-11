import { Badge } from "@/components/ui/badge";
import { ResourceSourcingStatus } from "@/generated/prisma/enums";

export function VenueAssignmentStatus({
  status,
}: {
  status: ResourceSourcingStatus;
}) {
  const config = {
    CONSIDERING: {
      label: "Considering",
      className:
        "bg-slate-50 text-slate-700 border-slate-200",
    },
    CONTACTED: {
      label: "Contacted",
      className:
        "bg-blue-50 text-blue-700 border-blue-200",
    },
    AVAILABLE: {
      label: "Available",
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    UNAVAILABLE: {
      label: "Unavailable",
      className:
        "bg-slate-50 text-slate-500 border-slate-200",
    },
    CONFIRMED: {
      label: "Confirmed",
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    REPLACED: {
      label: "Replaced",
      className:
        "bg-slate-50 text-slate-500 border-slate-200",
    },
    CANCELLED: {
      label: "Cancelled",
      className:
        "bg-slate-50 text-slate-500 border-slate-200",
    },
  } satisfies Record<
    ResourceSourcingStatus,
    {
      label: string;
      className: string;
    }
  >;

  const item = config[status];

  return (
    <Badge
      variant="outline"
      className={item.className}
    >
      {item.label}
    </Badge>
  );
}