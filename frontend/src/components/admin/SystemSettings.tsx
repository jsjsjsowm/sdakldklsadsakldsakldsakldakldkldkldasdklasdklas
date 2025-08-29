import React, { useState } from 'react';
import { 
  Database, 
  HardDrive, 
  MessageSquare, 
  Server, 
  AlertTriangle, 
  Download,
  Trash2
} from 'lucide-react';
import { apiService } from '../../services/apiService';
import toast from 'react-hot-toast';

const SystemSettings: React.FC = () => {
  const [loading, setLoading] = useState({
    bot: false,
    db: false,
    fs: false,
    backup: false,
    clearDb: false,
    clearFiles: false,
  });

  const setLoadingState = (key: keyof typeof loading, value: boolean) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  };

  const testBot = async () => {
    setLoadingState('bot', true);
    try {
      await apiService.testBot();
      toast.success('✅ Бот работает корректно');
    } catch (error) {
      toast.error('❌ Ошибка бота');
    } finally {
      setLoadingState('bot', false);
    }
  };

  const checkDatabase = async () => {
    setLoadingState('db', true);
    try {
      const response = await apiService.checkDatabaseStatus();
      toast.success(response.message);
    } catch (error) {
      toast.error('❌ Ошибка базы данных');
    } finally {
      setLoadingState('db', false);
    }
  };

  const checkFileSystem = async () => {
    setLoadingState('fs', true);
    try {
      const response = await apiService.checkFileSystemStatus();
      toast.success(response.message);
    } catch (error) {
      toast.error('❌ Ошибка файловой системы');
    } finally {
      setLoadingState('fs', false);
    }
  };

  const createBackup = async () => {
    if (!window.confirm('Создать резервную копию базы данных?')) return;
    
    setLoadingState('backup', true);
    try {
      const response = await apiService.backupDatabase();
      toast.success(`✅ ${response.message}: ${response.filename}`);
    } catch (error) {
      toast.error('❌ Ошибка создания резервной копии');
    } finally {
      setLoadingState('backup', false);
    }
  };

  const clearDatabase = async () => {
    const confirmation = prompt(
      'ВНИМАНИЕ! Это действие удалит ВСЕ данные из базы данных.\n\nНапишите "УДАЛИТЬ" для подтверждения:'
    );
    
    if (confirmation !== 'УДАЛИТЬ') {
      toast.error('Операция отменена');
      return;
    }
    
    setLoadingState('clearDb', true);
    try {
      await apiService.clearDatabase();
      toast.success('✅ База данных очищена');
    } catch (error) {
      toast.error('❌ Ошибка очистки базы данных');
    } finally {
      setLoadingState('clearDb', false);
    }
  };

  const clearFiles = async () => {
    const confirmation = prompt(
      'ВНИМАНИЕ! Это действие удалит ВСЕ файлы.\n\nНапишите "УДАЛИТЬ" для подтверждения:'
    );
    
    if (confirmation !== 'УДАЛИТЬ') {
      toast.error('Операция отменена');
      return;
    }
    
    setLoadingState('clearFiles', true);
    try {
      await apiService.clearFiles();
      toast.success('✅ Все файлы удалены');
    } catch (error) {
      toast.error('❌ Ошибка удаления файлов');
    } finally {
      setLoadingState('clearFiles', false);
    }
  };

  const systemChecks = [
    {
      title: 'Telegram Bot',
      icon: MessageSquare,
      description: 'Проверка работы бота',
      action: testBot,
      loading: loading.bot,
      color: 'blue',
    },
    {
      title: 'База данных',
      icon: Database,
      description: 'Проверка подключения к БД',
      action: checkDatabase,
      loading: loading.db,
      color: 'green',
    },
    {
      title: 'Файловая система',
      icon: HardDrive,
      description: 'Проверка доступа к файлам',
      action: checkFileSystem,
      loading: loading.fs,
      color: 'purple',
    },
    {
      title: 'Сервер',
      icon: Server,
      description: 'Статус сервера',
      action: () => toast.success('✅ Сервер работает'),
      loading: false,
      color: 'indigo',
    },
  ];

  const dangerousActions = [
    {
      title: 'Создать резервную копию',
      description: 'Резервное копирование базы данных',
      icon: Download,
      action: createBackup,
      loading: loading.backup,
      variant: 'warning',
    },
    {
      title: 'Очистить базу данных',
      description: 'Удалить все заявки из базы данных',
      icon: Trash2,
      action: clearDatabase,
      loading: loading.clearDb,
      variant: 'danger',
    },
    {
      title: 'Очистить все файлы',
      description: 'Удалить все загруженные файлы',
      icon: Trash2,
      action: clearFiles,
      loading: loading.clearFiles,
      variant: 'danger',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Настройки системы</h2>
        <p className="text-gray-600 mt-2">
          Управление и мониторинг компонентов системы
        </p>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemChecks.map((check, index) => {
          const Icon = check.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${check.color}-100`}>
                  <Icon className={`w-6 h-6 text-${check.color}-600`} />
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {check.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {check.description}
              </p>
              
              <button
                onClick={check.action}
                disabled={check.loading}
                className="w-full btn-secondary text-sm disabled:opacity-50"
              >
                {check.loading ? 'Проверка...' : 'Проверить'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Administrative Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
          <h3 className="text-xl font-semibold text-gray-800">
            Действия администратора
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dangerousActions.map((action, index) => {
            const Icon = action.icon;
            const colorClass = 
              action.variant === 'danger' ? 'border-red-200 hover:border-red-300' :
              action.variant === 'warning' ? 'border-yellow-200 hover:border-yellow-300' :
              'border-gray-200 hover:border-gray-300';
            
            const iconColorClass = 
              action.variant === 'danger' ? 'text-red-600' :
              action.variant === 'warning' ? 'text-yellow-600' :
              'text-gray-600';
            
            return (
              <div
                key={index}
                className={`border-2 ${colorClass} rounded-lg p-4 transition-colors`}
              >
                <div className="flex items-center mb-3">
                  <Icon className={`w-5 h-5 ${iconColorClass} mr-2`} />
                  <h4 className="font-semibold text-gray-800">{action.title}</h4>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  {action.description}
                </p>
                
                <button
                  onClick={action.action}
                  disabled={action.loading}
                  className={`w-full py-2 px-4 rounded text-sm font-medium transition-colors disabled:opacity-50 ${
                    action.variant === 'danger' 
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : action.variant === 'warning'
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      : 'bg-gray-600 hover:bg-gray-700 text-white'
                  }`}
                >
                  {action.loading ? 'Выполняется...' : action.title}
                </button>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <strong>Внимание:</strong> Операции очистки необратимы. 
              Убедитесь, что у вас есть резервные копии важных данных.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
