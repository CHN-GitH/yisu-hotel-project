// 酒店查询页 - 时间范围
import React, { useState, useMemo } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setDates } from '../../store/slices/searchSlice';
import Calendar from './Calendar';
import dayjs from 'dayjs';
import '../../styles/HotelSearch.scss';

export default function SearchCardTimeRange() {
  const dispatch = useAppDispatch();
  const { checkIn, checkOut, nights } = useAppSelector(state => state.search);
  const [showCalendar, setShowCalendar] = useState(false);

  // 判断是否需要显示凌晨入住提示（当前时间在0-6点，且入住日期是今天）
  const showEarlyMorningTip = useMemo(() => {
    const now = dayjs();
    const currentHour = now.hour();
    const isEarlyMorning = currentHour >= 0 && currentHour < 6;
    const isCheckInToday = checkIn && dayjs(checkIn).isSame(now, 'day');
    return isEarlyMorning && isCheckInToday;
  }, [checkIn]);

  // 确认日历
  const handleDateConfirm = (param: string[]) => {
    if (!Array.isArray(param) || param.length !== 2) {
      return;
    }

    const [startDate, endDate] = param;

    if (!dayjs(startDate).isValid() || !dayjs(endDate).isValid()) {
      Taro.showToast({ title: '日期选择失败', icon: 'none' });
      return;
    }

    // 计算晚数
    const nights = dayjs(endDate).diff(dayjs(startDate), 'day');

    // 更新redux中的日期
    dispatch(setDates({
      checkIn: startDate,
      checkOut: endDate,
      nights: nights > 0 ? nights : 1
    }));
  };

  // 获取星期几
  const getWeekDay = (date: string) => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[dayjs(date).day()];
  };

  // 安全格式化日期显示
  const formatDisplayDate = (date: string) => {
    if (!date || !dayjs(date).isValid()) return '--';
    return dayjs(date).format('MM月DD日');
  };

  return (
    <>
      <View className='search-row' onClick={() => setShowCalendar(true)}>
        <View className='search-time'>
          <View className='search-time-checkin'>
            <Text className='search-time-date'>{formatDisplayDate(checkIn)}</Text>
            {showEarlyMorningTip && (
              <View className='early-morning-tip'>
                <View className='early-morning-arrow'></View>
                <View className='early-morning-bubble'>
                  <Text className='early-morning-text'>当天已过0点，已选择今天凌晨6点前入住。中午离店</Text>
                </View>
              </View>
            )}
          </View>
          {checkIn && dayjs(checkIn).isSame(dayjs(), 'day')
            ? <Text className='search-time-week'>今天</Text>
            : <Text className='search-time-week'>{checkIn ? getWeekDay(checkIn) : '--'}</Text>
          }
          <Text className='search-time-separator'>-</Text>
          <Text className='search-time-date'>{formatDisplayDate(checkOut)}</Text>
          {checkOut && dayjs(checkOut).isSame(dayjs().add(1, 'day'), 'day')
            ? <Text className='search-time-week'>明天</Text>
            : <Text className='search-time-week'>{checkOut ? getWeekDay(checkOut) : '--'}</Text>
          }
          <Text className='search-time-nights'>共{nights || 1}晚</Text>
        </View>
      </View>

      <Calendar
        visible={showCalendar}
        defaultValue={checkIn && checkOut ? [checkIn, checkOut] : []}
        startDate={dayjs().format('YYYY-MM-DD')}
        monthCount={24}
        onClose={() => setShowCalendar(false)}
        onConfirm={handleDateConfirm}
      />
    </>
  );
};