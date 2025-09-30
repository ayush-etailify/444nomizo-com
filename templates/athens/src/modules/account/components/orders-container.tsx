"use client";

import { useSearchOrders } from "@/lib/data/account";
import { readPrice } from "@/lib/utils/text-format";
import { format } from "date-fns";

export default function OrdersContainer() {
  const { orders } = useSearchOrders({
    page: 0,
    size: 10,
  });

  return (
    <div className="mt-8 space-y-4">
      {orders?.response.map((order) => (
        <div
          key={order.uuid}
          className="border rounded-md overflow-clip border-stone-200"
        >
          <div className="flex justify-between bg-stone-100 p-4 px-8">
            <div className="flex gap-8">
              <div className="flex flex-col gap-1">
                <div className="text-sm text-stone-500">Created On</div>
                <div className="text-sm text-stone-600">
                  {format(
                    new Date(Number(order?.created_at)),
                    "d MMM 'at' h:mm a"
                  ) || "-"}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-sm text-stone-500">Total</div>
                <div className="text-sm text-stone-600">
                  {readPrice(order.bill?.net_total || "0", {
                    format: true,
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1 items-end">
              <div className="text-sm text-stone-500">Order ID</div>
              <div className="text-sm text-stone-600 uppercase">
                # {order.uuid?.slice(0, 8)}
              </div>
            </div>
          </div>
          <div className="py-8 px-8">
            <div className="flex flex-col gap-1">
              <div className="space-y-2">
                {order.products.map((product) => (
                  <div key={product.uuid}>
                    <div className="">{product.product.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
