// src/components/SearchResult/index.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import './index.scss';

interface HotFilter {
  label: string;
  value?: string | number;
}

interface SearchResultProps {
  itemData?: HotFilter[];
}

const SearchResult: React.FC<SearchResultProps> = ({ itemData = [] }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleItemClick = (index: number): void => {
    setCurrentIndex(index);
  };

  return (
    <View className='result-bar'>
      <ScrollView 
        className='filter-list' 
        scrollX 
        enableFlex 
        showScrollbar={false}
      >
        {itemData.map((item, index) => (
          <View 
            key={index} 
            className={`filter-item ${currentIndex === index ? 'active' : ''}`}
            onClick={() => handleItemClick(index)}
          >
            <Text className='filter-text'>{item.label}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default SearchResult;