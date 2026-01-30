/**
 * 개별 재료 API - Next.js API Routes
 * GET/PUT/DELETE /api/ingredients/[id]
 */

import { ingredients } from '../../../lib/fileStore';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const ingredient = await ingredients.getById(id);
      
      if (!ingredient) {
        return res.status(404).json({ error: 'Ingredient not found' });
      }
      
      res.status(200).json(ingredient);
    } catch (error) {
      console.error('Error fetching ingredient:', error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const { 
        name, name_en, name_ja, name_vi,
        unit, stock, min_stock, price_per_unit, supplier
      } = req.body;

      if (!name || !unit || stock === undefined || min_stock === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const updatedIngredient = await ingredients.update(id, {
        name, name_en, name_ja, name_vi,
        unit,
        stock: parseInt(stock),
        min_stock: parseInt(min_stock),
        price_per_unit: parseFloat(price_per_unit) || 0,
        supplier: supplier || ''
      });

      res.status(200).json({ 
        message: 'Ingredient updated successfully',
        ingredient: updatedIngredient
      });
    } catch (error) {
      console.error('Error updating ingredient:', error);
      if (error.message === 'Ingredient not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      await ingredients.delete(id);
      res.status(200).json({ message: 'Ingredient deleted successfully' });
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      if (error.message === 'Ingredient not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
