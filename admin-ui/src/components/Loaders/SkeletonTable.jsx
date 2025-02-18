import React from "react";

const SkeletonTable = () => {
	return (
		<div className="w-full animate-pulse">
			<table className="w-full border-collapse">
				<thead>
					<tr className="bg-gray-200">
						<th className="p-2">
							<div className="h-4 bg-gray-300 rounded w-6"></div>
						</th>
						<th className="p-2">
							<div className="h-4 bg-gray-300 rounded w-24"></div>
						</th>
						<th className="p-2">
							<div className="h-4 bg-gray-300 rounded w-16"></div>
						</th>
						<th className="p-2">
							<div className="h-4 bg-gray-300 rounded w-16"></div>
						</th>
						<th className="p-2">
							<div className="h-4 bg-gray-300 rounded w-20"></div>
						</th>
						<th className="p-2">
							<div className="h-4 bg-gray-300 rounded w-12"></div>
						</th>
					</tr>
				</thead>
				<tbody>
					{Array.from({ length: 10 }).map((_, index) => (
						<tr key={index} className="border-b border-gray-300">
							<td className="p-2">
								<div className="h-10 w-10 bg-gray-300 rounded-full"></div>
							</td>
							<td className="p-2">
								<div className="h-4 bg-gray-300 rounded w-32"></div>
							</td>
							<td className="p-2">
								<div className="h-4 bg-gray-300 rounded w-16"></div>
							</td>
							<td className="p-2">
								<div className="h-4 bg-gray-300 rounded w-16"></div>
							</td>
							<td className="p-2">
								<div className="h-6 bg-gray-300 rounded w-24"></div>
							</td>
							<td className="p-2">
								<div className="h-4 bg-gray-300 rounded w-8"></div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default SkeletonTable;
