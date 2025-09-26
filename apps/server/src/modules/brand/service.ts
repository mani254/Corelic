import type {
  BrandCreateBody,
  BrandListData,
  BrandListQuery,
  BrandUpdateBody,
} from "@repo/database";
import { Brand } from "@repo/database";
import { deleteFile } from "../../../utils/cloudfare/deleteSingleFile";
import { uploadSingleFile } from "../../../utils/cloudfare/uploadSingle";

export class BrandService {
  public buildMatchStage(query: BrandListQuery): Record<string, unknown> {
    const { search, status } = query;
    const matchStage: Record<string, unknown> = {};

    if (search && search.trim() !== "") {
      matchStage.title = { $regex: search, $options: "i" };
    }

    if (status) {
      matchStage.status = status;
    }

    return matchStage;
  }

  public async fetchBrands(query: BrandListQuery): Promise<BrandListData> {
    const {
      sortBy = "createdAt",
      orderBy = "desc",
      page,
      limit,
      fetchFields,
    } = query;

    const skip = page && limit ? (Number(page) - 1) * Number(limit) : 0;
    const matchStage = {
      tenantId: query.tenantId,
      ...this.buildMatchStage(query),
    } as any;

    const brandStages: any[] = [
      { $sort: { [sortBy]: orderBy === "desc" ? -1 : 1 } },
      { $skip: skip },
    ];

    if (limit) {
      brandStages.push({ $limit: Number(limit) });
    }

    if (fetchFields && Object.keys(fetchFields).length > 0) {
      brandStages.push({ $project: fetchFields });
    }

    const pipeline = [
      { $match: matchStage },
      {
        $facet: {
          totalItems: [{ $count: "count" }],
          brands: brandStages,
        },
      },
      {
        $project: {
          totalItems: { $arrayElemAt: ["$totalItems.count", 0] },
          brands: 1,
        },
      },
    ];

    const [result] = await Brand.aggregate(pipeline as any[]);
    return (result as BrandListData) || { totalItems: 0, brands: [] };
  }

  public async getById(tenantId: string, id: string) {
    return Brand.findOne({ _id: id, tenantId }).lean();
  }

  public async create(body: BrandCreateBody, logoFile?: Express.Multer.File) {
    let logo = undefined as any;
    if (logoFile) {
      const uploaded = await uploadSingleFile({
        tenantId: body.tenantId,
        fileBuffer: logoFile.buffer,
        originalName: logoFile.originalname,
        allowedTypes: [
          "image/png",
          "image/jpeg",
          "image/webp",
          "image/svg+xml",
        ],
        makePublic: true,
      });
      logo = { url: uploaded.url } as any;
    }

    const doc = await Brand.create({
      tenantId: body.tenantId,
      title: body.title,
      description: body.description,
      isActive: body.isActive ?? true,
      logo,
    } as any);

    return String(doc._id);
  }

  public async update(
    tenantId: string,
    id: string,
    body: BrandUpdateBody,
    logoFile?: Express.Multer.File
  ) {
    const existing = await Brand.findOne({ _id: id, tenantId });
    if (!existing) return false;

    let logo = (existing as any).logo;
    if (logoFile) {
      const uploaded = await uploadSingleFile({
        tenantId: String(tenantId),
        fileBuffer: logoFile.buffer,
        originalName: logoFile.originalname,
        allowedTypes: [
          "image/png",
          "image/jpeg",
          "image/webp",
          "image/svg+xml",
        ],
        makePublic: true,
      });
      logo = { url: uploaded.url } as any;
    }

    await Brand.updateOne(
      { _id: id, tenantId },
      {
        $set: {
          title: body.title ?? (existing as any).title,
          description: body.description ?? (existing as any).description,
          isActive: body.isActive ?? (existing as any).isActive,
          logo,
        },
      }
    );
    return true;
  }

  public async remove(tenantId: string, id: string) {
    const existing = await Brand.findOne({ _id: id, tenantId }).lean();
    if (!existing) return false;
    const logoUrl = (existing as any).logo?.url as string | undefined;
    if (logoUrl) {
      const domain = `https://${process.env.R2_PUBLIC_DOMAIN}/`;
      if (logoUrl.startsWith(domain)) {
        const key = logoUrl.slice(domain.length);
        await deleteFile(key);
      }
    }
    await Brand.deleteOne({ _id: id, tenantId });
    return true;
  }
}

export const brandService = new BrandService();
