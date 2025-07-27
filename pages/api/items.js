import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  const page = parseInt(req.query.page) || 0;
  const limit = 10;
  const offset = page * limit;

  try {
    const { rows } = await pool.query(
      'SELECT id, title, description FROM items ORDER BY id ASC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB 取得エラー' });
  }
}