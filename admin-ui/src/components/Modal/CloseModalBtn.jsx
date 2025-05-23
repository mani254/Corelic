import React from "react";
import { connect } from "react-redux";
import { hideModal } from "../../redux/actions/modalActions";

function CloseModelBtn({ hideModal, className }) {
	return (
		<div>
			<button className={className} onClick={hideModal}>
				<svg height="20px" viewBox="0 0 384 512">
					<path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path>
				</svg>
			</button>
		</div>
	);
}

const mapDispatchToProps = (dispatch) => {
	return {
		hideModal: () => dispatch(hideModal()),
	};
};

export default connect(null, mapDispatchToProps)(CloseModelBtn);
