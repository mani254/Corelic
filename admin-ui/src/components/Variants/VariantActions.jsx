import React, { useCallback } from "react";
import { FiEdit, FiTrash, FiEye } from "react-icons/fi";
import { connect } from "react-redux";
import ConfirmationAlert from "../Alerts/ConfirmationAlert";
import { showModal } from "../../redux/actions/modalActions";
import { deleteVariant, deleteMultipleVariants } from "../../redux/actions/variantActions";

function VariantActions({ id = null, selectedVariants, setSelectedVariants, showModal, deleteVariant, deleteMultipleVariants }) {
	const multiSelect = selectedVariants?.length;

	const deleteVariantInfo = {
		title: "Are you sure?",
		info: "If you delete this Variant, it can't be undone.",
		confirmFunction: (id) => {
			deleteVariant(id);
		},
	};

	const deleteVariantsInfo = {
		title: "Are you sure?",
		info: "This action cannot be undone.",
		confirmFunction: (selectedVariants) => {
			deleteMultipleVariants(selectedVariants);
			setSelectedVariants([]);
		},
	};

	const handleDelete = useCallback(
		(id) => {
			if (multiSelect) {
				showModal({ ...deleteVariantsInfo, id: selectedVariants }, ConfirmationAlert);
			} else {
				showModal({ ...deleteVariantInfo, id }, ConfirmationAlert);
			}
		},
		[showModal, selectedVariants, multiSelect]
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
	deleteVariant: (id) => dispatch(deleteVariant(id)),
	deleteMultipleVariants: (selectedVariants) => dispatch(deleteMultipleVariants(selectedVariants)),
});

export default connect(null, mapDispatchToProps)(VariantActions);
