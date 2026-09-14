"use client";

import { FormEvent, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Edit3, Package, Plus, Save, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDelete, useGet, usePost } from "@/hooks/use-api";
import { API_ROUTES } from "@/constants/routes";
import type { Category, Product, ProductInput } from "@/lib/types";

interface CollectionResponse<T> {
  data?: T[] | { items?: T[] };
}

const emptyProduct: ProductInput = {
  name: "",
  slug: "",
  categoryId: 0,
  description: "",
  targetAmount: 0,
  ticketPrice: 0,
};

function collectionItems<T>(response?: CollectionResponse<T>) {
  if (Array.isArray(response?.data)) return response.data;
  return response?.data?.items || [];
}

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [productForm, setProductForm] = useState<ProductInput>(emptyProduct);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const { data: productsResponse, isLoading: productsLoading } = useGet<
    CollectionResponse<Product>
  >(["admin-products"], API_ROUTES.ADMIN_PRODUCTS);
  const { data: categoriesResponse, isLoading: categoriesLoading } = useGet<
    CollectionResponse<Category>
  >(["admin-categories"], API_ROUTES.ADMIN_CATEGORIES);

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

  const products = collectionItems(productsResponse);
  const categories = collectionItems(categoriesResponse);

  const submitProduct = (event: FormEvent) => {
    event.preventDefault();
    saveProduct(productForm);
  };

  const startEditing = (product: Product) => {
    setEditingId(product.id);
    setProductForm({
      name: product.name,
      slug: product.slug,
      categoryId: product.categoryId,
      description: product.description || "",
      targetAmount: Number(product.targetAmount),
      ticketPrice: Number(product.ticketPrice),
    });
  };

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

            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">
                    {editingId ? "Edit product" : "Add product"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Matches the Admin Control product payload.
                  </p>
                </div>
                {editingId && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      setProductForm(emptyProduct);
                    }}
                  >
                    Cancel edit
                  </Button>
                )}
              </div>
              <form
                className="mt-5 grid gap-4 sm:grid-cols-2"
                onSubmit={submitProduct}
              >
                <Input
                  required
                  placeholder="Product name"
                  value={productForm.name}
                  onChange={(event) =>
                    setProductForm({ ...productForm, name: event.target.value })
                  }
                />
                <Input
                  required
                  placeholder="Slug"
                  value={productForm.slug}
                  onChange={(event) =>
                    setProductForm({ ...productForm, slug: event.target.value })
                  }
                />
                <select
                  required
                  value={productForm.categoryId || ""}
                  onChange={(event) =>
                    setProductForm({
                      ...productForm,
                      categoryId: Number(event.target.value),
                    })
                  }
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm sm:col-span-2"
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <textarea
                  required
                  placeholder="Description"
                  value={productForm.description}
                  onChange={(event) =>
                    setProductForm({
                      ...productForm,
                      description: event.target.value,
                    })
                  }
                  className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm sm:col-span-2"
                />
                <Input
                  required
                  min="0"
                  type="number"
                  placeholder="Target amount"
                  value={productForm.targetAmount}
                  onChange={(event) =>
                    setProductForm({
                      ...productForm,
                      targetAmount: Number(event.target.value),
                    })
                  }
                />
                <Input
                  required
                  min="0"
                  step="0.01"
                  type="number"
                  placeholder="Ticket price"
                  value={productForm.ticketPrice}
                  onChange={(event) =>
                    setProductForm({
                      ...productForm,
                      ticketPrice: Number(event.target.value),
                    })
                  }
                />
                <Button
                  type="submit"
                  disabled={savingProduct}
                  className="sm:col-span-2"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {savingProduct
                    ? "Saving..."
                    : editingId
                      ? "Update product"
                      : "Create product"}
                </Button>
              </form>
            </section>
          </div>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-bold">Product catalog</h2>
            <div className="mt-5 overflow-x-auto">
              {productsLoading ? (
                <p className="text-sm text-muted-foreground">
                  Loading products...
                </p>
              ) : (
                <table className="w-full min-w-180 text-left text-sm">
                  <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-3 py-3">Product</th>
                      <th className="px-3 py-3">Category</th>
                      <th className="px-3 py-3">Target</th>
                      <th className="px-3 py-3">Ticket</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className="px-3 py-3 font-semibold">
                          {product.name}
                          <span className="block text-xs font-normal text-muted-foreground">
                            {product.slug}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          {categories.find(
                            (category) => category.id === product.categoryId,
                          )?.name || product.categoryId}
                        </td>
                        <td className="px-3 py-3">
                          ${Number(product.targetAmount).toLocaleString()}
                        </td>
                        <td className="px-3 py-3">
                          ${Number(product.ticketPrice).toLocaleString()}
                        </td>
                        <td className="px-3 py-3">
                          <Badge>{product.status}</Badge>
                        </td>
                        <td className="px-3 py-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Edit ${product.name}`}
                            onClick={() => startEditing(product)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Delete ${product.name}`}
                            disabled={deletingProduct}
                            onClick={() => setProductToDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
