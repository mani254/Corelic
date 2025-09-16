import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl as sign } from "@aws-sdk/s3-request-presigner";
import { BUCKET, r2 } from "./client";

export async function getSignedUrl(key: string, expiresInSeconds = 3600) {
  return await sign(r2, new HeadObjectCommand({ Bucket: BUCKET, Key: key }), {
    expiresIn: expiresInSeconds,
  });
}
