import React from 'react';
import { UseFormRegister, UseFormWatch, FieldErrors } from 'react-hook-form';
import { FormData } from '../../types';
import { TruckIcon, MailIcon } from 'lucide-react';

interface DeliveryOptionsProps {
  register: UseFormRegister<FormData>;
  watch: UseFormWatch<FormData>;
  errors: FieldErrors<FormData>;
}

const DeliveryOptions: React.FC<DeliveryOptionsProps> = ({ register, watch, errors }) => {
  const deliveryMethod = watch('deliveryMethod');

  return (
    <div className="space-y-6">
      {/* Delivery Method */}
      <div className="card">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Способ доставки
        </h3>
        <p className="text-gray-600 mb-6">
          Выберите удобный способ получения документов
        </p>
        
        <div className="space-y-4">
          <label className="flex items-start space-x-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
            <input
              type="radio"
              value="courier"
              {...register('deliveryMethod')}
              className="mt-1 w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <TruckIcon className="w-6 h-6 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-gray-800">
                Курьером на дом
              </div>
              <div className="text-sm text-gray-600">
                Доставка курьером по указанному адресу
              </div>
            </div>
          </label>
          
          <label className="flex items-start space-x-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
            <input
              type="radio"
              value="post"
              {...register('deliveryMethod')}
              className="mt-1 w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <MailIcon className="w-6 h-6 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-gray-800">
                Почтой России
              </div>
              <div className="text-sm text-gray-600">
                Отправка заказным письмом
              </div>
            </div>
          </label>
        </div>
        
        {errors.deliveryMethod && (
          <p className="mt-4 text-red-600 text-sm">{errors.deliveryMethod.message}</p>
        )}
      </div>

      {/* Delivery Address */}
      {deliveryMethod && (
        <div className="card animate-slide-up">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Адрес доставки
          </h3>
          <p className="text-gray-600 mb-6">
            Укажите полный адрес для доставки документов
          </p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                Город
              </label>
              <input
                type="text"
                id="city"
                placeholder="Москва"
                className="input-field"
                {...register('city')}
              />
            </div>
            
            <div>
              <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 mb-2">
                Полный адрес
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                id="deliveryAddress"
                rows={3}
                placeholder="Индекс, город, улица, дом, квартира"
                className={`input-field ${errors.deliveryAddress ? 'border-red-500 focus:ring-red-500' : ''}`}
                {...register('deliveryAddress')}
              />
              {errors.deliveryAddress && (
                <p className="mt-1 text-sm text-red-600">{errors.deliveryAddress.message}</p>
              )}
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Важная информация:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Укажите точный и полный адрес</li>
              <li>• Убедитесь в правильности индекса</li>
              <li>• При доставке курьером будет произведен звонок</li>
              <li>• Документы передаются только получателю лично</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryOptions;
