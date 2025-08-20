import { getCategoryProductsQueryFn } from "@/data/categories";
import { PageProps } from "@/lib/types/common";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { name } = await props.searchParams;

  return {
    title: `${name} | 444Nomizo`,
    description: `${name} category.`,
    // TODO: add canonical slug
  };
}

export default async function CategoryProductsPage(props: PageProps) {
  const { slug } = await props.params;
  const { name } = await props.searchParams;

  const products = await getCategoryProductsQueryFn(slug, {
    page: 0,
    size: 10,
  });

  return (
    <div className="container min-h-screen py-8">
      <div>
        <h1 className="text-center text-xl font-medium uppercase sm:text-left">
          {name || slug || "Products"}
        </h1>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
        {products.response.map((product, index) => (
          <Link
            key={product.slug}
            href={`/products/${product.slug}`}
            prefetch
            className="group flex flex-col gap-2"
          >
            <div className="group-hover:border-brand-600 h-[200px] overflow-clip rounded-md border border-stone-200 transition-colors sm:h-[320px]">
              <Image
                priority={index <= 8 ? true : false}
                src={
                  product.skus[0]?.media?.[0]?.media_public_url ??
                  "/img/placeholder.png"
                }
                alt={product.name}
                quality={50}
                width={260}
                height={340}
                className="size-full bg-stone-50/80 object-cover"
              />
            </div>
            <h2 className="mt-1 text-center sm:text-left">{product.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
