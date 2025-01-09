import React, { useState, useMemo, useCallback } from "react";
import { CheckboxInput, SelectInput, TextInput } from "../FormComponents/FormComponents";
import MultiSelect from "../MultiSelect/MultiSelect";

const defaultOptions = [
	{ type: "None", sizes: [] },
	{ type: "Clothing", sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"] },
	{ type: "Footwear", sizes: ["8", "9", "10", "11", "12", "13"] },
	{ type: "Ornaments", sizes: ["5", "6", "7", "8", "9", "10", "11"] },
	{ type: "Accessories", sizes: ["One Size"] },
	{ type: "Bags", sizes: ["Small", "Medium", "Large"] },
	{ type: "Hats", sizes: ["S/M", "L/XL"] },
];

function Options({ options, setOptions }) {
	const [customOptions, setCustomOptions] = useState(false);
	const [selectedType, setSelectedType] = useState("None");
	const [singleOption, setSingleOption] = useState("");

	// Memoize options to avoid recalculating on every render
	const selectOptions = useMemo(() => defaultOptions.map((opt) => ({ value: opt.type, label: opt.type })), []);

	// Callback to handle type selection changes
	const handleOptionsChange = useCallback(
		(value) => {
			setSelectedType(value);
			const selectedSizes = defaultOptions.find((opt) => opt.type === value)?.sizes || [];
			setOptions(selectedSizes);
		},
		[setOptions]
	);

	// Callback to handle key press in custom options
	const handleKeyPress = useCallback(
		(e) => {
			if (e.key === "Enter" && singleOption.trim()) {
				setOptions((prev) => [...prev, singleOption.trim()]);
				setSingleOption("");
			}
		},
		[singleOption, setOptions]
	);

	return (
		<div>
			<CheckboxInput label="Custom Options" className="flex items-center gap-2" name="customOptions" checked={customOptions} onChange={(e) => setCustomOptions(e.target.checked)} />

			<div className="mt-4">
				<MultiSelect array={options} setArray={setOptions} />
			</div>

			<div className="mt-4">{customOptions ? <TextInput name="singleOption" id="singleOption" value={singleOption} onChange={(e) => setSingleOption(e.target.value)} onKeyDown={handleKeyPress} /> : <SelectInput options={selectOptions} value={selectedType} onChange={(e) => handleOptionsChange(e.target.value)} />}</div>
		</div>
	);
}

export default Options;
