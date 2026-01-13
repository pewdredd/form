import { useState } from 'react';
import { AddressSuggestions } from 'react-dadata';
import type { DaDataSuggestion, DaDataAddress } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';
import { sendStepByStepAddressData } from '../services/api';
import { useQueryParams } from '../hooks/useQueryParams';
import type { StepByStepFormData } from '../types/stepByStepForm.types';
import './StepByStepAddressForm.css';

export const StepByStepAddressForm = () => {
  const [formData, setFormData] = useState<StepByStepFormData>({
    city: undefined,
    street: undefined,
    house: undefined,
    city_fias_id: undefined,
    street_fias_id: undefined,
    building: '',
    apartment: '',
    entrance: '',
    floor: '',
    courierComment: '',
    deliveryConditions: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { user_id, session_id } = useQueryParams();

  // Обработчик выбора города
  const handleCityChange = (suggestion: DaDataSuggestion<DaDataAddress> | undefined) => {
    setFormData({
      ...formData,
      city: suggestion,
      city_fias_id: suggestion?.data.city_fias_id || suggestion?.data.settlement_fias_id || undefined,
      // Сбрасываем улицу и дом при смене города
      street: undefined,
      house: undefined,
      street_fias_id: undefined,
    });
  };

  // Обработчик выбора улицы
  const handleStreetChange = (suggestion: DaDataSuggestion<DaDataAddress> | undefined) => {
    setFormData({
      ...formData,
      street: suggestion,
      street_fias_id: suggestion?.data.street_fias_id || undefined,
      // Сбрасываем дом при смене улицы
      house: undefined,
    });
  };

  // Обработчик выбора дома
  const handleHouseChange = (suggestion: DaDataSuggestion<DaDataAddress> | undefined) => {
    setFormData({
      ...formData,
      house: suggestion,
    });
  };

  // Обработчик изменения текстовых полей
  const handleFieldChange = (field: keyof StepByStepFormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Валидация формы
  const validateForm = (): string | null => {
    if (!formData.city) {
      return 'Пожалуйста, выберите город из списка';
    }
    if (!formData.street) {
      return 'Пожалуйста, выберите улицу из списка';
    }
    if (!formData.house) {
      return 'Пожалуйста, выберите дом из списка';
    }
    if (!formData.apartment.trim()) {
      return 'Пожалуйста, укажите квартиру/офис';
    }
    return null;
  };

  // Отправка формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await sendStepByStepAddressData({
        ...formData,
        user_id,
        session_id,
      });

      setSuccess(true);

      // Очистить форму
      setFormData({
        city: undefined,
        street: undefined,
        house: undefined,
        city_fias_id: undefined,
        street_fias_id: undefined,
        building: '',
        apartment: '',
        entrance: '',
        floor: '',
        courierComment: '',
        deliveryConditions: '',
      });

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
      <div className="step-form-container">
        <div className="error-message">
          <h3>Ошибка конфигурации</h3>
          <p>VITE_DADATA_TOKEN не настроен в .env файле</p>
          <p>Создай файл .env и добавь токен DaData</p>
        </div>
      </div>
    );
  }

  // Проверка, можно ли активировать поля
  const canEnableStreet = !!formData.city_fias_id;
  const canEnableHouse = !!formData.street_fias_id;
  const canEnableOtherFields = !!formData.house;

  return (
    <div className="step-form-container">
      <h1>Адрес доставки</h1>

      {/* Debug info */}
      {(user_id || session_id) && (
        <div className="debug-info">
          <p><strong>Debug информация:</strong></p>
          {user_id && <p>User ID: <code>{user_id}</code></p>}
          {session_id && <p>Session ID: <code>{session_id}</code></p>}
        </div>
      )}

      {/* Индикатор прогресса */}
      <div className="progress-indicator">
        <div className={`step ${formData.city ? 'completed' : 'active'}`}>
          <span className="step-number">1</span>
          <span className="step-label">Город</span>
        </div>
        <div className={`step ${formData.street ? 'completed' : formData.city ? 'active' : ''}`}>
          <span className="step-number">2</span>
          <span className="step-label">Улица</span>
        </div>
        <div className={`step ${formData.house ? 'completed' : formData.street ? 'active' : ''}`}>
          <span className="step-number">3</span>
          <span className="step-label">Дом</span>
        </div>
        <div className={`step ${formData.apartment ? 'completed' : formData.house ? 'active' : ''}`}>
          <span className="step-number">4</span>
          <span className="step-label">Детали</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Шаг 1: Город */}
        <div className="form-group">
          <label htmlFor="city">
            Город <span className="required">*</span>
          </label>
          <AddressSuggestions
            token={dadata_token}
            value={formData.city}
            onChange={handleCityChange}
            filterFromBound="city"
            filterToBound="city"
            filterLocations={[
              { city_fias_id: 'c2deb16a-0330-4f05-821f-1d09c93331e6' }, // Санкт-Петербург
              { region_fias_id: '6d1ebb35-70c6-4129-bd55-da3969658f5d' }, // Ленинградская область
            ]}
            inputProps={{
              placeholder: 'СПб или города Ленинградской области...',
              required: true,
              id: 'city',
            }}
            count={10}
            delay={300}
          />
          <small className="help-text">
            Доступны только Санкт-Петербург и города Ленинградской области
          </small>
        </div>

        {/* Шаг 2: Улица */}
        <div className={`form-group ${!canEnableStreet ? 'disabled' : ''}`}>
          <label htmlFor="street">
            Улица <span className="required">*</span>
          </label>
          <AddressSuggestions
            token={dadata_token}
            value={formData.street}
            onChange={handleStreetChange}
            filterFromBound="street"
            filterToBound="house"
            filterLocations={formData.city_fias_id ? [{ city_fias_id: formData.city_fias_id }] : undefined}
            inputProps={{
              placeholder: canEnableStreet ? 'Начните вводить название улицы...' : 'Сначала выберите город',
              required: true,
              id: 'street',
              disabled: !canEnableStreet,
            }}
            count={10}
            delay={300}
          />
          <small className="help-text">
            {canEnableStreet ? 'Выберите улицу из списка подсказок' : 'Доступно после выбора города'}
          </small>
        </div>

        {/* Шаг 3: Дом */}
        <div className={`form-group ${!canEnableHouse ? 'disabled' : ''}`}>
          <label htmlFor="house">
            Дом <span className="required">*</span>
          </label>
          <AddressSuggestions
            token={dadata_token}
            value={formData.house}
            onChange={handleHouseChange}
            filterFromBound="house"
            filterToBound="house"
            filterLocations={formData.street_fias_id ? [{ street_fias_id: formData.street_fias_id }] : undefined}
            inputProps={{
              placeholder: canEnableHouse ? 'Начните вводить номер дома...' : 'Сначала выберите улицу',
              required: true,
              id: 'house',
              disabled: !canEnableHouse,
            }}
            count={10}
            delay={300}
          />
          <small className="help-text">
            {canEnableHouse ? 'Выберите дом из списка подсказок' : 'Доступно после выбора улицы'}
          </small>
        </div>

        {/* Дополнительные поля */}
        <div className={`additional-fields ${!canEnableOtherFields ? 'disabled' : ''}`}>
          {/* Корпус/строение */}
          <div className="form-group form-group-inline">
            <label htmlFor="building">Корпус/строение</label>
            <input
              type="text"
              id="building"
              value={formData.building}
              onChange={(e) => handleFieldChange('building', e.target.value)}
              placeholder="Например: 1А"
              disabled={!canEnableOtherFields}
              className="input-field"
            />
          </div>

          {/* Квартира/офис */}
          <div className="form-group form-group-inline">
            <label htmlFor="apartment">
              Квартира/офис <span className="required">*</span>
            </label>
            <input
              type="text"
              id="apartment"
              value={formData.apartment}
              onChange={(e) => handleFieldChange('apartment', e.target.value)}
              placeholder="Например: 42"
              required
              disabled={!canEnableOtherFields}
              className="input-field"
            />
          </div>

          {/* Подъезд */}
          <div className="form-group form-group-inline">
            <label htmlFor="entrance">Подъезд</label>
            <input
              type="text"
              id="entrance"
              value={formData.entrance}
              onChange={(e) => handleFieldChange('entrance', e.target.value)}
              placeholder="Например: 3"
              disabled={!canEnableOtherFields}
              className="input-field"
            />
          </div>

          {/* Этаж */}
          <div className="form-group form-group-inline">
            <label htmlFor="floor">Этаж</label>
            <input
              type="text"
              id="floor"
              value={formData.floor}
              onChange={(e) => handleFieldChange('floor', e.target.value)}
              placeholder="Например: 5"
              disabled={!canEnableOtherFields}
              className="input-field"
            />
          </div>
        </div>

        {/* Комментарий для курьера */}
        <div className={`form-group ${!canEnableOtherFields ? 'disabled' : ''}`}>
          <label htmlFor="courierComment">Комментарий для курьера</label>
          <textarea
            id="courierComment"
            value={formData.courierComment}
            onChange={(e) => handleFieldChange('courierComment', e.target.value)}
            placeholder="Дополнительная информация для курьера..."
            disabled={!canEnableOtherFields}
            className="textarea-field"
            rows={3}
          />
          <small className="help-text">
            Например: позвоните за 15 минут, домофон не работает
          </small>
        </div>

        {/* Особые условия доставки */}
        <div className={`form-group ${!canEnableOtherFields ? 'disabled' : ''}`}>
          <label htmlFor="deliveryConditions">Особые условия доставки</label>
          <textarea
            id="deliveryConditions"
            value={formData.deliveryConditions}
            onChange={(e) => handleFieldChange('deliveryConditions', e.target.value)}
            placeholder="Код домофона, пропуск, особые условия входа..."
            disabled={!canEnableOtherFields}
            className="textarea-field"
            rows={3}
          />
          <small className="help-text">
            Например: код домофона 123, нужен пропуск на охране
          </small>
        </div>

        {/* Сообщения об ошибках и успехе */}
        {error && (
          <div className="error-message">
            <strong>Ошибка:</strong> {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            <strong>Успешно!</strong> Адрес отправлен на обработку
          </div>
        )}

        {/* Кнопка отправки */}
        <button
          type="submit"
          disabled={loading || !canEnableOtherFields}
          className="submit-button"
        >
          {loading ? 'Отправка...' : 'Отправить адрес'}
        </button>
      </form>

      {/* Превью выбранного адреса */}
      {formData.house && (
        <div className="address-preview">
          <h3>Выбранный адрес:</h3>
          <p className="preview-address">
            {formData.city?.value}, {formData.street?.value}, д. {formData.house?.data.house}
            {formData.building && `, корп. ${formData.building}`}
            {formData.apartment && `, кв. ${formData.apartment}`}
          </p>
          {(formData.entrance || formData.floor) && (
            <p className="preview-details">
              {formData.entrance && `Подъезд: ${formData.entrance}`}
              {formData.entrance && formData.floor && ', '}
              {formData.floor && `Этаж: ${formData.floor}`}
            </p>
          )}
          {formData.courierComment && (
            <p className="preview-comment">
              <strong>Комментарий:</strong> {formData.courierComment}
            </p>
          )}
          {formData.deliveryConditions && (
            <p className="preview-comment">
              <strong>Условия доставки:</strong> {formData.deliveryConditions}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
