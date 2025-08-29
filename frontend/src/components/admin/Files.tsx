import React, { useState, useEffect } from 'react';
import { ApplicationFile } from '../../types';
import { apiService } from '../../services/apiService';
import { Download, Trash2, File } from 'lucide-react';
import toast from 'react-hot-toast';

const Files: React.FC = () => {
  const [files, setFiles] = useState<ApplicationFile[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await apiService.getApplicationFiles();
      setFiles(response.files);
    } catch (error) {
      console.error('Failed to load files:', error);
      toast.error('Ошибка загрузки файлов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleDownload = async (filename: string) => {
    try {
      await apiService.downloadApplicationFile(filename);
    } catch (error) {
      toast.error('Ошибка скачивания файла');
    }
  };

  const handleDelete = async (filename: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот файл?')) return;
    
    try {
      await apiService.deleteFile(filename);
      setFiles(prev => prev.filter(file => file.filename !== filename));
      toast.success('Файл удален');
    } catch (error) {
      toast.error('Ошибка удаления файла');
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
        <h2 className="text-3xl font-bold text-gray-800">Управление файлами</h2>
        <button
          onClick={loadFiles}
          className="btn-primary"
        >
          Обновить
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Файлы заявок</h3>
          <span className="text-sm text-gray-500">
            Всего файлов: {files.length}
          </span>
        </div>
        
        {files.length === 0 ? (
          <div className="text-center py-12">
            <File className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Файлы заявок не найдены</p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <File className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-800">
                      {file.filename}
                    </div>
                    <div className="text-sm text-gray-500">
                      Создан: {file.created} • Размер: {Math.round(file.size / 1024)} KB
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDownload(file.filename)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                    title="Скачать"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(file.filename)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Files;
