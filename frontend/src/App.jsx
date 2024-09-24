import React, { lazy } from "react";
import { connect } from "react-redux";

import BackendLayout from "./layouts/BackendLayout";

import "./App.css";

const Modal = lazy(() => import("./components/Modal/Modal"));

function App({ modal }) {
	return (
		<React.Fragment>
			<div className="bg-zinc-100 min-h-screen">
				<BackendLayout />
			</div>

			{modal.showModal && <Modal props={modal.modalProps} component={modal.modalComponent} />}
		</React.Fragment>
	);
}

const mapStateToProps = (state) => {
	return {
		modal: state.modal,
	};
};

export default connect(mapStateToProps, null)(App);
