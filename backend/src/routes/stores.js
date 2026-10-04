const router = require('express').Router();
const pool = require('../db');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { buildFilters, buildOrder } = require('../listing');
const { ratingSchema } = require('../validators');

router.use(authenticate, authorize('USER'));

// Store listing with overall rating and the current user's own rating
router.get('/', async (req, res, next) => {
  try {
    const cols = { name: 's.name', address: 's.address' };
    const { where, params } = buildFilters(req.query, cols);
    params.push(req.user.id);
    const order = buildOrder(req.query, { ...cols, rating: 'rating', myRating: 'my_rating' }, 'name');
    const { rows } = await pool.query(
      `SELECT s.id, s.name, s.address,
              ROUND(AVG(r.rating), 1)::float AS rating,
              MAX(r.rating) FILTER (WHERE r.user_id = $${params.length}) AS my_rating
       FROM stores s LEFT JOIN ratings r ON r.store_id = s.id
       ${where} GROUP BY s.id ${order}`, params
    );
    res.json(rows);
  } catch (e) { next(e); }
});

// Submit or modify a rating (upsert on the unique user/store pair)
router.put('/:id/rating', validate(ratingSchema), async (req, res, next) => {
  try {
    const storeId = Number(req.params.id);
    const store = await pool.query('SELECT 1 FROM stores WHERE id = $1', [storeId]);
    if (!store.rowCount) return res.status(404).json({ message: 'Store not found' });
    await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating) VALUES ($1,$2,$3)
       ON CONFLICT (user_id, store_id) DO UPDATE SET rating = EXCLUDED.rating, updated_at = now()`,
      [req.user.id, storeId, req.body.rating]
    );
    const { rows } = await pool.query(
      `SELECT ROUND(AVG(rating), 1)::float AS rating FROM ratings WHERE store_id = $1`, [storeId]
    );
    res.json({ storeId, myRating: req.body.rating, rating: rows[0].rating });
  } catch (e) { next(e); }
});

module.exports = router;
