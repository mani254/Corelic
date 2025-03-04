import React, { useState, useCallback, useEffect } from "react";
import { FiEdit, FiTrash, FiEye } from "react-icons/fi";
import { connect } from "react-redux";
import ConfirmationAlert from "../Alerts/ConfirmationAlert";
import { showModal } from "../../redux/actions/modalActions";
import { deleteBrand, deleteMultipleBrands } from "../../redux/actions/brandActions";

function BrandActions({ id = null, selectedBrands, setSelectedBrands, showModal, deleteBrand, deleteMultipleBrands }) {
	const multiSelect = selectedBrands?.length;

	const deleteBrandInfo = {
		title: "Are you sure?",
		info: "If you Delete this Brand, It can't be undone",
		confirmFunction: (id) => {
			deleteBrand(id);
		},
	};

	const deleteBrandsInfo = {
		title: "Are you sure?",
		info: "This action cannot be undone",
		confirmFunction: (selectedBrands) => {
			deleteMultipleBrands(selectedBrands);
			setSelectedBrands([]);
		},
	};

	const handleDelete = useCallback(
		(id) => {
			if (multiSelect) {
				showModal({ ...deleteBrandsInfo, id: selectedBrands }, ConfirmationAlert);
			} else {
				showModal({ ...deleteBrandInfo, id }, ConfirmationAlert);
			}
		},
		[showModal, selectedBrands, multiSelect]
	);

	return (
		<ul className="p-2">
			<li className="text-xs whitespace-nowrap flex items-center gap-2 px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onClick={() => window.alert("Option will be available soon")}>
				<FiEdit size={18} />
				<span>{multiSelect ? "Bulk Edit" : "Edit"}</span>
			</li>
			<li className="text-xs whitespace-nowrap flex items-center gap-2 px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onClick={() => handleDelete(id)}>
				<FiTrash size={18} />
				<span>Delete</span>
			</li>
			{!multiSelect && (
				<li className="text-xs whitespace-nowrap flex items-center gap-2 px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onClick={() => window.alert("Option will be available soon")}>
					<FiEye size={18} />
					<span>View Details</span>
				</li>
			)}
		</ul>
	);
}

const mapDispatchToProps = (dispatch) => ({
	showModal: (props, component) => dispatch(showModal(props, component)),
	deleteBrand: (id) => dispatch(deleteBrand(id)),
	deleteMultipleBrands: (selectedBrands) => dispatch(deleteMultipleBrands(selectedBrands)),
});

export default connect(null, mapDispatchToProps)(BrandActions);
