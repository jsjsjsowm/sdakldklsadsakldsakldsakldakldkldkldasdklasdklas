import React from 'react';

interface Category {
  id: string;
  name: string;
  description: string;
  subcategories?: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

const categories: Category[] = [
  {
    id: 'A',
    name: 'Категория A',
    description: 'Мотоциклы любой мощности',
    subcategories: [
      { id: 'A1', name: 'A1', description: 'Мотоциклы до 125 куб. см' },
      { id: 'M', name: 'M', description: 'Мопеды до 50 куб. см' },
    ],
  },
  {
    id: 'B',
    name: 'Категория B',
    description: 'Легковые авто до 3.5т',
    subcategories: [
      { id: 'B1', name: 'B1', description: 'Трициклы и квадроциклы' },
      { id: 'BE', name: 'BE', description: 'Легковые с прицепом' },
    ],
  },
  {
    id: 'C',
    name: 'Категория C',
    description: 'Грузовые авто от 3.5т',
    subcategories: [
      { id: 'C1', name: 'C1', description: 'Грузовики 3.5-7.5т' },
      { id: 'CE', name: 'CE', description: 'Грузовые с прицепом' },
      { id: 'C1E', name: 'C1E', description: 'Грузовики 3.5-7.5т с прицепом' },
    ],
  },
  {
    id: 'D',
    name: 'Категория D',
    description: 'Автобусы более 8 мест',
    subcategories: [
      { id: 'D1', name: 'D1', description: 'Автобусы 8-16 мест' },
      { id: 'DE', name: 'DE', description: 'Автобусы с прицепом' },
      { id: 'D1E', name: 'D1E', description: 'Малые автобусы с прицепом' },
    ],
  },
];

interface CategorySelectionProps {
  categories: string[];
  onChange: (categories: string[]) => void;
  error?: string;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({
  categories: selectedCategories,
  onChange,
  error,
}) => {
  const handleCategoryToggle = (categoryId: string) => {
    const isSelected = selectedCategories.includes(categoryId);
    if (isSelected) {
      onChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      onChange([...selectedCategories, categoryId]);
    }
  };

  return (
    <div className="card">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        Выберите категории прав
      </h3>
      <p className="text-gray-600 mb-6">
        Можно выбрать несколько категорий и подкатегорий
      </p>
      
      <div className="category-grid">
        {categories.map((category) => (
          <div key={category.id} className="space-y-4">
            {/* Main Category */}
            <label className="flex items-start space-x-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.id)}
                onChange={() => handleCategoryToggle(category.id)}
                className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-800">
                  {category.name}
                </div>
                <div className="text-sm text-gray-600">
                  {category.description}
                </div>
              </div>
            </label>
            
            {/* Subcategories */}
            {category.subcategories && (
              <div className="ml-8 space-y-2">
                {category.subcategories.map((subcategory) => (
                  <label
                    key={subcategory.id}
                    className="flex items-start space-x-3 p-3 border border-gray-200 rounded-md cursor-pointer hover:border-blue-300 transition-colors bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(subcategory.id)}
                      onChange={() => handleCategoryToggle(subcategory.id)}
                      className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-700 text-sm">
                        {subcategory.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {subcategory.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {error && (
        <p className="mt-4 text-red-600 text-sm">{error}</p>
      )}
    </div>
  );
};

export default CategorySelection;
