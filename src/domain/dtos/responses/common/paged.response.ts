export type PagedResponse<T> = {
    readonly content: T;
    readonly currentPage: number;
    readonly totalPages: number;
    readonly limit: number;
    readonly total: number;
    readonly next: string | null;
    readonly previous: string | null;
  };
  