import React, { useState } from "react";
import { FiEdit, FiTrash, FiEye, FiDownload, FiChevronRight } from "react-icons/fi";

function OrderActions({ multiSelect = false }) {
	const [showStatusMenu, setShowStatusMenu] = useState(false);

	return (
		<ul className="p-2">
			<li className="text-xs flex items-center gap-2 px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onClick={() => console.log("Edit Order Clicked")}>
				<FiEdit size={18} />
				<span>{multiSelect ? "Bulk Edit" : "Edit"}</span>
			</li>
			<li className="text-xs flex items-center gap-2 px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onClick={() => console.log("Delete Order Clicked")}>
				<FiTrash size={18} />
				<span>Delete</span>
			</li>
			{!multiSelect && (
				<li className="text-xs flex items-center gap-2 px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onClick={() => console.log("View Order Clicked")}>
					<FiEye size={18} />
					<span>View Order</span>
				</li>
			)}
			<li className="text-xs relative flex items-center gap-2 px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onMouseEnter={() => setShowStatusMenu(true)} onMouseLeave={() => setShowStatusMenu(false)}>
				<FiChevronRight size={18} className="ml-auto" />
				<span>Change Status</span>
				{/* Status Submenu */}
				{showStatusMenu && (
					<ul className="p-2 list-none absolute top-0 left-full ml-2 bg-main border border-main-2 rounded-lg shadow-lg z-20">
						<li className="text-xs px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onClick={() => console.log("Pending Selected")}>
							Pending
						</li>
						<li className="text-xs px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onClick={() => console.log("Processing Selected")}>
							Processing
						</li>
						<li className="text-xs px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onClick={() => console.log("Shipped Selected")}>
							Shipped
						</li>
						<li className="text-xs px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onClick={() => console.log("Completed Selected")}>
							Completed
						</li>
						<li className="text-xs px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onClick={() => console.log("Cancelled Selected")}>
							Cancelled
						</li>
					</ul>
				)}
			</li>

			<li className="text-xs flex items-center gap-2 px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onClick={() => console.log("Export Clicked")}>
				<FiDownload size={18} />
				<span>{multiSelect ? "Export to CSV" : "Export PDF"}</span>
			</li>
		</ul>
	);
}

export default OrderActions;
