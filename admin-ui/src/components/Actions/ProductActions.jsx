import React, { useState, useCallback } from "react";
import { FiEdit, FiTrash, FiEye, FiDownload, FiChevronLeft } from "react-icons/fi";

import { connect } from "react-redux";
import ConfirmationAlert from "../Alerts/ConfirmationAlert";
import { showModal } from "../../redux/actions/modalActions";
import { deleteProduct, deleteMultipleProducts } from "../../redux/actions/productActions";

function ProductActions({ multiSelect = false, id = null, selectedProducts, setSelectedProducts, showModal, deleteProduct, deleteMultipleProducts }) {
	const [showStatusMenu, setShowStatusMenu] = useState(false);

	const deleteProductInfo = {
		title: "Are You sure?",
		info: "If you Delete this Product, It can't be undone",
		confirmFunction: (id) => {
			deleteProduct(id);
		},
	};

	const deleteProductsInfo = {
		title: "Are You sure?",
		info: "This action cannot be undone",
		confirmFunction: (selectedProducts) => {
			deleteMultipleProducts(selectedProducts);
			setSelectedProducts([]);
		},
	};

	const handleDelete = useCallback(
		(id) => {
			if (multiSelect) {
				showModal({ ...deleteProductsInfo, id: selectedProducts }, ConfirmationAlert);
			} else {
				showModal({ ...deleteProductInfo, id }, ConfirmationAlert);
			}
		},
		[showModal, selectedProducts, multiSelect]
	);

	return (
		<ul className="p-2">
			<li className="text-xs flex items-center gap-2 px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onClick={() => console.log("Edit Clicked")}>
				<FiEdit size={18} />
				<span>{multiSelect ? " Bulk Edit" : "Edit"}</span>
			</li>
			<li className="text-xs flex items-center gap-2 px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onClick={() => handleDelete(id)}>
				<FiTrash size={18} />
				<span>Delete</span>
			</li>
			<li className="text-xs relative flex items-center gap-2 px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onMouseEnter={() => setShowStatusMenu(true)} onMouseLeave={() => setShowStatusMenu(false)}>
				<FiChevronLeft size={18} className="ml-auto" />
				<span>Change Status</span>
				{/* Status Submenu */}
				{showStatusMenu && (
					<ul className="p-2 list-none absolute top-0 right-full ml-2 bg-main border border-main-2 rounded-lg shadow-lg z-20">
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
				<FiDownload size={18} />
				<span>Export JSON</span>
			</li>
			{!multiSelect && (
				<li className="text-xs flex items-center gap-2 px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onClick={() => console.log("View Details Clicked")}>
					<FiEye size={18} />
					<span>View Details</span>
				</li>
			)}
		</ul>
	);
}

const mapDispatchToProps = (dispatch) => {
	return {
		showModal: (props, component) => dispatch(showModal(props, component)),
		deleteProduct: (id) => dispatch(deleteProduct(id)),
		deleteMultipleProducts: (selectedProducts) => dispatch(deleteMultipleProducts(selectedProducts)),
	};
};

export default connect(null, mapDispatchToProps)(ProductActions);
