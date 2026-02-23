import React, { useState, useMemo } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setDates } from '../../store/slices/searchSlice'
import { Calendar } from '@nutui/nutui-react-taro'
import dayjs from 'dayjs'
import '../../styles/HotelSearch.scss'

export default function SearchCardTime() {
  const dispatch = useAppDispatch()
  const { checkIn } = useAppSelector(state => state.search)
  const [showCalendar, setShowCalendar] = useState(false)
  // 单个日期，使用数组包裹以兼容Calendar组件
  const dateValue = checkIn ? [checkIn] : []
  // 判断是否需要显示凌晨入住提示
  const showEarlyMorningTip = useMemo(() => {
    const now = dayjs()
    const currentHour = now.hour()
    const isEarlyMorning = currentHour >= 0 && currentHour < 6
    const isCheckInToday = checkIn && dayjs(checkIn).isSame(now, 'day')
    return isEarlyMorning && isCheckInToday
  }, [checkIn])

  // 确认日历 - 只选择单个日期
  const handleDateConfirm = (param: any) => {
    console.log('Calendar confirm param:', param)
    let selectedDate: string
    if (Array.isArray(param)) {
      if (param.length === 0) {
        console.error('No date selected')
        return
      }
      // 取第一个选中的日期
      const firstItem = param[0]
      if (Array.isArray(firstItem)) {
        // 格式: [[2024, 2, 16]]
        selectedDate = dayjs(`${firstItem[0]}-${firstItem[1]}-${firstItem[2]}`).format('YYYY-MM-DD')
      } else if (typeof firstItem === 'string') {
        selectedDate = firstItem
      } else if (firstItem instanceof Date) {
        selectedDate = dayjs(firstItem).format('YYYY-MM-DD')
      } else {
        selectedDate = firstItem?.value || firstItem?.date || dayjs(firstItem).format('YYYY-MM-DD')
      }
    } else if (typeof param === 'object' && param !== null) {
      selectedDate = param.date || param.value || param.startDate
    } else if (typeof param === 'string') {
      selectedDate = param
    } else {
      console.error('Unexpected param format:', param)
      return
    }
    // 验证日期有效性
    if (!selectedDate || !dayjs(selectedDate).isValid()) {
      console.error('Invalid date:', selectedDate)
      Taro.showToast({ title: '日期选择失败', icon: 'none' })
      return
    }
    // 更新redux中的日期（只设置checkIn，checkOut设为或同一天）
    dispatch(setDates({ 
      checkIn: selectedDate, 
      checkOut: selectedDate,
      nights: 0  // 单日选择，0晚
    }))
    setShowCalendar(false)
  }

  // 获取星期几
  const getWeekDay = (date: string) => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return days[dayjs(date).day()]
  }
  // 安全格式化日期显示
  const formatDisplayDate = (date: string) => {
    if (!date || !dayjs(date).isValid()) return '--'
    return dayjs(date).format('MM月DD日')
  }
  // 获取显示文本
  const getDisplayText = () => {
    if (!checkIn || !dayjs(checkIn).isValid()) return '选择日期'
    if (dayjs(checkIn).isSame(dayjs(), 'day')) return '今天'
    if (dayjs(checkIn).isSame(dayjs().add(1, 'day'), 'day')) return '明天'
    return getWeekDay(checkIn)
  }

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
          <Text className='search-time-week'>{getDisplayText()}</Text>
          <Text className='search-time-separator' style={{ opacity: 0 }}>-</Text>
          <Text className='search-time-date' style={{ opacity: 0 }}>--</Text>
          <Text className='search-time-week' style={{ opacity: 0 }}>--</Text>
          <Text className='search-time-nights' style={{ opacity: 0 }}>共0晚</Text>
        </View>
      </View>

      <Calendar
        title='选择日期'
        visible={showCalendar}
        defaultValue={dateValue}
        type="single"
        startDate={dayjs().format('YYYY-MM-DD')}
        endDate={dayjs().add(3, 'month').format('YYYY-MM-DD')}
        showToday={true}
        autoBackfill={true}
        onClose={() => setShowCalendar(false)}
        onConfirm={handleDateConfirm}
      />
    </>
  )
}