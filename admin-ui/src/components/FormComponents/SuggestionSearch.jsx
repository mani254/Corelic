import React, { useState, useEffect, useRef } from "react";

const SearchComponent = () => {
	const [query, setQuery] = useState("");
	const [suggestions, setSuggestions] = useState([]);
	const [selectedSuggestions, setSelectedSuggestions] = useState([]);
	const [isFocused, setIsFocused] = useState(false);
	const [activeIndex, setActiveIndex] = useState(-1);
	const inputRef = useRef(null);

	// Debounce effect
	useEffect(() => {
		const handler = setTimeout(() => {
			if (query.length > 2) {
				fetchSuggestions(query);
			} else {
				setSuggestions([]);
			}
		}, 300);

		return () => clearTimeout(handler);
	}, [query]);

	const fetchSuggestions = async (query) => {
		try {
			// Simulating API response with random data
			const data = Array.from({ length: 5 }, (_, i) => ({
				_id: i + 1,
				title: `Suggestion ${i + 1} for ${query}`,
			}));
			setSuggestions(data);
		} catch (error) {
			console.error("Error fetching suggestions", error);
		}
	};

	const handleSelect = (suggestion) => {
		setSelectedSuggestions((prev) => [...prev, suggestion]);
		setQuery("");
		setSuggestions([]);
	};

	const handleKeyDown = (e) => {
		if (e.key === "ArrowDown") {
			setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
		} else if (e.key === "ArrowUp") {
			setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
		} else if (e.key === "Enter") {
			if (suggestions.length > 0 && activeIndex !== -1) {
				handleSelect(suggestions[activeIndex]);
			}
		}
	};

	return (
		<div className="relative w-80">
			<input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setIsFocused(true)} onBlur={() => setTimeout(() => setIsFocused(false), 200)} onKeyDown={handleKeyDown} className="w-full p-2 border rounded focus:outline-none focus:ring" placeholder="Search..." />
			{isFocused && suggestions.length > 0 && (
				<div className="absolute w-full bg-white border mt-1 max-h-52 overflow-y-auto shadow-md rounded">
					{suggestions.map((suggestion, index) => (
						<div key={suggestion._id} onClick={() => handleSelect(suggestion)} className={`p-2 cursor-pointer ${index === activeIndex ? "bg-gray-200" : ""}`}>
							{suggestion.title}
						</div>
					))}
				</div>
			)}
			<div className="mt-4">
				<strong>Selected:</strong>
				<ul>
					{selectedSuggestions.map((s, i) => (
						<li key={i}>{s.title}</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default SearchComponent;
