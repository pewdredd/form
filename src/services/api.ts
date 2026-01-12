import axios from 'axios';
import type { DaDataSuggestion, DaDataAddress } from 'react-dadata';
import type { StepByStepFormData, StepByStepWebhookPayload } from '../types/stepByStepForm.types';

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL;

interface AddressPayload {
  address: DaDataSuggestion<DaDataAddress> | undefined;
  user_id?: string;
  session_id?: string;
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

/**
 * Отправляет данные поэтапной формы адреса на N8N webhook
 *
 * @param data - Объект с данными поэтапной формы и идентификаторами пользователя
 * @returns Promise с ответом от webhook
 * @throws Error если WEBHOOK_URL не настроен или запрос не удался
 */
export const sendStepByStepAddressData = async (
  data: StepByStepFormData & { user_id?: string; session_id?: string }
) => {
  if (!WEBHOOK_URL) {
    throw new Error('VITE_WEBHOOK_URL не настроен в .env файле');
  }

  try {
    // Формируем полный адрес из отдельных компонентов (без дублирования)
    const fullAddressParts = [
      data.city?.data.city_with_type || data.city?.data.settlement_with_type,
      data.street?.data.street_with_type,
      data.house?.data.house ? `д. ${data.house.data.house}` : '',
      data.building ? `корп. ${data.building}` : '',
      data.apartment ? `кв. ${data.apartment}` : '',
    ].filter(Boolean);

    const fullAddress = fullAddressParts.join(', ');

    const payload: StepByStepWebhookPayload = {
      user_id: data.user_id,
      session_id: data.session_id,
      city: data.city,
      street: data.street,
      house: data.house,
      building: data.building,
      apartment: data.apartment,
      entrance: data.entrance,
      floor: data.floor,
      courierComment: data.courierComment,
      deliveryConditions: data.deliveryConditions,
      timestamp: new Date().toISOString(),
      source: 'step_by_step_address_form',
      fullAddress,
    };

    console.log('📤 Отправка поэтапной формы на webhook:', WEBHOOK_URL);
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
        throw new Error(`Webhook вернул ошибку: ${error.response.status}`);
      } else if (error.request) {
        throw new Error('Webhook не отвечает. Проверь URL и доступность сервера');
      }
    }

    throw new Error('Неизвестная ошибка при отправке данных');
  }
};
