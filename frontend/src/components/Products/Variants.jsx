import React, { useState, useEffect } from "react";
import MultiSelect from "../MultiSelect/MultiSelect";

function Variants({ state, setState, productOptions }) {
	const [variantName, setVariantName] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		let optionsObject = productOptions.map((option) => {
			return { option };
		});
		if (state.length === 0) {
			setState([{ name: "variant-1", initial: true, options: optionsObject }]);
		}
	}, [state]);

	function handleVariantEntry(event) {
		if (event.key === "Enter" && variantName) {
			//for the intial contdintion default variant change if existed
			if (state.length === 1 && state[0].initial) {
				setState((prev) => [{ ...prev[0], initial: false, name: variantName }]);
				return setVariantName("");
			}
			const existed = state.find((item) => variantName.toLowerCase() === item.name.toLowerCase());

			if (existed) {
				return setError("Already existed");
			}
			let optionsObject = productOptions.map((option) => {
				return { option };
			});
			setState((prev) => [...prev, { name: variantName, options: optionsObject }]);
			setVariantName("");
		}
	}

	return (
		<div className="outer-box">
			<h4 className="mb-2">Variants</h4>
			<p className="text-xs">Select this option to add multiple variants</p>

			{/* <div className="flex gap-10">
				<div className="input-wrapper flex items-center gap-2">
					<input
						className="h-1/2"
						id="variants"
						type="checkbox"
						name="hasVariants"
						checked={hasVariants}
						onChange={() => {
							setHasVariants(!hasVariants);
							setState([]);
						}}
					/>
					<label className="mb-0" htmlFor="variants">
						Variants
					</label>
				</div>
			</div> */}

			<MultiSelect array={state} setArray={setState} value="name" />
			<div className="input-wrapper">
				<input
					type="text"
					placeholder="Variant Name"
					name="variantNaame"
					value={variantName}
					onChange={(e) => {
						setVariantName(e.target.value);
						setError("");
					}}
					onKeyDown={handleVariantEntry}></input>
				{error && <p className="error">{error}</p>}
			</div>
		</div>
	);
}

export default Variants;
