import React, { useState, useCallback } from "react";
import { FiEdit, FiTrash, FiEye, FiChevronRight } from "react-icons/fi";

import { connect } from "react-redux";
import ConfirmationAlert from "../Alerts/ConfirmationAlert";
import { showModal } from "../../redux/actions/modalActions";
import { deleteCollection, deleteMultipleCollections, updateCollectionStatus } from "../../redux/actions/collectionActions";

function CollectionActions({ id = null, selectedCollections, setSelectedCollections, handleOptions, showModal, deleteCollection, deleteMultipleCollections, updateCollectionStatus }) {
	const multiSelect = selectedCollections?.length;

	const [showStatusMenu, setShowStatusMenu] = useState(false);

	const deleteCollectionInfo = {
		title: "Are you sure?",
		info: "If you Delete this Collection, It can't be undone",
		confirmFunction: (id) => {
			deleteCollection(id);
		},
	};

	const deleteCollectionsInfo = {
		title: "Are you sure?",
		info: "This action cannot be undone",
		confirmFunction: (selectedCollections) => {
			deleteMultipleCollections(selectedCollections);
			setSelectedCollections([]);
		},
	};

	const handleDelete = useCallback(
		(id) => {
			if (multiSelect) {
				showModal({ ...deleteCollectionsInfo, id: selectedCollections }, ConfirmationAlert);
			} else {
				showModal({ ...deleteCollectionInfo, id }, ConfirmationAlert);
			}
		},
		[showModal, selectedCollections, multiSelect]
	);

	const handleStatusChange = useCallback(
		(id, status) => {
			if (multiSelect) {
				updateCollectionStatus(selectedCollections, status);
				setSelectedCollections([]);
			} else {
				updateCollectionStatus([id], status);
				handleOptions();
			}
		},
		[updateCollectionStatus, multiSelect]
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
			<li className="text-xs whitespace-nowrap relative flex items-center gap-2 px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onMouseEnter={() => setShowStatusMenu(true)} onMouseLeave={() => setShowStatusMenu(false)}>
				<FiChevronRight size={18} className="ml-auto" />
				<span>Change Status</span>
				{/* Status Submenu */}
				{showStatusMenu && (
					<ul className="p-2 list-none absolute top-0 right-full ml-2 bg-main border border-main-2 rounded-lg shadow-lg z-20">
						<li className="text-xs px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onClick={() => handleStatusChange(id, "active")}>
							Active
						</li>
						<li className="text-xs px-3 py-2 hover:bg-main-2 hover:bg-opacity-80 cursor-pointer" onClick={() => handleStatusChange(id, "inactive")}>
							Inactive
						</li>
					</ul>
				)}
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
	deleteCollection: (id) => dispatch(deleteCollection(id)),
	deleteMultipleCollections: (selectedCollections) => dispatch(deleteMultipleCollections(selectedCollections)),
	updateCollectionStatus: (id, status) => dispatch(updateCollectionStatus(id, status)),
});

export default connect(null, mapDispatchToProps)(CollectionActions);
