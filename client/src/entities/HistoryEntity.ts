export enum HistoryDocumentType {
  BANNER = 'banner',
  USER = 'user'
}

export interface HistoryEntity {
  _id: string;
  document_type: HistoryDocumentType;
  document_id: string;
  changed_at: string;
  changer_id: string;
  changer_username: string;
  previous_value: any;
  current_value: any;
}
