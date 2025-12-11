import { useEffect, useState } from 'react';
import type { QueryParams } from '../types/dadata.types';

/**
 * Хук для чтения всех query параметров из URL
 * Извлекает все параметры динамически
 *
 * Примеры:
 * - ?user_id=123 → { user_id: "123" }
 * - ?user_id=123&order_session_id=abc → { user_id: "123", order_session_id: "abc" }
 * - ?foo=bar&baz=qux → { foo: "bar", baz: "qux" }
 * - без параметров → {}
 */
export const useQueryParams = (): QueryParams => {
  const [params, setParams] = useState<QueryParams>({});

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const allParams: QueryParams = {};

    // Извлекаем все query параметры
    searchParams.forEach((value, key) => {
      allParams[key] = value;
    });

    setParams(allParams);

    // Логируем для отладки
    console.log('Query params:', Object.keys(allParams).length > 0 ? allParams : 'no params');
  }, []);

  return params;
};
