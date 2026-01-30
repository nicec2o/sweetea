/**
 * 재료 API - Next.js API Routes
 * GET/POST /api/ingredients
 */

import { ingredients } from '../../../lib/fileStore';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { low_stock } = req.query;
      let result;

      if (low_stock === 'true') {
        result = await ingredients.getLowStock();
      } else {
        result = await ingredients.getAll();
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { 
        name, name_en, name_ja, name_vi,
        unit, stock, min_stock, price_per_unit, supplier
      } = req.body;

      if (!name || !unit || stock === undefined || min_stock === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const newIngredient = await ingredients.create({
        name, name_en, name_ja, name_vi,
        unit,
        stock: parseInt(stock),
        min_stock: parseInt(min_stock),
        price_per_unit: parseFloat(price_per_unit) || 0,
        supplier: supplier || ''
      });

      res.status(201).json({ 
        message: 'Ingredient created successfully',
        ingredient: newIngredient
      });
    } catch (error) {
      console.error('Error creating ingredient:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
