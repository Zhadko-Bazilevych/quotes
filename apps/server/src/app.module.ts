import { Module } from '@nestjs/common';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { KyselyModule } from 'src/database/kysely.module';

@Module({
  imports: [KyselyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
