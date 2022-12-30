export interface ApiResponse<T> {
    timestamp: string;
    statusCode: number;
    status: string;
    message: string;
    data: { page: T }
}