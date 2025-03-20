
export class CreateAnalyticsDto {
  dimensions:             string
  revenue?:               number
  ordered_units?:         number
  unknown_metric?:        number
  hits_view_pdp?:         number
  hits_view?:             number
  hits_tocart_search?:    number
  hits_tocart_pdp?:       number
  hits_tocart?:           number
  session_view_search?:   number
  session_view_pdp?:      number
  session_view?:          number
  conv_tocart_search?:    number
  conv_tocart_pdp?:       number
  conv_tocart?:           number
  returns?:               number
  cancellations?:         number
  delivered_units?:       number
  position_category?:     number
}

export class CreateStockDto {
  sku:                  number	               
  warehouse_name:       string       
  item_code: 	          string          
  item_name: 	          string         
  free_to_sell_amount: 	number
  promised_amount: 	    number
  reserved_amount: 	    number
  idc?:                 number
};

export class CreateTransactionDto {
  operation_id:           number; 
  operation_type:         string;
  operation_date:         string;
  operation_type_name:    string;
  delivery_charge:        number;
  return_delivery_charge: number;
  accruals_for_sale:      number;
  sale_commission:        number;
  amount:                 number;
  type:                   string;
  delivery_schema?:       string | null; 
  order_date?:            string | null; 
  posting_number?:        string | null; 
  warehouse_id?:          number | null; 
  items?:                  any; 
  services?:              any; 
}

export class CreateProductDto {
  archived:            boolean
  has_fbo_stocks:      boolean
  has_fbs_stocks:      boolean
  is_discounted:       boolean
  offer_id:            string
  product_id:          number
  // quants
  quants:              string
}