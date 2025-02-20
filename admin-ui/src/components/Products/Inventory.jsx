import React, { useState, useEffect, useCallback, useMemo } from "react";
import { CheckboxInput, NumberInput } from "../FormComponents/FormComponents";

function Inventory({ trackInventory, setTrackInventory, options, setOptions, stock, setStock }) {
	const handleStockChange = useCallback((e) => {
		setStock(e.target.value);
	}, []);

	const handleOptionsStockChange = useCallback((e, optionIndex) => {
		const { value } = e.target;

		setOptions((prevOptions) => prevOptions.map((item, index) => (index === optionIndex ? { ...item, stock: value === "" ? "" : Number(value) } : item)));
	}, []);

	useEffect(() => {
		const totalStock = options.reduce((sum, option) => sum + option.stock, 0);
		setStock(totalStock);
	}, [options]);

	return (
		<div>
			<div className="flex items-center justify-between">
				<CheckboxInput label="Track Inventory" className="flex items-center gap-2" value={trackInventory} onChange={() => setTrackInventory((prev) => !prev)} />
				{trackInventory && <p className="text-xxs bg-main-2 px-2 py-1 rounded-lg">Stock - {Number(stock)}</p>}
			</div>

			{trackInventory && (
				<div className="flex flex-wrap gap-5 justify-between mt-5">
					<div>
						{options.length === 0 ? (
							<div>
								<NumberInput label="Stock:" className="flex gap-2 items-center justify-between" placeholder="Stock" variant="stock" name="stock" value={stock} onChange={handleStockChange} />
							</div>
						) : (
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
								{options.map((option, optionIndex) => (
									<div key={optionIndex} className="max-w-[120px]">
										<NumberInput label={`${option.name} :`} className="flex gap-2 justify-between items-center mb-2" placeholder="Stock" value={option.stock} onChange={(e) => handleOptionsStockChange(e, optionIndex)} />
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export default Inventory;
