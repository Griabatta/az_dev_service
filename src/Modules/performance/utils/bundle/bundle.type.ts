export namespace BundleType {
  export type Campaigns = Campaign[];
  
  
  
  type Campaign = {
    campaignId:      string | null
    advObjectType:   string | null
  };
  
  export type ImportCampaignsForBundle = {
    type:            string   | null
    campaigns:       string[]
    user:          {
      connect: {
        id: number
      }
    }
    reportId?:       number
    status:          string
  }
        
}