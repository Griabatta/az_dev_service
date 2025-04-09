import { Injectable, Logger } from "@nestjs/common";
import { BundleType } from "./bundle.type";
import { PerformanceCampaingsRep } from "../../repositories/campaings.repostiroty";
import { BundleRepo } from "./repository/bundle.repository";
import { UserRep } from "src/Modules/Auth/repository/user.repository";

@Injectable()
export class BundleService {

  constructor(
    private readonly campaignsRep: PerformanceCampaingsRep,

    private readonly bundleRep: BundleRepo,

    private readonly userService: UserRep
  ) {}

  async createBundle(campaignsData: BundleType.Campaigns, userId: number) {
    const chunkSize: number = 10;
    
    if (campaignsData.length > 0 ) {
      for (let i: number = 0; i <= campaignsData.length; i += 10) {
        const chunk: string[] = campaignsData.slice(i, i + chunkSize)
        .map(c => c.campaignId)
        .filter((id): id is string => id !== null);
        const data: BundleType.ImportCampaignsForBundle = {
          user: {
            connect: {
              id: userId
            }
          },
          campaigns: chunk,
          type: `${campaignsData[i]?.advObjectType}`,
          status: "Registered"
        }
        await this.bundleRep.createBundle(data);
      }
    }
  }

  async registerBundle(userId: number = 1) {
    const campaigns: BundleType.Campaigns = await this.campaignsRep.getCamaignsByUserIdForBundle(userId) || [{}];
    const bundleByUser = await this.bundleRep.getBundleByUserId(userId);

    if (campaigns.length > 0 && bundleByUser.length === 0) {
      const traffarets: BundleType.Campaigns = campaigns.filter(camp => camp.advObjectType === "SKU");
      const search: BundleType.Campaigns = campaigns.filter(camp => camp.advObjectType === "SEARCH_PROMO");
      const banner: BundleType.Campaigns = campaigns.filter(camp => camp.advObjectType === "BANNER");
      if (traffarets.length > 0) {
        await this.createBundle(traffarets, userId);
      };

      if (search.length > 0) {
        await this.createBundle(search, userId);
      };

      if (banner.length > 0) {
        await this.createBundle(banner, userId);
      };

    }
  };

  async registerBundleForAllUsers() {
    const users = await this.userService.getAllUser();
    if (!users) {
      Logger.log("User(-s) not found");
    }
    if (users.length > 0) {
      users.map(async user => {
        await this.registerBundle(user.id);
      })
    } 
  };


};