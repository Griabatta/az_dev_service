// import { Injectable } from '@nestjs/common';
// import { Cron } from '@nestjs/schedule';
// import { OzonSellerService } from '../logic/ozon_seller.service';
// import { analystDTO } from '../dto/fetch-ozon.dto';

// @Injectable()
// export class SchedulerService {
//   constructor(private readonly ozonFetchService: OzonSellerService) {}

//   @Cron('0 */2 * * *') // Каждые 2 часа
//   async handleCron() {
//     const headers = {
//       'az-client-id': 'your-client-id',
//       'az-api-key': 'your-api-key',
//     };
//     const metrics =  ['hits_view', 'session_view'];
//     const dimension = ['sku', 'modelID'];

//     // const payload: analystDTO = {
//     //     // date_from: datefrom || date_from,
//     //     // date_to: dateto || date_to,
//     //     // dimension: dimension || [ 'sku', 'day'],
//     //     // filters: filters || [],
//     //     // sort: sort || [{}],
//     //     // limit: limit || 1000,
//     //     // offset: offset || 0,
//     //     // metrics: metrics || ['revenue ', 'ordered_units']
//     // };

//     try {
//       const data = await this.ozonFetchService.getAnalyst(
//         "https://api-seller.ozon.ru/v1/analytics/data",
//         headers,
//         payload
//       );
//       // Сохраните данные в базу данных
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   }
// }