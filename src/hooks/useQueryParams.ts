import { useEffect, useState } from 'react';
import type { QueryParams } from '../types/dadata.types';

/**
 * Хук для чтения query параметров из URL
 * Извлекает user_id и session_id из URL
 *
 * Примеры:
 * - ?user_id=123 → { user_id: "123" }
 * - ?user_id=123&session_id=abc → { user_id: "123", session_id: "abc" }
 * - без параметров → {}
 */
export const useQueryParams = (): QueryParams => {
  const [params, setParams] = useState<QueryParams>({});

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    const user_id = searchParams.get('user_id');
    const session_id = searchParams.get('session_id');

    setParams({
      user_id: user_id || undefined,
      session_id: session_id || undefined,
    });

    // Логируем для отладки
    console.log('Query params:', {
      user_id: user_id || 'not provided',
      session_id: session_id || 'not provided'
    });
  }, []);

  return params;
};
