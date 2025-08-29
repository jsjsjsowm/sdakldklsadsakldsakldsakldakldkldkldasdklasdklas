import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  FileText, 
  Settings, 
  Shield, 
  Users,
  FileSearch,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import Dashboard from '../components/admin/Dashboard';
import Applications from '../components/admin/Applications';
import Files from '../components/admin/Files';
import IPBlocking from '../components/admin/IPBlocking';
import SystemSettings from '../components/admin/SystemSettings';
import { apiService } from '../services/apiService';
import toast from 'react-hot-toast';

type Tab = 'dashboard' | 'applications' | 'files' | 'ip-blocking' | 'settings';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(true); // In real app, implement proper auth

  const tabs = [
    { id: 'dashboard' as Tab, name: 'Дашборд', icon: BarChart3 },
    { id: 'applications' as Tab, name: 'Заявки', icon: FileText },
    { id: 'files' as Tab, name: 'Файлы', icon: FileSearch },
    { id: 'ip-blocking' as Tab, name: 'IP Блокировка', icon: Shield },
    { id: 'settings' as Tab, name: 'Настройки', icon: Settings },
  ];

  // Simple health check on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        await apiService.healthCheck();
        toast.success('Подключение к серверу установлено');
      } catch (error) {
        toast.error('Ошибка подключения к серверу');
      }
    };

    checkHealth();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800">Админ панель</h1>
            <p className="text-gray-600">Вход в систему управления</p>
          </div>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Логин
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Введите логин"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <input
                type="password"
                className="input-field"
                placeholder="Введите пароль"
              />
            </div>
            
            <button
              type="button"
              onClick={() => setIsAuthenticated(true)}
              className="w-full btn-primary"
            >
              Войти
            </button>
          </form>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'applications':
        return <Applications />;
      case 'files':
        return <Files />;
      case 'ip-blocking':
        return <IPBlocking />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Settings className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-800">
                Админ панель
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Система управления заявками
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
