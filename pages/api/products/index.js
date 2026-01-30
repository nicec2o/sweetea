/**
 * 상품 API - Next.js API Routes
 * GET/POST /api/products
 */

import { products } from '../../../lib/fileStore';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { category, search } = req.query;
      let result;

      if (category) {
        result = await products.getByCategory(category);
      } else if (search) {
        result = await products.search(search);
      } else {
        result = await products.getAll();
      }

      // 최신순 정렬
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { 
        name, name_en, name_ja, name_vi,
        description, description_en, description_ja, description_vi,
        price, category, image_url, stock 
      } = req.body;

      if (!name || !price || !category || stock === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const newProduct = await products.create({
        name, name_en, name_ja, name_vi,
        description, description_en, description_ja, description_vi,
        price: parseFloat(price),
        category,
        image_url: image_url || '',
        stock: parseInt(stock)
      });

      res.status(201).json({ 
        message: 'Product created successfully',
        product: newProduct
      });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
