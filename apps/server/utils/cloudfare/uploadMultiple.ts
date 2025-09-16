// utils/r2/uploadMultiple.ts
import { uploadSingleFile } from "./uploadSingle";

export async function uploadMultipleFiles(params: {
  tenantId: string;
  files: { buffer: Buffer; originalName: string }[];
  maxSizeMB?: number;
  allowedTypes?: string[];
  makePublic?: boolean;
}) {
  const { files, ...rest } = params;
  return Promise.all(
    files.map((file) =>
      uploadSingleFile({
        ...rest,
        fileBuffer: file.buffer,
        originalName: file.originalName,
      })
    )
  );
}
