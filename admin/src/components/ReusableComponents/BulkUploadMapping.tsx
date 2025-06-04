import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { showNotification } from "@/redux/notification/notificationActions";
import { AppDispatch } from "@/redux/store";
import BulkUploader from "@/utils/bulkUploadClass";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ColumnConfig, RowError } from "../Brand/BrandBulkUploadData";

type BulkUploadMappingProps = {
  bulkUploader: BulkUploader | null;
  setShowMapping: (value: boolean) => void;
  addRequiredCols: string[];
  updateRequiredCols: string[];
  handleBulkUpload: (params: {
    uploadType: "add" | "update",
    uniqueField: string,
    data: unknown[]
  }) => Promise<void>;
  setDialogOpen: (args: boolean) => void

};

const BulkUploadMapping = ({
  bulkUploader,
  setShowMapping,
  addRequiredCols,
  updateRequiredCols,
  handleBulkUpload,
  setDialogOpen,
}: BulkUploadMappingProps) => {

  const dispatch = useDispatch<AppDispatch>();

  const [openSelectForColumn, setOpenSelectForColumn] = useState<string | null>(null);
  const [mappedColumns, setMappedColumns] = useState<ColumnConfig[]>([]);
  const [extractedHeaders, setExtractedHeaders] = useState<string[]>([]);
  const [uploadMode, setUploadMode] = useState<'add' | 'update'>("add");
  const [errors, setErrors] = useState<RowError[]>([]);
  const [requiredColumns, setRequiredColumns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);


  useEffect(() => {
    if (!bulkUploader) return;

    try {
      bulkUploader.validateFile();
      const headers = bulkUploader.extractHeadersFromFile();
      setExtractedHeaders(headers);
      const initialMapping = bulkUploader.autoMapColumns();
      setMappedColumns(initialMapping);
    } catch (error) {
      dispatch(showNotification({
        message: 'Error while bulk uploading',
        subMessage: error instanceof Error ? error.message : 'Unknown error occurred',
        type: "error",
      }))
    }
  }, [bulkUploader, dispatch]);

  const handleColumnMap = (columnName: string, selectedHeader: string | null) => {
    if (!bulkUploader) return;
    try {
      if (selectedHeader === 'null') selectedHeader = null;

      bulkUploader.manualMapColumn(columnName, selectedHeader);
      const updatedMapping = bulkUploader.getMappedConfig();
      setMappedColumns([...updatedMapping]);

    } catch (error) {
      dispatch(showNotification({
        message: 'Error while bulk uploading',
        subMessage: error instanceof Error ? error.message : 'Unknown error occurred',
        type: "error",
      }))
    }
    setErrors([]);
  };

  const getAvailableHeaders = (currentColumn: ColumnConfig) => {
    return extractedHeaders.filter(header => {
      if (header === currentColumn.mappedTo) return true;
      return !mappedColumns.some(col => col.mappedTo === header);
    });
  };

  const handleUploadModeChange = (value: string) => {
    if (value) {
      setUploadMode(value as 'add' | 'update');
      if (value === 'add') {
        setRequiredColumns(addRequiredCols);
      } else {
        setRequiredColumns(updateRequiredCols);
      }
    }
    setErrors([]);
  };

  const options = [
    {
      value: "add",
      title: "Add New And update Existing",
      description: "Adds new records and updates existing records",
    },
    {
      value: "update",
      title: "Only update existing",
      description: "Updates records that already exist in the database",
    },
  ];

  const handleUpload = async () => {
    if (bulkUploader) {
      setIsLoading(true)
      try {
        bulkUploader.validateRequiredMappings(requiredColumns)
        const data = bulkUploader.parseAndValidateRows();
        setErrors(bulkUploader.getErrors());
        if (errors.length > 0) return
        await handleBulkUpload({
          uploadType: uploadMode,
          uniqueField: requiredColumns[0] || "title",
          data: data,
        })
        setShowMapping(false)
        setDialogOpen(false)
        setIsLoading(false)
      } catch (error) {
        // setShowMapping(false)
        dispatch(showNotification({
          message: 'Error while bulk uploading',
          subMessage: error instanceof Error ? error.message : 'Unknown error occurred',
          type: "error",
        }))
        setIsLoading(false)
      }
    }
  };

  // ✅ Move return INSIDE the component
  return (
    <DialogContent className="sm:max-w-[750px]">
      <DialogHeader>
        <DialogTitle className="text-md flex items-center gap-2">
          Map Your Columns
        </DialogTitle>
        <DialogDescription className="text-base">
          Match your file columns with the required fields
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-2">
          {mappedColumns.map((column) => (
            <div key={column.columnName} className="flex items-center justify-between gap-4 p-2">
              <div>
                <p className="font-medium capitalize">{column.columnName}</p>
              </div>

              <Select
                value={column.mappedTo === null ? "null" : column.mappedTo}
                open={openSelectForColumn === column.columnName}
                onOpenChange={(isOpen) => {
                  setOpenSelectForColumn(isOpen ? column.columnName : null);
                }}
                onValueChange={(value) => handleColumnMap(column.columnName, value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"null"}>None</SelectItem>
                  {getAvailableHeaders(column).map((header) => (
                    <SelectItem key={header} value={header}>
                      {header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>

      <DialogFooter className="w-full">
        <div className="w-full">
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleUploadModeChange(option.value)}
                className={cn(
                  "cursor-pointer rounded-md border p-4 transition-colors hover:bg-gray-50",
                  uploadMode === option.value
                    ? "border-orange-500 hover:bg-orange-50 bg-orange-50"
                    : "border-gray-300"
                )}
              >
                <h3 className="text-sm font-semibold">{option.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => setShowMapping(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={errors.length > 0 || isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </span>
              ) : (
                "Upload Data"
              )}
            </Button>
          </div>
        </div>
      </DialogFooter>

      {errors.length > 0 && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-3xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-red-600">Validation Errors Detected</h2>

            <p className="text-sm text-gray-600">
              Your uploaded file has one or more errors. Please fix the issues or upload a corrected file.
            </p>

            <div className="max-h-[300px] overflow-auto border rounded-md">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="p-2 border-b border-gray-300">Row</th>
                    <th className="p-2 border-b border-gray-300">Column</th>
                    <th className="p-2 border-b border-gray-300">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {errors.map((rowError) =>
                    rowError.errors.map((colErr, idx) => (
                      <tr key={`${rowError.rowIndex}-${idx}`} className="odd:bg-white even:bg-gray-50">
                        <td className="p-2 border-b border-gray-200 text-center">{rowError.rowIndex + 1}</td>
                        <td className="p-2 border-b border-gray-200">{colErr.column}</td>
                        <td className="p-2 border-b border-gray-200 text-red-600">{colErr.error}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-red-500 font-medium">
                Invalid file or mapping. Please upload a corrected file.
              </p>
              <Button
                variant="default"
                onClick={() => setErrors([])}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Go to Mapping
              </Button>
            </div>
          </div>
        </div>
      )}

    </DialogContent>
  );
};

export default BulkUploadMapping;

