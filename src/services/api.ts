import axios from 'axios';
import type { DaDataSuggestion, DaDataAddress } from 'react-dadata';

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL;

interface AddressPayload {
  address: DaDataSuggestion<DaDataAddress> | undefined;
  [key: string]: any;
}

/**
 * Отправляет данные адреса на N8N webhook
 *
 * @param data - Объект с адресом и идентификаторами пользователя
 * @returns Promise с ответом от webhook
 * @throws Error если WEBHOOK_URL не настроен или запрос не удался
 */
export const sendAddressData = async (data: AddressPayload) => {
  if (!WEBHOOK_URL) {
    throw new Error('VITE_WEBHOOK_URL не настроен в .env файле');
  }

  try {
    const payload = {
      ...data,
      timestamp: new Date().toISOString(),
      source: 'address_form',
    };

    console.log('📤 Отправка на webhook:', WEBHOOK_URL);
    console.log('📦 Payload:', payload);

    const response = await axios.post(WEBHOOK_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 секунд
    });

    console.log('✅ Webhook ответил:', response.data);

    return response.data;
  } catch (error) {
    console.error('❌ Ошибка отправки на webhook:', error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Сервер ответил с ошибкой
        throw new Error(`Webhook вернул ошибку: ${error.response.status}`);
      } else if (error.request) {
        // Запрос был отправлен, но ответа не было
        throw new Error('Webhook не отвечает. Проверь URL и доступность сервера');
      }
    }

    throw new Error('Неизвестная ошибка при отправке данных');
  }
};
