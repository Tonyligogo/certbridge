import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Award, BookOpen, Check, ChevronLeft, ChevronRight, Edit, Mail, MapPin, MoreHorizontal, Phone, Trash2, User, User2, UserCheck, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GetTrainersParams, Trainer } from "../services/trainer-service";

interface TrainersTableProps {
  trainers: Trainer[];
  isLoading: boolean;
  isError: boolean;
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
  setParams: React.Dispatch<React.SetStateAction<GetTrainersParams>>;
  isFetching: boolean;
  handleEdit: (trainer: Trainer) => void;
  handleViewTrainer: (trainer: Trainer) => void;
  setTrainerToDelete: (trainer: Trainer) => void;
}

const TrainersTable = ({
  trainers,
  isLoading,
  isError,
  pagination,
  setParams,
  isFetching,
  handleEdit,
  handleViewTrainer,
  setTrainerToDelete,
}: TrainersTableProps) => {

     const getStatusBadge = (status: Trainer["status"]) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium">
            Active
          </Badge>
        );
      case "INACTIVE":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-medium">
            Inactive
          </Badge>
        );
      case "SUSPENDED":
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 font-medium">
            Suspended
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  return (
    <div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead> <span className="flex items-center gap-1.5"><User2 size={16}/> Name</span> </TableHead>
              <TableHead> <span className="flex items-center gap-1.5"><Mail size={16}/> Email</span> </TableHead>
              <TableHead> <span className="flex items-center gap-1.5"><Phone size={16}/> Phone</span> </TableHead>
              <TableHead> <span className="flex items-center gap-1.5"><MapPin size={16}/> Location</span> </TableHead>
              <TableHead> <span className="flex items-center gap-1.5"><BookOpen size={16}/> Qualified Courses</span> </TableHead>
              <TableHead> <span className="flex items-center gap-1.5"><Award size={16}/> Certifications</span> </TableHead>
              <TableHead> <span className="flex items-center gap-1.5"><UserCheck size={16}/> Verified</span> </TableHead>
              <TableHead> <span className="flex items-center gap-1.5"><User size={16}/> Status</span> </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  Failed to load trainers list. Please try refreshing.
                </TableCell>
              </TableRow>
            ) : trainers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No trainers found matching your filters.
                </TableCell>
              </TableRow>
            ) : (
              trainers.map((trainer, index) => (
                <TableRow key={trainer.id} className={` ${trainer.status === "SUSPENDED" ? "opacity-20 pointer-events-none " : ""}`}>
                  <TableCell>{index + 1}.</TableCell>
                  {/* Name & Expertise */}
                  <TableCell>
                      <button onClick={() => handleViewTrainer(trainer)} className="cursor-pointer hover:underline">
                        {trainer.firstName} {trainer.lastName}
                      </button>
                  </TableCell>
                  {/* email */}
                  <TableCell>
                      <span>
                        {trainer.email}
                      </span>
                  </TableCell>
                  {/* Phone */}
                  <TableCell>
                      <span>
                        {trainer.phone}
                      </span>
                  </TableCell>
                  {/* Location */}
                  <TableCell>
                      {(trainer.primaryCity || trainer.primaryCountry) && (
                        <span>
                          {[trainer.primaryCity, trainer.primaryCountry]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      )}
                  </TableCell>
                  {/* Courses */}
                  <TableCell className="text-center">
                      <span>
                        {trainer.courses?.length || 0}
                      </span>
                  </TableCell>
                  {/* Certifications */}
                  <TableCell className="text-center">
                      <span>
                        {trainer.certifications?.length || 0}
                      </span>
                  </TableCell>
                  {/* Certified */}
                  <TableCell>
                    {trainer.certified ? (
                      <span className="flex items-center gap-2 w-fit rounded-full pl-2 pr-3 py-1 font-medium text-xs bg-green-100 text-green-700"> <Check size={14} /> Certified</span>
                    ) : (
                      <span className="flex items-center gap-2 w-fit rounded-full pl-2 pr-3 py-1 font-medium text-xs bg-amber-100 text-amber-700"> <X size={14} /> Unverified</span>
                    )}
                  </TableCell>
                  {/* Status */}
                  <TableCell>{getStatusBadge(trainer.status)}</TableCell>
                  {/* Actions */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewTrainer(trainer)}
                          className="text-xs gap-2 cursor-pointer"
                        >
                          <User2 className="h-3 w-3" />
                          View Trainer
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEdit(trainer)}
                          className="text-xs gap-2 cursor-pointer"
                        >
                          <Edit className="h-3 w-3" />
                          Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setTrainerToDelete(trainer)}
                          className="text-xs gap-2 text-rose-600 focus:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete Trainer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
        {/* Pagination Footer */}
        <div className="flex items-center justify-end gap-6 px-4 py-3 ">
          <p className="text-sm">
            Page {pagination.page} of {pagination.totalPages}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1 || isFetching}
              onClick={() =>
                setParams((prev) => ({ ...prev, page: (prev.page || 1) - 1 }))
              }
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={
                pagination.page >= pagination.totalPages || isFetching
              }
              onClick={() =>
                setParams((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))
              }
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
  )
}

export default TrainersTable