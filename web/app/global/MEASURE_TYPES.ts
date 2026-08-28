export type MeasureTypes = "hour" | "sheet";

export const MEASURE_TYPES: {
	measure_type: MeasureTypes;
	measure_name: string;
}[] = [
	{
		measure_type: "hour",
		measure_name: "час",
	},
	{
		measure_type: "sheet",
		measure_name: "смена",
	},
];
