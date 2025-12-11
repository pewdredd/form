// Экспортируем типы из react-dadata
import type { DaDataSuggestion as DaDataSuggestionType, DaDataAddress as DaDataAddressType } from 'react-dadata';

export type {
  DaDataSuggestion,
  DaDataAddress,
  DaDataAddressSuggestion
} from 'react-dadata';

// Дополнительные типы для нашего приложения
export interface QueryParams {
  [key: string]: string | undefined;
}

export interface WebhookPayload {
  [key: string]: any;
  address: DaDataSuggestionType<DaDataAddressType> | null;
  timestamp: string;
  source: string;
}
