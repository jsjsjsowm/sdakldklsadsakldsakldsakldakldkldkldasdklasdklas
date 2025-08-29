import React, { useState, useEffect } from 'react';
import { 
  Home, 
  FileText, 
  Info, 
  Phone, 
  MessageCircle,
  Shield,
  Clock,
  CheckCircle,
  CreditCard,
  HelpCircle
} from 'lucide-react';
import TelegramApplicationForm from './TelegramApplicationForm';

// Telegram WebApp types
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        BackButton: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
        colorScheme: 'light' | 'dark';
        viewportHeight: number;
        viewportStableHeight: number;
        isExpanded: boolean;
      };
    };
  }
}

type TabType = 'home' | 'about' | 'contact' | 'support' | 'application';

const TelegramApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  useEffect(() => {
    // Initialize Telegram WebApp
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Configure the app
      tg.ready();
      tg.expand();
      
      // Set theme variables
      if (tg.themeParams) {
        const root = document.documentElement;
        if (tg.themeParams.bg_color) {
          root.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color);
        }
        if (tg.themeParams.text_color) {
          root.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color);
        }
        if (tg.themeParams.button_color) {
          root.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color);
        }
      }
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="min-h-full gradient-bg">
            <div className="max-w-md mx-auto p-6">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-4">
                  Водительские права онлайн
                </h1>
                <p className="text-lg text-gray-200">
                  Быстрое и безопасное оформление водительского удостоверения
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-6 mb-16 px-4">
                <div className="card">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Короткие сроки 4-7 дней
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Быстрое оформление документов в течение недели
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Полная конфиденциальность
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Гарантируем безопасность ваших данных и анонимность
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Официальный документ
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Оригинальное водительское удостоверение, проходит любые проверки
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Безопасная оплата
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Удобная оплата в криптовалюте с полной анонимностью
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'about':
        return (
          <div className="p-6 space-y-4">
            <h2 className="text-xl font-bold mb-4">О сервисе</h2>
            <div className="space-y-4 text-sm">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  <Shield className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold">Наша миссия</h3>
                </div>
                <p className="text-gray-600">
                  Предоставляем быстрый и безопасный способ получения водительских прав
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="font-semibold">Преимущества</h3>
                </div>
                <ul className="text-gray-600 space-y-1">
                  <li>• Официальные документы</li>
                  <li>• Быстрое оформление</li>
                  <li>• Полная конфиденциальность</li>
                  <li>• Поддержка 24/7</li>
                </ul>
              </div>
            </div>
          </div>
        );
        
      case 'contact':
        return (
          <div className="p-6 space-y-4">
            <h2 className="text-xl font-bold mb-4">Контакты</h2>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  <MessageCircle className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold">Телеграм</h3>
                </div>
                <p className="text-sm text-gray-600">@support_driver_license</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  <Phone className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="font-semibold">Поддержка</h3>
                </div>
                <p className="text-sm text-gray-600">Круглосуточно в Telegram</p>
              </div>
            </div>
          </div>
        );
        
      case 'support':
        return (
          <div className="p-6 space-y-4">
            <h2 className="text-xl font-bold mb-4">Помощь</h2>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  <HelpCircle className="w-5 h-5 text-orange-600 mr-2" />
                  <h3 className="font-semibold">Частые вопросы</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <details className="cursor-pointer">
                    <summary className="font-medium">Сколько времени занимает оформление?</summary>
                    <p className="text-gray-600 mt-1">Обычно 4-7 рабочих дней</p>
                  </details>
                  <details className="cursor-pointer">
                    <summary className="font-medium">Какие документы нужны?</summary>
                    <p className="text-gray-600 mt-1">Паспорт, фото, подпись, медсправка</p>
                  </details>
                  <details className="cursor-pointer">
                    <summary className="font-medium">Как происходит оплата?</summary>
                    <p className="text-gray-600 mt-1">Принимаем криптовалюту (BTC, USDT, TON)</p>
                  </details>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'application':
        return (
          <div className="h-full bg-gray-50 overflow-y-auto p-4">
            <div className="max-w-md mx-auto">
              <TelegramApplicationForm />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {renderContent()}
      </div>
      
      {/* Application Button */}
      {activeTab !== 'application' && (
        <div className="absolute bottom-20 left-4 right-4 z-10">
          <button
            onClick={() => setActiveTab('application')}
            className="btn-primary text-lg px-8 py-4 w-full flex items-center justify-center"
          >
            <FileText className="w-5 h-5 mr-2" />
            Подать заявку
          </button>
        </div>
      )}
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
        <div className="flex justify-around py-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center py-2 px-3 ${
              activeTab === 'home' 
                ? 'text-blue-600' 
                : 'text-gray-500'
            }`}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs">Главная</span>
          </button>
          
          <button
            onClick={() => setActiveTab('about')}
            className={`flex flex-col items-center py-2 px-3 ${
              activeTab === 'about' 
                ? 'text-blue-600' 
                : 'text-gray-500'
            }`}
          >
            <Info className="w-5 h-5 mb-1" />
            <span className="text-xs">О нас</span>
          </button>
          
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex flex-col items-center py-2 px-3 ${
              activeTab === 'contact' 
                ? 'text-blue-600' 
                : 'text-gray-500'
            }`}
          >
            <Phone className="w-5 h-5 mb-1" />
            <span className="text-xs">Контакты</span>
          </button>
          
          <button
            onClick={() => setActiveTab('support')}
            className={`flex flex-col items-center py-2 px-3 ${
              activeTab === 'support' 
                ? 'text-blue-600' 
                : 'text-gray-500'
            }`}
          >
            <MessageCircle className="w-5 h-5 mb-1" />
            <span className="text-xs">Помощь</span>
          </button>
          
          <button
            onClick={() => setActiveTab('application')}
            className={`flex flex-col items-center py-2 px-3 ${
              activeTab === 'application' 
                ? 'text-blue-600' 
                : 'text-gray-500'
            }`}
          >
            <FileText className="w-5 h-5 mb-1" />
            <span className="text-xs">Заявка</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TelegramApp;
