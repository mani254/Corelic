import React from "react";
// import "./ConfirmationAlert.css";
import CloseModalBtn from "../Modal/CloseModalBtn";
import { hideModal } from "../../redux/actions/modalActions";
import { connect } from "react-redux";

function ConfirmationAlert({ title, info, confirmFunction, hideModal, id }) {
	return (
		<div className=" bg-white p-6 rounded-lg shadow-lg w-full max-w-xs relative">
			<div className="">
				<p className="text-lg font-medium mb-2">{title}</p>
				<p className="text-xs mb-5">{info}</p>
			</div>
			<div className="flex w-full justify-between">
				<button className="rounded-md bg-primary px-4 py-1 text-white" onClick={() => hideModal()}>
					Cancel
				</button>
				<button
					className="rounded-md bg-gray-400 px-4 py-1 text-white"
					onClick={() => {
						confirmFunction(id);
						hideModal();
					}}>
					Delete
				</button>
			</div>
			<CloseModalBtn className="absolute top-3 right-4" />
		</div>
	);
}

const mapDispatchToProps = (dispatch) => ({
	hideModal: () => dispatch(hideModal()),
});

export default connect(null, mapDispatchToProps)(ConfirmationAlert);
