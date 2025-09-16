// utils/r2/bulkDelete.ts
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { r2, BUCKET } from "./client";

export async function bulkDeleteFiles(keys: string[]) {
  if (!keys.length) return { deleted: [] };
  await r2.send(
    new DeleteObjectsCommand({
      Bucket: BUCKET,
      Delete: { Objects: keys.map((Key) => ({ Key })), Quiet: true },
    })
  );
  return { deleted: keys };
}
