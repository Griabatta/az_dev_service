import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Prisma/prisma.service";
import { CreateOzonAnalyticsRecord } from "./ozon-analytics-per.dto";


@Injectable()
export class OzonAnalyticsRepository {

	constructor(
		private readonly prismaService: PrismaService
	) {}

	async CreatedAnalyticsManyRecords(data: CreateOzonAnalyticsRecord[]) {
		return await this.prismaService.statisticDaily.createMany({
			data,
			skipDuplicates: true
		});
	};

	async CreateAnalyticsRecord(data: CreateOzonAnalyticsRecord) {
		return await this.prismaService.statisticDaily.create({
			data
		})
	}

	async upsertAnalyticsManyRecord(data: CreateOzonAnalyticsRecord[]) {
		const BATCH_SIZE = 30;
		const batches: CreateOzonAnalyticsRecord[][] = [];

		if (data.length < BATCH_SIZE) {
		try {
			await this.prismaService.$transaction(
				data.map(stat => 
					this.prismaService.statisticDaily.upsert({
					where: { campaignIdCreatedAt: stat.campaignIdCreatedAt },
					update: stat,
					create: stat
					})
				)
			);
			return { message: "OK", code: 200 };
		} catch (e) {
			return { 
				message: e.message || e.text || "Unknown error", 
				code: e.code || e.status || 500 
			};
		}
		}

		for (let i = 0; i < data.length; i += BATCH_SIZE) {
			batches.push(data.slice(i, i + BATCH_SIZE));
		}

		let successBatch = 0;

		for (const batch of batches) {
			try {
				await this.prismaService.$transaction(
					batch.map(stat => 
						this.prismaService.statisticDaily.upsert({
						where: { campaignIdCreatedAt: stat.campaignIdCreatedAt },
						update: stat,
						create: stat
						})
					)
				);
				successBatch++;
			} catch (e) {
				console.error(`Ошибка в батче ${successBatch + 1}:`, e.message);
				
			}
		}

		if (successBatch === batches.length) {
			return { 
				message: `Completed batch: ${successBatch}/${batches.length}. OK`, 
				code: 200 
			};
			} else if (successBatch > 0) {
			return { 
				message: `Completed batch: ${successBatch}/${batches.length}. Partial success`, 
				code: 206 
			};
			} else {
			return { 
				message: `Completed batch: ${successBatch}/${batches.length}. All failed`, 
				code: 500 
			};
		}
	}

}