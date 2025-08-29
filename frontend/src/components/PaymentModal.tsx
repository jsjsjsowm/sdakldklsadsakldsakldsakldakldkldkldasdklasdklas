import React, { useState, useEffect } from 'react';
import { useApplication } from '../contexts/ApplicationContext';
import { Application } from '../types';
import { X, CreditCard, Bitcoin, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: () => void;
  application: Application | null;
}

type PaymentStep = 'amount' | 'method' | 'crypto' | 'card';

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentComplete,
  application,
}) => {
  const { state, confirmPayment } = useApplication();
  const [currentStep, setCurrentStep] = useState<PaymentStep>('amount');
  const [paymentType, setPaymentType] = useState<'full' | 'partial'>('full');
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'card'>('crypto');
  const [isConfirming, setIsConfirming] = useState(false);

  const totalAmount = application?.totalAmount || 0;
  const usdAmount = state.exchangeRate ? Math.round(totalAmount / state.exchangeRate.rate) : 0;
  const partialAmount = Math.floor(totalAmount * 0.3);
  const partialUsdAmount = state.exchangeRate ? Math.round(partialAmount / state.exchangeRate.rate) : 0;

  useEffect(() => {
    if (isOpen) {
      setCurrentStep('amount');
      setPaymentType('full');
      setPaymentMethod('crypto');
    }
  }, [isOpen]);

  if (!isOpen || !application) return null;

  const handleConfirmPayment = async () => {
    setIsConfirming(true);
    try {
      const success = await confirmPayment(application.id, paymentType);
      if (success) {
        toast.success('Оплата подтверждена!');
        onPaymentComplete();
      }
    } catch (error) {
      toast.error('Ошибка подтверждения оплаты');
    } finally {
      setIsConfirming(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Адрес скопирован в буфер обмена');
    } catch (error) {
      toast.error('Ошибка копирования');
    }
  };

  const renderAmountStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Оплата заказа</h2>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {totalAmount.toLocaleString()} ₽
              </div>
              <div className="text-sm text-gray-600">Российские рубли</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {usdAmount.toLocaleString()} $
              </div>
              <div className="text-sm text-gray-600">Доллары США</div>
            </div>
          </div>
          {state.exchangeRate && (
            <div className="text-center mt-2 text-sm text-gray-500">
              Курс: {state.exchangeRate.rate} ₽/$
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Выберите тип оплаты</h3>
        
        <label className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
          <input
            type="radio"
            name="paymentType"
            value="full"
            checked={paymentType === 'full'}
            onChange={(e) => setPaymentType(e.target.value as 'full')}
            className="w-5 h-5 text-blue-600"
          />
          <div className="flex-1">
            <div className="font-semibold text-gray-800">Полная оплата</div>
            <div className="text-sm text-gray-600">100% суммы сейчас</div>
          </div>
          <div className="text-lg font-bold text-green-600">
            {totalAmount.toLocaleString()} ₽
          </div>
        </label>

        <label className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
          <input
            type="radio"
            name="paymentType"
            value="partial"
            checked={paymentType === 'partial'}
            onChange={(e) => setPaymentType(e.target.value as 'partial')}
            className="w-5 h-5 text-blue-600"
          />
          <div className="flex-1">
            <div className="font-semibold text-gray-800">Частичная оплата</div>
            <div className="text-sm text-gray-600">30% сейчас, остаток при получении</div>
          </div>
          <div className="text-lg font-bold text-orange-600">
            {partialAmount.toLocaleString()} ₽
          </div>
        </label>
      </div>

      <button
        onClick={() => setCurrentStep('method')}
        className="w-full btn-primary"
      >
        Далее
      </button>
    </div>
  );

  const renderMethodStep = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={() => setCurrentStep('amount')}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Способ оплаты</h2>
      </div>

      <div className="space-y-4">
        <label className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
          <input
            type="radio"
            name="paymentMethod"
            value="crypto"
            checked={paymentMethod === 'crypto'}
            onChange={(e) => setPaymentMethod(e.target.value as 'crypto')}
            className="w-5 h-5 text-blue-600"
          />
          <Bitcoin className="w-6 h-6 text-orange-500" />
          <div className="flex-1">
            <div className="font-semibold text-gray-800">Криптовалюта</div>
            <div className="text-sm text-gray-600">Оплата в USDT (TRC20)</div>
          </div>
        </label>

        <label className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === 'card'}
            onChange={(e) => setPaymentMethod(e.target.value as 'card')}
            className="w-5 h-5 text-blue-600"
          />
          <CreditCard className="w-6 h-6 text-blue-500" />
          <div className="flex-1">
            <div className="font-semibold text-gray-800">Банковская карта</div>
            <div className="text-sm text-gray-600">Оплата картой через оператора</div>
          </div>
        </label>
      </div>

      <button
        onClick={() => setCurrentStep(paymentMethod)}
        className="w-full btn-primary"
      >
        Далее
      </button>
    </div>
  );

  const renderCryptoStep = () => {
    const amount = paymentType === 'full' ? totalAmount : partialAmount;
    const usdAmountToPay = paymentType === 'full' ? usdAmount : partialUsdAmount;

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => setCurrentStep('method')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Оплата криптовалютой</h2>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-blue-600">
              {amount.toLocaleString()} ₽
            </div>
            <div className="text-xl font-bold text-purple-600">
              {usdAmountToPay.toLocaleString()} $
            </div>
            {state.exchangeRate && (
              <div className="text-sm text-gray-500">
                Курс: {state.exchangeRate.source}
              </div>
            )}
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-yellow-600 text-xl">⚠️</span>
            <span className="font-semibold text-yellow-800">Важно!</span>
          </div>
          <p className="text-yellow-700 text-sm">
            Отправляйте USDT только в сети TRC20
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Адрес кошелька USDT (TRC20):
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={state.config?.cryptoWallets.usdt || 'TWGYmrA4Q4M4qjHyNZBcgTpEh8ggKfniXx'}
                readOnly
                className="flex-1 input-field bg-gray-50"
              />
              <button
                onClick={() => copyToClipboard(state.config?.cryptoWallets.usdt || 'TWGYmrA4Q4M4qjHyNZBcgTpEh8ggKfniXx')}
                className="btn-secondary px-4"
              >
                📋
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleConfirmPayment}
          disabled={isConfirming}
          className="w-full btn-primary disabled:opacity-50"
        >
          {isConfirming ? 'Подтверждение...' : 'Подтвердить оплату'}
        </button>
      </div>
    );
  };

  const renderCardStep = () => {
    const amount = paymentType === 'full' ? totalAmount : partialAmount;

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => setCurrentStep('method')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Оплата картой</h2>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {amount.toLocaleString()} ₽
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-blue-600 text-xl">ℹ️</span>
            <span className="font-semibold text-blue-800">Для оплаты картой</span>
          </div>
          <p className="text-blue-700 text-sm mb-4">
            Напишите в Telegram следующую информацию:
          </p>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Тип оплаты: {paymentType === 'full' ? 'Полная' : 'Частичная'}</li>
            <li>• Сумма к оплате: {amount.toLocaleString()} ₽</li>
            <li>• ФИО: {application.fullName}</li>
          </ul>
        </div>

        <a
          href="https://t.me/LipaAleksandr"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          ✏️ Написать в Telegram @LipaAleksandr
        </a>

        <button
          onClick={handleConfirmPayment}
          disabled={isConfirming}
          className="w-full btn-primary disabled:opacity-50"
        >
          {isConfirming ? 'Подтверждение...' : 'Подтвердить оплату'}
        </button>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'amount':
        return renderAmountStep();
      case 'method':
        return renderMethodStep();
      case 'crypto':
        return renderCryptoStep();
      case 'card':
        return renderCardStep();
      default:
        return renderAmountStep();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Заявка №{application.id}</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
