import { sdk } from "@/lib/sdk-config";
import { cn } from "@/lib/utils/tailwind";
import { PageProps } from "@etailify/types";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

const ITEMS_PER_PAGE = 2;

function CategoriesLoading() {
  return (
    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
      {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
        <div key={index} className="group flex flex-col gap-2">
          <div className="h-44 sm:h-64 border rounded-md border-stone-200 bg-stone-200 animate-pulse" />
          <div className="h-6 mt-1 bg-stone-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function AdvancedPaginationControls({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
}: {
  currentPage: number;
  totalPages?: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}) {
  const generatePageNumbers = () => {
    if (!totalPages) return [];

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) pages.push(i);

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
      <Link
        href={`/categories?page=${currentPage - 1}`}
        className={cn(
          "px-3 py-2 border border-stone-300 rounded-md hover:bg-stone-50 text-sm select-none",
          !hasPrevPage && "opacity-50 pointer-events-none"
        )}
      >
        Previous
      </Link>

      {pageNumbers.map((pageNum) => (
        <Link
          key={pageNum}
          href={`/categories?page=${pageNum}`}
          className={cn(
            "px-3 py-2 border rounded-md text-sm border-stone-300 hover:bg-stone-50 min-w-10 flex justify-center items-center",
            pageNum === currentPage &&
              "border-brand-600 bg-brand-50 text-brand-700"
          )}
        >
          {pageNum + 1}
        </Link>
      ))}

      <Link
        href={`/categories?page=${currentPage + 1}`}
        className={cn(
          "px-3 py-2 border border-stone-300 rounded-md hover:bg-stone-50 text-sm select-none",
          !hasNextPage && "opacity-50 pointer-events-none"
        )}
      >
        Next
      </Link>
    </div>
  );
}

async function CategoriesContent({ page }: { page: number }) {
  try {
    const categories = await sdk.store.categories.searchCategories({
      page,
      size: ITEMS_PER_PAGE,
    });

    const hasNextPage = categories.page_response.has_next_page!;
    const hasPrevPage = page > 0;

    const totalPages = categories.page_response.total
      ? Math.ceil(Number(categories.page_response.total) / ITEMS_PER_PAGE)
      : undefined;

    return (
      <>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {categories.response.length === 0 ? (
            <div className="col-span-full text-center py-12 text-stone-500">
              No categories found
            </div>
          ) : (
            categories.response.map((category, index: number) => (
              <Link
                data-testid={`category-item__link__${category.slug}`}
                key={category.slug}
                href={{
                  pathname: `/categories/${category.slug}`,
                  query: { name: category.name },
                }}
                className="group flex flex-col gap-2"
                prefetch
              >
                <div className="h-44 sm:h-64 border group-hover:border-brand-600 transition-colors rounded-md border-stone-200 bg-stone-50/80 overflow-clip">
                  <Image
                    priority={index <= 8 ? true : false}
                    src={
                      category.media?.media_public_url || "/img/placeholder.png"
                    }
                    alt={category.name}
                    quality={50}
                    width={320}
                    height={320}
                    className="size-full object-cover"
                  />
                </div>
                <h2 className="mt-1 text-center sm:text-left">
                  {category.name}
                </h2>
              </Link>
            ))
          )}
        </div>

        {categories.response.length > 0 && (
          <AdvancedPaginationControls
            currentPage={page}
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
            totalPages={totalPages}
          />
        )}
      </>
    );
  } catch (error) {
    return (
      <div className="mt-8 text-center py-12">
        <div className="text-red-600 mb-4">
          Failed to load categories. Please try again later.
        </div>
        <Link
          href="/categories"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Reload page
        </Link>
      </div>
    );
  }
}

export default async function CategoriesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = params.page ? parseInt(params.page, 10) : 0;
  const validPage = Math.max(0, currentPage);

  return (
    <div className="container min-h-screen py-8">
      <div>
        <h2 className="text-center text-xl font-medium uppercase sm:text-left">
          Categories
        </h2>
      </div>

      <Suspense fallback={<CategoriesLoading />}>
        <CategoriesContent page={validPage} />
      </Suspense>
    </div>
  );
}
