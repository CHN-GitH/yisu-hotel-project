// src/components/SearchTabbar/index.tsx
import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { NavBar } from '@nutui/nutui-react-taro';
import { TriangleDown, Location, Search } from '@nutui/icons-react-taro';
import { Calendar } from '@nutui/nutui-react-taro';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setDates } from '../../store/slices/searchSlice';
import dayjs from 'dayjs';
import '../../styles/HotelList.scss';

const SearchTabbar: React.FC = () => {
  const dispatch = useAppDispatch();
  
  const { checkIn, checkOut, nights } = useAppSelector((state) => state.search);
  const { city, selectedHotel } = useAppSelector((state) => state.searchCity);
  
  const [showCalendar, setShowCalendar] = useState(false);
  
  const displayCity = city || "上海";
  
  const formatDisplayDate = (date: string) => {
    if (!date || !dayjs(date).isValid()) return '--';
    return dayjs(date).format('MM-DD');
  };

  const onClickLeft = () => {
    Taro.navigateBack();
  };

  const handleCityClick = (e: any) => {
    e.stopPropagation();
    Taro.navigateTo({ url: "/pages/CitySearch/index" });
  };

  const handleDateClick = (e: any) => {
    e.stopPropagation();
    setShowCalendar(true);
  };

  const handleMapClick = () => {
    Taro.navigateTo({ url: "/pages/Map/index" });
  };

  const handleSearchClick = () => {
    Taro.navigateTo({ url: "/pages/CitySearch/index" });
  };

  return (
    <>
      <NavBar
        back={
          <Text className='back-arrow'>&lt;</Text>
        }
        onBackClick={onClickLeft}
        fixed
        safeAreaInsetTop
        className='hotel-navbar'
      >
        <View className='navbar-content'>
          {/* 灰色高亮块 - 内部全部横向排列 */}
          <View className='search-highlight-block' onClick={handleSearchClick}>
            {/* 城市选择 */}
            <View className='block-item city-item' onClick={handleCityClick}>
              <Text className='city-text'>{displayCity}</Text>
            </View>

            {/* 分隔线 */}
            <View className='divider' />

            {/* 住离时间 - 上下排列 */}
            <View className='block-item date-item' onClick={handleDateClick}>
              <View className='date-row'>
                <Text className='date-label'>住</Text>
                <Text className='date-value'>{formatDisplayDate(checkIn)}</Text>
              </View>
              <View className='date-row'>
                <Text className='date-label'>离</Text>
                <Text className='date-value'>{formatDisplayDate(checkOut)}</Text>
              </View>
            </View>

            {/* 晚数 */}
            <View className='block-item nights-item'>
              <Text className='nights-text'>{nights || 1}晚</Text>
            </View>

            {/* 分隔线 */}
            <View className='divider' />

            {/* 搜索栏 */}
            <View className='block-item search-item'>
              <Search size={14} className='search-icon' />
              <Text className='search-text'>
                {selectedHotel ? selectedHotel.hotelName : '关键字/位置/民宿'}
              </Text>
            </View>
          </View>

          {/* 地图按钮 */}
          <View className='map-btn' onClick={handleMapClick}>
            <Location size={16} className='map-icon' />
          </View>
        </View>
      </NavBar>

      {/* Calendar 组件 */}
      {showCalendar && (
        <Calendar
          title='选择日期'
          visible={showCalendar}
          defaultValue={checkIn && checkOut ? [checkIn, checkOut] : []}
          type="range"
          startDate={dayjs().format('YYYY-MM-DD')}
          endDate={dayjs().add(3, 'month').format('YYYY-MM-DD')}
          startText='住'
          endText='离'
          showToday={true}
          autoBackfill={true}
          onClose={() => setShowCalendar(false)}
          onConfirm={(param: any) => {
            let startDate: string, endDate: string;
            if (Array.isArray(param)) {
              if (Array.isArray(param[0])) {
                const [startArr, endArr] = param;
                startDate = dayjs(`${startArr[0]}-${startArr[1]}-${startArr[2]}`).format('YYYY-MM-DD');
                endDate = dayjs(`${endArr[0]}-${endArr[1]}-${endArr[2]}`).format('YYYY-MM-DD');
              } else if (typeof param[0] === 'string') {
                [startDate, endDate] = param;
              } else {
                startDate = dayjs(param[0]).format('YYYY-MM-DD');
                endDate = dayjs(param[1]).format('YYYY-MM-DD');
              }
            } else return;

            const nightCount = dayjs(endDate).diff(dayjs(startDate), 'day');
            dispatch(setDates({ 
              checkIn: startDate, 
              checkOut: endDate,
              nights: nightCount > 0 ? nightCount : 1
            }));
            setShowCalendar(false);
          }}
        />
      )}
    </>
  );
};

export default SearchTabbar;