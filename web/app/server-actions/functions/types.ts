export type ApiResponse<T> = {
    code: number;
    message: string;
    error_code: string;
    data: T[];
};
