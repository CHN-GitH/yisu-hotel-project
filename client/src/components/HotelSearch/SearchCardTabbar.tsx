import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components';
import SearchCardCityChinese from './SearchCardCityChinese';
import SearchCardTimeRange from './SearchCardTimeRange';
import SearchCardPriceAndStar from './SearchCardPriceAndStar';
import '../../styles/HotelSearch.scss';

// 原始Tab
const originTabList = [
  { key: 'tab1', label: '国内' },
  { key: 'tab2', label: '海外' },
  { key: 'tab3', label: '钟点房' },
  { key: 'tab4', label: '民宿' },
];
// 合并后Tab
const mergedTabList = [
  { key: 'tab1-tab2', label: '国内 · 海外' }, // 合并后的 Tab
  { key: 'tab3', label: '钟点房' },
  { key: 'tab4', label: '民宿' },
];

export default function SearchCardTabbar() {
  const [activeTab, setActiveTab] = useState('tab1');
  const [renderTabList, setRenderTabList] = useState(originTabList);

  // 监听切换Tab列表
  useEffect(() => {
    if (['tab1', 'tab2'].includes(activeTab)) {
      setRenderTabList(originTabList);
    } else if (['tab3', 'tab4'].includes(activeTab)) {
      setRenderTabList(mergedTabList);
    }
  }, [activeTab]);

  // 此处如果点击的是合并后的tab1-tab2，默认选中tab1
  const handleTabClick = (tabKey: string) => {
    const targetKey = tabKey === 'tab1-tab2' ? 'tab1' : tabKey;
    setActiveTab(targetKey);
  };

  return (
    <View className="search-card">
      {/* Tabber */}
      <View className="search-card-tab">
        {renderTabList.map((tab) => (
          <View
            key={tab.key}
            className={`search-card-tab-item ${
              (tab.key === 'tab1-tab2' && ['tab1', 'tab2'].includes(activeTab)) || 
              (tab.key === activeTab) ? 'search-card-tab-item-active' : ''
            }`}
            onClick={() => handleTabClick(tab.key)}
          >
            <Text className="tab-label">{tab.label}</Text>
          </View>
        ))}
      </View>
      {activeTab === 'tab1' && <>
        <SearchCardCityChinese />
        <SearchCardTimeRange />
        <SearchCardPriceAndStar />
      </>}
    </View>
  );
};