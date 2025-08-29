import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormData } from '../../types';

interface PersonalDataFieldsProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

const PersonalDataFields: React.FC<PersonalDataFieldsProps> = ({ register, errors }) => {
  const formatPassport = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as XXXX XXXXXX
    if (digits.length <= 4) {
      return digits;
    } else if (digits.length <= 10) {
      return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    } else {
      return `${digits.slice(0, 4)} ${digits.slice(4, 10)}`;
    }
  };

  const formatPhone = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as +7 (XXX) XXX-XX-XX
    if (digits.length === 0) {
      return '';
    } else if (digits.length <= 1) {
      return '+7';
    } else if (digits.length <= 4) {
      return `+7 (${digits.slice(1)}`;
    } else if (digits.length <= 7) {
      return `+7 (${digits.slice(1, 4)}) ${digits.slice(4)}`;
    } else if (digits.length <= 9) {
      return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    } else {
      return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
    }
  };

  return (
    <div className="card">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        Личные данные для оформления
      </h3>
      <p className="text-gray-600 mb-6">
        Заполните все необходимые поля и прикрепите документы
      </p>
      
      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            ФИО
          </label>
          <div className="text-sm text-gray-500 mb-2">
            Введите полные фамилию, имя и отчество
          </div>
          <input
            type="text"
            id="fullName"
            placeholder="Иванов Иван Иванович"
            className={`input-field ${errors.fullName ? 'border-red-500 focus:ring-red-500' : ''}`}
            {...register('fullName')}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        {/* Passport Number */}
        <div>
          <label htmlFor="passportNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Номер паспорта
          </label>
          <div className="text-sm text-gray-500 mb-2">
            Введите серию и номер паспорта в формате XXXX XXXXXX
          </div>
          <input
            type="text"
            id="passportNumber"
            placeholder="1234 567890"
            className={`input-field ${errors.passportNumber ? 'border-red-500 focus:ring-red-500' : ''}`}
            {...register('passportNumber', {
              onChange: (e) => {
                e.target.value = formatPassport(e.target.value);
              }
            })}
          />
          {errors.passportNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.passportNumber.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Номер телефона для связи
          </label>
          <div className="text-sm text-gray-500 mb-2">
            Введите номер телефона в формате +7 (XXX) XXX-XX-XX
          </div>
          <input
            type="tel"
            id="phone"
            placeholder="+7 (XXX) XXX-XX-XX"
            className={`input-field ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
            {...register('phone', {
              onChange: (e) => {
                e.target.value = formatPhone(e.target.value);
              }
            })}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalDataFields;
