import Brand from "../schema/brandSchema";
import Product from "../schema/productSchema";
import { BrandQueryParams, BrandType } from "../types/brandTypes";

interface BrandFetchResult {
  totalItems: number;
  brands: BrandType[];
}

interface BrandDeleteResult {
  deletedBrands: BrandType[];
  invalidBrands: string[];
}

class BrandService {
  private getMatchState(query: BrandQueryParams): Record<string, any> {
    const { search } = query;
    let matchStage: Record<string, any> = {};

    if (search && search.trim() !== "") {
      matchStage.title = { $regex: search, $options: "i" };
    }

    return matchStage;
  }

  async fetchBrands(query: BrandQueryParams): Promise<BrandFetchResult> {
    try {
      const {
        sortBy = "createdAt",
        sortOrder = "desc",
        page,
        limit,
        fetchFields,
      } = query;

      const skip = page && limit ? (Number(page) - 1) * Number(limit) : 0;
      const matchStage = this.getMatchState(query);

      // Build dynamic stages
      const brandStages: any[] = [
        { $sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 } },
        { $skip: skip },
      ];

      if (limit) {
        brandStages.push({ $limit: Number(limit) });
      }

      // Add $project only if fetchFields is provided
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
      return result || { totalItems: 0, brands: [] };
    } catch (error: any) {
      console.error("Error while fetching brands:", error);
      throw new Error(error.message);
    }
  }

  async addBrand(brandData: Partial<BrandType>): Promise<BrandType> {
    try {
      const newBrand = await Brand.create(brandData);
      return newBrand;
    } catch (error: any) {
      console.error("Error while adding brand:", error);
      if (error.code === 11000 && error.keyValue) {
        const fields = Object.entries(error.keyValue)
          .map(([key, value]) => `${key} '${value}'`)
          .join(", ");
        const message = `Brand with ${fields} already exists.`;
        throw new Error(message);
      }
      throw new Error(error.message);
    }
  }

  async updateBrand(brandData: BrandType): Promise<BrandType | null> {

    try {
      const updatedBrand = await Brand.findByIdAndUpdate(
        brandData._id ,
        { $set: { ...brandData } },
        { new: true }
      );

      return updatedBrand as BrandType;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async checkBrandById(id: string): Promise<BrandType | null> {
    try {
      return await Brand.findById(id);
    } catch (error: any) {
      console.error("Error checking brand by ID:", error);
      throw new Error(error.message);
    }
  }

  async checkBrandByTitle(title:string): Promise<BrandType | null>{
    try{
      return await Brand.findOne({title})
    }catch(error:any){
      console.error("Error checkling brand by Title:",error)
      throw new Error(error.message)
    }
  }

async checkForTitleDuplication(title: string, id: string): Promise<BrandType | null> {
  try {
    return await Brand.findOne({
      title,
      _id: { $ne: id }, 
    });
  } catch (error: any) {
    console.error("Error checking brand by title and id:", error);
    throw new Error(error.message);
  }
}

  async checkMultipleBrandsById(ids: string[]): Promise<BrandType[]> {
    try {
      return await Brand.find({ _id: { $in: ids } });
    } catch (error: any) {
      console.error("Error checking multiple brand IDs:", error);
      throw new Error(error.message);
    }
  }

  async makeVendorNull(ids: string[]): Promise<any> {
    try {
      const result = await Product.updateMany(
        { vendor: { $in: ids } },
        { $set: { vendor: null } }
      );
      return result;
    } catch (error: any) {
      console.error("Error updating vendors to null:", error);
      throw new Error(error.message);
    }
  }

  async deleteBrandById(id: string): Promise<BrandType | null> {
    try {
      this.makeVendorNull([id]);
      let brand = await Brand.findByIdAndDelete(id);
      return brand as BrandType;
    } catch (error: any) {
      console.error("Error deleting brand:", error);
      throw new Error(error.message);
    }
  }

  async deleteMultipleBrandsById(ids: string[]): Promise<BrandDeleteResult> {
    try {
      const validBrands = await this.checkMultipleBrandsById(ids);
      const validBrandIds = validBrands.map((brand) => brand._id.toString());
      const invalidBrandIds = ids.filter((id) => !validBrandIds.includes(id));

      await this.makeVendorNull(validBrandIds);

      if (validBrandIds.length > 0) {
        await Brand.deleteMany({ _id: { $in: validBrandIds } });
      }

      return { deletedBrands: validBrands, invalidBrands: invalidBrandIds };
    } catch (error: any) {
      console.error("Error deleting multiple brands:", error);
      throw new Error(error.message);
    }
  }
}

export default new BrandService();
