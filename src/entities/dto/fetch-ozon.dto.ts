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
    operation_type?: string[],
    posting_number: string,
    transaction_type?: string
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