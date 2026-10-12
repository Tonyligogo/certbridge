
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface CoursePaginationProps {
  pagination: PaginationData;
}

export function CoursePagination({
  pagination,
}: CoursePaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    page,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  } = pagination;

  if (totalPages <= 1) return null;

  const changePage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) return;

    const params = new URLSearchParams(searchParams.toString());

    if (nextPage === 1) {
      params.delete("page");
    } else {
      params.set("page", String(nextPage));
    }

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });

    document
      .getElementById("course-results")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  const getVisiblePages = () => {
    const pages = new Set<number>([
      1,
      totalPages,
      page - 1,
      page,
      page + 1,
    ]);

    const sorted = [...pages]
      .filter((p) => p >= 1 && p <= totalPages)
      .sort((a, b) => a - b);

    const result: (number | "...")[] = [];

    sorted.forEach((p, index) => {
      const previous = sorted[index - 1];

      if (previous && p - previous > 1) {
        result.push("...");
      }

      result.push(p);
    });

    return result;
  };

  return (
    <nav
      aria-label="Course pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      <Button
        variant="outline"
        size="sm"
        disabled={!hasPreviousPage}
        onClick={() => changePage(page - 1)}
        className="gap-1.5"
      >
        <ChevronLeft className="size-4" />
        <span className="hidden sm:inline-flex">Previous</span>
      </Button>

      {getVisiblePages().map((item, index) =>
        item === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="px-2 text-sm text-muted-foreground"
          >
            ...
          </span>
        ) : (
          <Button
            key={item}
            variant={item === page ? "default" : "outline"}
            size="sm"
            onClick={() => changePage(item)}
            aria-label={`Go to page ${item}`}
            aria-current={item === page ? "page" : undefined}
            className="min-w-9"
          >
            {item}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="sm"
        disabled={!hasNextPage}
        onClick={() => changePage(page + 1)}
        className="gap-1.5"
      >
        <span className="hidden sm:inline-flex">Next</span>
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  );
}
