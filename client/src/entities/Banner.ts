export enum BannerStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled'
}

export interface Banner {
  status: BannerStatus;
  _id: string;
  name: string;
  placeholder: string;
  layout: string;
  config: object;
}
