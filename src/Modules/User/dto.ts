import { IsString } from "class-validator"

export class createUserDTO{
    @IsString()
    tgId            : string

    @IsString()
    tableSheetId    : string
}

