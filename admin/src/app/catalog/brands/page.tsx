"use client";

import BrandFilters from "@/components/Brand/BrandFilters";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface BrandType {
  _id: string;
  title: string;
  image: { url: string; alt?: string };
  status: "active" | "inactive";
}

const BrandsPage = () => {
  const [brands] = useState<BrandType[]>([
    { _id: "brand2", title: "Adidas", image: { url: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500", alt: "Adidas Logo" }, status: "inactive" },
    { _id: "brand3", title: "Puma", image: { url: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500", alt: "Puma Logo" }, status: "active" },
    { _id: "brand4", title: "Reebok", image: { url: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500", alt: "Reebok Logo" }, status: "inactive" },
    { _id: "brand5", title: "Under Armour", image: { url: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500", alt: "Under Armour Logo" }, status: "active" },
    { _id: "brand6", title: "New Balance", image: { url: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500", alt: "New Balance Logo" }, status: "active" },
    { _id: "brand7", title: "Asics", image: { url: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500", alt: "Asics Logo" }, status: "inactive" },
    { _id: "brand8", title: "Fila", image: { url: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500", alt: "Fila Logo" }, status: "active" },
    { _id: "brand9", title: "Converse", image: { url: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500", alt: "Converse Logo" }, status: "inactive" },
    { _id: "brand10", title: "Vans", image: { url: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500", alt: "Vans Logo" }, status: "active" },
    { _id: "brand11", title: "Skechers", image: { url: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500", alt: "Skechers Logo" }, status: "inactive" },
    { _id: "brand12", title: "Columbia", image: { url: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500", alt: "Columbia Logo" }, status: "active" },
    { _id: "brand13", title: "Timberland", image: { url: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500", alt: "Timberland Logo" }, status: "active" },
    { _id: "brand14", title: "The North Face", image: { url: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500", alt: "The North Face Logo" }, status: "inactive" },
    { _id: "brand15", title: "Lacoste", image: { url: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500", alt: "Lacoste Logo" }, status: "active" },
    { _id: "brand16", title: "Champion", image: { url: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500", alt: "Champion Logo" }, status: "inactive" },
    { _id: "brand17", title: "Jordan", image: { url: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500", alt: "Jordan Logo" }, status: "active" },
    { _id: "brand18", title: "Balenciaga", image: { url: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500", alt: "Balenciaga Logo" }, status: "inactive" },
    { _id: "brand19", title: "Gucci", image: { url: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500", alt: "Gucci Logo" }, status: "active" },
    { _id: "brand20", title: "Prada", image: { url: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500", alt: "Prada Logo" }, status: "inactive" },
  ]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState<boolean>(false);


  useEffect(() => {
    setAllSelected(
      brands.length > 0 &&
      selectedBrands.length === brands.length &&
      brands.every((b) => selectedBrands.includes(b._id))
    );
  }, [brands, selectedBrands]);


  const handleSelectAll = useCallback((checked: boolean) => {
    setSelectedBrands(checked ? brands.map((b) => b._id) : []);
  }, [brands]);


  const handleCheckboxChange = useCallback((id: string) => {
    setSelectedBrands((prev) => {
      const exists = prev.includes(id);
      return exists ? prev.filter((existingId) => existingId !== id) : [...prev, id];
    });
  }, []);

  return (
    <div>
      <div className="mt-1 py-2 flex items-center justify-between border-b border-gray-300">
        <h5>Brands</h5>
        <div className="flex gap-3">
          <Button variant="ghost">Import</Button>
          <Button variant="ghost" className="font-light">
            Export
          </Button>
          <Button>Add Brand</Button>
        </div>
      </div>

      <BrandFilters />

      <div className="pb-[120px]">
        <table className="w-full border-collapse rounded-md mt-3 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-2 text-left font-semibold w-10">
                <Checkbox onCheckedChange={handleSelectAll} checked={allSelected} />
              </th>
              <th className="px-6 py-3 text-left font-semibold">Image</th>
              <th className="px-6 py-3 text-left font-semibold">Title</th>
              <th className="px-6 py-3 text-left font-semibold">Status</th>
              <th className="px-6 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <BrandRow
                key={brand._id}
                brand={brand}
                isSelected={selectedBrands.includes(brand._id)}
                onCheckboxChange={handleCheckboxChange}
                selectedBrands={selectedBrands}
              />
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

// Optimized BrandRow component with React.memo for performance
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
        <Image width={100} height={100} src={brand.image.url} alt={brand.image.alt || ""} className="w-full h-full object-cover object-center"></Image>
      </div>
    </td>
    <td className="px-6 py-[6px] w-1/3">{brand.title}</td>
    <td className="px-6 py-[6px]">
      <span
        className={`inline-block px-3 py-1 rounded-full text-[13px] ${brand.status === "active"
          ? "bg-green-100 text-green-800"
          : brand.status === "inactive"
            ? "bg-red-100 text-red-800"
            : "bg-yellow-100 text-yellow-800"
          }`}
      >
        {brand.status}
      </span>
    </td>
    <td className="px-6 py-[6px]">
      actions
    </td>
  </tr>
);

export default BrandsPage;
