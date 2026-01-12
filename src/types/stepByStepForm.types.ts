import type { DaDataSuggestion, DaDataAddress } from 'react-dadata';

/**
 * Интерфейс для поэтапной формы выбора адреса
 */
export interface StepByStepFormData {
  // DaData suggestions
  city: DaDataSuggestion<DaDataAddress> | undefined;
  street: DaDataSuggestion<DaDataAddress> | undefined;
  house: DaDataSuggestion<DaDataAddress> | undefined;

  // FIAS IDs для фильтрации
  city_fias_id: string | undefined;
  street_fias_id: string | undefined;

  // Дополнительные поля
  building: string; // Корпус/строение
  apartment: string; // Квартира/офис (обязательно)
  entrance: string; // Подъезд
  floor: string; // Этаж
  courierComment: string; // Комментарий для курьера
  deliveryConditions: string; // Особые условия доставки (арка, пропуск и т.д.)
}

/**
 * Payload для отправки на webhook
 */
export interface StepByStepWebhookPayload {
  user_id?: string;
  session_id?: string;

  // Полный адрес из DaData
  city: DaDataSuggestion<DaDataAddress> | undefined;
  street: DaDataSuggestion<DaDataAddress> | undefined;
  house: DaDataSuggestion<DaDataAddress> | undefined;

  // Дополнительные поля
  building: string;
  apartment: string;
  entrance: string;
  floor: string;
  courierComment: string;
  deliveryConditions: string;

  // Метаданные
  timestamp: string;
  source: string;

  // Полный склеенный адрес для удобства
  fullAddress: string;
}

/**
 * Настройки фильтрации для DaData
 */
export interface DaDataFilterConfig {
  filterFromBound?: 'country' | 'region' | 'area' | 'city' | 'settlement' | 'street' | 'house';
  filterToBound?: 'country' | 'region' | 'area' | 'city' | 'settlement' | 'street' | 'house';
  filterLocations?: Array<{
    city_fias_id?: string;
    street_fias_id?: string;
  }>;
}
