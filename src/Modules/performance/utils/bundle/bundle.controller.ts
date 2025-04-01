import { Controller } from "@nestjs/common";
import { BundleService } from "./bundle.service";


@Controller('bundle')
export class BundleController {

  constructor(
    private readonly bundleService: BundleService
  ) {}
  
  async registerBundle(userId: number) {
    return this.bundleService.registerBundle(userId);
  }

  async registerBundleforAllUsers() {
    return this.bundleService.registerBundleForAllUsers();
  }
}