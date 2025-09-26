import type { BrandDocument } from "../schemas/brand";

export type BrandListQuery = {
  tenantId: string; // required for multi-tenant scoping
  search?: string;
  status?: string;
  sortBy?: "createdAt" | "title";
  orderBy?: "asc" | "desc";
  page?: number;
  limit?: number;
  fetchFields?: Record<string, 0 | 1>;
};

export type BrandListItem = Pick<
  BrandDocument,
  | "_id"
  | "tenantId"
  | "title"
  | "slug"
  | "description"
  | "isActive"
  | "productCount"
  | "logo"
  | "createdAt"
  | "updatedAt"
>;

export type BrandListData = {
  brands: BrandListItem[];
  totalItems: number;
};

export type BrandIdParam = { id: string };

export type BrandCreateBody = {
  tenantId: string;
  title: string;
  description?: string;
  isActive?: boolean;
};

export type BrandUpdateBody = Partial<BrandCreateBody> & { title?: string };
