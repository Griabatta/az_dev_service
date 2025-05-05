import { Injectable, Logger } from "@nestjs/common";
import { BundleRepo } from "../bundle/repository/bundle.repository";
import { UserRep } from "src/Modules/Auth/repository/user.repository";
import { ReportRepo } from "./repository/report.repository";
import { TokenRepo } from "../token/repository/token.repository";
import axios from "axios";
import { JournalErrorsService } from "src/Errors/errors.service";
import { FetchRawReportDTO } from "./models/report.dto";
import { formatISO, lightFormat, parseISO, startOfDay, subDays } from "date-fns";
import { DuplicateChecker } from "src/utils/duplicateChecker";
import { PrismaService } from "src/Prisma/prisma.service";
import { Prisma } from "@prisma/client";

interface ApiCampaignData {
  [campaignId: string]: {
    title: string;
    report: {
      rows: Array<{
        search_query: string;
        sku: string;
        title: string;
        price: string;
        views: string;
        clicks: string;
        ctr: string;
        toCart: string;
        avgBid: string;
        moneySpent: string;
        orders: string;
        ordersMoney: string;
        models: string;
        modelsMoney: string;
        drr: string;
        createdAt: string;
      }>;
    };
  };
}

interface ParsedCampaignItem {
  searchQuery: string;
  sku: string;
  title: string;
  price: string;
  views: number;
  clicks: number;
  ctr: string;
  toCart: number;
  avgBid: string;
  moneySpent: string;
  orders: number;
  ordersMoney: string;
  models: number;
  modelsMoney: string;
  drr: string;
  createdAt: Date;
  createdAtDB: Date;
  campaignId: string;
  userId: number;
  type: string;
}

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name)
  constructor(
    private readonly bundle: BundleRepo,

    private readonly user: UserRep,

    private readonly report: ReportRepo,

    private readonly token: TokenRepo,

    private readonly errors: JournalErrorsService,

    private readonly duplicateChecker: DuplicateChecker,

    private readonly prisma: PrismaService
  ) {}
  apiUrl = "https://api-performance.ozon.ru:443/api/client";

  private async processReportData (
    apiData: ApiCampaignData, 
    userId: number, 
    campaignType: string
  ): Promise<any | boolean> {
    const parsedData = this.parseResponse(apiData, userId, campaignType);
   try {
    if (parsedData.length > 0) {
      await this.report.bulkUpsertCampaignItems(parsedData, userId);     
      return;
    }
    
   } catch (e) {
    this.logger.error(e.status || e.code)
    this.logger.error("Create Campaigns")
    return false;
   }
  }

  
  async fetchReport(userId: number, body: FetchRawReportDTO) {
    const token = await this.token.getTokenByUserId(userId);
    if (!token) {
      Logger.log("Token not found or Unauthorized");
    }
    const headers = {
      "Authorization": `Bearer ${token?.token || ""}`
    };
    try {
      
      const response = await axios.post(`${this.apiUrl}/statistics/json`, body, { headers });
      return response.data;
    } catch (e) {
      this.logger.error("FetchReport Error")
    }

  }


  async registrationReport() {
    try {
      const users = await this.user.getAllUser();
      if (!users.length) {
        this.logger.log("Users not found");
        return;
      }
  
      // Обрабатываем пользователей последовательно с контролем ошибок
      for (const user of users) {
        try {
          await this.processUserReport(user);
        } catch (error) {
          await this.errors.logError({
            userId: user.id,
            message: `Report processing failed: ${error.message}`,
            priority: 2,
            code: "500",
            serviceName: "Report"
          });
          this.logger.error(`Failed to process report for user ${user.id}:`, error);
        }
        
        // Добавляем задержку между пользователями
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      this.logger.error("Critical error in registrationReport:", error);
      throw error;
    }
  }
  
  private async processUserReport(user: any) {
    const [reportByUser, bundles] = await Promise.all([
      this.report.getReportByUserId(user.id),
      this.bundle.getBundleByUserId(user.id)
    ]);
  
    const registeredBundles = bundles.filter(b => b.status === "Registered");
    if (!registeredBundles.length || !registeredBundles[0]?.campaigns?.length) {
      return;
    }
  
    const bundleForReport = {
      campaigns: registeredBundles[0].campaigns,
      from: formatISO(subDays(new Date(), 30)),
      to: formatISO(new Date()),
      dateFrom: lightFormat(subDays(new Date(), 30), 'yyyy-MM-dd'),
      dateTo: lightFormat(new Date(), 'yyyy-MM-dd'),
      groupBy: "NO_GROUP_BY"
    };
  
    const response = await this.fetchReport(user.id, bundleForReport);
    const uuid = response?.UUID || response?.uuid;
    if (!uuid || !registeredBundles[0]?.id) return;
    await Promise.all([
      this.report.createReport({
        type: registeredBundles[0]?.type || "",
        uuid,
        status: "In progress",
        userId: user.id,
        bundleId: registeredBundles[0].id
      }),
      this.bundle.updateStatusBundle(registeredBundles[0].id, "Reported")
    ]);
  
    this.logger.log(`Report ${uuid} registered for user ${user.name}`);
  }

  async chekReadyReport() {
    try {
      const users = await this.user.getAllUser();
      if (!users || users.length === 0) {
        Logger.log("Users not found");
        return;
      }
  
      await Promise.all(users.map(async user => {
        try {
          const reports = await this.report.getReportByUserId(user.id);
          if (!reports || reports.length === 0) {
            Logger.log(`Reports for user ${user.email} not found`);
            return;
          }
  
          const token = await this.token.getTokenByUserId(user.id);
          if (!token) {
            this.logger.error("Token not found");
          }
  
          const headers = {
            Authorization: `Bearer ${token?.token}`
          };
  
          await Promise.all(reports.map(async report => {
            try {
              const response = await axios.get(
                `https://api-performance.ozon.ru:443/api/client/statistics/${report.uuid}`,
                { headers }
              );
  
              if (response.data.state === "OK") {
                
                
                const reportData = await axios.get(
                  `https://api-performance.ozon.ru:443/api/client/statistics/report?UUID=${report.uuid}`,
                  { headers }
                );

                const resultDataImportDb = await this.processReportData(reportData.data, user.id, report.type);
                if (!resultDataImportDb) {
                  await this.report.updateReport(report.id, "Completed");
                }
              } else if (response.data.state = "NOT_STARTED") {
                await this.report.updateReport(report.id, "ERROR");
                await this.bundle.updateStatusBundle(report.bundleId, "ERROR")
              } else {
                await this.report.updateReport(report.id, "In Progress");
                await this.bundle.updateStatusBundle(report.bundleId, "In Progress")
              }
            } catch (error) {
              this.errors.logError({
                userId: user.id,
                message: `Report check failed: ${error.message}`,
                priority: 2,
                code: "500",
                serviceName: "Report"
              });
            }
          }));
        } catch (error) {
          this.errors.logError({
            userId: user.id,
            message: `User report processing failed: ${error.message}`,
            priority: 2,
            code: "500",
            serviceName: "Report"
          });
        }
      }));
    } catch (error) {
      this.logger.error(`Global report check error: ${error.message}`);
    }
  }


  
  
  
  private parseResponse(apiData: ApiCampaignData, userId: number, campaignType: string): ParsedCampaignItem[] {
    const result: ParsedCampaignItem[] = [];

    for (const [campaignId, campaignData] of Object.entries(apiData)) {
      for (const row of campaignData.report.rows) {
        result.push({
          searchQuery: row.search_query || '',
          sku: row.sku,
          title: row.title || '',
          price: row.price || '0,00',
          views: parseInt(row.views) || 0,
          clicks: parseInt(row.clicks) || 0,
          ctr: row.ctr || '0,00',
          toCart: parseInt(row.toCart) || 0,
          avgBid: row.avgBid || '0,00',
          moneySpent: row.moneySpent || '0,00',
          orders: parseInt(row.orders) || 0,
          ordersMoney: row.ordersMoney || '0,00',
          models: parseInt(row.models) || 0,
          modelsMoney: row.modelsMoney || '0,00',
          drr: row.drr || '0,00',
          createdAt: row.createdAt ? parseISO(row.createdAt) : new Date(),
          createdAtDB: startOfDay(new Date()),
          campaignId,
          userId,
          type: campaignType
        });
      }
    }

    return result;
  }
}