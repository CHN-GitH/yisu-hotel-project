import React, { useEffect, useCallback, useRef, useState } from 'react';
import Taro from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchSearch } from '../../store/slices/searchHotelSlice';
import { fetchHomeList } from '../../store/slices/homelistSlice';
import SearchTabbar from '../../components/HotelList/SearchTabbar';
import SearchOrder from '../../components/HotelList/SearchOrder';
import SearchList from '../../components/HotelList/SearchList';
import BackToTop from '../../components/HotelList/BackToTop';
import '../../styles/HotelList.scss';

// 获取导航栏高度
const getNavBarHeight = () => {
  try {
    const systemInfo = Taro.getSystemInfoSync();
    const menuButtonInfo = Taro.getMenuButtonBoundingClientRect();
    const navBarHeight = (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 + 32 + systemInfo.statusBarHeight;
    return navBarHeight;
  } catch (e) {
    return 88;
  }
};

export default function HotelList() {
  const dispatch = useAppDispatch();
  const { loading, currentpage, homelistdata } = useAppSelector((state) => state.homelist);
  const isLoadingRef = useRef(false);
  const [navBarHeight] = useState(() => getNavBarHeight());
  const [scrollTop, setScrollTop] = useState(0);
  
  // 用于 scrollIntoView 的锚点 ID
  const [targetId, setTargetId] = useState<string>('');
  // 标记是否正在执行回到顶部动画
  const isScrollingRef = useRef(false);

  useEffect(() => {
    dispatch(fetchSearch());
  }, [dispatch]);

  // 处理滚动事件
  const handleScroll = useCallback((e: any) => {
    const top = e.detail?.scrollTop || 0;
    // 如果不是正在执行回到顶部动画，则更新 scrollTop
    if (!isScrollingRef.current) {
      setScrollTop(top);
    }
  }, []);

  // 处理回到顶部 - 使用 scrollIntoView 实现
  const handleBackToTop = useCallback(() => {
    // 设置目标锚点，触发 scrollIntoView
    setTargetId('top-anchor');
    isScrollingRef.current = true;
    
    // 动画完成后重置
    setTimeout(() => {
      setTargetId('');
      setScrollTop(0);
      isScrollingRef.current = false;
    }, 300);
  }, []);

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
        scrollIntoView={targetId}  // 使用 scrollIntoView 实现平滑滚动
        onScroll={handleScroll}
        onRefresherRefresh={handleRefresherRefresh}
        onScrollToLower={handleScrollToLower}
        lowerThreshold={100}
        scrollWithAnimation  // 开启滚动动画
      >
        {/* 顶部锚点元素 */}
        <View id='top-anchor' className='top-anchor' />
        <SearchOrder />
        <SearchList />
      </ScrollView>

      <BackToTop 
        visibilityHeight={400}
        right={20}
        bottom={100}
        scrollTop={scrollTop}
        onBackToTop={handleBackToTop}
      />
    </View>
  );
}