import React, { useState, useEffect, useCallback, useMemo } from "react";
import { CheckboxInput, NumberInput } from "../FormComponents/FormComponents";

function Inventory({ variants, setVariants, options }) {
	const [trackInventory, setTrackInventory] = useState(false);

	// Memoized function to update stock for a variant
	const handleStockChange = useCallback(
		(e, variantIndex) => {
			const { value } = e.target;
			setVariants((prevVariants) => prevVariants.map((variant, i) => (i === variantIndex ? { ...variant, stock: value } : variant)));
		},
		[setVariants]
	);

	// Memoized function to update option stock for a variant
	const handleDetailedStockChange = useCallback(
		(e, variantIndex) => {
			const { name, value } = e.target;
			setVariants((prevVariants) =>
				prevVariants.map((variant, i) => {
					if (i === variantIndex) {
						const updatedDetailedStock = {
							...variant.detailedStock,
							[name]: value,
						};
						const valuesArray = Object.values(updatedDetailedStock).map((val) => {
							const num = Number(val);
							return isNaN(num) || val === "" ? 0 : num;
						});
						const newStock = valuesArray.reduce((acc, curr) => acc + curr, 0);
						return {
							...variant,
							detailedStock: updatedDetailedStock,
							stock: newStock,
						};
					}
					return variant;
				})
			);
		},
		[setVariants]
	);

	// Memoized default option stock creator
	const defaultDetailedStock = useMemo(() => options.reduce((stockMap, option) => ({ ...stockMap, [option]: 0 }), {}), [options]);

	// Effect to handle tracking inventory changes
	useEffect(() => {
		if (!trackInventory) {
			setVariants((prevVariants) => prevVariants.map(({ stock, detailedStock, ...rest }) => rest));
		} else {
			setVariants((prevVariants) =>
				prevVariants.map((variant) => ({
					...variant,
					stock: 0,
					detailedStock: defaultDetailedStock,
				}))
			);
		}
	}, [trackInventory, defaultDetailedStock]);
	return (
		<div>
			<CheckboxInput label="Track Inventory" className="flex items-center gap-2" value={trackInventory} onChange={() => setTrackInventory((prev) => !prev)} />

			{trackInventory && (
				<div className="flex flex-wrap gap-5 justify-between mt-5">
					{variants.map((variant, variantIndex) => (
						<div key={variantIndex}>
							<p className="py-[2px] px-3 text-xs border border-zinc-400 rounded-md bg-main-2 mb-2">Variant - {variant.name}</p>

							{options.length === 0 ? (
								<div>
									<NumberInput label="Stock:" className="flex gap-2 items-center justify-between" placeholder="Stock" variant="stock" name="stock" id={`stock-${variantIndex}`} value={variant.stock} onChange={(e) => handleStockChange(e, variantIndex)} />
								</div>
							) : (
								<div>
									{options.map((option, optionIndex) => (
										<NumberInput key={optionIndex} label={option} className="flex gap-2 justify-between items-center mb-2" placeholder="Stock" variant="stock" name={option} id={`${option}-${variantIndex}`} value={variant.detailedStock?.[option]} onChange={(e) => handleDetailedStockChange(e, variantIndex)} />
									))}
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default Inventory;
