import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApplication } from '../contexts/ApplicationContext';
import { FormData as AppFormData } from '../types';
import { FileText, User, Phone, MapPin, CreditCard, Send } from 'lucide-react';
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

const TelegramApplicationForm: React.FC = () => {
  const { state, createApplication } = useApplication();
  const [totalAmount, setTotalAmount] = useState(0);
  const [usdAmount, setUsdAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const watchedFields = watch(['categories', 'medical', 'school']);

  // Calculate total amount
  useEffect(() => {
    if (!state.config) return;

    let total = 0;
    const categories = watchedFields[0] || [];
    const medical = watchedFields[1];
    const school = watchedFields[2];

    // Add category prices
    categories.forEach((category) => {
      if (category in state.config!.prices.categories) {
        total += state.config!.prices.categories[category as keyof typeof state.config.prices.categories];
      }
    });

    // Add medical certificate price
    if (medical === 'order') {
      total += state.config.prices.medical.order;
    }

    // Add school price
    if (school === 'no') {
      total += state.config.prices.school.no;
    }

    setTotalAmount(total);

    // Convert to USD
    if (state.exchangeRate) {
      setUsdAmount(Math.round(total / state.exchangeRate.rate));
    }
  }, [watchedFields, state.config, state.exchangeRate]);

  const onFormSubmit = async (data: AppFormData) => {
    if (!state.config) {
      toast.error('Конфигурация не загружена');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      formData.append('full_name', data.fullName);
      formData.append('passport_number', data.passportNumber);
      formData.append('phone', data.phone);
      formData.append('categories', JSON.stringify(data.categories));
      formData.append('medical', data.medical);
      formData.append('school', data.school);
      formData.append('delivery_method', data.deliveryMethod);
      formData.append('delivery_address', data.deliveryAddress || '');
      formData.append('city', data.city || '');
      formData.append('total_amount', totalAmount.toString());
      
      if (data.signature) formData.append('signature', data.signature);
      if (data.personalPhoto) formData.append('personal_photo', data.personalPhoto);
      if (data.medCertificate) formData.append('med_certificate', data.medCertificate);

      await createApplication(formData);
      toast.success('Заявка успешно отправлена!');
      
    } catch (error) {
      console.error('Ошибка отправки заявки:', error);
      toast.error('Ошибка отправки заявки');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Заявка на водительские права
        </h1>
        <p className="text-gray-600">
          Заполните форму для получения документов
        </p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Personal Data */}
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold">Личные данные</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ФИО полностью
              </label>
              <input
                {...register('fullName')}
                className="mobile-form w-full"
                placeholder="Иванов Иван Иванович"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Номер паспорта
              </label>
              <input
                {...register('passportNumber')}
                className="mobile-form w-full"
                placeholder="1234 567890"
              />
              {errors.passportNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.passportNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Номер телефона
              </label>
              <input
                {...register('phone')}
                className="mobile-form w-full"
                placeholder="+7 (999) 123-45-67"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center mb-4">
            <FileText className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold">Категории прав</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {['A', 'B', 'C', 'D'].map((category) => (
              <label key={category} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  value={category}
                  {...register('categories')}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">Категория {category}</div>
                  <div className="text-sm text-gray-600">
                    {state.config?.prices.categories[category as keyof typeof state.config.prices.categories] || 0} ₽
                  </div>
                </div>
              </label>
            ))}
          </div>
          {errors.categories && (
            <p className="text-red-500 text-sm mt-2">{errors.categories.message}</p>
          )}
        </div>

        {/* Files */}
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Документы</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Фотография подписи *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setValue('signature', e.target.files?.[0] || null)}
                className="w-full text-sm"
              />
              {errors.signature && (
                <p className="text-red-500 text-sm mt-1">{errors.signature.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Личная фотография *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setValue('personalPhoto', e.target.files?.[0] || null)}
                className="w-full text-sm"
              />
              {errors.personalPhoto && (
                <p className="text-red-500 text-sm mt-1">{errors.personalPhoto.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Documents Options */}
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Дополнительные услуги</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Медицинская справка
              </label>
              <select {...register('medical')} className="mobile-form w-full">
                <option value="">Выберите вариант</option>
                <option value="yes">У меня есть</option>
                <option value="no">Не нужна</option>
                <option value="order">Заказать (+{state.config?.prices.medical.order || 0} ₽)</option>
              </select>
              {errors.medical && (
                <p className="text-red-500 text-sm mt-1">{errors.medical.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Автошкола
              </label>
              <select {...register('school')} className="mobile-form w-full">
                <option value="">Выберите вариант</option>
                <option value="yes">Проходил</option>
                <option value="no">Не проходил (+{state.config?.prices.school.no || 0} ₽)</option>
              </select>
              {errors.school && (
                <p className="text-red-500 text-sm mt-1">{errors.school.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Delivery */}
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center mb-4">
            <MapPin className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold">Доставка</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Способ доставки
              </label>
              <select {...register('deliveryMethod')} className="mobile-form w-full">
                <option value="">Выберите способ</option>
                <option value="courier">Курьером</option>
                <option value="post">Почтой России</option>
              </select>
              {errors.deliveryMethod && (
                <p className="text-red-500 text-sm mt-1">{errors.deliveryMethod.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Адрес доставки
              </label>
              <textarea
                {...register('deliveryAddress')}
                className="mobile-form w-full h-20"
                placeholder="Укажите полный адрес для доставки"
              />
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center mb-2">
            <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-blue-800">Итого к оплате</h3>
          </div>
          <div className="text-2xl font-bold text-blue-800">
            {totalAmount.toLocaleString()} ₽
          </div>
          {usdAmount > 0 && (
            <div className="text-blue-600">
              ≈ ${usdAmount} USD
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mobile-button flex items-center justify-center py-4 text-lg"
        >
          {isSubmitting ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
          ) : (
            <Send className="w-5 h-5 mr-2" />
          )}
          {isSubmitting ? 'Отправка...' : 'Подать заявку'}
        </button>
      </form>
    </div>
  );
};

export default TelegramApplicationForm;
