import React, { useState, useEffect, useRef } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setCity, setSelectedCityData } from '../../store/slices/searchCitySlice';
import SearchCardCityChinese from './SearchCardCityChinese';
import SearchCardCityInterNational from './SearchCardCityInterNational';
import SearchCardTimeRange from './SearchCardTimeRange';
import SearchCardPriceAndStar from './SearchCardPriceAndStar';
import SearchCardSearchButton from './SearchCardSearchButton';
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
  { key: 'tab1-tab2', label: '国内 · 海外' },
  { key: 'tab3', label: '钟点房' },
  { key: 'tab4', label: '民宿' },
];

export default function SearchCardTabbar() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState('tab1');
  const [renderTabList, setRenderTabList] = useState(originTabList);
  // 用于标记是否是手动切换
  const isManualSwitchRef = useRef(false);
  const prevCountryRef = useRef<string | undefined>(undefined);
  // 从 Redux 获取 country
  const { selectedCityData } = useAppSelector((state) => state.searchCity);
  const country = selectedCityData?.country;

  // 手动切换 tab 时，重置为对应默认值
  const handleTabClick = (tabKey: string) => {
    const targetKey = tabKey === 'tab1-tab2' ? 'tab1' : tabKey;
    isManualSwitchRef.current = true;
    setActiveTab(targetKey);
    // 手动切换时，重置 city 为对应默认值
    if (targetKey === 'tab1') {
      dispatch(setCity("上海"));
      dispatch(setSelectedCityData({
        cityName: "上海",
        cityId: 0,
        region: "国内",
        country: "中国"
      }));
    } else if (targetKey === 'tab2') {
      dispatch(setCity("首尔"));
      dispatch(setSelectedCityData({
        cityName: "首尔",
        cityId: 0,
        region: "日韩",
        country: "韩国"
      }));
    }
    // 重置标志位
    setTimeout(() => {
      isManualSwitchRef.current = false;
    }, 100);
  };

  // 监听 country 变化，自动切换 tab（仅在非手动切换时执行）
  useEffect(() => {
    if (isManualSwitchRef.current) return;
    if (!country || country === prevCountryRef.current) return;
    prevCountryRef.current = country;
    const isChina = country === "中国";
    const isInDomesticTab = activeTab === 'tab1';
    const isInInternationalTab = activeTab === 'tab2';
    // 如果在中国 tab 但选择了非中国城市，切换到海外 tab
    if (isInDomesticTab && !isChina) {
      console.log('检测到非中国城市，切换到海外 tab');
      setActiveTab('tab2');
    }
    // 如果在海外 tab 但选择了中国城市，切换到国内 tab
    if (isInInternationalTab && isChina) {
      console.log('检测到中国城市，切换到国内 tab');
      setActiveTab('tab1');
    }
  }, [country, activeTab, dispatch]);

  // 监听切换Tab列表
  useEffect(() => {
    if (['tab1', 'tab2'].includes(activeTab)) {
      setRenderTabList(originTabList);
    } else if (['tab3', 'tab4'].includes(activeTab)) {
      setRenderTabList(mergedTabList);
    }
  }, [activeTab]);

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
        <SearchCardSearchButton />
      </>}
      {activeTab === 'tab2' && <>
        <SearchCardCityInterNational />
        <SearchCardTimeRange />
        <SearchCardPriceAndStar />
        <SearchCardSearchButton />
      </>}
    </View>
  );
}