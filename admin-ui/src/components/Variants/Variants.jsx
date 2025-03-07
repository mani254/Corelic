import React, { useCallback, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { fetchVariants } from "../../redux/actions/variantActions";
import VariantsFilter from "./VariantsFilter";
import ImageComponent from "../Images/ImageComponent";
import { useSearchParams } from "react-router-dom";
import Pagination from "../Pagination/Pagination";
import VariantActions from "../Variants/VariantActions";
import { CheckboxInput } from "../FormComponents/FormComponents";
import Actions from "../Actions/Actions";

function Variants({ fetchVariants, variantData }) {
	const variants = variantData.variants || [];
	const [searchParams] = useSearchParams();
	const initialRender = useRef(true);
	const [totalItems, setTotalItems] = useState(0);
	const [selectedVariants, setSelectedVariants] = useState([]);

	const fetchVariantsData = useCallback(async () => {
		try {
			const data = await fetchVariants(searchParams);
			setTotalItems(data.totalItems || 0);
			setSelectedVariants([]);
		} catch (err) {
			console.error("Error fetching Variants:", err);
		}
	}, [fetchVariants, searchParams]);

	useEffect(() => {
		if (initialRender.current) {
			initialRender.current = false;
			return;
		}
		fetchVariantsData();
	}, [fetchVariantsData]);

	useEffect(() => {
		if (variantData.triggerFetch) {
			fetchVariantsData();
		}
	}, [variantData.triggerFetch, fetchVariantsData]);

	const handleCheckboxChange = useCallback((id) => {
		setSelectedVariants((prev) => (prev.includes(id) ? prev.filter((variantId) => variantId !== id) : [...prev, id]));
	}, []);

	const handleSelectAll = useCallback(() => {
		setSelectedVariants((prev) => (prev.length === variants.length ? [] : variants.map((v) => v._id)));
	}, [variants]);

	const allSelected = variants.length > 0 && selectedVariants.length === variants.length;

	const limit = parseInt(searchParams.get("limit"), 10) || 10;

	return (
		<div className="relative">
			<div className="overflow-x-auto min-h-screen px-6">
				<h2 className="mb-6 text-2xl font-bold text-gray-800">Variants</h2>
				<VariantsFilter />

				<div>
					{variantData.loading ? (
						<div className="text-center py-10">
							<h2 className="text-lg font-semibold">Loading...</h2>
						</div>
					) : variants.length ? (
						<>
							<div className="flex items-center mb-4">
								<CheckboxInput onChange={handleSelectAll} checked={allSelected} />
								<label className="ml-2 text-sm font-medium text-gray-700">Select All</label>
							</div>
							<div className="space-y-5">
								{variants.map((variant) => (
									<VariantCard key={variant._id} variant={variant} isSelected={selectedVariants.includes(variant._id)} onCheckboxChange={handleCheckboxChange} />
								))}
							</div>
						</>
					) : (
						<div className="text-center text-gray-500 p-8 rounded-lg border border-dashed border-gray-300 bg-gray-50">
							<h3 className="font-semibold">No Variants Found</h3>
							<p className="text-sm">Start by adding a new variant.</p>
						</div>
					)}
					{totalItems > limit && <Pagination totalItems={totalItems} />}
				</div>
			</div>
			{selectedVariants.length > 0 && (
				<div className="fixed right-10 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
					<VariantActions selectedVariants={selectedVariants} setSelectedVariants={setSelectedVariants} />
				</div>
			)}
		</div>
	);
}

const VariantCard = React.memo(({ variant, isSelected, onCheckboxChange }) => (
	<div className="outer-box">
		<div className="flex items-center justify-between">
			<CheckboxInput checked={isSelected} onChange={() => onCheckboxChange(variant._id)} />
			<Actions>
				<VariantActions id={variant._id} />
			</Actions>
		</div>

		<div className="mt-3 grid gap-3 grid-cols-2">
			{variant.products.map((product) => (
				<div key={product._id} className="flex gap-3 items-center border rounded-md p-3">
					<ImageComponent path={product.image.path} alt={product.image.alt} className="w-16 h-16 rounded-md object-cover" />
					<div>
						<p className="text-sm font-medium text-gray-700 mb-2">{product.title}</p>
						<span className={`px-2 py-1 text-xs rounded-md ${product.status === "active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}>{product.status}</span>
					</div>
				</div>
			))}
		</div>
	</div>
));

const mapStateToProps = (state) => ({ variantData: state.variant });

const mapDispatchToProps = (dispatch) => ({
	fetchVariants: (params) => dispatch(fetchVariants(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Variants);
