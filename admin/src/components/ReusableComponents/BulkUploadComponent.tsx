import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { showNotification } from "@/redux/notification/notificationActions";
import { AppDispatch } from "@/redux/store";
import BulkUploader from "@/utils/bulkUploadClass";
import { UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { brandColumnsConfig } from "../Brand/BrandBulkUploadData";
import { BulkUploadFileModal } from "./BulkUploadFileModal";
import BulkUploadMapping from "./BulkUploadMapping";

function BulkUploadComponent({ addRequiredCols, updateRequiredCols, handleBulkUpload }: {
  addRequiredCols: string[],
  updateRequiredCols: string[],
  handleBulkUpload: (params: {
    uploadType: "add" | "update",
    uniqueField: string,
    data: unknown[]
  }) => Promise<void>;
}) {

  const dispatch = useDispatch<AppDispatch>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bulkUploader, setBulkUploader] = useState<BulkUploader | null>(null);
  const [showMapping, setShowMapping] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedFile) return;

    const setupUploader = async () => {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploader = new BulkUploader({
        file: {
          originalname: selectedFile.name,
          mimetype: selectedFile.type,
          buffer: buffer,
          size: selectedFile.size,
        },
        columnsConfig: brandColumnsConfig,
        requiredColumns: updateRequiredCols,
      });

      setBulkUploader(uploader);
    };

    setupUploader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile]);

  const handleFileChange = (file: File | null) => {
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];

    if (file && allowedTypes.includes(file.type)) {
      setSelectedFile(file);
    } else if (file) {
      dispatch(
        showNotification({
          message: "Invalid File Type",
          subMessage: "Please upload a valid Excel or CSV file.",
          type: "error",
        })
      );
    } else {
      setSelectedFile(null);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <UploadCloud className="h-4 w-4" />
          Import Data
        </Button>
      </DialogTrigger>

      {showMapping ? (
        <BulkUploadMapping
          bulkUploader={bulkUploader}
          setShowMapping={setShowMapping}
          addRequiredCols={addRequiredCols}
          updateRequiredCols={updateRequiredCols}
          handleBulkUpload={handleBulkUpload}
          setDialogOpen={setDialogOpen}
        />
      ) : (
        <BulkUploadFileModal
          selectedFile={selectedFile}
          onFileSelect={handleFileChange}
          onShowMappingChange={setShowMapping}
        />
      )}
    </Dialog>
  );

}

export default BulkUploadComponent;
