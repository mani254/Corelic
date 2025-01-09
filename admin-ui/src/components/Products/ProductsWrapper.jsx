import React from "react";
import { Outlet } from "react-router-dom";

function ProductsWrapper() {
	return (
		<div>
			<Outlet />
		</div>
	);
}

export default ProductsWrapper;
