import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';
import { users } from '@/app/lib/placeholder-data';

const client = await db.connect();

async function seedUsers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;
  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );
  return insertedUsers;
}

async function seedSessions() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS sessions (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID NOT NULL,
      time INT NOT NULL,
      work_duration INT NOT NULL,
      break_duration INT NOt NULL,
    )
  `;
  const insertedSessions = await Promise.all(
    sessions.map(
        (session) => client.sql`
          INSERT INTO sessions (user_id, time, work_duration, break_duration)
          VALUES (${session.user_id}, ${session.time}, ${session.work_duration}, ${session.break_duration})
          ON CONFLICT (id) DO NOTHING;
        `,
    ),
  );

  return insertedSessions;
}

async function seedVisitors() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS visitors (
      month VARCHAR(4) NOT NULL UNIQUE,
      visitors INT NOT NULL
    );
  `;

  const insertedVisitors = await Promise.all(
    visitors.map(
      (visitor) => client.sql`
        INSERT INTO revenue (month, visitors)
        VALUES (${visitor.month}, ${visitor.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedVisitors;
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedUsers();
    await seedStats();
    await client.sql`COMMIT`;

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}