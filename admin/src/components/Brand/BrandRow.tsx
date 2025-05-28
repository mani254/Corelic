import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { deleteBrand, updateBrandStatus } from "@/redux/brand/BrandActions";
import { BrandType } from "@/redux/brand/BrandTypes";
import { AppDispatch } from "@/redux/store";
import { Ellipsis } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useDispatch } from "react-redux";
import imagePlaceholder from "../../../src/assets/images/imagePlaceholder.jpg";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import BrandActions from "./BrandActions";
import { BrandDetailsSheet } from "./BrandDetailedSheet";

interface BrandRowProps {
  brand: BrandType;
  isSelected: boolean;
  onCheckboxChange: (id: string) => void;
  mutlipleSelect: boolean;
}

const BrandRow = ({ brand, isSelected, mutlipleSelect, onCheckboxChange }: BrandRowProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);

  const handleClick = (event: React.MouseEvent<HTMLTableRowElement>) => {
    setIsReviewOpen(true);
    event.stopPropagation();
  };

  const handleOnView = (id: string) => {
    if (brand._id === id) {
      setIsReviewOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteBrand(id));
  };

  const handleUpdateSingleStatus = async (id: string, status: "active" | "inactive") => {
    await dispatch(updateBrandStatus(id, status));
  };

  return (
    <>
      <tr
        className="border-t border-gray-200 hover:bg-opacity-50 hover:bg-gray-50 cursor-pointer"
        onClick={handleClick}
      >
        <td className="px-6 py-[6px]" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onCheckboxChange(brand._id)}
          />
        </td>
        <td className="px-6 py-[6px]">
          <div className="relative h-10 w-10 overflow-hidden rounded-lg">
            <Image
              width={100}
              height={100}
              src={brand?.image?.url || imagePlaceholder}
              alt={brand?.image?.alt || ""}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </td>
        <td className="px-6 py-[6px] w-1/3">{brand.title}</td>
        <td className="px-6 py-[6px]">
          <Badge
            variant={
              brand.status === "active"
                ? "success"
                : brand.status === "inactive"
                  ? "destructive"
                  : "warning"
            }
            className="capitalize text-[13px]"
          >
            {brand.status}
          </Badge>
        </td>
        <td className="px-6 py-[6px]">
          {mutlipleSelect ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="p-2 bg-slate-100 rounded-full w-[35px] cursor-pointer"
            >
              <Ellipsis size={18} />
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 bg-slate-100 rounded-full w-[35px] cursor-pointer"
                >
                  <Ellipsis size={18} />
                </div>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0"
                side="left"
                sideOffset={10}
                align="start"
                alignOffset={10}
              >
                <BrandActions
                  id={brand._id}
                  onView={handleOnView}
                  onDelete={handleDelete}
                  onStatusChange={handleUpdateSingleStatus}
                />
              </PopoverContent>
            </Popover>
          )}
        </td>
      </tr>

      <BrandDetailsSheet
        isOpen={isReviewOpen}
        brand={brand}
        onOpenChange={setIsReviewOpen}
      />
    </>
  );
};

export default BrandRow;
