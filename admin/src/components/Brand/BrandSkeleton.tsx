
const BrandSkeleton = () => {
  return (
    [...Array(7)].map((_, i) => (
      <tr key={i} className="animate-pulse border-t border-gray-200">
        <td className="px-6 py-3">
          <div className="h-4 w-4 bg-gray-200 rounded" />
        </td>
        <td className="px-6 py-3">
          <div className="h-10 w-10 bg-gray-200 rounded" />
        </td>
        <td className="px-6 py-3">
          <div className="h-4 w-2/3 bg-gray-200 rounded" />
        </td>
        <td className="px-6 py-3">
          <div className="h-4 w-20 bg-gray-200 rounded-full" />
        </td>
        <td className="px-6 py-3">
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </td>
      </tr>
    ))
  )
}

export default BrandSkeleton
