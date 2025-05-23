import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import * as React from "react";

interface DeleteAlertProps {
  title?: string;
  description: string;
  onDelete: () => void;
  children: React.ReactNode;
}

export function DeleteAlert({
  title = "Delete file?",
  description,
  onDelete,
  children
}: DeleteAlertProps) {
  return (
    <AlertDialog >
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="md:w-[430px] rounded-3xl p-6 gap-4 border-0 shadow-lg">
        <div className="absolute right-4 top-4">
          <AlertDialogCancel className="p-1 h-auto bg-transparent hover:bg-gray-100 border-0 rounded-full">
            <X className="h-4 w-4 text-gray-400" />
          </AlertDialogCancel>
        </div>
        <AlertDialogHeader className="gap-2">
          <AlertDialogTitle className="text-xl font-semibold">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400 text-sm">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row gap-3 sm:gap-3 mt-2">
          <AlertDialogCancel
            className="m-0 bg-gray-100 hover:bg-gray-200 border-0 text-gray-700 rounded-full px-6 py-2 text-sm font-medium"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="m-0 bg-red-400 hover:bg-red-500 text-white rounded-full px-6 py-2 text-sm font-medium"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}