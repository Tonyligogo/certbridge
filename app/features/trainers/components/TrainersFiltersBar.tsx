import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Search } from "lucide-react";
import { GetTrainersParams } from "../services/trainer-service";

interface TrainersFiltersBarProps {
  params: GetTrainersParams;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStatusFilter: (value: string) => void;
  handleCertifiedFilter: (value: string) => void;
  refetch: () => void;
  isFetching: boolean;
}

const TrainersFiltersBar: React.FC<TrainersFiltersBarProps> = ({
  params,
  handleSearchChange,
  handleStatusFilter,
  handleCertifiedFilter,
  refetch,
  isFetching,
}) => {
  return (
    <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, expertise..."
                value={params.search || ""}
                onChange={handleSearchChange}
                className="pl-9 h-9 text-sm"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={params.status || "ALL"}
                onValueChange={handleStatusFilter}
              >
                <SelectTrigger className="w-32.5 h-9 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={
                  params.certified === undefined
                    ? "ALL"
                    : String(params.certified)
                }
                onValueChange={handleCertifiedFilter}
              >
                <SelectTrigger className="w-35 h-9 text-xs">
                  <SelectValue placeholder="Verification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Verification</SelectItem>
                  <SelectItem value="true">Certified</SelectItem>
                  <SelectItem value="false">Unverified</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
                className="h-9 w-9 p-0"
                title="Refresh Table"
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
  )
}

export default TrainersFiltersBar