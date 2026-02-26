import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import dayjs from 'dayjs';
import '../../styles/HotelSearch.scss';

interface SimpleCalendarProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (dates: string[]) => void;
  defaultValue?: string[];
  startDate?: string;
  monthCount?: number;
}

// 生成日历数据
const generateCalendarData = (startDate: string, monthCount: number = 12) => {
  const start = dayjs(startDate).startOf('month');
  const months: { month: string; days: any[] }[] = [];
  let current = start;
  for (let i = 0; i < monthCount; i++) {
    const monthStr = current.format('YYYY年MM月');
    const daysInMonth = current.daysInMonth();
    const firstDayWeek = current.day();
    const days = [];
    for (let i = 0; i < firstDayWeek; i++) {
      days.push({ type: 'empty' });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = current.date(d).format('YYYY-MM-DD');
      const isToday = dateStr === dayjs().format('YYYY-MM-DD');
      days.push({
        type: 'day',
        date: dateStr,
        day: d,
        isToday,
        isWeekend: current.date(d).day() === 0 || current.date(d).day() === 6
      });
    }
    months.push({ month: monthStr, days });
    current = current.add(1, 'month');
  }
  return months;
};

export default function Calendar({visible, onClose, onConfirm, defaultValue = [], startDate = dayjs().format('YYYY-MM-DD'), monthCount = 12}: SimpleCalendarProps) {
  const [selectedRange, setSelectedRange] = useState<string[]>([]);
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  // 关键：标记是否是用户手动选择的，而不是初始化的
  const isUserSelectedRef = useRef(false);
  // 标记组件是否刚挂载
  const isInitialMount = useRef(true);
  const calendarData = useMemo(() => 
    generateCalendarData(startDate, monthCount), 
    [startDate, monthCount]
  );

  // 当 visible 变化时重置状态
  useEffect(() => {
    if (visible) {
      // 打开时设置默认值，但不触发自动确认
      setSelectedRange(defaultValue.length === 2 ? defaultValue : []);
      isUserSelectedRef.current = false;
      isInitialMount.current = true;
    }
  }, [visible, defaultValue]);

  // 监听完成选择，自动确认
  useEffect(() => {
    // 首次挂载时不触发（避免读取 defaultValue 时触发）
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    // 只有用户手动选择后才自动确认
    if (isUserSelectedRef.current && selectedRange.length === 2) {
      const timer = setTimeout(() => {
        onConfirm(selectedRange);
        onClose();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedRange, onConfirm, onClose]);

  const isInRange = useCallback((date: string) => {
    if (selectedRange.length === 2) {
      const [start, end] = selectedRange;
      return dayjs(date).isAfter(start) && dayjs(date).isBefore(end);
    }
    if (selectedRange.length === 1 && hoverDate) {
      const start = selectedRange[0];
      const end = hoverDate;
      if (dayjs(end).isAfter(start)) {
        return dayjs(date).isAfter(start) && dayjs(date).isBefore(end);
      }
    }
    return false;
  }, [selectedRange, hoverDate]);

  const isSelected = useCallback((date: string) => {
    if (selectedRange.length === 0) return false;
    if (selectedRange.length === 1) return date === selectedRange[0];
    return date === selectedRange[0] || date === selectedRange[1];
  }, [selectedRange]);

  const isDisabled = useCallback((date: string) => {
    return dayjs(date).isBefore(dayjs().format('YYYY-MM-DD'), 'day');
  }, []);

  const handleDayClick = (date: string) => {
    if (isDisabled(date)) return;
    // 标记为用户手动选择
    isUserSelectedRef.current = true;
    if (selectedRange.length === 0 || selectedRange.length === 2) {
      setSelectedRange([date]);
    } else if (selectedRange.length === 1) {
      const start = selectedRange[0];
      if (dayjs(date).isBefore(start)) {
        setSelectedRange([date]);
      } else if (date === start) {
        setSelectedRange([]);
      } else {
        setSelectedRange([start, date]);
      }
    }
  };

  if (!visible) return null;
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <View className='simple-calendar-overlay' onClick={onClose}>
      <View className='simple-calendar' onClick={(e) => e.stopPropagation()}>
        <View className='calendar-header'>
          <Text className='calendar-title'>选择日期</Text>
          <View className='calendar-close' onClick={onClose}>
            <Text className='calendar-close-icon'>×</Text>
          </View>
        </View>
        <View className='calendar-weekdays'>
          {weekDays.map(day => (
            <Text key={day} className={`weekday ${day === '日' || day === '六' ? 'weekend' : ''}`}>
              {day}
            </Text>
          ))}
        </View>

        <ScrollView 
          className='calendar-scroll' 
          scrollY 
          enhanced
          showScrollbar
          scrollIntoView={selectedRange[0] ? `month-${dayjs(selectedRange[0]).format('YYYY-MM')}` : ''}
        >
          {calendarData.map(({ month, days }) => {
            const monthId = `month-${month.replace(/[年月]/g, '-')}`;
            return (
              <View key={month} className='calendar-month' id={monthId}>
                <Text className='month-title'>{month}</Text>
                <View className='month-days'>
                  {days.map((item, index) => {
                    if (item.type === 'empty') {
                      return <View key={`empty-${index}`} className='day-empty' />;
                    }
                    const selected = isSelected(item.date);
                    const inRange = isInRange(item.date);
                    const disabled = isDisabled(item.date);
                    const isStart = selectedRange[0] === item.date;
                    const isEnd = selectedRange[1] === item.date;
                    const isWeekend = item.isWeekend;

                    return (
                      <View
                        key={item.date}
                        className={`day-cell ${selected ? 'selected' : ''} ${inRange ? 'in-range' : ''} ${disabled ? 'disabled' : ''} ${item.isToday ? 'today' : ''} ${isStart ? 'range-start' : ''} ${isEnd ? 'range-end' : ''} ${isWeekend ? 'weekend' : ''}`}
                        onClick={() => handleDayClick(item.date)}
                      >
                        <Text className='day-text'>{item.day}</Text>
                        {item.isToday && !selected && <Text className='day-tag'>今天</Text>}
                        {isStart && <Text className='range-tag'>入住</Text>}
                        {isEnd && <Text className='range-tag'>离店</Text>}
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};