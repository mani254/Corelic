export type ColumnConfig = {
  columnName: string;
  dataType: "string" | "number" | "boolean" | "date" | "object" | "array";
  mappedTo: string | null;
};

export type RowError = {
  rowIndex: number;
  errors: Array<{ column: string; error: string }>;
};

export const brandColumnsConfig: ColumnConfig[] = [
  {
    columnName: "title",
    dataType: "string",
    mappedTo: null,
  },
  {
    columnName: "status",
    dataType: "string",
    mappedTo: null,
  },
  {
    columnName: "image",
    dataType: "string",
    mappedTo: null,
  },
  {
    columnName: "description",
    dataType: "string",
    mappedTo: null,
  },
  {
    columnName: "metaTitle",
    dataType: "string",
    mappedTo: null,
  },
  {
    columnName: "metaDescription",
    dataType: "string",
    mappedTo: null,
  },
];
