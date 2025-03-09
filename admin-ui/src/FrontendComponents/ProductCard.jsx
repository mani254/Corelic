import React from "react";
import { FaShoppingCart, FaHeart } from "react-icons/fa";

const ProductCard = ({ image, title, price, comparePrice, layout = "vertical" }) => {
	const discountPercentage = Math.round(((comparePrice - price) / comparePrice) * 100);
	const amountSaved = comparePrice - price;

	return (
		<div className={`relative bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300 hover:shadow-xl transition-transform transform hover:-translate-y-1 duration-300 p-3 ${layout === "horizontal" ? "w-96 h-36 flex" : "w-64 h-auto flex flex-col"}`}>
			<div className={`${layout === "horizontal" ? "w-1/3 h-full" : "w-full h-40"} overflow-hidden rounded-md relative`}>
				<img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
				{layout === "vertical" && (
					<div className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md cursor-pointer hover:scale-110 transition">
						<FaHeart className="text-gray-600 hover:text-red-500" size={14} />
					</div>
				)}
			</div>
			<div className={`${layout === "horizontal" ? "w-2/3 px-4 py-2" : "p-3 text-left"} flex flex-col justify-between`}>
				<h2 className="font-semibold text-gray-700 leading-tight text-sm text-left">{title}</h2>
				<div className={`flex items-center justify-between ${layout === "horizontal" ? "" : "mt-2"}`}>
					<div className="flex items-center gap-2">
						<span className="text-lg font-bold text-gray-900">₹{price}</span>
						{comparePrice > price && <span className="text-sm text-gray-500 line-through">₹{comparePrice}</span>}
					</div>
					{comparePrice > price && <span className="text-sm text-orange-400 font-semibold">Save ₹{amountSaved}</span>}
				</div>
				<div className="flex items-center gap-2 w-full mt-2">
					<button className="flex-1 flex items-center justify-center bg-gray-800 text-white py-1 px-3 rounded-md shadow-md hover:bg-gray-900 transition font-medium gap-2 text-xs">
						<FaShoppingCart size={12} /> Add to Cart
					</button>
					{layout === "horizontal" && (
						<div className="bg-white p-1 rounded-full shadow-md cursor-pointer hover:scale-110 transition">
							<FaHeart className="text-gray-600 hover:text-red-500" size={14} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

const DummyProduct = () => {
	const product = {
		image: "https://static.vecteezy.com/system/resources/previews/028/207/246/non_2x/hotel-lobby-with-scandinavian-style-furniture-profesionalgrapy-ai-generated-photo.jpg",
		title: "Luxury Scandinavian Sofa Set with Elegant Minimalist Design",
		price: 8999,
		comparePrice: 12999,
	};

	return (
		<div className="flex flex-col gap-5 justify-center items-center min-h-screen bg-gray-100">
			<ProductCard {...product} layout="vertical" />
			<ProductCard {...product} layout="horizontal" />
		</div>
	);
};

export default DummyProduct;
