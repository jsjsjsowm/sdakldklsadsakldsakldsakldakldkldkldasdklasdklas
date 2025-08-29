import React from 'react';
import {
  ShieldCheckIcon,
  LockIcon,
  CreditCardIcon,
  StarIcon,
  ZapIcon,
  ChevronDownIcon
} from 'lucide-react';

interface BenefitsScreenProps {
  onNext: () => void;
}

const benefits = [
  {
    icon: LockIcon,
    title: 'Официальный документ',
    description: 'Оригинальное водительское удостоверение, которое проходит любые проверки',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Полная конфиденциальность',
    description: 'Гарантируем безопасность ваших данных и анонимность оформления',
  },
  {
    icon: CreditCardIcon,
    title: 'Безопасная оплата',
    description: 'Удобная оплата в криптовалюте с полной анонимностью транзакций',
  },
  {
    icon: StarIcon,
    title: '100+ довольных клиентов',
    description: 'Большое количество положительных отзывов от наших клиентов',
  },
  {
    icon: ZapIcon,
    title: 'Короткие сроки 4-7 дней',
    description: 'Быстрое оформление документов в течение недели',
  },
];

const BenefitsScreen: React.FC<BenefitsScreenProps> = ({ onNext }) => {
  return (
    <div className="fullscreen-section gradient-bg">
      <div className="max-w-6xl mx-auto animate-fade-in">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
            Наши преимущества
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Мы предлагаем надежное и быстрое решение для получения водительских прав
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="card group hover:shadow-glow transform hover:-translate-y-2 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <button
            onClick={onNext}
            className="btn-primary text-lg px-8 py-4 group relative overflow-hidden"
          >
            <span className="relative z-10">Заполнить заявку</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          <div className="animate-bounce mt-8">
            <div className="flex flex-col items-center text-gray-500">
              <span className="text-sm mb-2">Заполнить</span>
              <ChevronDownIcon className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitsScreen;
