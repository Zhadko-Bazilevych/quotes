import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthcheckController {
  @Get('health')
  check(): { status: string } {
    return { status: 'ok' };
  }
}
