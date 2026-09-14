"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Calendar, Package, Ticket, TrendingUp } from "lucide-react";
import { DataTable } from "@/components/molecules/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useGet } from "@/hooks/use-api";
import { API_ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/format-date";
import type { Category, Product } from "@/lib/types";

interface ProductListResponse {
  data?: {
    items?: Product[];
    pagination?: { totalPages?: number };
  };
}

interface CategoryResponse {
  data?: Category[];
}

export default function ProductsPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [categoryId, setCategoryId] = useState("all");
  const pageSize = 5;

  const { data: categoryData } = useGet<CategoryResponse>(
    ["product-categories"],
    API_ROUTES.PRODUCT_CATEGORIES,
  );
  const productsPath =
    categoryId === "all"
      ? API_ROUTES.PRODUCTS
      : API_ROUTES.PRODUCTS_BY_CATEGORY.replace(":id", categoryId);
  const { data, isLoading } = useGet<ProductListResponse>(
    ["products", categoryId, String(pageIndex + 1)],
    `${productsPath}?page=${pageIndex + 1}&limit=${pageSize}`,
  );

  const products = useMemo(() => data?.data?.items || [], [data]);
  const categories = categoryData?.data || [];
  const totalPages = data?.data?.pagination?.totalPages || 1;

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
            <Package className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <Link
              href={`/polls/${row.original.id}`}
              className="block max-w-xs truncate font-semibold text-foreground hover:text-blue-600"
            >
              {row.original.name}
            </Link>
            <p className="max-w-xs truncate text-xs text-muted-foreground">
              {row.original.description || "Product pool"}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          className={
            row.original.status === "active"
              ? "bg-green-500/20 text-green-700 hover:bg-green-500/30 dark:text-green-400"
              : "bg-red-500/20 text-red-700 hover:bg-red-500/30 dark:text-red-400"
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "ticketPrice",
      header: "Ticket price",
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <Ticket className="h-4 w-4 text-blue-600 dark:text-blue-300" />$
          {Number(row.original.ticketPrice).toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "raisedAmount",
      header: "Raised",
      cell: ({ row }) => (
        <span className="text-sm font-semibold">
          ${Number(row.original.raisedAmount).toLocaleString()} / $
          {Number(row.original.targetAmount).toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Added",
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {formatDate(row.original.createdAt, "MMM dd")}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          asChild
          size="sm"
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          <Link href={`/polls/${row.original.id}`}>View product</Link>
        </Button>
      ),
    },
  ];

  const stats = [
    {
      label: "Active Products",
      value: products.filter((product) => product.status === "active").length,
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      label: "Total Raised",
      value: `$${products.reduce((sum, product) => sum + Number(product.raisedAmount || 0), 0).toLocaleString()}`,
      icon: Ticket,
      color: "text-blue-600 dark:text-blue-300",
    },
    {
      label: "Products Listed",
      value: products.length,
      icon: Package,
      color: "text-blue-500",
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex min-h-full flex-1 flex-col gap-8 bg-[#f5f3ff] p-6 lg:p-8 dark:bg-[#0b1020]">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
            Product listings
          </p>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            Products
          </h1>
          <p className="text-muted-foreground">
            Browse products and enroll in a pool with tickets.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Filter by category
            </p>
            <p className="text-sm text-muted-foreground">
              Find products in a specific category.
            </p>
          </div>
          <Select
            value={categoryId}
            onValueChange={(value) => {
              setCategoryId(value);
              setPageIndex(0);
            }}
          >
            <SelectTrigger className="w-full bg-white sm:w-64 dark:bg-slate-900">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-white/80 p-6 shadow-[0_8px_24px_rgba(37,99,235,0.06)] dark:border-slate-800 dark:bg-slate-900/80"
            >
              <Icon className={`h-6 w-6 ${color}`} />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {label}
                </p>
                <p className="text-2xl font-bold text-foreground">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white/80 dark:border-slate-800 dark:bg-slate-900/80">
          <DataTable
            columns={columns}
            data={products}
            pageCount={totalPages}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPaginationChange={(state) => setPageIndex(state.pageIndex)}
            emptyMessage={
              isLoading ? "Loading products..." : "No products found"
            }
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
