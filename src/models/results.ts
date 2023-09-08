  export interface Results {
    id?: number;
    results: Record<string, any>;
    status: 'pending' | 'success' | 'error';
    date?: Date;
  }
  