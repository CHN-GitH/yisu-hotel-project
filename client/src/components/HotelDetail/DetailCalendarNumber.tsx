// 酒店详情页 - 日历+人数
import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Calendar, Popup, InputNumber, SafeArea } from '@nutui/nutui-react-taro';
import dayjs from 'dayjs';
import type { CSSProperties } from 'react';
import type { PageScrollObject } from '@tarojs/taro/types';

// 日期选择器组件
interface DateSelectorProps {
  onNightsChange?: (nights: number) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ onNightsChange }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [checkIn, setCheckIn] = useState(dayjs().format('YYYY-MM-DD'));
  const [checkOut, setCheckOut] = useState(dayjs().add(1, 'day').format('YYYY-MM-DD'));
  const dateRange = checkIn && checkOut ? [checkIn, checkOut] : [];
  const nights = dayjs(checkOut).diff(dayjs(checkIn), 'day');

  // 当夜数变化时通知父组件
  useEffect(() => {
    if (onNightsChange) {
      onNightsChange(nights);
    }
  }, [nights, onNightsChange]);

  const handleDateConfirm = (param: any) => {
    let startDate: string;
    let endDate: string;
    if (Array.isArray(param)) {
      if (param.length === 2) {
        if (Array.isArray(param[0])) {
          const [startArr, endArr] = param;
          startDate = dayjs(`${startArr[0]}-${startArr[1]}-${startArr[2]}`).format('YYYY-MM-DD');
          endDate = dayjs(`${endArr[0]}-${endArr[1]}-${endArr[2]}`).format('YYYY-MM-DD');
        } else if (typeof param[0] === 'string') {
          startDate = param[0];
          endDate = param[1];
        } else if (param[0] instanceof Date) {
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
    if (!startDate || !endDate || !dayjs(startDate).isValid() || !dayjs(endDate).isValid()) {
      Taro.showToast({ title: '日期选择失败', icon: 'none' });
      return;
    }
    setCheckIn(startDate);
    setCheckOut(endDate);
    setShowCalendar(false);
  };

  const getWeekDay = (date: string) => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[dayjs(date).day()];
  };

  const formatDisplayDate = (date: string) => {
    if (!date || !dayjs(date).isValid()) return '--';
    return dayjs(date).format('M月D日');
  };

  const isToday = (date: string) => dayjs(date).isSame(dayjs(), 'day');
  const isTomorrow = (date: string) => dayjs(date).isSame(dayjs().add(1, 'day'), 'day');

  return (
    <>
      <View className='date-selector-left' onClick={() => setShowCalendar(true)}>
        <View className='date-item'>
          <Text className='week-text'>
            {isToday(checkIn) ? '今天' : getWeekDay(checkIn)}
          </Text>
          <Text className='date-text'>{formatDisplayDate(checkIn)}</Text>
        </View>
        <Text className='date-separator'>-</Text>
        <View className='date-item'>
          <Text className='week-text'>
            {isTomorrow(checkOut) ? '明天' : getWeekDay(checkOut)}
          </Text>
          <Text className='date-text'>{formatDisplayDate(checkOut)}</Text>
        </View>
        <Text className='nights-badge'>共{nights}晚</Text>
      </View>
      <Calendar
        title='选择入住日期'
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

// 人数选择器组件
interface GuestSelectorProps {
  externalRoomCount?: number; // 外部传入的房间数
}

const GuestSelector: React.FC<GuestSelectorProps> = ({ externalRoomCount }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [roomCount, setRoomCount] = useState(1);
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  
  // 当外部房间数变化时，同步更新内部状态
  useEffect(() => {
    if (externalRoomCount !== undefined && externalRoomCount !== roomCount) {
      setRoomCount(externalRoomCount > 0 ? externalRoomCount : 1);
      // 同步更新成人数，确保不少于房间数
      if (adultCount < externalRoomCount) {
        setAdultCount(externalRoomCount);
      }
    }
  }, [externalRoomCount]);

  // 当内部房间数变化时，确保成人数不少于房间数
  useEffect(() => {
    if (adultCount < roomCount) {
      setAdultCount(roomCount);
    }
  }, [roomCount]);

  // 计算显示的成人数（确保不少于房间数）
  const displayAdultCount = adultCount > 2 * roomCount ? 2 * roomCount : adultCount >= roomCount ? adultCount : roomCount || 1;
  
  return (
    <>
      <View className='guest-selector-right' onClick={() => setShowPopup(true)}>
        <Text className='guest-text'>{roomCount}间</Text>
        <Text className='guest-separator'>·</Text>
        <Text className='guest-text'>{displayAdultCount}人</Text>
        <Text className='guest-separator'>·</Text>
        <Text className='guest-text'>{childCount}童</Text>
      </View>
      <Popup
        visible={showPopup}
        position="bottom"
        round
        closeable
        title="选择人数"
        onClose={() => setShowPopup(false)}
        className='guest-popup'
      >
        <View className='guest-popup-content'>
          <View className='guest-row'>
            <View className='guest-label'>
              <Text className='label-title'>房间数</Text>
            </View>
            <InputNumber
              value={roomCount}
              min={1}
              onChange={(value) => setRoomCount(Number(value))}
            />
          </View>
          <View className='guest-row'>
            <View className='guest-label'>
              <Text className='label-title'>成人数</Text>
            </View>
            <InputNumber
              value={displayAdultCount}
              min={roomCount}
              max={roomCount * 2}
              onChange={(value) => setAdultCount(Number(value))}
            />
          </View>
          <View className='guest-row'>
            <View className='guest-label'>
              <Text className='label-title'>儿童数</Text>
              <Text className='label-desc'>0-17岁</Text>
            </View>
            <InputNumber
              value={childCount}
              min={0}
              onChange={(value) => setChildCount(Number(value))}
            />
          </View>
          <View className='guest-confirm-btn' onClick={() => setShowPopup(false)}>
            <Text className='confirm-text'>确定</Text>
          </View>
        </View>
        <SafeArea position='bottom' />
      </Popup>
    </>
  );
};

// 整合的粘性栏组件
interface BookingStickyBarProps {
  externalRoomCount?: number;
  onNightsChange?: (nights: number) => void;
}

export default function BookingStickyBar({ externalRoomCount, onNightsChange }: BookingStickyBarProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const STICKY_THRESHOLD = 160;

  useEffect(() => {
    const onScroll = (res: PageScrollObject) => {
      const currentScrollTop = res.scrollTop || 0;
      setScrollTop(currentScrollTop);
    };
    Taro.eventCenter.on('pageScroll', onScroll);
    const instance = Taro.getCurrentInstance();
    const originalOnPageScroll = instance?.page?.onPageScroll;
    if (instance?.page) {
      instance.page.onPageScroll = onScroll;
    }
    return () => {
      Taro.eventCenter.off('pageScroll', onScroll);
      if (instance?.page) {
        instance.page.onPageScroll = originalOnPageScroll;
      }
    };
  }, []);

  const stickyBarStyle: CSSProperties = {
    position: scrollTop >= STICKY_THRESHOLD ? 'fixed' : 'relative',
    top: scrollTop >= STICKY_THRESHOLD ? `${STICKY_THRESHOLD-120}px` : 'auto',
    width: '100%',
    zIndex: 100,
  };

  return (
    <View className='booking-sticky-bar' style={stickyBarStyle}>
      <View className='sticky-content'>
        <DateSelector onNightsChange={onNightsChange} />
        <View className='divider' />
        <GuestSelector externalRoomCount={externalRoomCount} />
      </View>
    </View>
  );
};