import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApplication } from '../contexts/ApplicationContext';
import { FormData as AppFormData } from '../types';
import CategorySelection from './form/CategorySelection';
import PersonalDataFields from './form/PersonalDataFields';
import FileUploads from './form/FileUploads';
import DocumentOptions from './form/DocumentOptions';
import DeliveryOptions from './form/DeliveryOptions';
import PriceCalculator from './form/PriceCalculator';
import toast from 'react-hot-toast';

const formSchema = z.object({
  fullName: z.string().min(1, 'ФИО обязательно для заполнения'),
  passportNumber: z.string().regex(/^\d{4}\s\d{6}$/, 'Неверный формат номера паспорта'),
  phone: z.string().regex(/^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/, 'Неверный формат номера телефона'),
  categories: z.array(z.string()).min(1, 'Выберите хотя бы одну категорию'),
  medical: z.enum(['yes', 'no', 'order'], { required_error: 'Выберите вариант медицинской справки' }),
  school: z.enum(['yes', 'no'], { required_error: 'Выберите вариант образования' }),
  deliveryMethod: z.enum(['courier', 'post', ''], { required_error: 'Выберите способ доставки' }),
  deliveryAddress: z.string().optional(),
  city: z.string().optional(),
  signature: z.any().refine((file) => file !== null, 'Загрузите фотографию подписи'),
  personalPhoto: z.any().refine((file) => file !== null, 'Загрузите личную фотографию'),
  medCertificate: z.any().optional(),
});

interface ApplicationFormProps {
  onSubmit: () => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ onSubmit }) => {
  const { state, createApplication } = useApplication();
  const [totalAmount, setTotalAmount] = useState(0);
  const [usdAmount, setUsdAmount] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AppFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categories: [],
      medical: '',
      school: '',
      deliveryMethod: '',
      deliveryAddress: '',
      city: '',
      signature: null,
      personalPhoto: null,
      medCertificate: null,
    },
  });

  const watchedFields = watch();

  // Calculate total amount when form values change
  useEffect(() => {
    if (!state.config) return;

    let total = 0;
    const { prices } = state.config;

    // Add category prices
    watchedFields.categories?.forEach((category) => {
      if (category in prices.categories) {
        total += prices.categories[category as keyof typeof prices.categories];
      }
    });

    // Add medical price
    if (watchedFields.medical === 'order') {
      total += prices.medical.order;
    }

    // Add school price
    if (watchedFields.school === 'no') {
      total += prices.school.no;
    }

    setTotalAmount(total);

    // Calculate USD amount
    if (state.exchangeRate) {
      setUsdAmount(Math.round(total / state.exchangeRate.rate));
    }
  }, [watchedFields, state.config, state.exchangeRate]);

  const onFormSubmit = async (data: AppFormData) => {
    if (!state.config) {
      toast.error('Конфигурация не загружена');
      return;
    }

    // Validate delivery address if method is selected
    if (data.deliveryMethod && !data.deliveryAddress) {
      toast.error('Укажите адрес доставки');
      return;
    }

    // Create FormData for file upload
    const formData = new FormData();
    
    // Add text fields
    formData.append('full_name', data.fullName);
    formData.append('passport_number', data.passportNumber);
    formData.append('phone', data.phone);
    formData.append('medical', data.medical);
    formData.append('school', data.school);
    formData.append('total_amount', totalAmount.toString());
    
    if (data.deliveryMethod) {
      formData.append('delivery_method', data.deliveryMethod);
    }
    if (data.deliveryAddress) {
      formData.append('delivery_address', data.deliveryAddress);
    }
    if (data.city) {
      formData.append('city', data.city);
    }

    // Add categories
    data.categories.forEach(category => {
      formData.append('categories', category);
    });

    // Add files
    if (data.signature) {
      formData.append('signature', data.signature);
    }
    if (data.personalPhoto) {
      formData.append('personal_photo', data.personalPhoto);
    }
    if (data.medCertificate) {
      formData.append('med_certificate', data.medCertificate);
    }

    const result = await createApplication(formData);
    
    if (result.success) {
      onSubmit();
    }
  };

  if (state.loading.config || !state.config) {
    return (
      <div className="fullscreen-section gradient-bg">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p className="text-gray-600 mt-4">Загрузка конфигурации...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gradient mb-4">
            Оформление заявки
          </h2>
          <p className="text-xl text-gray-600">
            Заполните форму для получения водительского удостоверения
          </p>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-12">
          <CategorySelection
            categories={watchedFields.categories || []}
            onChange={(categories) => setValue('categories', categories)}
            error={errors.categories?.message}
          />

          <PersonalDataFields
            register={register}
            errors={errors}
          />

          <FileUploads
            onSignatureChange={(file) => setValue('signature', file)}
            onPersonalPhotoChange={(file) => setValue('personalPhoto', file)}
            onMedCertificateChange={(file) => setValue('medCertificate', file)}
            errors={errors}
          />

          <DocumentOptions
            register={register}
            errors={errors}
          />

          <DeliveryOptions
            register={register}
            watch={watch}
            errors={errors}
          />

          <PriceCalculator
            totalAmount={totalAmount}
            usdAmount={usdAmount}
            exchangeRate={state.exchangeRate}
          />

          <div className="text-center">
            <button
              type="submit"
              disabled={state.loading.application || totalAmount === 0}
              className="btn-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.loading.application ? (
                <span className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Создание заявки...</span>
                </span>
              ) : (
                'Оформить заявку'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
