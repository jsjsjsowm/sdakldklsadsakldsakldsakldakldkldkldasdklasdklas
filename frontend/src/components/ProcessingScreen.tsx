import React from 'react';
import { useApplication } from '../contexts/ApplicationContext';
import { CheckCircleIcon, ClockIcon } from 'lucide-react';

const ProcessingScreen: React.FC = () => {
  const { state } = useApplication();
  const application = state.currentApplication;

  if (!application) {
    return (
      <div className="fullscreen-section gradient-bg">
        <div className="text-center">
          <p className="text-gray-600">Заявка не найдена</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fullscreen-section gradient-bg">
      <div className="max-w-2xl mx-auto text-center animate-fade-in">
        <div className="card">
          <div className="mb-8">
            {application.paymentConfirmed ? (
              <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-6 animate-pulse-soft" />
            ) : (
              <ClockIcon className="w-20 h-20 text-yellow-500 mx-auto mb-6 animate-pulse-soft" />
            )}
            
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {application.paymentConfirmed ? 'Заявка принята в обработку' : 'Ожидание оплаты'}
            </h1>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">
                Заявка №{application.id}
              </h2>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Дата создания:</span>
                  <span className="font-medium">
                    {new Date(application.createdAt).toLocaleString('ru-RU')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ФИО:</span>
                  <span className="font-medium">{application.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Телефон:</span>
                  <span className="font-medium">{application.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Сумма:</span>
                  <span className="font-medium">
                    {application.totalAmount.toLocaleString()} ₽
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Статус оплаты:</span>
                  <span className={`font-medium ${
                    application.paymentConfirmed ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {application.paymentConfirmed ? 'Оплачено' : 'Ожидает оплаты'}
                  </span>
                </div>
                {application.paymentType === 'partial' && application.remainingAmount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">К доплате при получении:</span>
                    <span className="font-medium text-orange-600">
                      {application.remainingAmount.toLocaleString()} ₽
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {application.paymentConfirmed ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="text-green-800 font-semibold">Статус обработки</span>
                </div>
                <p className="text-green-700 mb-4">
                  Ваша заявка находится в обработке. Уведомление о готовности документов придет в бот.
                </p>
                <div className="space-y-2 text-sm text-green-600">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Заявка проверена и принята в работу</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                    <span>Изготовление документов (4-7 дней)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                    <span>Отправка документов</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-yellow-800 mb-4">
                  Для завершения оформления заявки необходимо произвести оплату.
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="btn-primary"
                >
                  Перейти к оплате
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>
            По всем вопросам обращайтесь в техническую поддержку
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProcessingScreen;
