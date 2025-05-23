import { DeleteAlert } from "@/components/ui/DeleteAlert";
import {
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";

interface BrandActionsProps {
  id: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onStatusChange?: (id: string, status: 'active' | 'inactive') => void;
}

const BrandActions: React.FC<BrandActionsProps> = ({
  id,
  onEdit,
  onDelete,
  onView,
  onStatusChange,
}) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  return (
    <ul className="bg-white rounded-xl shadow-md w-max p-1 text-[14px] z-10 relative text-gray-700" onClick={(e) => { e.stopPropagation() }}>
      <li
        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => onEdit?.(id)}
      >
        <Pencil size={16} />
        <span>Edit</span>
      </li>

      <DeleteAlert
        title="Delete brand?"
        description="Are you sure you want to delete this brand? This action cannot be undone."
        onDelete={() => onDelete?.(id)}
      >
        <li className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer">
          <Trash2 size={16} />
          <span>Delete</span>
        </li>
      </DeleteAlert>

      <li
        className="relative flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
        onMouseEnter={() => setShowStatusMenu(true)}
        onMouseLeave={() => setShowStatusMenu(false)}
      >
        <span>Change Status</span>
        <ChevronRight size={16} className="ml-auto" />

        {showStatusMenu && (
          <ul className="absolute left-full top-0 ml-1 bg-white border rounded shadow-lg p-1 min-w-[120px]">
            <li
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onStatusChange?.(id, "active")}
            >
              Active
            </li>
            <li
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onStatusChange?.(id, "inactive")}
            >
              Inactive
            </li>
          </ul>
        )}
      </li>

      <li
        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => onView?.(id)}
      >
        <Eye size={16} />
        <span>View Details</span>
      </li>
    </ul>
  );
};

export default BrandActions;
