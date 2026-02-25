// 酒店列表页 - 排序
import React, { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSortType, resetHomeList, fetchHomeList } from '../../store/slices/homelistSlice';
import { RootState } from '../../store';
import '../../styles/HotelList.scss';

type SortType = 'default' | 'rating' | 'originalPrice' | 'currentPrice';

const sortOptions = [
  { key: 'default' as SortType, label: '默认排序' },
  { key: 'rating' as SortType, label: '评分排序' },
  { key: 'originalPrice' as SortType, label: '原价排序' },
  { key: 'currentPrice' as SortType, label: '现价排序' },
];

export default function SearchOrder() {
  const dispatch = useAppDispatch();
  const activeSort = useAppSelector((state: RootState) => state.homelist.sortType);

  const handleSortClick = (sortType: SortType) => {
    if (sortType === 'default') {
      // 默认排序：重置列表并重新获取数据
      dispatch(resetHomeList());
      dispatch(fetchHomeList());
    }
    dispatch(setSortType(sortType));
  };

  return (
    <View className='search-order'>
      {sortOptions.map((option) => (
        <View
          key={option.key}
          className={`search-order-item ${activeSort === option.key ? 'active' : ''}`}
          onClick={() => handleSortClick(option.key)}
        >
          <Text className='search-order-item-text'>{option.label}</Text>
        </View>
      ))}
    </View>
  );
};