// utils/r2/listFiles.ts
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { BUCKET, r2 } from "./client";

export async function listFilesByTenant(params: {
  tenantId: string;
  maxKeys?: number;
  continuationToken?: string;
}) {
  const { tenantId, maxKeys = 20, continuationToken } = params;
  const res = await r2.send(
    new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: `${tenantId}/`,
      MaxKeys: maxKeys,
      ContinuationToken: continuationToken,
    })
  );

  return {
    files:
      res.Contents?.map((i) => ({
        key: i.Key!,
        size: i.Size,
        lastModified: i.LastModified,
      })) || [],
    nextToken: res.NextContinuationToken || null,
    isTruncated: res.IsTruncated || false,
  };
}
