"use client";

import { isCustomerLoggedIn } from "@/lib/utils/common";
import { BoxIcon, MapPinHouseIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const ACCOUNT_PAGES = [
  {
    title: "My orders",
    description: "View your order history",
    href: "/account/orders",
    icon: BoxIcon,
  },
  {
    title: "My addresses",
    description: "View and manage your addresses",
    href: "/account/addresses",
    icon: MapPinHouseIcon,
  },
];

export default function AccountIndexPage() {
  useEffect(() => {
    if (!isCustomerLoggedIn()) {
      redirect("/account/login");
    }
  }, []);
  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
      {ACCOUNT_PAGES.map((page) => (
        <Link
          key={page.href}
          href={page.href}
          className="rounded-md border border-stone-200 p-4 cursor-pointer hover:bg-stone-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <page.icon className="size-6 stroke-brand-800" />
          </div>
          <div className="flex flex-col gap-2 mt-3">
            <h3 className="text-lg font-medium">{page.title}</h3>
            <p className="text-sm text-stone-500">{page.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
