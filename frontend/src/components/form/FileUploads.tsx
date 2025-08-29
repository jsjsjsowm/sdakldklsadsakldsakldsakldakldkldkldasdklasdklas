import React, { useState } from 'react';
import { FieldErrors } from 'react-hook-form';
import { FormData } from '../../types';
import { UploadIcon, CheckCircleIcon } from 'lucide-react';

interface FileUploadsProps {
  onSignatureChange: (file: File | null) => void;
  onPersonalPhotoChange: (file: File | null) => void;
  onMedCertificateChange: (file: File | null) => void;
  errors: FieldErrors<FormData>;
}

const FileUploads: React.FC<FileUploadsProps> = ({
  onSignatureChange,
  onPersonalPhotoChange,
  onMedCertificateChange,
  errors,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState({
    signature: null as File | null,
    personalPhoto: null as File | null,
    medCertificate: null as File | null,
  });

  const handleFileUpload = (
    file: File | null,
    type: 'signature' | 'personalPhoto' | 'medCertificate'
  ) => {
    setUploadedFiles(prev => ({ ...prev, [type]: file }));
    
    switch (type) {
      case 'signature':
        onSignatureChange(file);
        break;
      case 'personalPhoto':
        onPersonalPhotoChange(file);
        break;
      case 'medCertificate':
        onMedCertificateChange(file);
        break;
    }
  };

  const FileUploadField: React.FC<{
    title: string;
    description: string;
    type: 'signature' | 'personalPhoto' | 'medCertificate';
    required?: boolean;
    accept?: string;
  }> = ({ title, description, type, required = false, accept = "image/*" }) => {
    const file = uploadedFiles[type];
    const error = errors[type];

    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
        <label className="cursor-pointer block">
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0] || null;
              handleFileUpload(selectedFile, type);
            }}
          />
          
          <div className="text-center">
            {file ? (
              <div className="space-y-3">
                <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto" />
                <div>
                  <p className="text-green-700 font-semibold">{title}</p>
                  <p className="text-sm text-gray-600">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleFileUpload(null, type);
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Удалить файл
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <UploadIcon className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-gray-700 font-semibold">
                    {title}
                    {required && <span className="text-red-500 ml-1">*</span>}
                  </p>
                  <p className="text-sm text-gray-500">{description}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Нажмите для выбора файла или перетащите сюда
                  </p>
                </div>
              </div>
            )}
          </div>
        </label>
        
        {error && (
          <p className="mt-2 text-sm text-red-600 text-center">{error.message}</p>
        )}
      </div>
    );
  };

  return (
    <div className="card">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        Загрузка документов
      </h3>
      <p className="text-gray-600 mb-6">
        Прикрепите необходимые документы и фотографии
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FileUploadField
          title="Фотография подписи"
          description="Четкое фото подписи на белом листе"
          type="signature"
          required
          accept="image/*"
        />
        
        <FileUploadField
          title="Личная фотография"
          description="Фото на светлом фоне"
          type="personalPhoto"
          required
          accept="image/*"
        />
        
        <FileUploadField
          title="Медицинская справка"
          description="Справка формы 003 (если имеется)"
          type="medCertificate"
          accept="image/*,application/pdf"
        />
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Требования к файлам:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Форматы: JPG, PNG, PDF</li>
          <li>• Максимальный размер: 10 МБ</li>
          <li>• Изображения должны быть четкими и читаемыми</li>
          <li>• Подпись должна быть на белом фоне</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUploads;
