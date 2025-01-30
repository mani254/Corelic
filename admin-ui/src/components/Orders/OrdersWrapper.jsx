import React from "react";
import { Outlet } from "react-router-dom";

function OrdersWrapper() {
	return (
		<div className="p-6 max-w-6xl m-auto rounded-lg overflow-hidden mt-2 bg-main">
			<Outlet />
		</div>
	);
}

export default OrdersWrapper;
