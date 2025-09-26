import type {
  ApiResponse,
  BrandCreateBody,
  BrandListData,
  BrandListQuery,
  BrandUpdateBody,
} from "@repo/database";
import type { Request, Response } from "express";
import { HttpError } from "../../middlewares/error";
import { brandService } from "./service";

export async function fetchBrands(
  req: Request,
  res: Response<ApiResponse<BrandListData>>
) {
  const q = req.query as Record<string, unknown>;
  const query: BrandListQuery = {
    tenantId: String(q.tenantId ?? ""),
    search: (q.search as string) || undefined,
    status: (q.status as string) || undefined,
    sortBy: (q.sortBy as BrandListQuery["sortBy"]) || undefined,
    orderBy: (q.orderBy as BrandListQuery["orderBy"]) || undefined,
    page: q.page !== undefined ? Number(q.page) : undefined,
    limit: q.limit !== undefined ? Number(q.limit) : undefined,
  };
  if (!query.tenantId) throw new HttpError(400, "tenantId is required");

  const allowedSortFields = ["createdAt", "title"];
  if (query.sortBy && !allowedSortFields.includes(query.sortBy)) {
    throw new HttpError(400, "Invalid sort field. Allowed: createdAt, title");
  }

  if (query.orderBy && !["asc", "desc"].includes(query.orderBy)) {
    throw new HttpError(400, "Invalid sort order. Allowed: asc, desc");
  }

  const data = await brandService.fetchBrands(query);

  res
    .status(200)
    .json({ success: true, message: "Brands fetched successfully", data });
}

export async function getBrandById(
  req: Request,
  res: Response<ApiResponse<{ brand: unknown }>>
) {
  const { tenantId } = req.query;
  if (!tenantId) throw new HttpError(400, "tenantId is required");
  const brand = await brandService.getById(
    String(tenantId),
    req.params["id"] as string
  );
  if (!brand) throw new HttpError(404, "Brand not found");
  res
    .status(200)
    .json({ success: true, message: "Brand fetched", data: { brand } });
}

export async function createBrand(
  req: Request<unknown, unknown, BrandCreateBody>,
  res: Response<ApiResponse<{ brandId: string }>>
) {
  const { tenantId, title } = req.body;
  if (!tenantId) throw new HttpError(400, "tenantId is required");
  if (!title) throw new HttpError(400, "title is required");

  const logoFile = (req as any).file as Express.Multer.File | undefined;
  const brandId = await brandService.create(req.body, logoFile);
  res
    .status(201)
    .json({ success: true, message: "Brand created", data: { brandId } });
}

export async function updateBrand(
  req: Request,
  res: Response<ApiResponse<{ updated: boolean }>>
) {
  const { tenantId } = req.query;
  if (!tenantId) throw new HttpError(400, "tenantId is required");
  const logoFile = (req as any).file as Express.Multer.File | undefined;
  const updated = await brandService.update(
    String(tenantId),
    req.params["id"] as string,
    req.body as BrandUpdateBody,
    logoFile
  );
  if (!updated) throw new HttpError(404, "Brand not found");
  res
    .status(200)
    .json({ success: true, message: "Brand updated", data: { updated: true } });
}

export async function deleteBrand(
  req: Request,
  res: Response<ApiResponse<{ deleted: boolean }>>
) {
  const { tenantId } = req.query;
  if (!tenantId) throw new HttpError(400, "tenantId is required");
  const deleted = await brandService.remove(
    String(tenantId),
    req.params["id"] as string
  );
  if (!deleted) throw new HttpError(404, "Brand not found");
  res
    .status(200)
    .json({ success: true, message: "Brand deleted", data: { deleted: true } });
}
