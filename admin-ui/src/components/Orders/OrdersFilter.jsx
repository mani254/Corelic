import React, { useState, useCallback, useRef } from "react";
import { useQueryParams } from "../../hooks/useQueryParams";
import SearchComponent from "../FormComponents/SearchComponent";
import { SelectInput, DateInput } from "../FormComponents/FormComponents";

function debounce(func, delay) {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func(...args);
		}, delay);
	};
}

function OrdersFilter() {
	const { getParam, setParam, resetParams } = useQueryParams({
		page: 1,
		itemsPerPage: 10,
	});

	const [searchValue, setSearchValue] = useState(getParam("search"));
	const [startDate, setStartDate] = useState(getParam("startDate"));
	const [endDate, setEndDate] = useState(getParam("endDate"));

	const debouncedSearchChange = useRef(
		debounce((searchText) => {
			setParam("search", searchText);
			setParam("page", 1);
		}, 500)
	).current;

	const handleSearchChange = useCallback(
		(e) => {
			const searchText = e.target.value;
			setSearchValue(searchText);
			debouncedSearchChange(searchText);
		},
		[debouncedSearchChange]
	);

	const handleStatusChange = useCallback(
		(e) => {
			setParam("status", e.target.value);
			setParam("page", 1);
		},
		[setParam]
	);

	const handleItemsPerPageChange = useCallback(
		(e) => {
			setParam("itemsPerPage", e.target.value);
			setParam("page", 1);
		},
		[setParam]
	);

	const handleStartDateChange = useCallback(
		(e) => {
			setStartDate(e.target.value);
			setParam("startDate", e.target.value);
			setParam("page", 1);
		},
		[setParam]
	);

	const handleEndDateChange = useCallback(
		(e) => {
			setEndDate(e.target.value);
			setParam("endDate", e.target.value);
			setParam("page", 1);
		},
		[setParam]
	);

	return (
		<div className="my-6">
			<div className="flex gap-4 items-center justify-between my-5">
				<div className="flex gap-4">
					<SelectInput
						label="Items per page:"
						className="flex gap-2"
						value={getParam("itemsPerPage")}
						onChange={handleItemsPerPageChange}
						options={[
							{ label: "10", value: 10 },
							{ label: "20", value: 20 },
							{ label: "30", value: 30 },
							{ label: "40", value: 40 },
							{ label: "50", value: 50 },
						]}
					/>

					<SelectInput
						label="Status:"
						className="flex gap-2"
						value={getParam("status")}
						onChange={handleStatusChange}
						options={[
							{ label: "All", value: "" },
							{ label: "Delivered", value: "Delivered" },
							{ label: "In Transit", value: "In Transit" },
							{ label: "Pending", value: "Pending" },
							{ label: "Cancelled", value: "Cancelled" },
						]}
					/>
				</div>
				<div className="flex gap-4">
					<DateInput label="From:" className="flex gap-2" id="startDate" value={getParam("startDate")} onChange={handleStartDateChange} />
					<DateInput label="To:" className="flex gap-2" id="endDate" value={getParam("endDate")} onChange={handleEndDateChange} />
				</div>
			</div>
			<div className="flex items-center justify-between">
				<div className="min-w-[550px]">
					<SearchComponent placeholder="Search for Order..." value={searchValue} onChange={handleSearchChange} rounded="lg" />
				</div>
				<button onClick={resetParams} className="px-6 py-1 bg-main-2 rounded-lg block">
					Reset Filters
				</button>
			</div>
		</div>
	);
}

export default OrdersFilter;
