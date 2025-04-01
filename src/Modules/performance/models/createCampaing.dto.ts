import { Optional } from "@nestjs/common"
import { IsDate, IsNumber, IsString } from "class-validator"

export class CampaingCreateDto {
    @IsDate()
    createdAt:           Date

    @IsString()
    campaignId:         string

    @IsString()
    status:             string

    @IsString()
    @Optional()
    cpmType?:           string

    @IsString()
    @Optional()
    advObjectType?:     string

    @IsString()
    @Optional()
    title?:             string

    @IsString()
    @Optional()
    fromDate?:          string

    @IsString()
    @Optional()
    toDate?:            string

    @IsString()
    @Optional()
    dailyBudget?:       string

    @IsString()
    @Optional()
    budget?:            string

    @IsNumber()
    userId:             number
}