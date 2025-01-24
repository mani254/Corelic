import React from "react";
import { Outlet } from "react-router-dom";

function OrdersWrapper() {
	return (
		<div className="p-6 max-w-6xl m-auto bg-main rounded-lg overflow-hidden mt-2">
			<Outlet />
		</div>
	);
}

export default OrdersWrapper;
