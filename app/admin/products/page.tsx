"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit3, Package, Plus, Trash2, Truck } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { ProductForm } from "@/components/admin/product-form";
import { DataTable } from "@/components/molecules/data-table";
import { ModalLayout } from "@/components/layout/modal-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDelete, useGet, useGetPage, usePost } from "@/hooks/use-api";
import { API_ROUTES } from "@/constants/routes";
import { formatCurrency } from "@/lib/utils";
import type { Category, Product, ProductInput } from "@/lib/types";
import { useDeliveryStatus } from "@/hooks/use-delivery-status";

const emptyProduct: ProductInput = {
  name: "",
  slug: "",
  categoryId: "",
  description: "",
  targetAmount: 0,
  ticketPrice: 0,
  image: "", // single image url
  productValueAmount: 0,
};

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [productPage, setProductPage] = useState(1);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [productFormKey, setProductFormKey] = useState(0);
  const [productForm, setProductForm] = useState<ProductInput>(emptyProduct);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const { getStatus: getDeliveryStatus, updateStatus: updateDeliveryStatus } =
    useDeliveryStatus();

  const productPageSize = 10;
  const { data: productsResponse, isLoading: productsLoading } = useGetPage<Product>(
    ["admin-products", String(productPage)],
    `${API_ROUTES.ADMIN_PRODUCTS}?page=${productPage}&limit=${productPageSize}`,
  );
  const { data: categories = [], isLoading: categoriesLoading } = useGet<Category[]>(
    ["admin-categories"],
    API_ROUTES.ADMIN_CATEGORIES,
  );

  const refreshCatalog = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    queryClient.invalidateQueries({ queryKey: ["product-categories"] });
  };

  const { mutate: saveProduct, isPending: savingProduct } = usePost<
    unknown,
    ProductInput
  >(
    editingId
      ? API_ROUTES.ADMIN_PRODUCT_BY_ID.replace(":id", String(editingId))
      : API_ROUTES.ADMIN_PRODUCTS,
    {
      onSuccess: () => {
        setProductForm(emptyProduct);
        setEditingId(null);
        setProductDialogOpen(false);
        setProductFormKey((key) => key + 1);
        refreshCatalog();
      },
    },
    editingId ? "patch" : "post",
  );
  const { mutate: deleteProduct, isPending: deletingProduct } = useDelete(
    productToDelete
      ? API_ROUTES.ADMIN_PRODUCT_BY_ID.replace(":id", String(productToDelete))
      : API_ROUTES.ADMIN_PRODUCTS,
    { onSuccess: refreshCatalog },
  );
  const { mutate: createCategory, isPending: creatingCategory } = usePost(
    API_ROUTES.ADMIN_CATEGORIES,
    {
      onSuccess: () => {
        setCategoryName("");
        refreshCatalog();
      },
    },
  );
  const { mutate: deleteCategory, isPending: deletingCategory } = useDelete(
    categoryToDelete
      ? API_ROUTES.ADMIN_CATEGORY_BY_ID.replace(":id", String(categoryToDelete))
      : API_ROUTES.ADMIN_CATEGORIES,
    { onSuccess: refreshCatalog },
  );

  useEffect(() => {
    if (categoryToDelete !== null) {
      deleteCategory();
      setCategoryToDelete(null);
    }
  }, [categoryToDelete, deleteCategory]);

  useEffect(() => {
    if (productToDelete !== null) {
      deleteProduct();
      setProductToDelete(null);
    }
  }, [productToDelete, deleteProduct]);

  const products = productsResponse?.items || [];
  const winningProducts = products.filter(
    (product) => product.winnerUserId != null,
  );
  const uniqueWinners = new Set(
    winningProducts.map((product) => String(product.winnerUserId)),
  ).size;
  const prizeValueAwarded = winningProducts.reduce(
    (total, product) => total + Number(product.productValueAmount || 0),
    0,
  );
  const pendingDeliveries = products.filter(
    (product) =>
      product.claimType === "physical" &&
      product.claimStatus?.startsWith("claimed") &&
      getDeliveryStatus(product.id) !== "received",
  ).length;

  const startCreating = () => {
    setEditingId(null);
    setProductForm(emptyProduct);
    setProductFormKey((key) => key + 1);
    setProductDialogOpen(true);
  };

  const startEditing = (product: Product) => {
    setEditingId(product.id);
    setProductForm({
      name: product.name,
      slug: product.slug,
      image: product.image || "",
      productValueAmount: Number(product.productValueAmount) || 0,
      categoryId: String(product.categoryId),
      description: product.description || "",
      targetAmount: Number(product.targetAmount),
      ticketPrice: Number(product.ticketPrice),
    });
    setProductFormKey((key) => key + 1);
    setProductDialogOpen(true);
  };

  const closeProductDialog = () => {
    setProductDialogOpen(false);
    setEditingId(null);
    setProductForm(emptyProduct);
    setProductFormKey((key) => key + 1);
  };

  const productColumns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => (
        <div className="min-w-52 max-w-72 space-y-1">
          <span className="block line-clamp-2 font-semibold leading-snug">
            {row.original.name}
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {categories.find(
              (category) => category.id === row.original.categoryId,
            )?.name || "Uncategorized"}
          </span>
        </div>
      ),
    },
    {
      id: "pricing",
      header: "Prize / ticket",
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          <p className="font-semibold">
            {formatCurrency(row.original.productValueAmount || 0)}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(row.original.ticketPrice)} / ticket
          </p>
        </div>
      ),
    },
    {
      id: "drawProgress",
      header: "Draw progress",
      cell: ({ row }) => {
        const totalSlots = Number(row.original.totalSlots || 0);
        const slotsLeft = Number(row.original.slotsLeft || 0);
        const slotsSold = Math.max(0, totalSlots - slotsLeft);
        const percentage = Math.min(
          100,
          Math.max(0, Number(row.original.percentage || 0)),
        );

        return (
          <div className="min-w-32 space-y-1.5">
            <div className="flex justify-between gap-3 text-xs tabular-nums">
              <span>{slotsSold.toLocaleString()} sold</span>
              <span className="text-muted-foreground">{percentage}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className="capitalize">{row.original.status}</Badge>
      ),
    },
    {
      id: "winner",
      header: "Winner / prize",
      cell: ({ row }) => {
        const product = row.original;
        if (product.winnerUserId == null) {
          return (
            <span className="text-xs text-muted-foreground">Awaiting draw</span>
          );
        }

        const winnerName =
          product.winnerUser?.username ||
          product.winnerUser?.name ||
          [product.winnerUser?.firstName, product.winnerUser?.lastName]
            .filter(Boolean)
            .join(" ");

        if (product.claimType === "cash") {
          return (
            <div className="min-w-36 space-y-1">
              <p className="truncate text-xs font-semibold">
                {winnerName || "Winner details unavailable"}
              </p>
              <Badge className="border-0 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                Cash claimed
              </Badge>
              <p className="text-muted-foreground">
                {formatCurrency(
                  product.claimDetails?.payoutAmount ??
                    product.productValueAmount ??
                    0,
                )}
              </p>
            </div>
          );
        }
        if (
          product.claimType !== "physical" ||
          !product.claimStatus?.startsWith("claimed")
        ) {
          return (
            <div className="min-w-36 space-y-1">
              <p className="truncate text-xs font-semibold">
                {winnerName || "Winner details unavailable"}
              </p>
              <Badge variant="outline">Claim not submitted</Badge>
            </div>
          );
        }

        const shipping = product.claimDetails?.shippingDetails;
        const deliveryStatus = getDeliveryStatus(product.id);
        const address = [
          shipping?.addressLine1,
          shipping?.city,
          shipping?.state,
          shipping?.country,
        ]
          .filter(Boolean)
          .join(", ");
        return (
          <div className="min-w-44 space-y-1.5">
            <p className="truncate text-xs font-semibold">
              {winnerName || "Winner details unavailable"}
            </p>
            <p
              className="truncate text-[11px] text-muted-foreground"
              title={`${shipping?.recipientName || ""} · ${shipping?.phoneNumber || ""} · ${address}`}
            >
              {shipping?.recipientName || "Recipient not provided"}
              {shipping?.city ? ` · ${shipping.city}` : ""}
            </p>
            <div className="flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                aria-label={`Delivery status for ${product.name}`}
                value={deliveryStatus}
                onChange={(event) =>
                  updateDeliveryStatus(
                    product.id,
                    event.target.value as "pending" | "shipped" | "received",
                  )
                }
                className="h-8 min-w-32 rounded-md border border-border bg-background px-2 text-xs"
              >
                <option value="pending">Awaiting delivery</option>
                <option value="shipped">Shipped</option>
                <option value="received">Received</option>
              </select>
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Edit ${row.original.name}`}
            onClick={() => startEditing(row.original)}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Delete ${row.original.name}`}
            disabled={deletingProduct}
            onClick={() => setProductToDelete(row.original.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="min-h-full bg-background p-4 text-foreground lg:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <header>
            <Badge className="border-0 bg-warning/15 text-warning">
              Catalog control
            </Badge>
            <h1 className="mt-2 text-3xl font-black tracking-tight">
              Products & categories
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Create, update, and retire the products customers can enroll in.
            </p>
          </header>

          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-bold">Winner performance</h2>
                <p className="text-xs text-muted-foreground">
                  Totals from the products currently loaded. Winner names are
                  shown when included in the API response.
                </p>
              </div>
              <Badge variant="outline">
                {pendingDeliveries} awaiting receipt
              </Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">Winning draws</p>
                <p className="mt-1 text-xl font-bold tabular-nums">
                  {winningProducts.length}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">Unique winners</p>
                <p className="mt-1 text-xl font-bold tabular-nums">
                  {uniqueWinners}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">
                  Prize value awarded
                </p>
                <p className="mt-1 text-xl font-bold tabular-nums">
                  {formatCurrency(prizeValueAwarded)}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">
                  Awaiting receipt
                </p>
                <p className="mt-1 text-xl font-bold tabular-nums">
                  {pendingDeliveries}
                </p>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Delivery updates are saved in this browser only until a
              fulfillment API is available.
            </p>
          </section>

          <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Categories</h2>
                  <p className="text-sm text-muted-foreground">
                    Organize the product catalog.
                  </p>
                </div>
                <Package className="h-5 w-5 text-primary" />
              </div>
              <form
                className="mt-5 flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (categoryName.trim())
                    createCategory({
                      name: categoryName.trim(),
                      slug: categoryName
                        .trim()
                        .toLowerCase()
                        .replace(/\s+/g, "-"),
                    });
                }}
              >
                <Input
                  value={categoryName}
                  onChange={(event) => setCategoryName(event.target.value)}
                  placeholder="Category name"
                  disabled={creatingCategory}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!categoryName.trim() || creatingCategory}
                  aria-label="Add category"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </form>
              <div className="mt-5 space-y-2">
                {categoriesLoading ? (
                  <p className="text-sm text-muted-foreground">
                    Loading categories...
                  </p>
                ) : (
                  categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between rounded-xl border border-border bg-muted px-3 py-2 text-sm"
                    >
                      <span>{category.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${category.name}`}
                        disabled={deletingCategory}
                        onClick={() => {
                          setCategoryToDelete(category.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">Product catalog</h2>
                <p className="text-sm text-muted-foreground">
                  {productsResponse?.totalItems ?? products.length} products
                </p>
              </div>
              <Button type="button" onClick={startCreating}>
                <Plus className="mr-2 h-4 w-4" />
                Add product
              </Button>
            </div>
            <DataTable
              columns={productColumns}
              data={products}
              pageCount={productsResponse?.pageCount ?? 1}
              pageIndex={productPage - 1}
              pageSize={productPageSize}
              onPaginationChange={(pagination) =>
                setProductPage(pagination.pageIndex + 1)
              }
              isLoading={productsLoading}
              emptyMessage="No products in the catalog yet"
            />
          </section>
        </div>
      </div>
      <ModalLayout
        open={productDialogOpen}
        onOpenChange={setProductDialogOpen}
        title={editingId ? "Edit product" : "Add product"}
        description={
          editingId
            ? "Update the selected product in the catalog."
            : "Add a product to the catalog."
        }
        size="xl"
        className="max-h-[90vh] overflow-y-auto"
      >
        <ProductForm
          key={`${editingId ?? "new"}-${productFormKey}`}
          categories={categories}
          defaultValues={productForm}
          isEditing={editingId !== null}
          isSaving={savingProduct}
          onSubmit={saveProduct}
          onCancel={closeProductDialog}
        />
      </ModalLayout>
    </AdminLayout>
  );
}
