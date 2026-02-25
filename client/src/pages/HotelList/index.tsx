import React, { useEffect, useCallback, useRef } from 'react';
import Taro from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchSearch } from '../../store/slices/searchHotelSlice';
import { fetchHomeList } from '../../store/slices/homelistSlice';
import SearchTabbar from '../../components/HotelList/SearchTabbar';
import SearchOrder from '../../components/HotelList/SearchOrder';
import SearchList from '../../components/HotelList/SearchList';
import '../../styles/HotelList.scss';

export default function HotelList() {
  const dispatch = useAppDispatch();
  const { loading, currentpage, homelistdata } = useAppSelector((state) => state.homelist);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    dispatch(fetchSearch());
  }, [dispatch]);

  // 滚动到底部触发加载
  const handleScrollToLower = useCallback(() => {
    // 防止重复触发
    if (isLoadingRef.current || loading) return;
    
    isLoadingRef.current = true;
    dispatch(fetchHomeList()).finally(() => {
      isLoadingRef.current = false;
    });
  }, [dispatch, loading]);

  // 下拉刷新
  const handleRefresherRefresh = useCallback(() => {
    // 可以在这里添加刷新逻辑，如果需要的话
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
        onRefresherRefresh={handleRefresherRefresh}
        onScrollToLower={handleScrollToLower}  // 关键：滚动到底部事件
        lowerThreshold={100}  // 距离底部100px时触发
      >
        <SearchOrder />
        <SearchList />
      </ScrollView>
    </View>
  );
};