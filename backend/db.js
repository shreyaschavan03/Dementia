import pg from 'pg';

const pool = new pg.Pool({
  user: 'postgres',
  host: 'db.jrbpdiyuhuafmtigoaxo.supabase.co',   // <-- changed from Supabase URL
  database: 'postgres',
  password: 'Secure@123',
  port: 5432
});

export default pool;
