import path from "path";
import * as xlsx from "xlsx";

// Represents each column config in mapping UI
import { ColumnConfig, RowError } from "@/components/Brand/BrandBulkUploadData";

// Represents the structure of the uploaded file (e.g., from multer)
type UploadedFile = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

class BulkUploader {
  private file: UploadedFile;
  private columnsConfig: ColumnConfig[];
  private requiredColumns: string[];
  private fileInfo: {
    name: string;
    extension: string;
    sizeInKB: string;
    originalname: string;
  };
  private supportedMimeTypes: string[];
  private supportedExtensions: string[];
  private extractedHeaders: string[];
  private rawData: string[][];
  private parsedData: Record<string, unknown>[];
  private errors: RowError[];

  constructor({
    file,
    columnsConfig,
    requiredColumns,
  }: {
    file: UploadedFile;
    columnsConfig?: ColumnConfig[];
    requiredColumns?: string[];
  }) {
    if (!file) throw new Error("File is required.");
    if (!Array.isArray(columnsConfig))
      throw new Error("columnsConfig must be an array.");
    if (!Array.isArray(requiredColumns))
      throw new Error("requiredColumns must be an array.");

    this.file = file;

    this.columnsConfig = columnsConfig.map((col) => ({
      ...col,
      mappedTo: null,
    }));

    this.requiredColumns = requiredColumns;

    this.fileInfo = {
      name: file.originalname,
      extension: path.extname(file.originalname).toLowerCase(),
      sizeInKB: (file.size / 1024).toFixed(2),
      originalname: file.originalname,
    };

    this.supportedMimeTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    this.supportedExtensions = [".csv", ".xls", ".xlsx"];
    this.extractedHeaders = [];
    this.rawData = [];
    this.parsedData = [];
    this.errors = [];
  }

  validateFile(): boolean {
    const { mimetype, originalname, size } = this.file;
    const ext = path.extname(originalname).toLowerCase();

    if (
      !this.supportedMimeTypes.includes(mimetype) ||
      !this.supportedExtensions.includes(ext)
    ) {
      throw new Error(
        "Unsupported file type. Only CSV or Excel files are allowed."
      );
    }

    if (size === 0) {
      throw new Error("Uploaded file is empty.");
    }

    return true;
  }

  extractHeadersFromFile(): string[] {
    const workbook = xlsx.read(this.file.buffer, { type: "buffer" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(firstSheet, { header: 1 });

    const headers = jsonData[0] as string[];
    if (!headers || headers.length === 0) {
      throw new Error("No headers found in the file.");
    }

    this.extractedHeaders = headers.map((h: string) =>
      typeof h === "string" ? h.trim() : h
    );

    this.rawData = jsonData.slice(1) as string[][];
    return this.extractedHeaders;
  }

  normalize(str: string): string {
    return str?.trim().toLowerCase();
  }

  autoMapColumns(): ColumnConfig[] {
    if (this.extractedHeaders.length === 0)
      throw new Error("Extract headers first.");

    this.columnsConfig = this.columnsConfig.map((col) => {
      const match = this.extractedHeaders.find(
        (header) => this.normalize(header) === this.normalize(col.columnName)
      );
      return {
        ...col,
        mappedTo: match || null,
      };
    });

    return this.columnsConfig;
  }

  manualMapColumn(columnName: string, selectedHeader: string | null): void {
    const index = this.columnsConfig.findIndex(
      (col) => col.columnName === columnName
    );
    if (index === -1)
      throw new Error(`Column ${columnName} not found in config.`);

    this.columnsConfig[index].mappedTo = selectedHeader;
  }

  validateRequiredMappings(requiredColumns: string[]): void {
    const unmapped = requiredColumns.filter((req) => {
      const col = this.columnsConfig.find((c) => c.columnName === req);
      return !col || !col.mappedTo;
    });

    if (unmapped.length) {
      throw new Error(`Required columns not mapped: ${unmapped.join(", ")}`);
    }
  }

  parseAndValidateRows(): Record<string, unknown>[] {
    const mappedFields = this.columnsConfig.filter((col) => col.mappedTo);
    const parsedRows: Record<string, unknown>[] = [];
    const errors: RowError[] = [];

    for (let i = 0; i < this.rawData.length; i++) {
      const row = this.rawData[i];
      const parsedRow: Record<string, unknown> = {};
      const rowErrors: RowError["errors"] = [];

      mappedFields.forEach((col) => {
        const idx = this.extractedHeaders.indexOf(col.mappedTo!);
        const value = row[idx];

        const validated = this.validateDataType(value, col.dataType);
        if (!validated.valid) {
          rowErrors.push({ column: col.columnName, error: validated.message! });
        }

        parsedRow[col.columnName] = validated.value;
      });

      if (rowErrors.length) {
        errors.push({ rowIndex: i + 2, errors: rowErrors }); // Excel is 1-based + header row
      }

      parsedRows.push(parsedRow);
    }

    this.parsedData = parsedRows;
    this.errors = errors;

    return this.parsedData;
  }

  validateDataType(
    value: string,
    type: ColumnConfig["dataType"]
  ): { valid: boolean; value: unknown; message?: string } {
    if (value === undefined || value === null || value === "") {
      return { valid: true, value: null };
    }

    switch (type) {
      case "string":
        return { valid: true, value: String(value).trim() };

      case "number":
        const num = parseFloat(String(value));
        if (isNaN(num))
          return { valid: false, message: "Invalid number", value: null };
        return { valid: true, value: num };

      case "boolean":
        if (
          [
            "true",
            "false",
            "1",
            "0",
            "True",
            "False",
            "TRUE",
            "FALSE",
          ].includes(String(value)) ||
          typeof value === "boolean"
        ) {
          return {
            valid: true,
            value:
              String(value).toLowerCase() === "true" || String(value) === "1",
          };
        }
        return { valid: false, message: "Invalid boolean", value: null };

      case "date":
        const d = new Date(String(value));
        if (isNaN(d.getTime()))
          return { valid: false, message: "Invalid date", value: null };
        return { valid: true, value: d };

      case "array":
        try {
          const arr = value
            .split(",")
            .map((item: string) => item.trim())
            .filter((item) => item.length > 0);

          // Optional: Try converting numeric values to numbers
          const parsedArray = arr.map((item) =>
            !isNaN(Number(item)) ? parseFloat(item) : item
          );

          return { valid: true, value: parsedArray };
        } catch {
          return { valid: false, message: "Invalid array string", value: null };
        }

      case "object":
        try {
          const obj = JSON.parse(value.trim());
          if (typeof obj === "object" && obj !== null) {
            return { valid: true, value: obj };
          }
          return {
            valid: false,
            message: "Parsed value is not an object",
            value: null,
          };
        } catch {
          return { valid: false, message: "Invalid object JSON", value: null };
        }

      default:
        return { valid: true, value };
    }
  }

  // ===== Utility Methods =====
  getFileInfo(): typeof this.fileInfo {
    return this.fileInfo;
  }

  getMappedConfig(): ColumnConfig[] {
    return this.columnsConfig;
  }

  getUnmappedColumns(): ColumnConfig[] {
    return this.columnsConfig.filter((col) => !col.mappedTo);
  }

  getErrors(): RowError[] {
    return this.errors;
  }

  getRowCount(): number {
    return this.rawData.length;
  }

  getInvalidRowCount(): number {
    return this.errors.length;
  }

  isFullyMapped(): boolean {
    return this.columnsConfig.every((col) => col.mappedTo !== null);
  }
}

export default BulkUploader;
