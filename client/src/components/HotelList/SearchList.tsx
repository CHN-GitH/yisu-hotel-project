import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import SearchItem from './SearchItem';
import { fetchHomeList } from '../../store/slices/homelistSlice';
import { RootState, AppDispatch } from '../../store';
import { HouseListItem, HouseDetailData } from '../../services/modules/homelist';
import styles from '../../styles/HotelList.scss';

export default function SearchList() {
  const dispatch = useDispatch<AppDispatch>();
  const { homelistdata } = useSelector((state: RootState) => state.homelist);

  useEffect(() => {
    dispatch(fetchHomeList());
  }, [dispatch]);

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
    </View>
  );
};