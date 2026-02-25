// 酒店列表页 - 列表
import React, { useEffect, useCallback } from 'react';
import Taro from '@tarojs/taro';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text } from '@tarojs/components';
import SearchItem from './SearchItem';
import { fetchHomeList } from '../../store/slices/homelistSlice';
import { RootState, AppDispatch } from '../../store';
import { HouseListItem, HouseDetailData } from '../../services/modules/homelist';
import '../../styles/HotelList.scss';

export default function SearchList() {
  const dispatch = useDispatch<AppDispatch>();
  const { homelistdata, loading, currentpage } = useSelector((state: RootState) => state.homelist);

  // 初始加载
  useEffect(() => {
    if (homelistdata.length === 0) {
      dispatch(fetchHomeList());
    }
  }, [dispatch, homelistdata.length]);

  const handleItemClick = (itemData: HouseDetailData) => {
    Taro.navigateTo({
      url: `/pages/HotelDetail/index?id=${itemData.houseId}`
    });
  };

  return (
    <View className='search-list'>
      {homelistdata?.map((item, index) => (
        <View 
          key={item.data.houseId || index} 
          className='search-list-item'
          onClick={() => handleItemClick(item.data)}
        >
          <SearchItem itemdata={item} />
        </View>
      ))}
      {loading && (
        <View className='loading-more'>
          <Text className='loading-text'>加载中...</Text>
        </View>
      )}
      <View className='load-more-trigger' id='load-more-trigger' />
    </View>
  );
};