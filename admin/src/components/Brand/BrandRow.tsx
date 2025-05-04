import { BrandType } from "@/redux/brand/BrandTypes";
import Image from "next/image";
import imagePlaceholder from '../../../src/assets/images/imagePlaceholder.jpg';
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";


const BrandRow = ({ brand, isSelected, onCheckboxChange }: {
  brand: BrandType;
  isSelected: boolean;
  onCheckboxChange: (id: string) => void;
  selectedBrands: string[];
}) => (
  <tr className="border-t border-gray-200 hover:bg-opacity-50 hover:bg-gray-50 cursor-pointer">
    <td className="px-6 py-[6px]">
      <Checkbox checked={isSelected} onCheckedChange={() => onCheckboxChange(brand._id)} className="" />
    </td>
    <td className="px-6 py-[6px]">
      <div className="relative h-10 w-10 overflow-hidden rounded-lg">
        <Image width={100} height={100} src={brand?.image?.url || imagePlaceholder} alt={brand?.image?.alt || ""} className="w-full h-full object-cover object-center"></Image>
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
      actions
    </td>
  </tr>
);

export default BrandRow