import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormData } from '../../types';

interface DocumentOptionsProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

const DocumentOptions: React.FC<DocumentOptionsProps> = ({ register, errors }) => {
  return (
    <div className="space-y-8">
      {/* Medical Certificate */}
      <div className="card">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Медицинская справка
        </h3>
        <p className="text-gray-600 mb-6">
          Наличие медицинской справки для оформления
        </p>
        
        <div className="space-y-4">
          <label className="flex items-start space-x-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
            <input
              type="radio"
              value="yes"
              {...register('medical')}
              className="mt-1 w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="font-semibold text-gray-800">
                Есть справка
              </div>
              <div className="text-sm text-gray-600">
                У меня уже есть медицинская справка
              </div>
            </div>
          </label>
          
          <label className="flex items-start space-x-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
            <input
              type="radio"
              value="order"
              {...register('medical')}
              className="mt-1 w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="font-semibold text-gray-800">
                Заказать у нас
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  +5,000 ₽
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Поможем оформить справку
              </div>
            </div>
          </label>
        </div>
        
        {errors.medical && (
          <p className="mt-4 text-red-600 text-sm">{errors.medical.message}</p>
        )}
      </div>

      {/* School Certificate */}
      <div className="card">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Документ об автошколе
        </h3>
        <p className="text-gray-600 mb-6">
          Наличие документа об окончании автошколы
        </p>
        
        <div className="space-y-4">
          <label className="flex items-start space-x-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
            <input
              type="radio"
              value="yes"
              {...register('school')}
              className="mt-1 w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="font-semibold text-gray-800">
                Есть документ
              </div>
              <div className="text-sm text-gray-600">
                У меня есть свидетельство об окончании
              </div>
            </div>
          </label>
          
          <label className="flex items-start space-x-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
            <input
              type="radio"
              value="no"
              {...register('school')}
              className="mt-1 w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="font-semibold text-gray-800">
                Нужны документы
                <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                  +15,000 ₽
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Помощь в оформлении документов
              </div>
            </div>
          </label>
        </div>
        
        {errors.school && (
          <p className="mt-4 text-red-600 text-sm">{errors.school.message}</p>
        )}
      </div>
    </div>
  );
};

export default DocumentOptions;
