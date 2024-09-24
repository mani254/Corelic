import React from "react";
import { IoClose } from "react-icons/io5";

function MultiSelect({ array, setArray, value = null, className = "" }) {
	function handleItemDelete(delIndex) {
		const newArray = array.filter((_, index) => index !== delIndex);
		setArray(newArray);
	}
	return (
		<div className={`flex flex-wrap gap-2 mb-4 ${className}`}>
			{array.length > 0 &&
				array.map((item, index) => (
					<div className="flex items-center gap-1 bg-zinc-200 px-3 rounded-md" key={index}>
						{console.log(value, item)}
						<p>{value ? item[value] : item}</p>
						<IoClose className="cursor-pointer mt-[2]" onClick={() => handleItemDelete(index)} />
					</div>
				))}
		</div>
	);
}

export default MultiSelect;
