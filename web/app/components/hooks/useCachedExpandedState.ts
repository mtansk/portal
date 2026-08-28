import { useState } from "react";
import { useEffect } from "react";

export function useCachedExpandedState(key: string, id: string) {
	const [isExpanded, setIsExpanded] = useState<boolean>(false);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedState = localStorage.getItem(key);
			if (storedState) {
				const parsedState = JSON.parse(storedState);
				setIsExpanded(!!parsedState[id]);
			}
		}
	}, [key, id]);

	function handleExpandableClick() {
		setIsExpanded((prevState) => {
			const newState = !prevState;
			if (typeof window !== "undefined") {
				const openGroups = JSON.parse(localStorage.getItem(key) || "{}");
				if (newState) {
					openGroups[id] = true;
				} else {
					delete openGroups[id];
				}
				localStorage.setItem(key, JSON.stringify(openGroups));
			}
			return newState;
		});
	}

	return { isExpanded, handleExpandableClick };
}
