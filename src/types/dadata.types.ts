// Экспортируем типы из react-dadata
export type {
  DaDataSuggestion,
  DaDataAddress,
  DaDataAddressSuggestion
} from 'react-dadata';

// Дополнительные типы для нашего приложения
export interface QueryParams {
  user_id?: string;
  session_id?: string;
}

export interface WebhookPayload {
  user_id?: string;
  session_id?: string;
  address: DaDataSuggestion<DaDataAddress> | null;
  timestamp: string;
  source: string;
}
