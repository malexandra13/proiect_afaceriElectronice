import express from 'express';
import { Product } from '../sequelize.js';
const router = express.Router();

// Get all products with optional filters
router.route('/').get(async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).send(products);
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).json({ error: 'An error occurred while fetching products.' });
  }
});

// Create a new product
router.route('/').post(async (req, res) => {
  try {
    const newProduct = await Product.create({...req.body, images: JSON.stringify(req.body.images)});
    return res.status(200).send(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'An error occurred while creating the product.' });
  }
});

// Update a product by ID
router.route('/:id').put(async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByPk(productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      await product.update({...req.body, images: JSON.stringify(req.body.images)});
      res.status(200).send(product);
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'An error occurred while updating the product.' });
  }
});

// Delete a product by ID
router.route('/:id').delete(async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByPk(productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      await product.destroy();
      res.status(200).json({ message: 'Product deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'An error occurred while deleting the product.' });
  }
});

export default router;