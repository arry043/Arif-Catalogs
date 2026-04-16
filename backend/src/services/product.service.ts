import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

export class ProductService {
  static async getProducts(params: {
    search?: string;
    category?: string | string[];
    min_price?: number;
    max_price?: number;
    min_rating?: number;
    in_stock?: boolean;
    tags?: string[];
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    const {
      search,
      category,
      min_price,
      max_price,
      min_rating,
      in_stock,
      tags,
      sort_by = 'createdAt',
      sort_order = 'desc',
      page = 1,
      limit = 20,
    } = params;

    const skip = (page - 1) * limit;
    const take = Math.min(limit, 100);

    const where: Prisma.ProductWhereInput = {
      isActive: true, // Only show active items by default
    };

    // Full-text search
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
      // Note: SQLite doesn't support 'mode: insensitive' in Prisma's standard provider.
      // In a production environment with PostgreSQL, we'd use 'mode: insensitive' or GIN indices.
    }

    // Categories filter (supporting string or string[])
    if (category) {
      const categoryNames = Array.isArray(category) ? category : [category];
      where.category = {
        name: { in: categoryNames },
      };
    }

    // Price range
    if (min_price !== undefined || max_price !== undefined) {
      where.price = {};
      if (min_price !== undefined) where.price.gte = min_price;
      if (max_price !== undefined) where.price.lte = max_price;
    }

    // Rating
    if (min_rating !== undefined) {
      where.rating = { gte: min_rating };
    }

    // Stock
    if (in_stock) {
      where.stock = { gt: 0 };
    }

    // Tags (AND logic: must contain ALL tags)
    if (tags && tags.length > 0) {
      where.AND = [
        ...(where.AND as any[] || []),
        ...tags.map((tag: string) => ({
          tags: { contains: tag }
        }))
      ];
    }

    // Ordering
    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      [sort_by]: sort_order,
    };

    const startTime = Date.now();
    const [data, total_items] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy,
        skip,
        take,
      }),
      prisma.product.count({ where }),
    ]);
    const query_time_ms = Date.now() - startTime;

    const total_pages = Math.ceil(total_items / take);

    return {
      data: data.map(p => ({ ...p, tags: p.tags ? p.tags.split(',') : [] })),
      pagination: {
        page,
        limit: take,
        total_items,
        total_pages,
        has_next: page < total_pages,
        has_prev: page > 1,
      },
      meta: {
        query_time_ms,
        filters_applied: params,
      },
    };
  }

  static async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) return null;
    return { ...product, tags: product.tags ? product.tags.split(',') : [] };
  }

  static async getCategories() {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
    });

    return categories.map((c) => ({
      category: c.name,
      count: c._count.products,
    }));
  }

  static async getStats(params: any) {
    const {
      search,
      category,
      min_price,
      max_price,
      min_rating,
      in_stock,
      tags,
    } = params;

    const where: Prisma.ProductWhereInput = { isActive: true };
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }
    if (category) {
      const categoryNames = Array.isArray(category) ? category : [category];
      where.category = { name: { in: categoryNames } };
    }
    if (min_price !== undefined || max_price !== undefined) {
      where.price = {};
      if (min_price !== undefined) (where.price as any).gte = min_price;
      if (max_price !== undefined) (where.price as any).lte = max_price;
    }
    if (min_rating !== undefined) where.rating = { gte: min_rating };
    if (in_stock) where.stock = { gt: 0 };
    if (tags && tags.length > 0) {
       where.AND = [
        ...(where.AND as any[] || []),
        ...tags.map((tag: string) => ({
          tags: { contains: tag }
        }))
      ];
    }

    const aggregates = await prisma.product.aggregate({
      where,
      _count: { id: true, stock: true },
      _avg: { price: true, rating: true },
      _min: { price: true },
      _max: { price: true },
    });

    const outOfStockCount = await prisma.product.count({
      where: { ...where, stock: 0 },
    });

    return {
      total_products: aggregates._count.id,
      avg_price: Number(aggregates._avg.price?.toFixed(2) || 0),
      avg_rating: Number(aggregates._avg.rating?.toFixed(2) || 0),
      price_range: {
        min: Number(aggregates._min.price || 0),
        max: Number(aggregates._max.price || 0),
      },
      out_of_stock_count: outOfStockCount,
    };
  }

  static async createProduct(data: Prisma.ProductCreateInput) {
    return prisma.product.create({ data, include: { category: true } });
  }

  static async updateProduct(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({ 
      where: { id }, 
      data,
      include: { category: true }
    });
  }

  static async softDeleteProduct(id: string) {
    return prisma.product.update({
      where: { id },
      data: { isActive: false }
    });
  }
}
