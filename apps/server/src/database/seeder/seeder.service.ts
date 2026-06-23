import { ResultAsync } from 'neverthrow';
import { KyselyService } from 'src/database/kysely.service';
import { NewQuote } from 'src/database/tables/quote.tables';
import { NewUser, UserId } from 'src/database/tables/user.tables';

import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

function createRandomUser(): NewUser {
  return {
    name: faker.person.firstName(),
    email: `${faker.string.uuid()}@gmail.com`,
    emailVerified: true,
  };
}

function createRandomQuote(ids: UserId[]): () => NewQuote {
  return () => ({
    author: faker.person.firstName(),
    content: faker.hacker.phrase(),
    context: faker.lorem.paragraph(),
    visibility: faker.helpers.arrayElement(['public', 'private']),
    userId: faker.helpers.arrayElement(ids),
  });
}

@Injectable()
export class SeederService {
  constructor(private readonly db: KyselyService) {}
  seed(): ResultAsync<void, void> {
    return this.db.withTransaction(() => {
      return ResultAsync.fromThrowable(
        async () => {
          await this.db.ctx.deleteFrom('vote').execute();
          await this.db.ctx.deleteFrom('quote').execute();
          await this.db.ctx.deleteFrom('user').execute();
          await this.db.ctx.deleteFrom('verification').execute();

          const fakeUsers = faker.helpers.multiple(createRandomUser, {
            count: 100,
          });
          const users = await this.db.ctx
            .insertInto('user')
            .values(fakeUsers)
            .returning('id')
            .execute();
          const userIds = users.map((user) => user.id);

          const fakeQuotes = faker.helpers.multiple(
            createRandomQuote(userIds),
            {
              count: 10000,
            },
          );
          const quotes = await this.db.ctx
            .insertInto('quote')
            .values(fakeQuotes)
            .returning('id')
            .execute();

          const quoteIds = quotes.map((quote) => quote.id);

          const fakeVotes = userIds
            .map((userId) => {
              return faker.helpers
                .arrayElements(quoteIds, { min: 0, max: 200 })
                .map((quoteId) => ({
                  userId,
                  quoteId,
                  value: faker.helpers.arrayElement([-1, 1]),
                }));
            })
            .flat();

          await this.db.ctx.insertInto('vote').values(fakeVotes).execute();

          await this.db.ctx
            .with('voteCount', (qc) =>
              qc
                .selectFrom('vote')
                .select([
                  'quoteId',
                  this.db.ctx.fn
                    .countAll<number>()
                    .filterWhere('vote.value', '=', 1)
                    .as('likes'),
                  this.db.ctx.fn
                    .countAll<number>()
                    .filterWhere('vote.value', '=', -1)
                    .as('dislikes'),
                ])
                .groupBy(['quoteId']),
            )
            .updateTable('quote')
            .from('voteCount')
            .whereRef('voteCount.quoteId', '=', 'quote.id')
            .set({
              likes: (eb) => eb.ref('voteCount.likes'),
              dislikes: (eb) => eb.ref('voteCount.dislikes'),
            })
            .execute();
        },
        (e) => {
          console.error(e);
        },
      )();
    });
  }
}
