"use client";

import { useCart } from "@/lib/hooks/use-cart";
import { sdk } from "@/lib/sdk-config";
import { isCustomerLoggedIn } from "@/lib/utils/common";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function AccountHeaderLogout() {
  const { clearCart } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isCustomerLoggedIn()) {
      setIsLoggedIn(true);
    }
  }, []);

  if (!isLoggedIn) return null;

  return (
    <button
      onClick={() => {
        sdk.auth.login.logout();
        setIsLoggedIn(false);
        clearCart();
        redirect("/account/login");
      }}
      className="text-sm text-red-700 cursor-pointer"
    >
      Logout
    </button>
  );
}
