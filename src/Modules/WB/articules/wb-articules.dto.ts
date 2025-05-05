
export class CreateWbArticulesRecord {
    nmid          : string 
    imtID       ? : string
    nmUUID      ? : string
    subjectID   ? : string
    subjectName ? : string
    vendorCode  ? : string
    title       ? : string
    brand       ? : string
    photos      ? : string
    accountId     : number
}

export class exportDataArt {
    data: [
        {
            nmid: string,
            id: number
        }
    ]
    message: string
    code: number
} 