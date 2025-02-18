import React from "react";

const SkeletonDescription = () => {
	return (
		<div className="min-h-[350px] border border-gray-300 rounded-lg p-4 animate-pulse">
			<div className="flex space-x-3 mb-3">
				<div className="h-5 w-5 bg-gray-300 rounded"></div>
				<div className="h-5 w-5 bg-gray-300 rounded"></div>
				<div className="h-5 w-5 bg-gray-300 rounded"></div>
				<div className="h-5 w-5 bg-gray-300 rounded"></div>
				<div className="h-5 w-5 bg-gray-300 rounded"></div>
				<div className="h-5 w-5 bg-gray-300 rounded"></div>
			</div>
			<div className="h-[250px] bg-gray-300 rounded-md"></div>
		</div>
	);
};

export default SkeletonDescription;
