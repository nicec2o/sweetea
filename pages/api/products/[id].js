/**
 * 개별 상품 API - Next.js API Routes
 * GET/PUT/DELETE /api/products/[id]
 */

import { products } from '../../../lib/fileStore';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const product = await products.getById(id);
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.status(200).json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const { 
        name, name_en, name_ja, name_vi,
        description, description_en, description_ja, description_vi,
        price, category, image_url, stock 
      } = req.body;

      if (!name || !price || !category || stock === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const updatedProduct = await products.update(id, {
        name, name_en, name_ja, name_vi,
        description, description_en, description_ja, description_vi,
        price: parseFloat(price),
        category,
        image_url: image_url || '',
        stock: parseInt(stock)
      });

      res.status(200).json({ 
        message: 'Product updated successfully',
        product: updatedProduct
      });
    } catch (error) {
      console.error('Error updating product:', error);
      if (error.message === 'Product not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      await products.delete(id);
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      if (error.message === 'Product not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
