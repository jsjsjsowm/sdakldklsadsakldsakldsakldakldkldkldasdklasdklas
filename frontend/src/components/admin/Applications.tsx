import React, { useState, useEffect } from 'react';
import { Application } from '../../types';
import { apiService } from '../../services/apiService';
import { Eye, Trash2, Shield, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const Applications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAdminApplications();
      setApplications(response.applications);
    } catch (error) {
      console.error('Failed to load applications:', error);
      toast.error('Ошибка загрузки заявок');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту заявку?')) return;
    
    try {
      await apiService.deleteApplication(id);
      setApplications(prev => prev.filter(app => app.id !== id));
      toast.success('Заявка удалена');
    } catch (error) {
      toast.error('Ошибка удаления заявки');
    }
  };

  const handleBlockIP = async (ipAddress: string) => {
    const reason = prompt(`Введите причину блокировки IP ${ipAddress}:`);
    if (!reason) return;
    
    try {
      await apiService.blockIP(ipAddress, reason, 'Admin');
      toast.success(`IP ${ipAddress} заблокирован`);
    } catch (error) {
      toast.error('Ошибка блокировки IP');
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone.includes(searchTerm) ||
      app.passportNumber.includes(searchTerm) ||
      app.ipAddress.includes(searchTerm);
    
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'paid' && app.paymentConfirmed) ||
      (statusFilter === 'pending' && !app.paymentConfirmed);
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Управление заявками</h2>
        <button
          onClick={loadApplications}
          className="btn-primary"
        >
          Обновить
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск по ФИО, телефону, паспорту, IP..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Все заявки</option>
            <option value="paid">Оплаченные</option>
            <option value="pending">Ожидающие</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Дата</th>
                <th>ФИО</th>
                <th>Телефон</th>
                <th>IP</th>
                <th>Сумма</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app.id}>
                  <td className="font-mono">{app.id}</td>
                  <td>{new Date(app.createdAt).toLocaleDateString('ru-RU')}</td>
                  <td>{app.fullName}</td>
                  <td className="font-mono">{app.phone}</td>
                  <td className="font-mono text-sm">{app.ipAddress}</td>
                  <td>{app.totalAmount.toLocaleString()} ₽</td>
                  <td>
                    <span className={`status-badge ${app.paymentConfirmed ? 'paid' : 'pending'}`}>
                      {app.paymentConfirmed ? 'Оплачено' : 'Ожидает'}
                    </span>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => alert(`Просмотр заявки ${app.id}`)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="Просмотр"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleBlockIP(app.ipAddress)}
                        className="p-1 text-orange-600 hover:bg-orange-100 rounded"
                        title="Заблокировать IP"
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Заявки не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
