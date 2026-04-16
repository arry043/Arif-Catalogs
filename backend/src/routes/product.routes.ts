import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting for search (bonus)
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 100, 
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many search requests, please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/products', productController.getProducts);
router.get('/products/categories', productController.getCategories);
router.get('/products/stats', productController.getStats);
router.get('/products/:id', productController.getProductById);

// Admin routes (bonus)
router.post('/products', productController.createProduct);
router.patch('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

export default router;
