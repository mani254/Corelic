import React, { useState } from "react";
import { FiEdit, FiTrash, FiEye, FiChevronRight } from "react-icons/fi";

function CollectionActions({ multiSelect = false }) {
	const [showStatusMenu, setShowStatusMenu] = useState(false);
	return (
		<ul className="p-2">
			<li className="text-xs flex items-center gap-2 px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onClick={() => console.log("Edit Clicked")}>
				<FiEdit size={18} />
				<span>{multiSelect ? "Bulk Edit" : "Edit"}</span>
			</li>
			<li className="text-xs flex items-center gap-2 px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onClick={() => console.log("Delete Clicked")}>
				<FiTrash size={18} />
				<span>Delete</span>
			</li>
			<li className="text-xs relative flex items-center gap-2 px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onMouseEnter={() => setShowStatusMenu(true)} onMouseLeave={() => setShowStatusMenu(false)}>
				<FiChevronRight size={18} className="ml-auto" />
				<span>Change Status</span>
				{/* Status Submenu */}
				{showStatusMenu && (
					<ul className="p-2 list-none absolute top-0 left-full ml-2 bg-main border border-main-2 rounded-lg shadow-lg z-20">
						<li className="text-xs px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onClick={() => console.log("Active Selected")}>
							Active
						</li>
						<li className="text-xs px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onClick={() => console.log("Inactive Selected")}>
							Inactive
						</li>
					</ul>
				)}
			</li>
			{/* <li className="text-xs flex items-center gap-2 px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onClick={() => console.log("Export JSON Clicked")}>
                        <FiDownload size={18} />
                        <span>Export JSON</span>
                     </li> */}
			{!multiSelect && (
				<li className="text-xs flex items-center gap-2 px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onClick={() => console.log("View Details Clicked")}>
					<FiEye size={18} />
					<span>View Details</span>
				</li>
			)}
		</ul>
	);
}

export default CollectionActions;
