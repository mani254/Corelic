import React, { useState, useCallback, useRef, useEffect } from "react";
import { CheckboxInput } from "../FormComponents/FormComponents";
import { useSearchParams } from "react-router-dom";
import Pagination from "../Pagination/Pagination";
import CollectionsFilter from "./CollectionFilter";
import Actions from "../Actions/Actions";
import CollectionActions from "../Actions/CollectionActions";
import SkeletonTable from "../Loaders/SkeletonTable";

const Collections = () => {
	const [collections, setCollections] = useState([
		{
			_id: 1,
			title: "Summer Collection",
			description: "Summer clothing for the sunny days.",
			keywords: "Summer, Clothing, Fashion",
			status: "Active",
			image: "https://source.unsplash.com/200x200/?summer",
		},
		{
			_id: 2,
			title: "Winter Collection",
			description: "Warm clothing for cold weather.",
			keywords: "Winter, Warm, Fashion",
			status: "Inactive",
			image: "https://source.unsplash.com/200x200/?winter",
		},
		{
			_id: 3,
			title: "Casual Collection",
			description: "Casual outfits for everyday wear.",
			keywords: "Casual, Fashion, Everyday",
			status: "Active",
			image: "https://source.unsplash.com/200x200/?casual",
		},
		{
			_id: 4,
			title: "Sports Collection",
			description: "Athletic wear for active lifestyles.",
			keywords: "Sports, Fitness, Fashion",
			status: "Active",
			image: "https://source.unsplash.com/200x200/?sports",
		},
		{
			_id: 5,
			title: "Formal Collection",
			description: "Professional outfits for business events.",
			keywords: "Formal, Business, Fashion",
			status: "Inactive",
			image: "https://source.unsplash.com/200x200/?formal",
		},
		{
			_id: 6,
			title: "Party Collection",
			description: "Outfits for special occasions and parties.",
			keywords: "Party, Fashion, Celebration",
			status: "Active",
			image: "https://source.unsplash.com/200x200/?party",
		},
		{
			_id: 7,
			title: "Beach Collection",
			description: "Swimwear and beach essentials for sunny vacations.",
			keywords: "Beach, Swimwear, Fashion",
			status: "Inactive",
			image: "https://source.unsplash.com/200x200/?beach",
		},
		{
			_id: 8,
			title: "Spring Collection",
			description: "Light and airy clothing for the spring season.",
			keywords: "Spring, Fashion, Fresh",
			status: "Active",
			image: "https://source.unsplash.com/200x200/?spring",
		},
		{
			_id: 9,
			title: "Autumn Collection",
			description: "Layered clothing for the fall weather.",
			keywords: "Autumn, Fashion, Cozy",
			status: "Inactive",
			image: "https://source.unsplash.com/200x200/?autumn",
		},
		{
			_id: 10,
			title: "Luxury Collection",
			description: "High-end, luxury clothing for the elite.",
			keywords: "Luxury, Fashion, Premium",
			status: "Active",
			image: "https://source.unsplash.com/200x200/?luxury",
		},
	]);
	const [searchParams] = useSearchParams();
	const initialRender = useRef(true);

	const [selectedCollections, setSelectedCollections] = useState([]);

	const [loader, setLoader] = useState(true);
	useEffect(() => {
		const timeout = setTimeout(() => {
			setLoader(false);
		}, 1000);

		return () => clearTimeout(timeout);
	}, []);

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

	// function to select all
	const handleSelectAll = useCallback(
		(e) => {
			setSelectedCollections(e.target.checked ? collections.map((c) => c._id) : []);
		},
		[collections]
	);

	// function to select the single item
	const handleCheckboxChange = useCallback((id) => {
		setSelectedCollections((prev) => (prev.includes(id) ? prev.filter((collectionId) => collectionId !== id) : [...prev, id]));
	}, []);

	return (
		<div className="overflow-x-auto">
			<h4 className="mb-5">Collections</h4>
			<CollectionsFilter />
			<div>
				<div>
					{loader ? (
						<SkeletonTable />
					) : (
						<table className="w-full border-collapse">
							<thead>
								<tr className="bg-main-2">
									<th className="px-6 py-3 text-left font-medium w-10">
										<CheckboxInput onChange={handleSelectAll} checked={collections.length > 0 && selectedCollections.length === collections.length} />
									</th>
									<th className="px-6 py-3 text-left font-medium">Title</th>
									<th className="px-6 py-3 text-left font-medium w-1/3">Description</th>
									<th className="px-6 py-3 text-left font-medium">Status</th>
									<th className="px-6 py-3 text-left font-medium">Actions</th>
								</tr>
							</thead>
							<tbody>
								{collections.map((collection) => (
									<tr key={collection._id} className="border-t border-main-2 hover:bg-opacity-50 hover:bg-main-2 cursor-pointer">
										<td className="px-6 py-2">
											<CheckboxInput checked={selectedCollections.includes(collection._id)} onChange={() => handleCheckboxChange(collection._id)} />
										</td>
										<td className="px-6 py-2">{collection.title}</td>
										<td className="px-6 py-2">{collection.description}</td>
										<td className="px-6 py-2">
											<span className={`inline-block px-3 py-1 rounded-full text-xxs ${collection.status === "Active" ? "bg-green-100 text-green-800" : collection.status === "Inactive" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>{collection.status}</span>
										</td>
										<td className="px-6 py-2">
											<Actions>
												<CollectionActions multiSelect={selectedCollections.length > 1} />
											</Actions>
										</td>
										{/* <td className="px-6 py-2">Actions</td> */}
									</tr>
								))}
							</tbody>
						</table>
					)}

					<Pagination totalItems={100} />
				</div>
			</div>
		</div>
	);
};

export default Collections;
