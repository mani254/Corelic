"use client";

import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { BrandType } from "@/redux/brand/BrandTypes";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";

interface BrandSheetProps {
  brand: BrandType;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BrandDetailsSheet({ brand, isOpen, onOpenChange }: BrandSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:w-[540px] md:w-[600px] px-8 py-4 overflow-y-auto"
      >
        <div className="space-y-8">
          <SheetHeader>
            <VisuallyHidden>
              <SheetTitle>Brand Details - {brand.title}</SheetTitle>
            </VisuallyHidden>
          </SheetHeader>

          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">{brand.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Slug: <span className="font-medium text-gray-700">{brand.slug}</span>
              </p>
            </div>
            <Badge
              variant={brand.status === "active" ? "success" : "destructive"}
              className="px-3 py-[6px] rounded-full capitalize text-sm mt-1"
            >
              {brand.status}
            </Badge>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Brand Image</h3>
            <div className="w-full flex justify-center border rounded-md bg-muted p-4">
              <Image
                src={brand.image?.url || "/fallback-image.svg"}
                alt={brand.image?.alt || "Brand image"}
                width={200}
                height={200}
                className="rounded-md object-contain shadow-md"
              />
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2 italic">
              {brand.image?.alt || "No alt text provided"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
            <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-800 border">
              {brand.description || "No description provided"}
            </div>
          </div>

          <div className="grid gap-4">
            <h3 className="text-sm font-medium text-muted-foreground">Meta Information</h3>
            <div className="grid gap-2 text-sm">
              <div>
                <span className="text-muted-foreground block text-xs mb-1">Meta Title</span>
                <div className="bg-gray-50 p-2 rounded-md border text-gray-800">
                  {brand.metaData?.metaTitle || "—"}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs mb-1">Meta Description</span>
                <div className="bg-gray-50 p-2 rounded-md border text-gray-800">
                  {brand.metaData?.metaDescription || "—"}
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="text-xs text-muted-foreground space-y-1 border-t pt-4">
            <p>
              <span className="font-medium">Created At:</span>{" "}
              {brand.createdAt ? new Date(brand.createdAt).toLocaleString() : "—"}
            </p>
            <p>
              <span className="font-medium">Updated At:</span>{" "}
              {brand.updatedAt ? new Date(brand.updatedAt).toLocaleString() : "—"}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
