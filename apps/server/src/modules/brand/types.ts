import type { BrandListData, BrandListQuery } from "@repo/database";

export type { BrandListQuery };

export type BrandListResponse = {
  message: string;
  brands: BrandListData["brands"];
  totalItems: BrandListData["totalItems"];
};
