type JsonValue = string | number | boolean | null | Date | JsonObject | JsonArray;
export interface JsonObject { [key: string]: JsonValue; }
type JsonArray = Array<JsonValue>;

interface CsvDownloadOptions {
  filename?: string;
  columns?: string[];
}

export function downloadJsonAsCsv(
  jsonData: JsonObject[],
  options: CsvDownloadOptions = {}
): void {
  if (!Array.isArray(jsonData)) {
    console.error("Input JSON must be an array of objects.");
    return;
  }

  const predefinedColumns = options.columns || [];

  const flattenObject = (obj: JsonObject): Record<string, string> => {
    const flat: Record<string, string> = {};

    for (const key in obj) {
      const value = obj[key];

      if (key === "metaData" && typeof value === "object" && value !== null && !Array.isArray(value)) {
        const meta = value as JsonObject;
        flat["metaTitle"] = typeof meta["title"] === "string" ? meta["title"] : "";
        flat["metaDescription"] = typeof meta["description"] === "string" ? meta["description"] : "";
        continue;
      }

      if (key === "image" && typeof value === "object" && value !== null && !Array.isArray(value)) {
        const img = value as JsonObject;
        flat["image"] = typeof img["url"] === "string" ? img["url"] : "";
        continue;
      }

      if (value instanceof Date) {
        flat[key] = value.toISOString();
      } else if (Array.isArray(value)) {
        flat[key] = value.map(v => String(v)).join(", ");
      } else if (typeof value === "object" && value !== null) {
        flat[key] = JSON.stringify(value);
      } else {
        flat[key] = value !== null && value !== undefined ? String(value) : "";
      }
    }

    return flat;
  };

  const extractAllKeys = (data: JsonObject[]): string[] => {
    const keys = new Set<string>();

    for (const item of data) {
      const flatItem = flattenObject(item);
      Object.keys(flatItem).forEach((key) => keys.add(key));
    }

    return Array.from(keys);
  };

  const allKeys = predefinedColumns.length > 0 ? predefinedColumns : extractAllKeys(jsonData);
  const flatData = jsonData.map(flattenObject);

  const csvRows: string[] = [
    allKeys.join(","), // Header
    ...flatData.map((item) =>
      allKeys
        .map((key) => `"${String(item[key] ?? "").replace(/"/g, '""')}"`)
        .join(",")
    ),
  ];

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = options.filename || "converted.csv";
  a.click();

  URL.revokeObjectURL(url);
}
