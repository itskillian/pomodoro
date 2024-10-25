import { sql } from "@vercel/postgres";

export async function fetchVisitors() {
  try {
    const data = await sql`SELECT * FROM visitors`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch visitor data.');
  }
}