import { Kysely } from 'kysely';
import { DbContextModule } from 'src/database/cli/database-context.module';

import { NestFactory } from '@nestjs/core';

async function bootstrap(): Promise<void> {
  const email = process.argv[2];

  if (!email) {
    throw new Error('use: set-admin <email>');
  }

  const app = await NestFactory.createApplicationContext(DbContextModule);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = app.get(Kysely<any>);

  const res = await db
    .updateTable('user')
    .set({ role: 'admin' })
    .where('email', '=', email)
    .executeTakeFirst();

  if (!res.numUpdatedRows) {
    throw new Error('User not found');
  }

  await app.close();
  console.log(`User ${email} promoted to admin`);
}

bootstrap().catch((e: unknown) => {
  console.error(e);
  process.exit(1);
});
