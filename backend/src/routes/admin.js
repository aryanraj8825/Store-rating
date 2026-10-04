const router = require('express').Router();
const bcrypt = require('bcryptjs');
const pool = require('../db');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { buildFilters, buildOrder } = require('../listing');
const { adminUserSchema, storeSchema } = require('../validators');

router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT (SELECT COUNT(*) FROM users)::int   AS users,
              (SELECT COUNT(*) FROM stores)::int  AS stores,
              (SELECT COUNT(*) FROM ratings)::int AS ratings`
    );
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.get('/users', async (req, res, next) => {
  try {
    const cols = { name: 'u.name', email: 'u.email', address: 'u.address', role: 'u.role' };
    const { where, params } = buildFilters(req.query, cols, ['role']);
    const order = buildOrder(req.query, cols, 'name');
    const { rows } = await pool.query(
      `SELECT u.id, u.name, u.email, u.address, u.role FROM users u ${where} ${order}`, params
    );
    res.json(rows);
  } catch (e) { next(e); }
});

router.get('/users/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id,name,email,address,role FROM users WHERE id = $1', [req.params.id]);
    const user = rows[0];
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'OWNER') {
      const r = await pool.query(
        `SELECT ROUND(AVG(r.rating), 1)::float AS rating
         FROM stores s JOIN ratings r ON r.store_id = s.id WHERE s.owner_id = $1`, [user.id]
      );
      user.rating = r.rows[0].rating;
    }
    res.json(user);
  } catch (e) { next(e); }
});

router.post('/users', validate(adminUserSchema), async (req, res, next) => {
  try {
    const { name, email, address, password, role } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO users (name,email,password_hash,address,role) VALUES ($1,$2,$3,$4,$5)
       RETURNING id,name,email,address,role`,
      [name, email, await bcrypt.hash(password, 10), address, role]
    );
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

router.get('/owners', async (req, res, next) => {
  try {
    const { rows } = await pool.query(`SELECT id, name, email FROM users WHERE role = 'OWNER' ORDER BY name`);
    res.json(rows);
  } catch (e) { next(e); }
});

router.get('/stores', async (req, res, next) => {
  try {
    const cols = { name: 's.name', email: 's.email', address: 's.address' };
    const { where, params } = buildFilters(req.query, cols);
    const order = buildOrder(req.query, { ...cols, rating: 'rating' }, 'name');
    const { rows } = await pool.query(
      `SELECT s.id, s.name, s.email, s.address, ROUND(AVG(r.rating), 1)::float AS rating
       FROM stores s LEFT JOIN ratings r ON r.store_id = s.id
       ${where} GROUP BY s.id ${order}`, params
    );
    res.json(rows);
  } catch (e) { next(e); }
});

router.post('/stores', validate(storeSchema), async (req, res, next) => {
  try {
    const { name, email, address, ownerId } = req.body;
    if (ownerId) {
      const o = await pool.query(`SELECT 1 FROM users WHERE id = $1 AND role = 'OWNER'`, [ownerId]);
      if (!o.rowCount) return res.status(400).json({ message: 'Validation failed', errors: { ownerId: 'Choose a valid store owner' } });
    }
    const { rows } = await pool.query(
      `INSERT INTO stores (name,email,address,owner_id) VALUES ($1,$2,$3,$4) RETURNING id,name,email,address`,
      [name, email, address, ownerId || null]
    );
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

module.exports = router;
