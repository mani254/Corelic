import React, { useState, useCallback, useRef, useEffect } from "react";
import { CheckboxInput } from "../FormComponents/FormComponents";
import { useSearchParams } from "react-router-dom";
import Pagination from "../Pagination/Pagination";
import CollectionsFilter from "./CollectionFilter";
import Actions from "../Actions/Actions";
import CollectionActions from "../Actions/CollectionActions";
import SkeletonTable from "../Loaders/SkeletonTable";
import ImageComponent from "../Images/ImageComponent";

import { connect } from "react-redux";
import { fetchCollections } from "../../redux/actions/collectionActions";

const Collections = ({ collectionData, fetchCollections }) => {
	const collections = collectionData.collections;
	const [searchParams] = useSearchParams();
	const initialRender = useRef(true);
	const [totalItems, setTotalItems] = useState(0);
	const [selectedCollections, setSelectedCollections] = useState([]);

	// Function to fetch collections
	const fetchCollectionsData = useCallback(async () => {
		try {
			const data = await fetchCollections(searchParams);
			setTotalItems(data.totalItems);
			setSelectedCollections([]);
		} catch (err) {
			console.error("Error fetching collections:", err);
		}
	}, [fetchCollections, searchParams]);

	// Fetch collection when searchParams change
	useEffect(() => {
		if (initialRender.current) {
			initialRender.current = false;
			return;
		}
		fetchCollectionsData();
	}, [fetchCollectionsData]);

	// useEffect to send the data to the backend when ever there is a chage in search params
	useEffect(() => {
		if (initialRender.current) {
			initialRender.current = false;
			return;
		}
		if (searchParams.size !== 0) {
			console.log("Request sent to backend with params:", Object.fromEntries(searchParams.entries()));
		}
	}, [searchParams]);

	useEffect(() => {
		if (collectionData.triggerFetch) {
			fetchCollectionsData();
		}
	}, [collectionData.triggerFetch]);

	// Function to handle checkbox click
	const handleCheckboxChange = useCallback((id) => {
		setSelectedCollections((prev) => (prev.includes(id) ? prev.filter((collectionId) => collectionId !== id) : [...prev, id]));
	}, []);

	// function to select all
	const handleSelectAll = useCallback(
		(e) => {
			setSelectedCollections(e.target.checked ? collections.map((c) => c._id) : []);
		},
		[collections]
	);

	// Check if all items are selected
	const allSelected = collections.length > 0 && selectedCollections.length === collections.length;

	const limit = parseInt(searchParams.get("limit"), 10) || 10;

	return (
		<div className=" relative">
			<div className="overflow-x-auto min-h-screen">
				<h4 className="mb-5">Collections</h4>
				<CollectionsFilter />
				<div>
					<div>
						{collectionData.loading ? (
							<SkeletonTable />
						) : collections.length ? (
							<table className="w-full border-collapse">
								<thead>
									<tr className="bg-main-2">
										<th className="px-6 py-3 text-left font-medium w-10">
											<CheckboxInput onChange={handleSelectAll} checked={allSelected} />
										</th>
										<th className="px-6 py-3 text-left font-medium">Image</th>
										<th className="px-6 py-3 text-left font-medium">Title</th>
										<th className="px-6 py-3 text-left font-medium">Status</th>
										<th className="px-6 py-3 text-left font-medium">Actions</th>
									</tr>
								</thead>
								<tbody>
									{collections.map((collection) => (
										<CollectionRow key={collection._id} collection={collection} isSlected={selectedCollections.includes(collection._id)} onCheckboxChange={handleCheckboxChange} selectedCollections={selectedCollections} />
									))}
								</tbody>
							</table>
						) : (
							<div className="flex flex-col items-center justify-center text-gray-500 p-8 rounded-lg border border-dashed border-gray-300 bg-gray-50">
								<svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 text-gray-400 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<path d="M3 9.5V17a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9.5" />
									<path d="M3 9.5 12 4l9 5.5" />
									<path d="M12 4v13" />
								</svg>
								<h3 className="font-semibold">No Collections Found</h3>
								<p className="text-sm text-gray-500 text-center">Start by adding a new collection to manage and display items.</p>
							</div>
						)}

						{totalItems > limit && <Pagination totalItems={totalItems} />}
					</div>
				</div>
			</div>
			{selectedCollections.length ? (
				<div className="w-[163px] fixed right-[100px] top-1/2 -translate-y-1/2 bg-main border border-main-2 rounded-lg shadow-lg">
					<CollectionActions selectedCollections={selectedCollections} setSelectedCollections={setSelectedCollections}></CollectionActions>
				</div>
			) : null}
		</div>
	);
};

const CollectionRow = React.memo(({ collection, isSlected, onCheckboxChange, selectedCollections }) => (
	<tr key={collection._id} className="border-t border-main-2 hover:bg-opacity-50 hover:bg-main-2 cursor-pointer">
		<td className="px-6 py-2">
			<CheckboxInput checked={isSlected} onChange={() => onCheckboxChange(collection._id)} />
		</td>
		<td className="px-6 py-2 w-10">
			<div className="relative h-10 w-10 overflow-hidden rounded-lg bg-main-3">
				<ImageComponent path={collection.image?.path} alt={collection.image?.alt} className="w-full h-full object-cover object-center" />
			</div>
		</td>
		<td className="px-6 py-2">{collection.title}</td>
		<td className="px-6 py-2">
			<span className={`inline-block px-3 py-1 rounded-full text-xxs ${collection.status === "active" ? "bg-green-100 text-green-800" : collection.status === "inactive" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>{collection.status}</span>
		</td>
		<td className="px-6 py-2">
			<Actions disable={selectedCollections.length}>
				<CollectionActions id={collection._id} />
			</Actions>
		</td>
	</tr>
));

const mapStateToProps = (state) => ({ collectionData: state.collection });
const mapDispatchToProps = (dispatch) => ({
	fetchCollections: (params) => dispatch(fetchCollections(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Collections);
