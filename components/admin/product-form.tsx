"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import InputComponent from "@/components/atoms/input-component";
import { SelectComponent } from "@/components/atoms/select-component";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { productSchema, type ProductFormValues } from "@/lib/schemas";
import type { Category, ProductInput } from "@/lib/types";

interface ProductFormProps {
  categories: Category[];
  defaultValues: ProductInput;
  isEditing: boolean;
  isSaving: boolean;
  onSubmit: (product: ProductInput) => void;
  onCancel: () => void;
}

export function ProductForm({
  categories,
  defaultValues,
  isEditing,
  isSaving,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    defaultValues: {
      ...defaultValues,
      slots:
        defaultValues.ticketPrice > 0
          ? Math.max(
              1,
              Math.round(
                defaultValues.targetAmount / defaultValues.ticketPrice,
              ),
            )
          : 1,
    },
    resolver: zodResolver(productSchema),
  });
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    getValues,
    setValue,
  } = form;

  const updateTicketPrice = (targetAmount: number, slots: number) => {
    if (
      Number.isFinite(targetAmount) &&
      Number.isFinite(slots) &&
      targetAmount >= 0 &&
      slots > 0
    ) {
      setValue("ticketPrice", targetAmount / slots, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  const updateSlotCount = (targetAmount: number, ticketPrice: number) => {
    if (
      Number.isFinite(targetAmount) &&
      Number.isFinite(ticketPrice) &&
      targetAmount >= 0 &&
      ticketPrice > 0
    ) {
      setValue("slots", Math.max(1, Math.round(targetAmount / ticketPrice)), {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  const updateName = (value: string) => {
    setValue(
      "slug",
      value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const submitProduct = (values: ProductFormValues) => {
    onSubmit({
      name: values.name,
      slug: values.slug,
      categoryId: values.categoryId,
      image: values.image,
      description: values.description,
      targetAmount: values.targetAmount,
      ticketPrice: values.ticketPrice,
      productValueAmount: values.productValueAmount,
    });
  };

  return (
    <Form {...form}>
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={handleSubmit(submitProduct)}
      >
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <InputComponent
              {...field}
              label="Product name"
              state={errors.name ? "error" : null}
              disabled={isSaving}
              onChange={(event) => {
                field.onChange(event);
                updateName(event.target.value);
              }}
            />
          )}
        />
        <FormField
          control={control}
          name="slug"
          render={({ field }) => (
            <InputComponent
              {...field}
              label="Slug"
              state={errors.slug ? "error" : null}
              readOnly
            />
          )}
        />
        <div className="sm:col-span-2">
          <Controller
            control={control}
            name="categoryId"
            rules={{ required: "Select a category" }}
            render={({ field }) => (
              <SelectComponent
                value={field.value || ""}
                onValueChange={field.onChange}
                options={categories.map((category) => ({
                  value: String(category.id),
                  label: category.name,
                }))}
                placeholder="Select category"
                label="Category"
                disabled={isSaving}
                error={errors.categoryId?.message}
              />
            )}
          />
        </div>
        <div className="sm:col-span-2">
          <FormField
            control={control}
            name="image"
            render={({ field }) => (
              <InputComponent
                {...field}
                label="Image URL"
                type="url"
                state={errors.image ? "error" : null}
                disabled={isSaving}
              />
            )}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="product-description">Description</Label>
          <textarea
            id="product-description"
            aria-invalid={Boolean(errors.description)}
            {...register("description")}
            className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>
        <FormField
          control={control}
          name="targetAmount"
          render={({ field }) => (
            <InputComponent
              {...field}
              label="Target amount"
              min="0"
              type="number"
              state={errors.targetAmount ? "error" : null}
              disabled={isSaving}
              onChange={(event) => {
                const targetAmount = event.target.valueAsNumber;
                field.onChange(targetAmount);
                updateTicketPrice(targetAmount, getValues("slots"));
              }}
            />
          )}
        />
        <FormField
          control={control}
          name="slots"
          render={({ field }) => (
            <InputComponent
              {...field}
              label="Number of slots"
              min="1"
              step="1"
              type="number"
              state={errors.slots ? "error" : null}
              disabled={isSaving}
              onChange={(event) => {
                const slots = event.target.valueAsNumber;
                field.onChange(slots);
                updateTicketPrice(getValues("targetAmount"), slots);
              }}
            />
          )}
        />
        <FormField
          control={control}
          name="ticketPrice"
          render={({ field }) => (
            <InputComponent
              {...field}
              label="Ticket price"
              min="0"
              step="0.01"
              type="number"
              state={errors.ticketPrice ? "error" : null}
              disabled={isSaving}
              onChange={(event) => {
                const ticketPrice = event.target.valueAsNumber;
                field.onChange(ticketPrice);
                updateSlotCount(getValues("targetAmount"), ticketPrice);
              }}
            />
          )}
        />
        <FormField
          control={control}
          name="productValueAmount"
          render={({ field }) => (
            <InputComponent
              {...field}
              label="Product value amount"
              min="0.01"
              step="0.01"
              type="number"
              state={errors.productValueAmount ? "error" : null}
              disabled={isSaving}
              onChange={(event) => field.onChange(event.target.valueAsNumber)}
            />
          )}
        />
        <div className="sm:col-span-2 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isSaving}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving
              ? "Saving..."
              : isEditing
                ? "Update product"
                : "Create product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
