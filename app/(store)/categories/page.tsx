import { sdk } from "@/lib/config";
import Image from "next/image";
import Link from "next/link";

export default async function CategoriesPage() {
  const categories = await sdk.store.categories.searchCategories({
    page: 0,
    size: 10,
  });

  return (
    <div className="container min-h-screen py-8">
      <div>
        <h2 className="text-center text-xl font-medium uppercase sm:text-left">
          Categories
        </h2>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
        {categories.response.map((category, index) => (
          <Link
            key={category.slug}
            href={{
              pathname: `/categories/${category.slug}`,
              query: { name: category.name },
            }}
            className="group flex flex-col gap-2"
            prefetch
          >
            <Image
              priority={index <= 8 ? true : false}
              src={category.media?.media_public_url || ""}
              alt={category.name}
              quality={50}
              width={320}
              height={320}
              sizes="(max-width: 768px) 280px, (max-width: 992px) 480px, 800px"
              className="group-hover:border-brand-600 size-full rounded-md border border-stone-200 bg-stone-50/80 object-cover transition-colors"
            />
            <h2 className="mt-1 text-center sm:text-left">{category.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
