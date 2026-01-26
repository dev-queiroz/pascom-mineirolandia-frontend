export type Month = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12';

export interface ApiError {
    statusCode: number;
    message: string | string[];
    error: string;
}

export interface ApiResponse<T> {
    data: T;
    status: number;
}