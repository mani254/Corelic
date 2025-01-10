import React from "react";
import Navbar from "../components/Navbar/Navbar";

import { Outlet } from "react-router-dom";

function BaseLayout() {
	return (
		<div className="flex gap-10">
			<Navbar />
			<div className="w-full">
				<Outlet />
			</div>
		</div>
	);
}

export default BaseLayout;
