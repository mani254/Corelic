import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { IoWarningOutline } from "react-icons/io5";
import { MdOutlineErrorOutline } from "react-icons/md";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { IoClose } from "react-icons/io5";

import { hideNotification } from "../../redux/notification/notificationActions";

function Notification({ notifications, hideNotification }) {
	const [timeouts, setTimeouts] = useState([]);

	useEffect(() => {
		notifications.forEach((notification) => {
			const included = timeouts.some((item) => item.id === notification.id);
			if (!included) {
				const timeoutId = setTimeout(() => {
					hideNotification(notification.id);
					setTimeouts((prev) => {
						let newTimeOuts = prev.filter((item) => item.id !== notification.id);
						return newTimeOuts;
					});
				}, 3500);
				setTimeouts((prev) => [...prev, { id: notification.id, timeoutId: timeoutId }]);
			}
		});
	}, [notifications]);

	const handleHide = (id) => {
		hideNotification(id);
	};

	const getIcon = (type) => {
		switch (type) {
			case "success":
				return <AiOutlineCheckCircle />;
			case "warning":
				return <IoWarningOutline />;
			case "error":
				return <MdOutlineErrorOutline className="w-5 h-5" />;
			default:
				return null;
		}
	};

	const getColor = (type) => {
		switch (type) {
			case "success":
				return "bg-success";
			case "warning":
				return "bg-warning";
			case "error":
				return "bg-accent";
			default:
				return "bg-secondary";
		}
	};

	return (
		<div className="fixed right-10 top-10 z-20 flex gap-3 flex-col">
			{notifications.map((notification) => (
				<div key={notification.id} className={`relative w-full max-w-sm px-4 py-2 rounded-lg shadow-md flex items-center ${getColor(notification.type)} text-white overflow-hidden`}>
					{/* Icon */}
					<div className="mr-3">{getIcon(notification.type)}</div>

					{/* Message */}
					<div className="flex-grow text-xs">{notification.message}</div>

					{/* Close Button */}
					<span className="cursor-pointer ml-5" onClick={() => handleHide(notification.id)}>
						<IoClose className="w-5 h-5 text-white" />
					</span>

					{/* Progress Bar */}
					<div className="absolute left-0 top-0 h-1 bg-white w-full animate-shrink"></div>
				</div>
			))}
		</div>
	);
}

const mapStateToProps = (state) => ({
	notifications: state.notification.notifications,
});

const mapDispatchToProps = (dispatch) => ({
	hideNotification: (id) => dispatch(hideNotification(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
