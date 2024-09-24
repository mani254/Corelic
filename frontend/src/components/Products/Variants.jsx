import React, { useState } from "react";
import MultiSelect from "../MultiSelect/MultiSelect";

function Variants({ state, setState }) {
	const [variantName, setVariantName] = useState("");

	function handleVariantEntry(event) {
		if (event.key == "Enter" && variantName) {
			setState((prev) => [...prev, { name: variantName }]);
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
				<input type="text" placeholder="Variant Name" name="variantNaame" value={variantName} onChange={(e) => setVariantName(e.target.value)} onKeyDown={handleVariantEntry}></input>
			</div>
		</div>
	);
}

export default Variants;
