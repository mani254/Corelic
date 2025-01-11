import React, { useState, useRef, useEffect } from "react";
import { FiMoreVertical, FiEdit, FiTrash, FiEye, FiDownload, FiChevronRight } from "react-icons/fi";

const ProductActions = () => {
	const [showOptions, setShowOptions] = useState(false);
	const [showStatusMenu, setShowStatusMenu] = useState(false);
	const dropdownRef = useRef(null);

	// Close dropdown if clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setShowOptions(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className="" ref={dropdownRef}>
			<button className="p-2 rounded-full bg-main-2 border border-main-4 border-opacity-40" onClick={() => setShowOptions(!showOptions)}>
				<FiMoreVertical size={16} />
			</button>

			{showOptions && (
				<div className="absolute  right-[15%] mt-2 bg-main border-main-2 rounded-lg shadow-lg z-10">
					<ul className="p-2">
						<li className="text-xs flex items-center gap-2 px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onClick={() => console.log("Edit Clicked")}>
							<FiEdit size={14} />
							<span>Edit</span>
						</li>
						<li className="text-xs flex items-center gap-2 px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onClick={() => console.log("Delete Clicked")}>
							<FiTrash size={14} />
							<span>Delete</span>
						</li>
						<li className="text-xs relative flex items-center gap-2 px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onMouseEnter={() => setShowStatusMenu(true)} onMouseLeave={() => setShowStatusMenu(false)}>
							<span>Change Status</span>
							<FiChevronRight size={14} className="ml-auto" />
							{/* Status Submenu */}
							{showStatusMenu && (
								<ul className="p-2 list-none absolute top-0 left-full ml-2 bg-main border border-main-2 rounded-lg shadow-lg z-20">
									<li className="text-xs px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onClick={() => console.log("Draft Selected")}>
										Draft
									</li>
									<li className="text-xs px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onClick={() => console.log("Active Selected")}>
										Active
									</li>
									<li className="text-xs px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onClick={() => console.log("Inactive Selected")}>
										Inactive
									</li>
								</ul>
							)}
						</li>
						<li className="text-xs flex items-center gap-2 px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onClick={() => console.log("Export JSON Clicked")}>
							<FiDownload size={14} />
							<span>Export JSON</span>
						</li>
						<li className="text-xs flex items-center gap-2 px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onClick={() => console.log("View Details Clicked")}>
							<FiEye size={14} />
							<span>View Details</span>
						</li>
					</ul>
				</div>
			)}
		</div>
	);
};

export default ProductActions;
