import React, { useState, useEffect } from 'react';
import { BlockedIP } from '../../types';
import { apiService } from '../../services/apiService';
import { Shield, ShieldCheck, Search, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const IPBlocking: React.FC = () => {
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>([]);
  const [loading, setLoading] = useState(true);
  const [newIP, setNewIP] = useState('');
  const [newReason, setNewReason] = useState('');
  const [checkIP, setCheckIP] = useState('');

  const loadBlockedIPs = async () => {
    try {
      setLoading(true);
      const response = await apiService.getBlockedIPs();
      setBlockedIPs(response.blocked_ips);
    } catch (error) {
      console.error('Failed to load blocked IPs:', error);
      toast.error('Ошибка загрузки заблокированных IP');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlockedIPs();
  }, []);

  const handleBlockIP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newIP.trim()) {
      toast.error('Введите IP адрес');
      return;
    }
    
    try {
      await apiService.blockIP(newIP.trim(), newReason.trim(), 'Admin');
      setNewIP('');
      setNewReason('');
      loadBlockedIPs();
      toast.success(`IP ${newIP} заблокирован`);
    } catch (error) {
      toast.error('Ошибка блокировки IP');
    }
  };

  const handleUnblockIP = async (ipAddress: string) => {
    if (!window.confirm(`Разблокировать IP ${ipAddress}?`)) return;
    
    try {
      await apiService.unblockIP(ipAddress);
      loadBlockedIPs();
      toast.success(`IP ${ipAddress} разблокирован`);
    } catch (error) {
      toast.error('Ошибка разблокировки IP');
    }
  };

  const handleCheckIP = async () => {
    if (!checkIP.trim()) {
      toast.error('Введите IP адрес для проверки');
      return;
    }
    
    try {
      const response = await apiService.checkIP(checkIP.trim());
      const status = response.is_blocked ? '🚫 ЗАБЛОКИРОВАН' : '✅ НЕ ЗАБЛОКИРОВАН';
      toast.success(`IP ${checkIP}: ${status}`, { duration: 5000 });
    } catch (error) {
      toast.error('Ошибка проверки IP');
    }
  };

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
        <h2 className="text-3xl font-bold text-gray-800">IP Блокировка</h2>
        <button
          onClick={loadBlockedIPs}
          className="btn-primary"
        >
          Обновить
        </button>
      </div>

      {/* Block IP Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Заблокировать IP адрес
        </h3>
        
        <form onSubmit={handleBlockIP} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IP адрес
              </label>
              <input
                type="text"
                value={newIP}
                onChange={(e) => setNewIP(e.target.value)}
                placeholder="192.168.1.1"
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Причина блокировки
              </label>
              <input
                type="text"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                placeholder="Нарушение правил"
                className="input-field"
              />
            </div>
            
            <div className="flex items-end">
              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Заблокировать
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Check IP */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Search className="w-5 h-5 mr-2" />
          Проверить IP адрес
        </h3>
        
        <div className="flex space-x-4">
          <input
            type="text"
            value={checkIP}
            onChange={(e) => setCheckIP(e.target.value)}
            placeholder="Введите IP адрес для проверки"
            className="flex-1 input-field"
          />
          <button
            onClick={handleCheckIP}
            className="btn-secondary"
          >
            Проверить
          </button>
        </div>
      </div>

      {/* Blocked IPs List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">
            Заблокированные IP адреса ({blockedIPs.length})
          </h3>
        </div>
        
        {blockedIPs.length === 0 ? (
          <div className="text-center py-12">
            <ShieldCheck className="w-16 h-16 text-green-300 mx-auto mb-4" />
            <p className="text-gray-500">Заблокированных IP адресов нет</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full admin-table">
              <thead>
                <tr>
                  <th>IP адрес</th>
                  <th>Дата блокировки</th>
                  <th>Заблокировал</th>
                  <th>Причина</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {blockedIPs.map((ip) => (
                  <tr key={ip.id}>
                    <td className="font-mono">{ip.ipAddress}</td>
                    <td>{new Date(ip.blockedAt).toLocaleString('ru-RU')}</td>
                    <td>{ip.blockedBy || 'Система'}</td>
                    <td className="max-w-xs truncate">{ip.reason || 'Не указана'}</td>
                    <td>
                      <button
                        onClick={() => handleUnblockIP(ip.ipAddress)}
                        className="btn-secondary text-sm"
                      >
                        Разблокировать
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default IPBlocking;
