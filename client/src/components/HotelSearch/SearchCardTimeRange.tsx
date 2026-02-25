// 酒店查询页 - 时间范围
import React, { useState, useMemo } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setDates } from '../../store/slices/searchSlice';
import { Calendar } from '@nutui/nutui-react-taro';
import dayjs from 'dayjs';
import '../../styles/HotelSearch.scss';

export default function SearchCardTimeRange() {
  const dispatch = useAppDispatch();
  const { checkIn, checkOut, nights } = useAppSelector(state => state.search);
  const [showCalendar, setShowCalendar] = useState(false);
  
  // 格式化日期数组，需要Date对象或日期字符串数组
  const dateRange = checkIn && checkOut ? [checkIn, checkOut] : [];

  // 判断是否需要显示凌晨入住提示（当前时间在0-6点，且入住日期是今天）
  const showEarlyMorningTip = useMemo(() => {
    const now = dayjs();
    const currentHour = now.hour();
    const isEarlyMorning = currentHour >= 0 && currentHour < 6;
    const isCheckInToday = checkIn && dayjs(checkIn).isSame(now, 'day');
    return isEarlyMorning && isCheckInToday;
  }, [checkIn]);

  // 确认日历
  const handleDateConfirm = (param: any) => {
    console.log('Calendar confirm param:', param);
    let startDate: string;
    let endDate: string;
    if (Array.isArray(param)) {
      if (param.length === 2) {
        if (Array.isArray(param[0])) {
          // 格式: [[2024, 2, 16], [2024, 2, 17]]
          const [startArr, endArr] = param;
          startDate = dayjs(`${startArr[0]}-${startArr[1]}-${startArr[2]}`).format('YYYY-MM-DD');
          endDate = dayjs(`${endArr[0]}-${endArr[1]}-${endArr[2]}`).format('YYYY-MM-DD');
        } else if (typeof param[0] === 'string') {
          startDate = param[0];
          endDate = param[1];
        } else if (param[0] instanceof Date) {
          // 格式: [Date, Date]
          startDate = dayjs(param[0]).format('YYYY-MM-DD');
          endDate = dayjs(param[1]).format('YYYY-MM-DD');
        } else {
          startDate = param[0]?.value || param[0]?.date || dayjs(param[0]).format('YYYY-MM-DD');
          endDate = param[1]?.value || param[1]?.date || dayjs(param[1]).format('YYYY-MM-DD');
        }
      } else {
        console.error('Unexpected param format:', param);
        return;
      }
    } else if (typeof param === 'object' && param !== null) {
      startDate = param.startDate || param[0];
      endDate = param.endDate || param[1];
    } else {
      return;
    }

    // 验证日期有效性
    if (!startDate || !endDate || !dayjs(startDate).isValid() || !dayjs(endDate).isValid()) {
      console.error('Invalid dates:', startDate, endDate);
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
    
    setShowCalendar(false);
  }

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
        title='选择日期'
        visible={showCalendar}
        defaultValue={dateRange}
        type="range"
        startDate={dayjs().format('YYYY-MM-DD')}
        endDate={dayjs().add(3, 'month').format('YYYY-MM-DD')}
        startText='入住'
        endText='离店'
        showToday={true}
        autoBackfill={true}
        onClose={() => setShowCalendar(false)}
        onConfirm={handleDateConfirm}
      />
    </>
  );
};