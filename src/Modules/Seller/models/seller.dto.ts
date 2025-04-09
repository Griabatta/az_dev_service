export type headerDTO = Record<string, string>;

export interface stockDTO {
    limit: number,
    offset: number,
    warehouse_type: string
  }
  
  export interface analystDTO {
    date_from: string,
    date_to: string,
    metrics: string[],
    dimension: string[],
    filters: string[],
    sort: object[],
    limit: number,
    offset: number
  }
  
  export interface transactionDTO {
    filter: {
      date: {
        from: string,
        to: string
      },
      operation_type: string[],
      posting_number: string,
      transaction_type: string
    },
    page: number,
    page_size: number
  }
  
  
  export interface productListDTO {
    filter: {
      offer_id: string[],
      product_id: string[],
      visibility: string
    },
    last_id: string,
    limit: number
  }

  const allMetrics: string[] = [
    "revenue",
    "ordered_units",
    "hits_view_search",
    "hits_view_pdp",
    "hits_view",
    "hits_tocart_search",
    "hits_tocart_pdp",
    "hits_tocart",
    "session_view_search",
    "session_view_pdp",
    "session_view",
    "conv_tocart_search",
    "conv_tocart_pdp",
    "conv_tocart",
    "returns",
    "cancellations",
    "delivered_units",
    "position_category",
  ];
  
  // Разбиваем метрики на группы по 14
  export const metricGroups: string[][] = [];
  for (let i = 0; i < allMetrics.length; i += 14) {
    metricGroups.push(allMetrics.slice(i, i + 14));
  }

  export const metricTemplate = {
    "revenue": 0,
    "ordered_units": 0,
    "hits_view_search": 0,
    "hits_view_pdp": 0,
    "hits_view": 0,
    "hits_tocart_search": 0,
    "hits_tocart_pdp": 0,
    "hits_tocart": 0,
    "session_view_search": 0,
    "session_view_pdp": 0,
    "session_view": 0,
    "conv_tocart_search": 0,
    "conv_tocart_pdp": 0,
    "conv_tocart": 0,
    "returns": 0,
    "cancellations": 0,
    "delivered_units": 0,
    "position_category": 0
  };