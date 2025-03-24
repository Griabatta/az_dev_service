import { IsBoolean, IsNumber, IsOptional, isString, IsString } from "class-validator"

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

  @IsString()
  operation_id:           string;
  
  @IsString() 
  operation_type:         string;
  
  @IsString()
  operation_date:         string;
  
  @IsString()
  operation_type_name:    string;
  
  @IsNumber()
  delivery_charge:        number;
  
  @IsNumber()
  return_delivery_charge: number;
  
  @IsNumber()
  accruals_for_sale:      number;
  
  @IsNumber()
  sale_commission:        number;
  
  @IsNumber()
  amount:                 number;
  
  @IsString()
  type:                   string;
  
  @IsString()
  @IsOptional()
  delivery_schema?:       string | null;
  
  @IsString()
  @IsOptional() 
  order_date?:            string | null;
  
  @IsString()
  @IsOptional() 
  posting_number?:        string | null;
  
  @IsString()
  @IsOptional() 
  warehouse_id?:          string | null;
  
  @IsOptional() 
  items?:                 any;
  
  @IsOptional() 
  services?:              any; 
}

export class CreateProductDto {
  @IsBoolean()
  archived: boolean;

  @IsBoolean()
  has_fbo_stocks: boolean;

  @IsBoolean()
  has_fbs_stocks: boolean;

  @IsBoolean()
  is_discounted: boolean;

  @IsString() 
  offer_id: string;

  @IsString() 
  product_id: string; 

  @IsOptional()
  @IsString()
  quants?: string; 
}