export declare class AppError extends Error {
    statusCode: number;
    message: string;
    isOperational: boolean;
    constructor(statusCode: number, message: string, isOperational?: boolean);
}
export declare const handleError: (error: any) => AppError;
declare const _default: {
    AppError: typeof AppError;
    handleError: (error: any) => AppError;
};
export default _default;
//# sourceMappingURL=errors.d.ts.map