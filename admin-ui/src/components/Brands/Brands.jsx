import React, { useState, useCallback, useRef, useEffect } from "react";
import { CheckboxInput } from "../FormComponents/FormComponents";
import { useSearchParams } from "react-router-dom";
import Pagination from "../Pagination/Pagination";
import BrandsFilter from "./BrandsFilter";
import Actions from "../Actions/Actions";
import BrandActions from "../Actions/BrandActions";
import { connect } from "react-redux";
import { fetchBrands } from "../../redux/actions/brandActions";

const Brands = ({ brandData, fetchBrands }) => {
	const brands = brandData.brands;
	const [searchParams] = useSearchParams();
	const initialRender = useRef(true);
	const [totalItems, setTotalItems] = useState(0);
	const [selectedBrands, setSelectedBrands] = useState([]);

	const fetchBrandsData = useCallback(async () => {
		try {
			const data = await fetchBrands(searchParams);
			setTotalItems(data.totalItems);
			setSelectedBrands([]);
		} catch (err) {
			console.error("Error fetching brands:", err);
		}
	}, [fetchBrands, searchParams]);

	useEffect(() => {
		if (initialRender.current) {
			initialRender.current = false;
			return;
		}
		fetchBrandsData();
	}, [fetchBrandsData]);

	const handleCheckboxChange = useCallback((id) => {
		setSelectedBrands((prev) => (prev.includes(id) ? prev.filter((brandId) => brandId !== id) : [...prev, id]));
	}, []);

	const handleSelectAll = useCallback(
		(e) => {
			setSelectedBrands(e.target.checked ? brands.map((b) => b._id) : []);
		},
		[brands]
	);

	const allSelected = brands.length > 0 && selectedBrands.length === brands.length;

	const limit = parseInt(searchParams.get("limit"), 10) || 20;

	return (
		<div className="relative">
			<div className="overflow-x-auto min-h-screen">
				<h4 className="mb-5">Brands</h4>
				<BrandsFilter />
				<div>
					{brandData.loading ? (
						<h1>loading ...</h1>
					) : brands.length ? (
						<>
							<div className="flex items-center mb-3">
								<CheckboxInput onChange={handleSelectAll} checked={allSelected} />
								<label className="ml-2 text-sm font-medium">Select All</label>
							</div>
							<div className="grid gap-y-5 gap-x-10 grid-cols-3">
								{brands.map((brand) => (
									<BrandCard key={brand._id} brand={brand} isSelected={selectedBrands.includes(brand._id)} onCheckboxChange={handleCheckboxChange} selectedBrands={selectedBrands} />
								))}
							</div>
						</>
					) : (
						<div className="text-center text-gray-500 p-8 rounded-lg border border-dashed border-gray-300 bg-gray-50">
							<h3 className="font-semibold">No Brands Found</h3>
							<p className="text-sm">Start by adding a new brand.</p>
						</div>
					)}
					{totalItems > limit && <Pagination totalItems={totalItems} />}
				</div>
			</div>
			{selectedBrands.length ? (
				<div className="w-[163px] fixed right-[100px] top-1/2 -translate-y-1/2 bg-main border border-main-2 rounded-lg shadow-lg">
					<BrandActions selectedBrands={selectedBrands} setSelectedBrands={setSelectedBrands}></BrandActions>
				</div>
			) : null}
		</div>
	);
};

const BrandCard = React.memo(({ brand, isSelected, onCheckboxChange, selectedBrands }) => (
	<div className="border border-gray-300 bg-main-2 rounded-full px-6 py-3 shadow-sm flex gap-5 items-center justify-between">
		<CheckboxInput checked={isSelected} onChange={() => onCheckboxChange(brand._id)} />
		<p className="font-semibold">{brand.title}</p>
		<Actions disable={selectedBrands.length}>
			<BrandActions id={brand._id} />
		</Actions>
	</div>
));

const mapStateToProps = (state) => ({ brandData: state.brand });
const mapDispatchToProps = (dispatch) => ({
	fetchBrands: (params) => dispatch(fetchBrands(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Brands);
