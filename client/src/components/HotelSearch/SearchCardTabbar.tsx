import React, { useState, useEffect, useRef } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setCity, setSelectedCityData } from '../../store/slices/searchCitySlice';
import { setDates } from '../../store/slices/searchSlice';
import SearchCardCityChinese from './SearchCardCityChinese';
import SearchCardCityInterNational from './SearchCardCityInterNational';
import SearchCardTimeRange from './SearchCardTimeRange';
import SearchCardPriceAndStar from './SearchCardPriceAndStar';
import SearchCardSearchButton from './SearchCardSearchButton';
import SearchKeywords from './SearchKeywords';
import SearchCardTime from './SearchCardTime';
import dayjs from 'dayjs'
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
  // 从 Redux 获取 country
  const { selectedCityData } = useAppSelector((state) => state.searchCity);
  const { checkIn, checkOut } = useAppSelector(state => state.search);
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
        cityId: 310100,
        region: "国内",
        country: "中国"
      }));
    } else if (targetKey === 'tab2') {
      dispatch(setCity("首尔"));
      dispatch(setSelectedCityData({
        cityName: "首尔",
        cityId: 1601,
        region: "日韩",
        country: "韩国"
      }));
    } else if (targetKey === 'tab3' || targetKey === 'tab4') {
      // tab3 和 tab4 也重置为上海（国内城市）
      dispatch(setCity("上海"));
      dispatch(setSelectedCityData({
        cityName: "上海",
        cityId: 310100,
        region: "国内",
        country: "中国"
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
    if (!country) return;
    const isChina = country === "中国";
    // 如果在中国 tab 但选择了非中国城市，切换到海外 tab
    if (activeTab === 'tab1' && !isChina) {
      console.log('检测到非中国城市，切换到海外 tab');
      setActiveTab('tab2');
    }
    // 如果在海外 tab 但选择了中国城市，切换到国内 tab
    else if (activeTab === 'tab2' && isChina) {
      console.log('检测到中国城市，切换到国内 tab');
      setActiveTab('tab1');
    }
    // tab3 和 tab4 不自动切换 tab，但如果是海外城市，重置为上海
    else if ((activeTab === 'tab3' || activeTab === 'tab4') && !isChina) {
      console.log('tab3/tab4 检测到海外城市，重置为上海');
      dispatch(setCity("上海"));
      dispatch(setSelectedCityData({
        cityName: "上海",
        cityId: 310100,
        region: "国内",
        country: "中国"
      }));
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

  // 监听切换时间
  useEffect(() => {
    if (checkIn === checkOut && ['tab1', 'tab2', 'tab4'].includes(activeTab)) {
      dispatch(setDates({ 
            checkIn: dayjs().format('YYYY-MM-DD'), 
            checkOut: dayjs().add(1, 'day').format('YYYY-MM-DD'),
            nights: 1
          }))
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
        <SearchKeywords />
        <SearchCardSearchButton />
      </>}
      {activeTab === 'tab2' && <>
        <SearchCardCityInterNational />
        <SearchCardTimeRange />
        <SearchCardPriceAndStar />
        <SearchKeywords />
        <SearchCardSearchButton />
      </>}
      {activeTab === 'tab3' && <>
        <SearchCardCityChinese />
        <SearchCardTime />
        <SearchCardSearchButton />
      </>}
      {activeTab === 'tab4' && <>
        <SearchCardCityChinese />
        <SearchCardTimeRange />
        <SearchCardSearchButton />
      </>}
    </View>
  );
}