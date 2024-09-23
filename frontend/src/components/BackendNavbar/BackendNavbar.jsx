import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

const navlinks = [
	{
		title: "Home",
		to: "/home",
		image: "https://cdn-icons-png.flaticon.com/512/25/25694.png",
	},
	{
		title: "Orders",
		to: "/orders",
		image: "https://img.icons8.com/m_rounded/512w/purchase-order.png",
		children: [
			{
				title: "Recent",
				to: "/orders/recent",
			},
			{
				title: "Delivered",
				to: "/orders/delivered",
			},
			{
				title: "Returned",
				to: "/orders/returned",
			},
		],
	},
	{
		title: "Products",
		image: "https://cdn-icons-png.flaticon.com/512/126/126422.png",
		to: "/products",
		children: [
			{
				title: "Inventory",
				to: "/products/inventory",
			},
			{
				title: "Collection",
				to: "/products/collection",
			},
			{
				title: "Transfers",
				to: "/products/transfers",
			},
		],
	},
	{
		title: "Offers",
		image: "https://cdn-icons-png.freepik.com/512/6977/6977692.png",
		to: "/offers",
		children: [
			{
				title: "Combos",
				to: "/offers/combos",
			},
			{
				title: "Discount",
				to: "/offers/discount",
			},
			{
				title: "Coupons",
				to: "/offers/coupons",
			},
		],
	},
	{
		title: "Customers",
		to: "/customers",
		image: "https://cdn-icons-png.flaticon.com/256/666/666201.png",
	},
	{
		title: "Analytics",
		to: "/analytics",
		image: "https://cdn-icons-png.freepik.com/512/1167/1167073.png",
	},
	{
		title: "Marketing",
		to: "/marketing",
		image: "https://cdn-icons-png.freepik.com/512/484/484603.png",
	},
];

function BackendNavbar() {
	const location = useLocation();

	return (
		<nav className="px-2">
			<ul>
				{navlinks.map((link, index) => (
					<li key={index} className="mt-1">
						<div className={`px-4 flex gap-3 items-center hover:bg-zinc-200  rounded-md cursor-pointer py-[2px] ${location.pathname.startsWith(link.to) && "active bg-zinc-200 text-logo"}`}>
							<img className="w-4 h-4" src={link.image} alt={`${link.title} icon`} />
							<NavLink className="block w-full h-full" to={link.to}>
								{link.title}
							</NavLink>
						</div>
						{link.children && link.children.length > 0 && (
							<ul className="ml-12">
								{link.children.map((child, childIndex) => (
									<li className={`text-opacity-70 hover:text-opacity-90 cursor-pointer ${location.pathname.startsWith(child.to) && "active text-opacity-100 text-logo"}`} key={childIndex}>
										<NavLink className="block w-full h-full" to={child.to}>
											{child.title}
										</NavLink>
									</li>
								))}
							</ul>
						)}
					</li>
				))}
			</ul>
		</nav>
	);
}

export default BackendNavbar;
