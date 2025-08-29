import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  FileText, 
  DollarSign, 
  Users, 
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react';
import { AdminStats } from '../../types';
import { apiService } from '../../services/apiService';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAdminStats();
      setStats(response.stats);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      title: 'Всего заявок',
      value: stats?.total || 0,
      icon: FileText,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
    },
    {
      title: 'Оплаченные',
      value: stats?.paid || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600',
    },
    {
      title: 'Ожидающие оплаты',
      value: stats?.pending || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Выручка',
      value: `${(stats?.revenue || 0).toLocaleString()} ₽`,
      icon: DollarSign,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
    },
    {
      title: 'Онлайн пользователей',
      value: stats?.online_users || 0,
      icon: Users,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Дашборд</h2>
          <p className="text-gray-600 mt-2">
            Обзор статистики системы заявок на водительские права
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Обновлено: {lastUpdated.toLocaleTimeString('ru-RU')}
          </div>
          <button
            onClick={loadStats}
            disabled={loading}
            className="flex items-center space-x-2 btn-secondary"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Обновить</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.color} bg-opacity-10`}>
                  <Icon className={`w-6 h-6 ${card.color.replace('bg-', 'text-')}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                  {loading ? '...' : card.value}
                </h3>
                <p className="text-sm text-gray-600">{card.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Conversion Rate */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Конверсия оплат
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Всего заявок</span>
                <span className="font-medium">{stats.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Оплаченных</span>
                <span className="font-medium text-green-600">{stats.paid}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Конверсия</span>
                <span className="font-bold text-blue-600">
                  {stats.total > 0 ? Math.round((stats.paid / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${stats.total > 0 ? (stats.paid / stats.total) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Средний чек
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Общая выручка</span>
                <span className="font-medium">{stats.revenue.toLocaleString()} ₽</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Оплаченных заявок</span>
                <span className="font-medium">{stats.paid}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Средний чек</span>
                <span className="font-bold text-purple-600">
                  {stats.paid > 0 ? Math.round(stats.revenue / stats.paid).toLocaleString() : 0} ₽
                </span>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.paid > 0 ? Math.round(stats.revenue / stats.paid).toLocaleString() : 0} ₽
                </div>
                <div className="text-sm text-purple-600">средний доход с заявки</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Быстрые действия
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-center">
            <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-700">Заявки</span>
          </button>
          
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-300 transition-colors text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-700">Одобрить</span>
          </button>
          
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-red-300 transition-colors text-center">
            <Clock className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-700">Блокировка</span>
          </button>
          
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 transition-colors text-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-700">Отчеты</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
