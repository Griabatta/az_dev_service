import { Injectable, Logger } from "@nestjs/common";
import { BundleType } from "./bundle.type";
import { PerformanceCampaingsRep } from "../../repositories/campaings.repostiroty";
import { BundleRepo } from "./repository/bundle.repository";
import { UserRep } from "src/Modules/Auth/repository/user.repository";

@Injectable()
export class BundleService {
  private readonly logger = new Logger(BundleService.name);
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

  async registerBundle(users: any) {
    
    const campaigns = await this.campaignsRep.getAllCampaigns();
    const bundleByUsers = await this.bundleRep.getBundleAll();
    var dataForCreate: any[] = []
    const chunkSize = 10;
    users.map(user => {
      var userIsBundle = false;
      bundleByUsers.map(bundle => {
        if (bundle.userId === user.id && (bundle.status === "Registered" || bundle.status === "ERROR")) {
          userIsBundle = true;
        }
      });
      if (userIsBundle) {
        return;
      }
      const campaignsByUser = campaigns.filter(camp => camp.userId === user.id);
      if (campaignsByUser.length === 0) {
        return;
      }
      for (let i: number = 0; i <= campaignsByUser.length; i += 10) {
        const chunk: string[] = campaignsByUser.slice(i, i + chunkSize)
        .map(c => c.campaignId)
        .filter((id): id is string => id !== null);
        const data = {
          userId: user.id,
          campaigns: chunk,
          type: `${campaignsByUser[i]?.advObjectType}`,
          status: "Registered"
        }
        dataForCreate.push(data);
      }
    })
    if (dataForCreate.length > 0) {
      await this.bundleRep.createManyBundle(dataForCreate);
    } else {
      this.logger.debug("NOT CREATE BUNDLE!!!")
    }
    // var UserHaveBundle = [];

    // if (bundleByUsers.length > 0)

    // if (campaigns.length > 0 && bundleByUsers.length === 0) {
    //   const traffarets: BundleType.Campaigns = campaigns.filter(camp => camp.advObjectType === "SKU");
    //   const search: BundleType.Campaigns = campaigns.filter(camp => camp.advObjectType === "SEARCH_PROMO");
    //   const banner: BundleType.Campaigns = campaigns.filter(camp => camp.advObjectType === "BANNER");
      
    //   if (traffarets.length > 0) {
    //     await this.createBundle(traffarets, userId);
    //   };

    //   if (search.length > 0) {
    //     await this.createBundle(search, userId);
    //   };

    //   if (banner.length > 0) {
    //     await this.createBundle(banner, userId);
    //   };

    // }
  };

  async registerBundleForAllUsers() {
    const users = await this.userService.getAllUser();
    if (!users) {
      Logger.log("User(-s) not found");
    }
    if (users.length > 0) {
      await this.registerBundle(users);
    } 
  };


};