import { Module } from '@nestjs/common';
import { HealthcheckController as HealthcheckController } from 'src/healthcheck/healthcheck.controller';

@Module({
  controllers: [HealthcheckController],
})
export class HealthcheckModule {}
