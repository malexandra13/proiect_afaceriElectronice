import express from 'express';
import { Op } from 'sequelize';
import { Cart, CartRow, Product, User } from '../sequelize.js';
const router = express.Router();

// Get all carts with optional filters
router.route('/').get(async (req, res) => {
  try {
    const query = {};
    const allowedFilters = ['cartId', 'userId'];
    const filterKeys = Object.keys(req.query).filter(e => allowedFilters.includes(e));
    query.include = [{
      model: Product,
      through: 'CartRow'
    }]
    if (filterKeys.length > 0) {
      query.where = {};
      for (const key of filterKeys) {
        query.where[key] = {
          [Op.eq]: req.query[key],
        };
      }
    }

    const carts = await Cart.findAll(query);
    res.status(200).send(carts);
  } catch (error) {
    console.error('Error retrieving carts:', error);
    res.status(500).json({ error: 'An error occurred while fetching carts.' });
  }
});

// Get a single cart by ID
router.route('/:id').get(async (req, res) => {
  try {
    const cartId = req.params.id;
    const cart = await Cart.findByPk(cartId);
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
    } else {
      res.status(200).send(cart);
    }
  } catch (error) {
    console.error('Error retrieving cart:', error);
    res.status(500).json({ error: 'An error occurred while fetching the cart.' });
  }
});

// Create a new cart
router.route('/').post(async (req, res) => {
  try {
    let cart = await Cart.findOne({ where: { userId: req.body.userId } });
    if (!cart) {
      cart = await Cart.create({ userId: req.body.userId });
    }
    const products = req.body.products;
    for (let product of products) {
      const cartRow = await CartRow.findOne({ where: { cartId: cart.cartId, productId: product.productId } });
      if (!cartRow) {
        await CartRow.create({ cartId: cart.cartId, productId: product.productId, quantity: product.quantity })
      } else {
        await cartRow.update({ quantity: cartRow.quantity + 1 });
      }
    }

    return res.status(201).send(cart);
  } catch (error) {
    console.error('Error creating cart:', error);
    res.status(500).json({ error: 'An error occurred while creating the cart.' });
  }
});

// Update a cart by ID
router.route('/:id').put(async (req, res) => {
  try {
    const cartId = req.params.id;
    const cart = await Cart.findByPk(cartId);
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
    } else {
      await cart.update(req.body);
      res.status(200).send(cart);
    }
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'An error occurred while updating the cart.' });
  }
});

// Update a product from cart
router.route('/rows/:cartId/:productId').put(async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const productId = req.params.productId;
    const cartRow = await CartRow.findOne({ where: { cartId, productId } });
    if (!cartRow) {
      res.status(404).json({ message: 'CartRow not found' });
    } else {
      await cartRow.update({ quantity: req.body.quantity });
      res.status(200).send(cartRow);
    }
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'An error occurred while updating the cart.' });
  }
});

// Delete a product from cart
router.route('/rows/:cartId/:productId').delete(async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const productId = req.params.productId;
    const cartRow = await CartRow.findOne({ where: { cartId, productId } });
    if (!cartRow) {
      res.status(404).json({ message: 'CartRow not found' });
    } else {
      await cartRow.destroy();
      res.status(200).send(cartRow);
    }
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'An error occurred while updating the cart.' });
  }
});

// Delete a cart by ID and decrease product stock
router.route('/:id').delete(async (req, res) => {
  try {
    const cartId = req.params.id;

    const cart = await Cart.findByPk(cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartRows = await CartRow.findAll({ where: { cartId }, include: [Product] });

    // Actualizează stocul fiecărui produs
    for (let row of cartRows) {
      const product = row.Product; // Include modelul Product în query
      if (product) {
        const newStock = product.stock - row.quantity;
        await product.update({ stock: newStock >= 0 ? newStock : 0 }); // Evită stocuri negative
      }
      // Șterge rândul din cart
      await row.destroy();
    }


    await cart.destroy();

    res.status(200).json({ message: 'Cart deleted successfully and stock updated' });
  } catch (error) {
    console.error('Error deleting cart:', error);
    res.status(500).json({ error: 'An error occurred while deleting the cart.' });
  }
});


export default router;