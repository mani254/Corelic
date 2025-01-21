import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const useQueryParams = (defaults = {}) => {
	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		setSearchParams(defaults);
	}, []);

	const getParam = (key) => searchParams.get(key) || "";

	const setParam = (key, value) => {
		if (value) {
			searchParams.set(key, value);
		} else {
			searchParams.delete(key);
		}
		setSearchParams(searchParams);
	};

	const resetParams = () => {
		// console.log(defaults);
		setSearchParams(defaults);
	};

	return { getParam, setParam, resetParams, searchParams };
};
