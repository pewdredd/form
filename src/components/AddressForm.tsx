import { useState } from 'react';
import { AddressSuggestions } from 'react-dadata';
import type { DaDataSuggestion, DaDataAddress } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';
import { sendAddressData } from '../services/api';
import { useQueryParams } from '../hooks/useQueryParams';
import './AddressForm.css';

export const AddressForm = () => {
  const [address, setAddress] = useState<DaDataSuggestion<DaDataAddress> | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { user_id, session_id } = useQueryParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      setError('Пожалуйста, выберите адрес из списка');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await sendAddressData({
        address,
        user_id,
        session_id,
      });

      setSuccess(true);
      setAddress(undefined); // Очистить форму

      // Скрыть сообщение об успехе через 5 секунд
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка отправки данных. Попробуйте еще раз.';
      setError(errorMessage);
      console.error('Form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const dadata_token = import.meta.env.VITE_DADATA_TOKEN;

  if (!dadata_token) {
    return (
      <div className="address-form-container">
        <div className="error-message">
          <h3>⚠️ Ошибка конфигурации</h3>
          <p>VITE_DADATA_TOKEN не настроен в .env файле</p>
          <p>Создай файл .env и добавь токен DaData</p>
        </div>
      </div>
    );
  }

  return (
    <div className="address-form-container">
      <h1>📍 Выбор адреса доставки</h1>

      {/* Debug info - показываем query параметры */}
      {(user_id || session_id) && (
        <div className="debug-info">
          <p><strong>Debug информация:</strong></p>
          {user_id && <p>👤 User ID: <code>{user_id}</code></p>}
          {session_id && <p>🔑 Session ID: <code>{session_id}</code></p>}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="address">
            Введите адрес: <span className="required">*</span>
          </label>
          <AddressSuggestions
            token={dadata_token}
            value={address}
            onChange={setAddress}
            inputProps={{
              placeholder: 'Начните вводить адрес...',
              required: true,
              id: 'address',
            }}
            count={10}
            delay={300}
          />
          <small className="help-text">
            Начните вводить адрес, и появятся подсказки
          </small>
        </div>

        {/* Показываем выбранный адрес */}
        {address && (
          <div className="selected-address">
            <p><strong>✓ Выбран адрес:</strong></p>
            <p className="address-value">{address.value}</p>
            {address.data.geo_lat && address.data.geo_lon && (
              <p className="geo-info">
                📍 Координаты: {address.data.geo_lat}, {address.data.geo_lon}
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="error-message">
            <strong>❌ Ошибка:</strong> {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            <strong>✅ Успешно!</strong> Адрес отправлен на обработку
          </div>
        )}

        <button
          type="submit"
          disabled={!address || loading}
          className="submit-button"
        >
          {loading ? '⏳ Отправка...' : '📤 Отправить адрес'}
        </button>
      </form>
    </div>
  );
};
