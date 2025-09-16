// utils/r2/deleteFile.ts
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { BUCKET, r2 } from "./client";

export async function deleteFile(key: string) {
  await r2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
  return { deleted: true, key };
}
