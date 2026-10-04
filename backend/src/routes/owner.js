const router = require('express').Router();
const pool = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('OWNER'));

router.get('/dashboard', async (req, res, next) => {
  try {
    const stores = (await pool.query(
      `SELECT s.id, s.name, s.address, ROUND(AVG(r.rating), 1)::float AS average, COUNT(r.id)::int AS count
       FROM stores s LEFT JOIN ratings r ON r.store_id = s.id
       WHERE s.owner_id = $1 GROUP BY s.id ORDER BY s.name`, [req.user.id]
    )).rows;
    for (const s of stores) {
      s.raters = (await pool.query(
        `SELECT u.id, u.name, u.email, r.rating, r.updated_at
         FROM ratings r JOIN users u ON u.id = r.user_id
         WHERE r.store_id = $1 ORDER BY r.updated_at DESC`, [s.id]
      )).rows;
    }
    res.json({ stores });
  } catch (e) { next(e); }
});

module.exports = router;
