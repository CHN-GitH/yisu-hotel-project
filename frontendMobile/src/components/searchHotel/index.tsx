import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, Input, ScrollView } from '@tarojs/components'
import { Cell, Calendar, CalendarCard } from '@nutui/nutui-react-taro';
import { setDate } from '../../store/slices/searchSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from 'src/store';
import dayjs from 'dayjs'
// import './index.scss'

// 类型封装
const useAppDispatch = useDispatch.withTypes<AppDispatch>()
const useAppSelector = useSelector.withTypes<RootState>()

export default function SearchHotelCalendar() {
  const [showCalendar, setShowCalendar] = useState(false)
  const dispatch = useAppDispatch()
  const { checkInDate, checkOutDate, nights } = useAppSelector(state => state.search)
  // 获取星期
  const getWeekDay = (date: string) => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return days[dayjs(date).day()]
  }

  // 打开日历
  const handleDateClick = () => {
    setShowCalendar(true)
  }
  // 确认日期
  const handleDateConfirm = (dates: {start: string, end: string}) => {
    dispatch(setDate({ checkInDate: dates.start, checkOutDate: dates.end }))
    setShowCalendar(false)
  }

  return (
    <View>
      <View className='search-row' onClick={handleDateClick}>
        <View className='row-left'>
          <Calendar color='#1989fa' />
          <Text className='label'>入住时间</Text>
        </View>
        <View className='row-right'>
          <Text className='date-value'>
            <Text className='date'>{dayjs(checkInDate).format('M月D日')}</Text>
            <Text className='week'>{getWeekDay(checkInDate)}</Text>
            <Text className='separator'>至</Text>
            <Text className='date'>{dayjs(checkOutDate).format('M月D日')}</Text>
            <Text className='week'>{getWeekDay(checkOutDate)}</Text>
            <Text className='nights'>共{nights}晚</Text>
          </Text>
        </View>
      </View>
      {!!showCalendar && <CalendarCard
        type='range'
      />}
    </View>
  )
}