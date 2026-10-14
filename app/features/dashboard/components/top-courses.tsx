import { BookOpen } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { DashboardTopCourse } from "../types/dashboard";

export function TopCourses({
  courses,
}: {
  courses: DashboardTopCourse[];
}) {
  const maxBookings = Math.max(
    ...courses.map((course) => course.bookings),
    1
  );

  return (
    <Card className="min-w-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-base">Top courses</CardTitle>
        <CardDescription>
          Most requested training courses
        </CardDescription>
      </CardHeader>

      <CardContent>
        {courses.length === 0 ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
            <BookOpen className="mb-3 size-8 text-muted-foreground" />
            <p className="text-sm font-medium">No course activity yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Popular courses will appear as bookings are received.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {courses.map((course, index) => (
              <div key={course.courseId}>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="w-4 shrink-0 text-xs text-muted-foreground">
                      {index + 1}.
                    </span>
                    <p className="truncate text-sm font-medium">
                      {course.title}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs text-muted-foreground">
                    {course.bookings} {course.bookings === 1 ? "booking" : "bookings"}
                  </span>
                </div>

                <div className="ml-7 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${(course.bookings / maxBookings) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}