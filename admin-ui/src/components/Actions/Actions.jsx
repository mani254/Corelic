import React, { useState, useRef, useEffect, useCallback } from "react";
import { FiMoreVertical } from "react-icons/fi";

function Actions({ children }) {
	const [showOptions, setShowOptions] = useState(false);
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

	const handleOptions = useCallback(() => {
		setShowOptions(!showOptions);
	}, [showOptions]);

	return (
		<div className="" ref={dropdownRef}>
			<button className="p-2 rounded-full bg-main-2 border border-main-4 border-opacity-40" onClick={handleOptions}>
				<FiMoreVertical size={14} />
			</button>
			{showOptions && <div className="absolute  right-[15%] mt-2 bg-main border-main-2 rounded-lg shadow-lg z-10">{children}</div>}
		</div>
	);
}

export default Actions;
