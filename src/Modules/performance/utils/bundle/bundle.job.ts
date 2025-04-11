import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BundleService } from './bundle.service';
import { UserRep } from 'src/Modules/Auth/repository/user.repository';

@Injectable()
export class BundleCorsJob {
  private readonly logger = new Logger(BundleService.name);
  constructor(
    private readonly bundle: BundleService,
    private readonly user: UserRep
  ) {

  }

  
  // @Cron(CronExpression.EVERY_2_HOURS) 
  // async bundleRegistrationCron() {
  //   const users = await this.user.getAllUser();
  //   if (users.length > 0) {
  //       users.map(async user => {
  //           await this.bundle.registerBundle(user.id);
  //       });
  //   };    
  // };
}