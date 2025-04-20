// utils/bulkUpsertHandler.ts

import { FilterQuery, Model } from "mongoose";
import { BrandInput, BrandType } from "../types/brandTypes";

export interface BulkUpsertResult {
  successList: any[];
  failedList: any[];
}

export const bulkUpsertHandler = async <T extends BrandType>(
  model: Model<T>,
  data: BrandInput[],
  uniqueField: keyof BrandInput
): Promise<BulkUpsertResult> => {
  const successList: any[] = [];
  const failedList: any[] = [];

  for (const entry of data) {
    const uniqueValue = entry[uniqueField];

    if (!uniqueValue) {
      failedList.push(`Missing ${String(uniqueField)} in entry`);
      continue;
    }

    try {
      const filter = { [uniqueField]: uniqueValue } as FilterQuery<T>;
      const existing = await model.findOne(filter);

      if (existing) {
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

        await model.updateOne(filter, { $set: updateObj });
        successList.push(uniqueValue);
      } else {
        await model.create(entry);
        successList.push(uniqueValue);
      }
    } catch (err) {
      console.error(`Error processing ${uniqueValue}:`, err);
      failedList.push(uniqueValue);
    }
  }

  return { successList, failedList };
};

export const normalizeBulkData = (data: BrandInput[]) => {
  return data.map((item) => {
    const normalizedItem = { ...item };

    // 1. Normalize image field
    if (normalizedItem.image && typeof normalizedItem.image === "string") {
      normalizedItem.image = {
        url: normalizedItem.image,
      };
    }

    // 2. Move metaTitle and metaDescription into metaData
    const hasMetaTitle = "metaTitle" in normalizedItem;
    const hasMetaDescription = "metaDescription" in normalizedItem;

    if (hasMetaTitle || hasMetaDescription) {
      normalizedItem.metaData = {
        // ...normalizedItem.metaData, // preserve existing metaData if present
        ...(hasMetaTitle && { metaTitle: normalizedItem.metaTitle! }),
        ...(hasMetaDescription && {
          metaDescription: normalizedItem.metaDescription!,
        }),
      };

      delete normalizedItem.metaTitle;
      delete normalizedItem.metaDescription;
    }

    return normalizedItem;
  });
};
