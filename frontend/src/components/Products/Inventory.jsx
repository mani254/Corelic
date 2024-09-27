import React, { useState, useEffect } from "react";

function Inventory({ variants, setVariants, options }) {
	const [trackInventory, setTrackInventory] = useState(false);

	function handleVariantStock(event, variantName) {
		const newVariants = variants.map((variant) => {
			if (variant.name === variantName) {
				return { ...variant, stock: event.target.value };
			} else {
				return variant;
			}
		});
		setVariants(newVariants);
	}

	function setStockPrice(variants) {
		const newVariants = variants.map((variant) => {
			const stock = variant.options.reduce((acc, curr) => {
				return acc + (curr.stock || 0);
			}, 0);
			return { ...variant, stock }; // Assign the total stock to the variant
		});
		setVariants(newVariants); // Update state with new variants
	}

	function handleOptionStock(event, variantName, optionName) {
		const newVariants = variants.map((variant) => {
			if (variant.name === variantName) {
				const newOptions = variant.options.map((option) => {
					if (option.option === optionName) {
						return { ...option, stock: Number(event.target.value) }; // Convert to number
					}
					return option;
				});
				return { ...variant, options: newOptions };
			}
			return variant;
		});

		setVariants(newVariants);
		setStockPrice(newVariants);
	}

	useEffect(() => {
		if (trackInventory || !variants) return;

		function resetStockToZero() {
			const newVariants = variants.map((variant) => {
				const newOptions = variant?.options.map((option) => {
					return { ...option, stock: 0 };
				});
				return { ...variant, stock: 0, options: newOptions };
			});
			setVariants(newVariants);
		}

		resetStockToZero();
	}, [trackInventory]);

	return (
		<div className="outer-box inventory">
			<h4 className="mb-3">Inventory</h4>
			<div className="input-wrapper ">
				<p className="text-xs">Track inventory to keep track of no.of products available</p>
				<div className="flex items-center gap-3">
					<input type="checkbox" className="max-w-3 h-3" checked={trackInventory} name="trackInventory" id="trackInventory" onChange={() => setTrackInventory(!trackInventory)} />
					<label className=" whitespace-nowrap mb-0" htmlFor="trackInventory">
						Track Inventory
					</label>
				</div>
			</div>
			{trackInventory && (
				<div className="flex flex-wrap gap-5 justify-between">
					{variants.map((variant, index) => {
						return (
							<div key={index}>
								<p className="mb-3 border border-black border-opacity-30 px-2 rounded-md bg-zinc-100">Variant - {variant.name}</p>
								{options.length <= 0 ? (
									<div className="input-wrapper">
										<input type="number" className="max-w-20" placeholder="Stock" value={variant.stock} onChange={(e) => handleVariantStock(e, variant.name)}></input>
									</div>
								) : (
									options.map((option, index) => {
										return (
											<div key={index}>
												<div className="input-wrapper flex gap-3 justify-between">
													<label htmlFor={option}>{option} :</label>
													<input
														type="number"
														id={option}
														className="max-w-20"
														placeholder="Stock"
														value={option.stock}
														onChange={(e) => {
															handleOptionStock(e, variant.name, option);
														}}></input>
												</div>
											</div>
										);
									})
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}

export default Inventory;
