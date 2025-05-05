import { isNumber, IsNumber, IsString } from "class-validator"


export class createOzonAccDTO {
    @IsString()
    clientId                :string
    
    @IsString()
    apiKey                  :string

    @IsString()
    clientPerforId          :string

    @IsString()
    clientSecret            :string
    
    @IsNumber()   
    userId                  :number
    
    @IsNumber()
    performanceTokenId      :number
}

export class createPerfromanceToken {
    @IsString()
    token                   :string
}

