// src/pages/HotelList/index.tsx
import React, { useEffect } from 'react';
import { View, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchSearch } from '../../store/slices/searchHotelSlice';
import SearchTabbar from '../../components/HotelList/SearchTabbar';
import SearchResult from '../../components/HotelList/SearchResult';
import SearchItem from '../../components/HotelList/SearchItem';
import '../../styles/HotelList.scss';

const HotelList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { searchdata } = useAppSelector((state) => state.searchHotel);

  useEffect(() => {
    dispatch(fetchSearch());
  }, [dispatch]);

  const handleBack = (): void => {
    Taro.navigateBack();
  };

  const handleMore = (): void => {
    console.log('More clicked');
  };

  // 类型守卫：检查 searchdata 是否为 SearchResponse
  const isSearchResponse = (data: any): data is { list: any[]; total: number; page: number; size: number } => {
    return data && Array.isArray(data.list);
  };

  const hotelList = isSearchResponse(searchdata) ? searchdata.list : [];

  return (
    <View className='hotel-list-page tabbar-hidden'>
      <View className='nav-bar'>
        <View className='back-btn' onClick={handleBack}>
          <View className='icon-arrow-left' />
        </View>
        <View className='search-bar-wrapper'>
          <SearchTabbar />
        </View>
        <View className='more-btn' onClick={handleMore}>
          <View className='more-text'>map</View>
        </View>
      </View>

      <ScrollView 
        className='main-content' 
        scrollY 
        enableBackToTop
        refresherEnabled
        onRefresherRefresh={() => dispatch(fetchSearch())}
      >
        <SearchResult />
        <SearchItem itemData={hotelList} />
      </ScrollView>
    </View>
  );
};

export default HotelList;