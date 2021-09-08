import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronService {

  constructor(
    private readonly userService: UserService,
  ) {
  }

  private readonly logger = new Logger(CronService.name);

  @Cron('0 0 0 * * *')
  resetLimitConnect() {
    this.userService.resetLimitConnect();
    this.logger.debug('Called when the 0h new day');
  }
}