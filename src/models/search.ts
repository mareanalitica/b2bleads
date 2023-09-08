export interface Search {
    id?: number;
    params: Record<string, any>;
    total: number;
    status: 'pending' | 'success' | 'error';
    date?: Date;
}