require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../src/db');

(async () => {
  const hash = (p) => bcrypt.hashSync(p, 10);
  const users = [
    ['System Administrator Account', 'admin@example.com', 'Admin@1234', '1 Admin Street, Indore', 'ADMIN'],
    ['Sample Store Owner Account', 'owner@example.com', 'Owner@1234', '22 Market Road, Indore', 'OWNER'],
    ['Sample Normal User Account', 'user@example.com', 'User@1234', '5 Park Avenue, Indore', 'USER'],
  ];
  for (const [name, email, pw, address, role] of users) {
    await pool.query(
      `INSERT INTO users (name,email,password_hash,address,role) VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (email) DO NOTHING`,
      [name, email, hash(pw), address, role]
    );
  }
  const { rows } = await pool.query(`SELECT id FROM users WHERE email='owner@example.com'`);
  const ownerId = rows[0].id;
  const stores = [
    ['Corner Cafe', 'hello@cornercafe.test', '12 Main Street, Indore', ownerId],
    ['Green Basket Grocers', 'contact@greenbasket.test', '88 Station Road, Indore', null],
    ['Paper & Pine Books', 'shop@paperpine.test', '3 Library Lane, Indore', null],
  ];
  for (const [name, email, address, owner] of stores) {
    await pool.query(
      `INSERT INTO stores (name,email,address,owner_id) VALUES ($1,$2,$3,$4) ON CONFLICT (email) DO NOTHING`,
      [name, email, address, owner]
    );
  }
  console.log('Seeded. Logins: admin@example.com / Admin@1234, owner@example.com / Owner@1234, user@example.com / User@1234');
  await pool.end();
})().catch((e) => { console.error(e); process.exit(1); });
