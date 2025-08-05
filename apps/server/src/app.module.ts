import { Module } from '@nestjs/common';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { KyselyModule } from 'src/database/kysely.module';
import { MigratorModule } from 'src/database/migrator/migrator.module';
import { QuotesModule } from './quotes/qoutes.module';

@Module({
  imports: [KyselyModule, MigratorModule, QuotesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
