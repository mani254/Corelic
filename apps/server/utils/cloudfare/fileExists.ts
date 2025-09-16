// utils/r2/fileExists.ts
import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { BUCKET, r2 } from "./client";

export async function fileExists(key: string): Promise<boolean> {
  try {
    await r2.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch (err: any) {
    if (err.name === "NotFound") return false;
    throw err;
  }
}
