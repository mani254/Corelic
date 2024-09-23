import React from "react";

import BackendHeader from "../components/BackendHeader/BackendHeader";
import BackendNavbar from "../components/BackendNavbar/BackendNavbar";

function BackendLayout() {
	return (
		<React.Fragment>
			<div className="fixed w-full top-0 right-0 z-10">
				<BackendHeader />
			</div>
			<div className="flex relative">
				<div className=" w-1/5 max-w-64 sticky top-0 left-0 h-screen border-r border-black border-opacity-15 pt-16 py-2">
					<BackendNavbar />
				</div>
				<div className="w-full overflow-y-auto"></div>
			</div>
		</React.Fragment>
	);
}

export default BackendLayout;
