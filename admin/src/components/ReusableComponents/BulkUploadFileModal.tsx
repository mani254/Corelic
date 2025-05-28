import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, FileSpreadsheet, UploadCloud } from "lucide-react";
import { useRef } from "react";

interface BulkUploadFileModalProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  onShowMappingChange(value: boolean): void;
}

export function BulkUploadFileModal({
  selectedFile,
  onFileSelect,
  onShowMappingChange
}: BulkUploadFileModalProps) {

  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadSampleSheet = () => {
    console.log("Downloading sample sheet...");
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <DialogContent className="sm:max-w-[750px]">
      <DialogHeader>
        <DialogTitle className="text-xl flex items-center gap-5">
          Import Excel or CSV File
        </DialogTitle>
        <DialogDescription className="text-base">
          Upload your data file to import records into the system.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Upload Section */}
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={downloadSampleSheet}
        >
          <Download className="h-4 w-4" />
          Sample Sheet
        </Button>
        <div
          className="border-dashed border-2 border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-muted/50 transition group"
          onClick={triggerFileUpload}
        >
          <div className="rounded-full bg-muted p-4 mb-4 group-hover:bg-background transition-colors">
            <UploadCloud className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">Click to upload or drag & drop</p>
          <p className="text-xs text-muted-foreground mt-2">Accepted formats: .xlsx, .csv</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileSelect(file);
            }}
          />
        </div>

        {/* Selected File Preview */}
        {selectedFile && (
          <div className="bg-muted rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-background p-2">
                <FileSpreadsheet className="w-4 h-4 text-green-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => onFileSelect(null)}
            >
              Remove
            </Button>
          </div>
        )}
      </div>

      <DialogFooter className="mt-6">
        <Button variant="outline" type="button">
          Cancel
        </Button>
        <Button
          disabled={!selectedFile}
          type="button"
          className="gap-2"
          onClick={() => onShowMappingChange(true)}
        >
          <UploadCloud className="h-4 w-4" />
          Continue to Mapping
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}