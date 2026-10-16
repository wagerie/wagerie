"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Copy,
  Edit3,
  Eye,
  EyeOff,
  Package,
  Plus,
  Trash2,
  Truck,
} from "lucide-react";
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
import type { Category, Product, ProductInput, ProductShipment } from "@/lib/types";

interface ShipmentResponse {
  product?: Product;
  shipment?: ProductShipment;
}

interface ShipmentInput {
  courier: string;
  trackingNumber: string;
  trackingUrl: string;
  shippingStatus: "shipped" | "delivered";
  estimatedDeliveryAt?: string;
  notes?: string;
}

function getProductShipment(product: Product) {
  return product.claimDetails?.shipment;
}

function hasPhysicalClaim(product: Product) {
  return (
    product.claimType === "physical" &&
    (product.claimStatus?.startsWith("claimed") === true ||
      ["shipped", "delivered", "received"].includes(product.claimStatus || ""))
  );
}

function formatDateTimeInput(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 16);
}

function ProductActions({
  product,
  onUpdated,
  onEdit,
  onDelete,
  onShipment,
  deleting,
}: {
  product: Product;
  onUpdated: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onShipment: () => void;
  deleting: boolean;
}) {
  const { mutate: duplicateProduct, isPending: duplicating } = usePost<
    unknown,
    { name: string; slug: string; targetAmount: number; ticketPrice: number; productValueAmount: number }
  >(
    API_ROUTES.ADMIN_PRODUCT_DUPLICATE.replace(":id", product.id),
    { onSuccess: onUpdated },
  );
  const { mutate: updatePublication, isPending: updatingPublication } = usePost<
    unknown,
    { status: "active" | "draft" }
  >(
    API_ROUTES.ADMIN_PRODUCT_BY_ID.replace(":id", product.id),
    { onSuccess: onUpdated },
    "patch",
  );
  const publicationStatus = product.status === "active" || product.status === "published";

  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={`Duplicate ${product.name}`}
        title="Duplicate as draft"
        disabled={duplicating}
        onClick={() => {
          const suffix = Date.now().toString();
          duplicateProduct({
            name: `Copy of ${product.name}`,
            slug: `${product.slug}-copy-${suffix}`,
            targetAmount: Number(product.targetAmount),
            ticketPrice: Number(product.ticketPrice),
            productValueAmount: Number(product.productValueAmount || 0),
          });
        }}
      >
        <Copy className="h-4 w-4" />
      </Button>
      {(product.status === "active" || product.status === "published" || product.status === "draft") && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={publicationStatus ? `Unpublish ${product.name}` : `Publish ${product.name}`}
          title={publicationStatus ? "Set to draft" : "Publish product"}
          disabled={updatingPublication}
          onClick={() => updatePublication({ status: publicationStatus ? "draft" : "active" })}
        >
          {publicationStatus ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      )}
      {product.claimType === "physical" && product.winnerUserId != null && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Manage shipment for ${product.name}`}
          title="Manage shipment"
          onClick={onShipment}
        >
          <Truck className="h-4 w-4" />
        </Button>
      )}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={`Edit ${product.name}`}
        onClick={onEdit}
      >
        <Edit3 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={`Delete ${product.name}`}
        disabled={deleting}
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}

function ShipmentDialog({
  product,
  onClose,
  onUpdated,
}: {
  product: Product;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const route = API_ROUTES.ADMIN_PRODUCT_SHIPMENT.replace(":id", product.id);
  const { data } = useGet<ShipmentResponse>(["admin-shipment", product.id], route);
  const shipment = data?.shipment || getProductShipment(product);
  const [form, setForm] = useState<ShipmentInput>({
    courier: shipment?.courier || "",
    trackingNumber: shipment?.trackingNumber || "",
    trackingUrl: shipment?.trackingUrl || "",
    shippingStatus:
      shipment?.shippingStatus === "delivered" || shipment?.shippingStatus === "received"
        ? "delivered"
        : "shipped",
    estimatedDeliveryAt: formatDateTimeInput(shipment?.estimatedDeliveryAt),
    notes: shipment?.notes || "",
  });
  const { mutate: updateShipment, isPending } = usePost<unknown, ShipmentInput>(
    API_ROUTES.ADMIN_PRODUCT_SHIP.replace(":id", product.id),
    {
      onSuccess: () => {
        onUpdated();
        onClose();
      },
    },
  );

  useEffect(() => {
    if (data?.shipment) {
      setForm((current) => ({
        ...current,
        courier: data.shipment?.courier || current.courier,
        trackingNumber: data.shipment?.trackingNumber || current.trackingNumber,
        trackingUrl: data.shipment?.trackingUrl || current.trackingUrl,
        shippingStatus:
          data.shipment?.shippingStatus === "delivered" || data.shipment?.shippingStatus === "received"
            ? "delivered"
            : "shipped",
        estimatedDeliveryAt: formatDateTimeInput(data.shipment?.estimatedDeliveryAt),
        notes: data.shipment?.notes || current.notes,
      }));
    }
  }, [data]);

  const updateField = (field: keyof ShipmentInput, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  return (
    <ModalLayout
      open
      onOpenChange={(open) => !open && onClose()}
      title={`Shipment: ${product.name}`}
      description="Update carrier, tracking, and delivery status for this physical prize."
      size="lg"
    >
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          updateShipment({
            ...form,
            estimatedDeliveryAt: form.estimatedDeliveryAt
              ? new Date(form.estimatedDeliveryAt).toISOString()
              : undefined,
          });
        }}
      >
        <Input value={form.courier} onChange={(event) => updateField("courier", event.target.value)} placeholder="Courier" aria-label="Courier" required disabled={isPending} />
        <Input value={form.trackingNumber} onChange={(event) => updateField("trackingNumber", event.target.value)} placeholder="Tracking number" aria-label="Tracking number" required disabled={isPending} />
        <Input className="sm:col-span-2" value={form.trackingUrl} onChange={(event) => updateField("trackingUrl", event.target.value)} placeholder="Tracking URL" aria-label="Tracking URL" type="url" required disabled={isPending} />
        <label className="grid gap-1 text-sm">
          <span>Shipping status</span>
          <select
            value={form.shippingStatus}
            onChange={(event) => updateField("shippingStatus", event.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3"
            disabled={isPending}
          >
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          <span>Estimated delivery</span>
          <Input type="datetime-local" value={form.estimatedDeliveryAt || ""} onChange={(event) => updateField("estimatedDeliveryAt", event.target.value)} disabled={isPending} />
        </label>
        <textarea
          className="min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm sm:col-span-2"
          value={form.notes || ""}
          onChange={(event) => updateField("notes", event.target.value)}
          placeholder="Shipment notes"
          aria-label="Shipment notes"
          disabled={isPending}
        />
        <div className="flex justify-end gap-2 sm:col-span-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>Cancel</Button>
          <Button type="submit" disabled={isPending}>{isPending ? "Updating..." : "Save shipment"}</Button>
        </div>
      </form>
    </ModalLayout>
  );
}

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
  const [shipmentProduct, setShipmentProduct] = useState<Product | null>(null);

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
      hasPhysicalClaim(product) &&
      !["delivered", "received"].includes(
        getProductShipment(product)?.shippingStatus || "",
      ),
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
      cell: ({ row }) => {
        const status = row.original.status;
        const label = status === "active" || status === "published"
          ? "Published"
          : status.charAt(0).toUpperCase() + status.slice(1);
        return <Badge className="capitalize">{label}</Badge>;
      },
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
        if (!hasPhysicalClaim(product)) {
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
        const shipment = getProductShipment(product);
        const deliveryStatus = shipment?.shippingStatus || "pending";
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
              <span className="text-xs capitalize">{deliveryStatus}</span>
              {shipment?.trackingNumber && (
                <span className="text-[11px] text-muted-foreground">{shipment.trackingNumber}</span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <ProductActions
          product={row.original}
          onUpdated={refreshCatalog}
          onEdit={() => startEditing(row.original)}
          onDelete={() => setProductToDelete(row.original.id)}
          onShipment={() => setShipmentProduct(row.original)}
          deleting={deletingProduct}
        />
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
      {shipmentProduct && (
        <ShipmentDialog
          product={shipmentProduct}
          onClose={() => setShipmentProduct(null)}
          onUpdated={refreshCatalog}
        />
      )}
    </AdminLayout>
  );
}
