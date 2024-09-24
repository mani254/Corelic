import React, { useEffect, useState } from "react";
import { options } from "../../utils";
import MultiSelect from "../MultiSelect/MultiSelect";

function Options({ state, setState }) {
	const [optionName, setOptionName] = useState("");
	const [defaultOptions, setDefaultOptions] = useState(null);
	const [customOptions, setCustomOptions] = useState(false);

	useEffect(() => {
		function handleDefaultOptions() {
			if (!defaultOptions) return setState([]);
			const value = defaultOptions;
			let array = value.split(",");
			array = array.map((item) => item.trim());
			setState(array);
		}
		handleDefaultOptions();
	}, [defaultOptions]);

	function handleOptionEntry(event) {
		if (event.key == "Enter" && optionName) {
			setState((prev) => [...prev, optionName]);
			setOptionName("");
		}
	}

	return (
		<div className="outer-box">
			<h4 className="mb-2">Options</h4>
			<p className="text-xs">Add Options likes Sizes and Types to the Product</p>
			<div className="flex gap-5">
				<div className="input-wrapper flex items-center gap-2">
					<input
						className="h-1/2"
						id="customOptions"
						type="checkbox"
						name="customOptions"
						checked={customOptions}
						onChange={() => {
							setCustomOptions(!customOptions);
							setState([]);
						}}
					/>
					<label className="mb-0" htmlFor="variants">
						Custom
					</label>
				</div>
			</div>
			{customOptions ? (
				<>
					<MultiSelect array={state} setArray={setState} />
					<div className="input-wrapper">
						<input type="text" placeholder="Option value" name="optionName" value={optionName} onChange={(e) => setOptionName(e.target.value)} onKeyDown={handleOptionEntry}></input>
					</div>
				</>
			) : (
				<>
					<MultiSelect array={state} setArray={setState} />
					<div className="input-wrapper">
						<select
							name="defaultOptions"
							value={defaultOptions}
							onChange={(event) => {
								setDefaultOptions(event.target.value);
							}}>
							<option default={true} value="">
								None
							</option>
							{options.map((item, index) => (
								<option key={index} value={item.sizes}>
									{item.type}
								</option>
							))}
						</select>
					</div>
				</>
			)}
		</div>
	);
}

export default Options;
