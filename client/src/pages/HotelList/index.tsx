// src/pages/HotelList/index.tsx
import React, { useEffect } from 'react';
import { View, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchSearch } from '../../store/slices/searchHotelSlice';
import SearchTabbar from '../../components/HotelList/SearchTabbar';
import SearchResult from '../../components/HotelList/SearchResult';
import SearchList from '../../components/HotelList/SearchList';
import '../../styles/HotelList.scss';

const HotelList: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchSearch());
  }, [dispatch]);

  return (
    <View className='hotel-list-page'>
      <View className='nav-bar'>
        <SearchTabbar />
      </View>

      <ScrollView 
        className='main-content' 
        scrollY 
        enableBackToTop
        refresherEnabled
        onRefresherRefresh={() => dispatch(fetchSearch())}
      >
        <SearchResult />
        <SearchList />
      </ScrollView>
    </View>
  );
};

export default HotelList;