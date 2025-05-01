import BrandFilters from "@/components/Brand/BrandFilters"
import { Button } from "@/components/ui/button"

const BrandsPage = () => {
  return (
    <>
      <div className="mt-1 py-2 flex items-center justify-between border-b border-gray-300">
        <h5 className="">Brands</h5>
        <div className="flex gap-3">
          <Button variant="ghost">Import</Button>
          <Button variant="ghost" className="font-light">Export</Button>
          <Button>Add Brand</Button>
        </div>
      </div>

      <BrandFilters />
    </>
  )
}

export default BrandsPage
