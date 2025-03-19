
export class CreateAnalyticsDto {
  dimensions: JSON
  revenue: string;
  ordered_units?: string;
  unknown_metric?: string ;
  hits_view_pdp?: string;
  hits_view?: string;
  hits_tocart_search?: string;
  hits_tocart_pdp?: string;
  hits_tocart?: string;
  session_view_search?: string;
  session_view_pdp?: string;
  session_view?: string;
  conv_tocart_search?: string;
  conv_tocart_pdp?: string;
  conv_tocart?: string;
  returns?: string;
  cancellations?: string;
  delivered_units?: string;
  position_category?: string;
}

export class CreateStockDto {
  sku:                  number	               
  warehouse_name:       string       
  item_code: 	          string          
  item_name: 	          string         
  free_to_sell_amount: 	number
  promised_amount: 	    number
  reserved_amount: 	    number
  idc?:                  number
};

export class CreateTransactionDto {
  operation_id:             number
  operation_type:           string
  operation_date:           string
  operation_type_name:      string
  delivery_charge:          number
  return_delivery_charge:   number
  accruals_for_sale:        number
  sale_commission :         number
  amount:                   number
  type:                     string
  //delivery schema     
  delivery_schema?:          string
  order_date?:               string
  posting_number?:           string
  warehouse_id?:             number
  //items     
  name_item?:                string
  sku_item?:                 number
  //services      
  name_services?:            string
  price_services?:           number
}

export class CreateProductDto {
  archived:            boolean
  has_fbo_stocks:      boolean
  has_fbs_stocks:      boolean
  is_discounted:       boolean
  offer_id:            string
  product_id:          number
  // quants
  quant_code?:          string
  quant_size?:          number
}