import { Optional } from "@nestjs/common"
import { IsNumber, IsString } from "class-validator"

export class CampaingCreateDto {
    @IsString()
    createdAt:           string

    @IsString()
    campaingId:         string

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