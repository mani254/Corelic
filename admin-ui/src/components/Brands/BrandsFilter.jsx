import React, { useState, useCallback, useEffect } from "react";
import { useQueryParams } from "../../hooks/useQueryParams";
import SearchComponent from "../FormComponents/SearchComponent";
import { SelectInput } from "../FormComponents/FormComponents";
import { debounce } from "../../utils/functions";

function BrandsFilter() {
	const { getParam, setParam, resetParams, searchParams } = useQueryParams({
		page: 1,
		limit: 20,
	});

	useEffect(() => {
		setParam("limit", 20);
	}, []);

	const [searchValue, setSearchValue] = useState(getParam("search"));

	const debouncedSearchChange = useCallback(
		debounce((searchText) => {
			setParam("search", searchText);
			setParam("page", 1);
		}, 500),
		[searchParams]
	);

	const handleSearchChange = useCallback(
		(e) => {
			const searchText = e.target.value;
			setSearchValue(searchText);
			debouncedSearchChange(searchText);
		},
		[debouncedSearchChange]
	);

	const handleItemsPerPageChange = useCallback(
		(e) => {
			setParam("limit", e.target.value);
			setParam("page", 1);
		},
		[setParam]
	);

	return (
		<div className="my-6 flex gap-4 items-center justify-between sticky top-10">
			<div className="flex justify-between items-center min-w-[350px]">
				<SearchComponent placeholder="Search for Brand..." value={searchValue} onChange={handleSearchChange} rounded="lg" />
			</div>

			<div className="flex gap-4 items-center">
				<SelectInput
					label="Items per page:"
					className="flex gap-2"
					value={getParam("limit")}
					onChange={handleItemsPerPageChange}
					options={[
						{ label: "10", value: 10 },
						{ label: "20", value: 20 },
						{ label: "30", value: 30 },
						{ label: "40", value: 40 },
						{ label: "50", value: 50 },
					]}
				/>
			</div>

			<div className="flex justify-end">
				<button onClick={resetParams} className="px-6 py-1 bg-main-2 rounded-lg">
					Reset Filters
				</button>
			</div>
		</div>
	);
}

export default BrandsFilter;
