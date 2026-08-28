import styles from "./css/arrow-link.module.scss";

export function ArrowLink({
	fn,
	direction,
	isDisabled,
}: {
	fn?: () => void;
	direction: "back" | "forward";
	isDisabled?: boolean;
}) {
	return (
		<button
			className={`${styles.arrow_button} ${isDisabled ? styles.disabled : ""}`}
			onClick={!isDisabled ? fn : undefined}
			type="button"
			disabled={isDisabled}
		>
			<div className="icon">
				{direction === "back" ? "arrow_back_ios_new" : "arrow_forward_ios"}
			</div>
		</button>
	);
}
