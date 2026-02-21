import React from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import type { RoomStats } from './TypeChoose';
import type { HouseDetailData } from '../../services/modules/detail';
import '../../styles/HotelDetail.scss'

// 定义组件接收的 props 类型
interface BookingBarProps {
  currentHouse: NonNullable<HouseDetailData['currentHouse']>;
  nights: number;
  roomStats: RoomStats;
  finalTotalPrice: number;
  originalTotalPrice: number | null;
}

export default function BookingBar({currentHouse, nights, roomStats, finalTotalPrice, originalTotalPrice}: BookingBarProps) {
  const hasSelectedRooms = roomStats.totalCount > 0;
  const handleBookClick = () => {
    if (currentHouse.allowBooking) {
      if (roomStats.totalCount === 0) {
        Taro.showToast({ title: '请先选择房型', icon: 'none' });
      } else {
        Taro.showToast({ 
          title: `预订${nights}晚，总价¥${finalTotalPrice}`, 
          icon: 'none' 
        });
      }
    }
  };

  return (
    <View className='booking-bar'>
      <View className='price-info'>
        <Text className='price-symbol'>¥</Text>
        <Text className='price-num'>{finalTotalPrice}</Text>
        {originalTotalPrice && (
          <Text className='price-original'>¥{originalTotalPrice}</Text>
        )}
        <Text className='price-unit'>/{nights}晚</Text>
        {hasSelectedRooms && (
          <>
            <Text className='price-unit'>
              {roomStats.totalCount}间
            </Text>
            <Text className='price-unit price-unit-pernight'>
              ¥{roomStats.totalPrice}/晚
            </Text>
          </>
        )}
      </View>
      <View 
        className={`book-btn ${!currentHouse.allowBooking ? 'disabled' : ''}`}
        onClick={handleBookClick}
      >
        {currentHouse.allowBooking 
          ? (hasSelectedRooms ? '立即预订' : '请选择房型') 
          : '已满房'}
      </View>
    </View>
  );
};