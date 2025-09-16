// utils/r2/renameFile.ts
import { CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2, BUCKET } from "./client";

export async function renameFile(oldKey: string, newFileName: string) {
  const tenantId = oldKey.split("/")[0];
  const ext = oldKey.split(".").pop();
  const newKey = `${tenantId}/${newFileName}.${ext}`;

  await r2.send(
    new CopyObjectCommand({
      Bucket: BUCKET,
      CopySource: `${BUCKET}/${oldKey}`,
      Key: newKey,
      ACL: "private",
    })
  );

  await r2.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: oldKey,
    })
  );

  return { oldKey, newKey };
}
