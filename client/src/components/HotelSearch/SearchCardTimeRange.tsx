import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setDates } from '../../store/slices/searchSlice'
import Calendar from './SearchCardCalendar'
import dayjs from 'dayjs'
import '../../styles/HotelSearch.scss'

export default function SearchCard() {
  const dispatch = useAppDispatch()
  const { checkIn, checkOut, nights } = useAppSelector(state => state.search)
  const [showCalendar, setShowCalendar] = useState(false)

  const handleDateConfirm = (dates: { start: string; end: string }) => {
    dispatch(setDates({ checkIn: dates.start, checkOut: dates.end }))
    setShowCalendar(false)
  }

  const getWeekDay = (date: string) => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return days[dayjs(date).day()]
  }

  return (
    <>
      <View className='search-row' onClick={() => setShowCalendar(true)}>
        <View className='search-time'>
          <Text className='search-time-date'>{dayjs(checkIn).format('MM月DD日')}</Text>
          {dayjs(checkIn).isSame(dayjs(), 'day')
            ? <Text className='search-time-week'>今天</Text>
            : <Text className='search-time-week'>{getWeekDay(checkIn)}</Text>
          }
          <Text className='search-time-separator'>-</Text>
          <Text className='search-time-date'>{dayjs(checkOut).format('MM月DD日')}</Text>
          {dayjs(checkOut).isSame(dayjs().add(1, 'day'), 'day')
            ? <Text className='search-time-week'>明天</Text>
            : <Text className='search-time-week'>{getWeekDay(checkOut)}</Text>
          }
          <Text className='search-time-nights'>共{nights}晚</Text>
        </View>
      </View>
      {/* 日历弹窗 */}
      <Calendar
        visible={showCalendar}
        startDate={checkIn}
        endDate={checkOut}
        onConfirm={handleDateConfirm}
        onClose={() => setShowCalendar(false)}
      />
    </>
  )
}