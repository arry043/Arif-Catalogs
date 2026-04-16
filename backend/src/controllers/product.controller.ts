import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const productQuerySchema = z.object({
  search: z.string().optional(),
  category: z.union([z.string(), z.array(z.string())]).optional(),
  min_price: z.coerce.number().min(0).optional(),
  max_price: z.coerce.number().min(0).optional(),
  min_rating: z.coerce.number().min(0).max(5).optional(),
  in_stock: z.preprocess((val) => val === 'true', z.boolean()).optional(),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
  sort_by: z.enum(['name', 'price', 'rating', 'createdAt', 'stock']).default('createdAt'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

const productIdParamsSchema = z.object({
  id: z.string().min(1),
});

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = productQuerySchema.parse(req.query);
    
    // Handle specific invalid price range case
    if (validated.min_price && validated.max_price && validated.min_price > validated.max_price) {
      // Swap them silently as per instructions
      const temp = validated.min_price;
      validated.min_price = validated.max_price;
      validated.max_price = temp;
    }

    // Convert tags to array if string
    const tags = validated.tags ? (Array.isArray(validated.tags) ? validated.tags : [validated.tags]) : [];

    const result = await ProductService.getProducts({
      ...validated,
      tags,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = productIdParamsSchema.parse(req.params);
    const product = await ProductService.getProductById(id);
    if (!product) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: `Product with id ${id} not found`,
          request_id: uuidv4(),
        },
      });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ProductService.getCategories();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = productQuerySchema.parse(req.query);
    const tags = validated.tags ? (Array.isArray(validated.tags) ? validated.tags : [validated.tags]) : [];
    const result = await ProductService.getStats({ ...validated, tags });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ProductService.createProduct(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = productIdParamsSchema.parse(req.params);
    const result = await ProductService.updateProduct(id, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = productIdParamsSchema.parse(req.params);
    await ProductService.softDeleteProduct(id);
    res.status(200).json({ message: 'Product deleted successfully (soft delete)' });
  } catch (error) {
    next(error);
  }
};
