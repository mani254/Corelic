import React from "react";
import { Outlet } from "react-router-dom";

function VariantssWrapper() {
	return (
		<div className="p-6 max-w-6xl mx-auto  rounded-lg overflow-hidden mt-2 bg-main">
			<Outlet />
		</div>
	);
}

export default VariantssWrapper;
