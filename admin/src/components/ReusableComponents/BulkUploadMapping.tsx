import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BulkUploader from "@/utils/bulkUploadClass";
import { useEffect, useState } from "react";
import { ColumnConfig } from "../Brand/BrandBulkUploadData";

type BulkUploadMappingProps = {
  bulkUploader: BulkUploader | null;
  setRequiredColumns: (columns: string[]) => void;
};

const BulkUploadMapping = ({ bulkUploader }: BulkUploadMappingProps) => {
  const [mappedColumns, setMappedColumns] = useState<ColumnConfig[]>([]);
  const [extractedHeaders, setExtractedHeaders] = useState<string[]>([]);
  const [errors] = useState([]);

  useEffect(() => {
    if (!bulkUploader) return;

    try {
      bulkUploader.validateFile();
      const headers = bulkUploader.extractHeadersFromFile();
      setExtractedHeaders(headers);
      const initialMapping = bulkUploader.autoMapColumns();
      setMappedColumns(initialMapping);
    } catch (error) {
      // setErrors(error instanceof Error ? [error.message] : ['An error occurred']);
      console.error(error);
    }
  }, [bulkUploader]);

  const handleColumnMap = (columnName: string, selectedHeader: string | null) => {
    if (!bulkUploader) return;

    try {
      if (selectedHeader === 'null') selectedHeader = null;
      bulkUploader.manualMapColumn(columnName, selectedHeader);
      const updatedMapping = bulkUploader.getMappedConfig();
      console.log(updatedMapping, 'updatedmapping');
      // Create a new array reference to ensure React detects the change
      setMappedColumns([...updatedMapping]);
    } catch (error) {
      console.error(error);
    }
  };

  const getAvailableHeaders = (currentColumn: ColumnConfig) => {
    return extractedHeaders.filter(header => {
      if (header === currentColumn.mappedTo) return true;
      return !mappedColumns.some(col => col.mappedTo === header);
    });
  };

  if (errors.length > 0) {
    return (
      <DialogContent className="sm:max-w-[750px]">
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-[750px]">
      <DialogHeader>
        <DialogTitle className="text-xl flex items-center gap-5">
          Map Your Columns
        </DialogTitle>
        <DialogDescription className="text-base">
          Match your file columns with the required fields
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">File Columns</h3>
        <div className="space-y-2">
          {mappedColumns.map((column) => (
            <div key={column.columnName} className="flex items-center justify-between gap-4 p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">{column.columnName}</p>
                {/* <p className="text-sm text-muted-foreground">{column.description}</p> */}
              </div>



              <Select
                value={column.mappedTo === null ? "null" : column.mappedTo}
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

      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => {
            if (bulkUploader) {
              try {
                bulkUploader.validateRequiredMappings();
                const data = bulkUploader.parseAndValidateRows();
                console.log('Parsed Data:', data);
                const errors = bulkUploader.getErrors();
                if (errors.length > 0) {
                  console.error('Validation Errors:', errors);
                }
              } catch (error) {
                console.error(error)
              }
            }
          }}
        >
          Validate Mapping
        </Button>
        <Button
          disabled={!bulkUploader?.isFullyMapped()}
          onClick={() => {
            if (bulkUploader) {
              try {
                bulkUploader.validateRequiredMappings();
                const data = bulkUploader.parseAndValidateRows();
                console.log('Ready to upload:', data);
              } catch (error) {
                console.error(error)
              }
            }
          }}
        >
          Upload Data
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default BulkUploadMapping;
