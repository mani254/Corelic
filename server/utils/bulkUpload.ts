import mongoose, { FilterQuery, Model } from "mongoose";
import { BrandInput, BrandType } from "../types/brandTypes";

/**
 * Handles bulk upsert operations using Mongoose transactions.
 *
 * @param model - Mongoose model to operate on
 * @param data - Array of brand input data
 * @param uniqueField - Field to uniquely identify records
 * @param uploadType - Either 'add' (insert new) or 'update' (update existing only)
 * @returns Number of successful upserts
 */

export const bulkUpsertHandler = async <T extends BrandType>(
  model: Model<T>,
  data: BrandInput[],
  uniqueField: keyof BrandInput,
  uploadType: "add" | "update"
): Promise<number> => {
  let successCount = 0;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (const entry of data) {
      const uniqueValue = entry[uniqueField];

      if (!uniqueValue) {
        throw new Error(`Missing ${String(uniqueField)} in entry`);
      }

      const filter = { [uniqueField]: uniqueValue } as FilterQuery<T>;
      const existing = await model.findOne(filter).session(session);

      if (existing) {
        // Prepare update object excluding _id, createdAt, updatedAt
        const updateObj: Partial<T> = {};

        for (const key in entry) {
          const typedKey = key as keyof T;
          const value = entry[typedKey as keyof BrandInput];

          if (
            value !== undefined &&
            value !== null &&
            key !== "_id" &&
            key !== "createdAt" &&
            key !== "updatedAt"
          ) {
            updateObj[typedKey] = value;
          }
        }

        await model.updateOne(filter, { $set: updateObj }, { session });

        successCount++;
      } else {
        if (uploadType === "add") {
          await model.create([entry], { session });
          successCount++;
        }
        // else {
        //   throw new Error(`${uniqueValue} not found for update`);
        // }
      }
    }

    await session.commitTransaction();
    session.endSession();
    return successCount;
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction aborted due to error:", err.message);
    throw new Error(err.message);
  }
};

/**
 * Normalizes bulk brand input data by:
 * 1. Converting image strings to object format
 * 2. Grouping metaTitle and metaDescription into a metaData field
 */
export const normalizeBulkData = (data: BrandInput[]): BrandInput[] => {
  return data.map((item) => {
    const normalizedItem: BrandInput = { ...item };

    // 1. Normalize image field
    if (typeof normalizedItem.image === "string") {
      normalizedItem.image = { url: normalizedItem.image };
    }

    // 2. Move metaTitle and metaDescription into metaData
    const { metaTitle, metaDescription, ...rest } = normalizedItem;
    if (metaTitle || metaDescription) {
      normalizedItem.metaData = {
        ...(metaTitle && { metaTitle }),
        ...(metaDescription && { metaDescription }),
      };

      delete normalizedItem.metaTitle;
      delete normalizedItem.metaDescription;
    }

    return normalizedItem;
  });
};
