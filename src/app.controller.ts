import { Controller, Get, Request } from '@nestjs/common';
import { AppService } from './app.service';

// 🛠️ FIX: Explicit Interface prevents unsafe return types
interface RequestWithUser extends Express.Request {
  user: Record<string, unknown>;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    // 🛠️ FIX: req.user is now strictly typed
    return req.user;
  }
}
