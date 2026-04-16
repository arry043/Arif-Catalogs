import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type {
  CategoryCount,
  FetchProductsParams,
  Product,
  ProductMutationInput,
  ProductStats,
  ProductsResponse,
} from '../types/product';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api/v1';

type ProductWithNumericStrings = Omit<Product, 'price' | 'rating'> & {
  price: number | string;
  rating: number | string;
};

type RawProductsResponse = Omit<ProductsResponse, 'data'> & {
  data: ProductWithNumericStrings[];
};

const toNumber = (value: number | string): number => {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeProduct = (product: ProductWithNumericStrings): Product => ({
  ...product,
  price: toNumber(product.price),
  rating: toNumber(product.rating),
  category: {
    ...product.category,
    name: product.category?.name ?? 'Unknown',
  },
});

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async fetchProducts(params: FetchProductsParams = {}, signal?: AbortSignal): Promise<ProductsResponse> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') return;

      if (Array.isArray(value)) {
        value.forEach((entry) => queryParams.append(key, entry));
      } else {
        queryParams.append(key, String(value));
      }
    });

    const response = await this.client.get<RawProductsResponse>('/products', {
      params: queryParams,
      signal,
    });

    return {
      ...response.data,
      data: response.data.data.map(normalizeProduct),
    };
  }

  async fetchProductById(id: string): Promise<Product> {
    const response = await this.client.get<ProductWithNumericStrings>(`/products/${id}`);
    return normalizeProduct(response.data);
  }

  async fetchCategories(): Promise<CategoryCount[]> {
    const response = await this.client.get<CategoryCount[]>('/products/categories');
    return response.data;
  }

  async fetchStats(params: FetchProductsParams = {}): Promise<ProductStats> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') return;

      if (Array.isArray(value)) {
        value.forEach((entry) => queryParams.append(key, entry));
      } else {
        queryParams.append(key, String(value));
      }
    });

    const response = await this.client.get<ProductStats>('/products/stats', { params: queryParams });
    return response.data;
  }

  async createProduct(data: ProductMutationInput): Promise<Product> {
    const response = await this.client.post<ProductWithNumericStrings>('/products', data);
    return normalizeProduct(response.data);
  }

  async updateProduct(id: string, data: ProductMutationInput): Promise<Product> {
    const response = await this.client.patch<ProductWithNumericStrings>(`/products/${id}`, data);
    return normalizeProduct(response.data);
  }

  async deleteProduct(id: string): Promise<{ message: string }> {
    const response = await this.client.delete<{ message: string }>(`/products/${id}`);
    return response.data;
  }
}

export const api = new ApiService();
