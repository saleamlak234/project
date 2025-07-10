import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="absolute top-2 right-2 z-20">
      <select
        onChange={(e) => changeLanguage(e.target.value)}
        defaultValue={i18n.language}
        className="bg-gray-700 text-white rounded-md p-1 text-sm"
      >
        <option value="en">English</option>
        <option value="om">Oromo</option>
        <option value="am">Amharic</option>
        <option value="ti">Tigrinya</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;