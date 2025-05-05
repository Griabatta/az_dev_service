import { IsNumber, IsString } from "class-validator"


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

export class updateTokenForAccountDTO {
    @IsString()
    performanceTokenId      :number

    @IsNumber()
    id                      :number
}

export class createPerfromanceTokenDTO {
    @IsString()
    clientPerForId          :string

    @IsString()
    clientSecret            :string

    @IsNumber()
    accountId      :number
}

