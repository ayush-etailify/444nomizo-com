"use client";

import { useServerCart } from "@/lib/hooks/use-server-cart";

export default function AddressesContainer() {
  const { customer } = useServerCart();

  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {customer?.addresses?.map((address, index) => (
        <div key={index} className="border border-stone-200 rounded-md p-4">
          <div className="font-medium mb-2">
            {customer.first_name} {customer.last_name}
          </div>
          <div>{address.address.address_line_1}</div>
          <div>{address.address.address_line_2}</div>
          <div>
            {address.address.city}, {address.address.state}
          </div>
          <div>{address.address.postal_code}</div>
          <div>{address.address.country}</div>
        </div>
      ))}
    </div>
  );
}
