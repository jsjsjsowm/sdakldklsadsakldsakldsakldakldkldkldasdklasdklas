import React from 'react';
import { ExchangeRate } from '../../types';

interface PriceCalculatorProps {
  totalAmount: number;
  usdAmount: number;
  exchangeRate: ExchangeRate | null;
}

const PriceCalculator: React.FC<PriceCalculatorProps> = ({
  totalAmount,
  usdAmount,
  exchangeRate,
}) => {
  return (
    <div className="card">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        Итоговая стоимость
      </h3>
      
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-center flex-1">
            <div className="text-3xl font-bold text-blue-600">
              {totalAmount.toLocaleString()}
              <span className="text-lg ml-1">₽</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">Российские рубли</div>
          </div>
          
          <div className="mx-6 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
          </div>
          
          <div className="text-center flex-1">
            <div className="text-3xl font-bold text-purple-600">
              {usdAmount ? usdAmount.toLocaleString() : '—'}
              <span className="text-lg ml-1">$</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">Доллары США</div>
          </div>
        </div>
        
        {exchangeRate && (
          <div className="text-center">
            <div className="text-sm text-gray-600">
              Курс: {exchangeRate.rate} ₽/$
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Источник: {exchangeRate.source}
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-green-800 font-semibold">Финальная цена</span>
        </div>
        <p className="text-green-700 text-sm">
          Указанная стоимость является окончательной без скрытых платежей и дополнительных комиссий.
        </p>
      </div>
      
      {totalAmount === 0 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            Выберите категории прав для расчета стоимости
          </p>
        </div>
      )}
    </div>
  );
};

export default PriceCalculator;
