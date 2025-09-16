// utils/r2/uploadSingle.ts
import { HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import mime from "mime-types";
import { BUCKET, r2 } from "./client";

export async function uploadSingleFile(params: {
  tenantId: string;
  fileBuffer: Buffer;
  originalName: string;
  maxSizeMB?: number;
  allowedTypes?: string[];
  makePublic?: boolean;
}) {
  const {
    tenantId,
    fileBuffer,
    originalName,
    maxSizeMB = 20,
    allowedTypes,
    makePublic = false,
  } = params;

  const sizeMB = fileBuffer.length / (1024 * 1024);
  if (sizeMB > maxSizeMB) throw new Error(`File too large. Max ${maxSizeMB}MB`);

  const mimeType = mime.lookup(originalName) || "application/octet-stream";
  if (allowedTypes && !allowedTypes.includes(mimeType))
    throw new Error(`Invalid type: ${mimeType}`);

  const ext = mime.extension(mimeType) || "bin";
  const key = `${tenantId}/${randomUUID()}.${ext}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: makePublic ? "public-read" : undefined,
    })
  );

  const url = makePublic
    ? `https://${process.env.R2_PUBLIC_DOMAIN}/${key}`
    : await getSignedUrl(
        r2,
        new HeadObjectCommand({ Bucket: BUCKET, Key: key }),
        { expiresIn: 3600 }
      );

  return { key, url, mimeType, size: fileBuffer.length };
}
