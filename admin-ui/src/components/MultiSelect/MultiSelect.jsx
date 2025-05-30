import React, { useCallback } from "react";
import { IoClose } from "react-icons/io5";

const MultiSelect = React.memo(({ array = [], setArray, value = null, className = "" }) => {
	const handleItemDelete = useCallback(
		(index) => {
			setArray((prevArray) => prevArray.filter((_, i) => i !== index));
		},
		[setArray]
	);

	return (
		<div className={`flex flex-wrap gap-2 mb-4 ${className}`}>
			{array.map((item, index) => (
				<div className="flex items-center gap-1 bg-main-2 px-3 rounded-md" key={index}>
					<p className="text-xs">{value ? item[value] : item}</p>
					<IoClose className="cursor-pointer text-opposite hover:text-red-400 transition-colors" onClick={() => handleItemDelete(index)} />
				</div>
			))}
		</div>
	);
});

export default MultiSelect;
