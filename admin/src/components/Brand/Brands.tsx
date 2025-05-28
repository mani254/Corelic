import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchBrands } from "@/redux/brand/BrandActions";
import { BrandQueryParams } from "@/redux/brand/BrandTypes";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import BrandFilters from "./BrandFilters";
import BrandRow from "./BrandRow";
import BrandSkeleton from "./BrandSkeleton";
import BulkUploadComponent from "../ReusableComponents/BulkUploadComponent";

const Brands = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { brands, fetchLoading } = useSelector((state: RootState) => state.brand);

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState<boolean>(false);
  const [totalItems, setTotalItems] = useState<number>(0);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams.get("page")) return;

    async function fetchBrandsData() {
      const params: BrandQueryParams = {
        search: searchParams.get("search") || undefined,
        sortBy: searchParams.get("sortBy") || undefined,
        orderBy: searchParams.get("orderBy") || undefined,
        status: searchParams.get("status") as "active" | "inactive" || undefined,
        page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
        limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
      };

      try {
        const data = await dispatch(fetchBrands(params))
        setTotalItems(data.totalItems);
        setSelectedBrands([]);
      } catch (err) {
        console.error("Error fetching brands:", err);
      }
    }

    fetchBrandsData();
  }, [searchParams, dispatch]);

  useEffect(() => {
    setAllSelected(
      brands.length > 0 &&
      selectedBrands.length === brands.length &&
      brands.every((b) => selectedBrands.includes(b._id))
    );
  }, [brands, selectedBrands]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedBrands(checked ? brands.map((b) => b._id) : []);
    },
    [brands]
  );

  const handleCheckboxChange = useCallback((id: string) => {
    setSelectedBrands((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  return (
    <div>
      <div className="mt-1 py-2 flex items-center justify-between border-b border-gray-300">
        <h5>Brands</h5>
        <div className="flex gap-3">
          <BulkUploadComponent />
          <Button variant="ghost" className="font-light">
            Export
          </Button>
          <Button>Add Brand</Button>
        </div>
      </div>

      <BrandFilters totalItems={totalItems} />

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
            {fetchLoading ? (
              <BrandSkeleton />
            ) : brands.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-14 w-14 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 4a1 1 0 011-1h5l1 2h6l1-2h5a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"
                      />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-700">No brands found</h3>
                    <p className="text-sm text-gray-500">Try adjusting your filters or adding a new brand.</p>
                  </div>
                </td>
              </tr>
            ) : (
              brands.map((brand) => (
                <BrandRow
                  key={brand._id}
                  brand={brand}
                  isSelected={selectedBrands.includes(brand._id)}
                  onCheckboxChange={handleCheckboxChange}
                  mutlipleSelect={selectedBrands.length > 0}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Brands;