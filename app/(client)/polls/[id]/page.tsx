"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Package, Ticket } from "lucide-react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useGet, usePost } from "@/hooks/use-api";
import { API_ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/format-date";
import type { Product, ProductEnrollment } from "@/lib/types";

interface ProductDetailResponse {
  data?: {
    product?: Product;
    enrollments?: ProductEnrollment[];
  };
}

interface EnrollmentResponse {
  data?: {
    enrollment?: ProductEnrollment;
    product?: Product;
    newBalance?: number | string;
  };
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const productId = Number(params.id);
  const queryClient = useQueryClient();
  const [tickets, setTickets] = useState(1);
  const detailPath = API_ROUTES.PRODUCT_DETAIL.replace(":id", params.id);

  const { data, isLoading, isError } = useGet<ProductDetailResponse>(
    ["product", params.id],
    detailPath,
    { enabled: Number.isInteger(productId) && productId > 0 },
  );
  const { mutate: enroll, isPending } = usePost<
    EnrollmentResponse,
    { productId: number; tickets: number }
  >(API_ROUTES.ENROLL_PRODUCT, {
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["product", params.id] });
      setTickets(1);
    },
  });

  const product = data?.data?.product;
  const enrollments = data?.data?.enrollments || [];
  const total = product ? Number(product.ticketPrice) * tickets : 0;
  const canEnroll = product?.status === "active" && tickets > 0;

  const handleEnroll = () => {
    if (!product || !canEnroll) return;
    enroll({ productId: product.id, tickets });
  };

  return (
    <DashboardLayout>
      <div className="min-h-full bg-[#f5f3ff] p-6 lg:p-8 dark:bg-[#0b1020]">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/polls"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to products
          </Link>

          {isLoading ? (
            <div className="rounded-2xl border border-blue-100 bg-white/80 p-8 text-muted-foreground dark:border-slate-800 dark:bg-slate-900/80">
              Loading product...
            </div>
          ) : isError || !product ? (
            <div className="rounded-2xl border border-red-200 bg-white/80 p-8 text-red-600 dark:border-red-500/30 dark:bg-slate-900/80">
              This product could not be found.
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <section className="rounded-2xl border border-blue-100 bg-white/80 p-6 shadow-[0_8px_24px_rgba(37,99,235,0.06)] dark:border-slate-800 dark:bg-slate-900/80">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
                      Product detail
                    </p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                      {product.name}
                    </h1>
                  </div>
                  <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold capitalize text-green-700 dark:text-green-400">
                    {product.status}
                  </span>
                </div>

                <div className="mt-8 flex min-h-48 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                  <Package className="h-16 w-16" />
                </div>
                <p className="mt-6 text-slate-600 dark:text-slate-300">
                  {product.description ||
                    "Join this product pool for a chance to win."}
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Ticket price
                    </p>
                    <p className="mt-1 text-xl font-bold">
                      ${Number(product.ticketPrice).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Raised</p>
                    <p className="mt-1 text-xl font-bold">
                      ${Number(product.raisedAmount).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Target</p>
                    <p className="mt-1 text-xl font-bold">
                      ${Number(product.targetAmount).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="mt-6 text-xs text-muted-foreground">
                  Listed {formatDate(product.createdAt, "MMM dd, yyyy")}
                </p>
              </section>

              <section className="h-fit rounded-2xl border border-blue-100 bg-white/80 p-6 shadow-[0_8px_24px_rgba(37,99,235,0.06)] dark:border-slate-800 dark:bg-slate-900/80">
                <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                  Enroll in this product
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Buy more tickets to increase your chances.
                </p>
                <label
                  className="mt-6 block text-sm font-semibold"
                  htmlFor="tickets"
                >
                  Number of tickets
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    id="tickets"
                    type="number"
                    min={1}
                    step={1}
                    value={tickets}
                    onChange={(event) =>
                      setTickets(Math.max(1, Number(event.target.value) || 1))
                    }
                    className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"
                    disabled={isPending || product.status !== "active"}
                  />
                  <Ticket className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="mt-5 flex items-center justify-between border-t pt-4 text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-xl font-bold">
                    ${total.toLocaleString()}
                  </span>
                </div>
                <Button
                  type="button"
                  onClick={handleEnroll}
                  disabled={!canEnroll || isPending}
                  className="mt-5 w-full bg-blue-600 text-white hover:bg-blue-700"
                >
                  {isPending ? "Enrolling..." : "Enroll now"}
                </Button>

                {enrollments.length > 0 && (
                  <div className="mt-6 border-t pt-5">
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Recent enrollments: {enrollments.length}
                    </p>
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
