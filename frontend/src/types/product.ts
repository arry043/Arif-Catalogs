export interface Category {
  id?: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  rating: number;
  tags: string[];
  isActive: boolean;
  category: Category;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryCount {
  category: string;
  count: number;
}

export interface ProductPagination {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface ProductsResponse {
  data: Product[];
  pagination: ProductPagination;
  meta?: {
    query_time_ms: number;
    filters_applied: unknown;
  };
}

export interface ProductStats {
  total_products: number;
  avg_price: number;
  avg_rating: number;
  price_range: {
    min: number;
    max: number;
  };
  out_of_stock_count: number;
}

export interface FetchProductsParams {
  search?: string;
  category?: string[];
  min_price?: number | null;
  max_price?: number | null;
  min_rating?: number | null;
  in_stock?: boolean;
  tags?: string[];
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ProductMutationInput {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  rating?: number;
  tags?: string[];
  isActive?: boolean;
  categoryId?: string;
}
