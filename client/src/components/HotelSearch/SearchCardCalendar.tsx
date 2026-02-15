import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import dayjs from 'dayjs'
import '../../styles/HotelSearch.scss'

interface Props {
  visible: boolean
  startDate?: string
  endDate?: string
  onConfirm: (dates: { start: string; end: string }) => void
  onClose: () => void
  // 新增：自定义日期上下文字的回调（可选）
  getDayExtraText?: (date: string) => { top?: string; bottom?: string }
}

// 扩展日期项类型
interface DayItem {
  day: string | number
  date: string
  isToday: boolean
  disabled: boolean
  // 新增：上下文字
  topText?: string
  bottomText?: string
}

export default function Calendar({
  visible,
  startDate,
  endDate,
  onConfirm,
  onClose,
  getDayExtraText // 接收自定义文字的回调
}: Props) {
  const today = dayjs().format('YYYY-MM-DD')
  const [selecting, setSelecting] = useState<'start' | 'end'>('start')
  const [tempStart, setTempStart] = useState(startDate || today)
  const [tempEnd, setTempEnd] = useState(endDate || dayjs(today).add(1, 'day').format('YYYY-MM-DD'))

  // 生成3个月数据
  const months = useMemo(() => {
    const result = []
    for (let i = 0; i < 3; i++) {
      const month = dayjs().add(i, 'month')
      result.push({
        year: month.year(),
        month: month.month() + 1,
        days: generateDays(month, getDayExtraText) // 传入自定义文字回调
      })
    }
    return result
  }, [getDayExtraText]) // 依赖添加，确保文字更新时重新生成

  const handleDayClick = (dateStr: string, disabled: boolean) => {
    if (disabled) return

    if (selecting === 'start') {
      setTempStart(dateStr)
      setSelecting('end')
      if (dayjs(dateStr).isAfter(tempEnd)) {
        setTempEnd(dayjs(dateStr).add(1, 'day').format('YYYY-MM-DD'))
      }
    } else {
      if (dayjs(dateStr).isBefore(tempStart)) {
        setTempStart(dateStr)
        setSelecting('end')
      } else {
        setTempEnd(dateStr)
        // 注释：原逻辑点击结束日期直接确认，如需保留手动确认可注释这行
        onConfirm({ start: tempStart, end: dateStr })
      }
    }
  }

  const getDayClass = (date: string, isToday: boolean, isDisabled: boolean) => {
    const classes = ['day']
    if (isDisabled) classes.push('disabled')
    if (isToday) classes.push('today')
    if (date === tempStart) classes.push('start')
    if (date === tempEnd) classes.push('end')
    if (dayjs(date).isAfter(tempStart) && dayjs(date).isBefore(tempEnd)) {
      classes.push('between')
    }
    return classes.join(' ')
  }

  if (!visible) return null

  return (
    <View className='calendar-popup'>
      {/* 修复：mask 层占满全屏，避免遮挡滚动 */}
      <View className='mask' onClick={onClose} />
      <View className='content'>
        <View className='header'>
          <Text className='title'>选择日期</Text>
          <View className='selected'>
            <View className='date-box'>
              <Text className='label'>入住</Text>
              <Text className={selecting === 'start' ? 'date active' : 'date'}>
                {dayjs(tempStart).format('M月D日')}
              </Text>
            </View>
            <View className='nights'>
              <Text>{dayjs(tempEnd).diff(dayjs(tempStart), 'day')}晚</Text>
            </View>
            <View className='date-box'>
              <Text className='label'>离店</Text>
              <Text className={selecting === 'end' ? 'date active' : 'date'}>
                {dayjs(tempEnd).format('M月D日')}
              </Text>
            </View>
          </View>
        </View>

        {/* 修复滑动：增加高度、滚动属性，确保可滚动 */}
        <ScrollView 
          className='body' 
          scrollY 
          scrollWithAnimation // 平滑滚动
          showsVerticalScrollIndicator={false} // 隐藏滚动条（可选）
          style={{ height: '500px' }} // 关键：固定滚动区域高度
        >
          {months.map(m => (
            <View key={`${m.year}-${m.month}`} className='month'>
              <Text className='month-title'>{m.year}年{m.month}月</Text>
              <View className='weekdays'>
                {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                  <Text key={d} className='weekday'>{d}</Text>
                ))}
              </View>
              <View className='days'>
                {m.days.map((day: DayItem, idx) => (
                  <View
                    key={idx}
                    className={getDayClass(day.date, day.isToday, day.disabled)}
                    onClick={() => handleDayClick(day.date, day.disabled)}
                  >
                    {/* 新增：日期上方文字 */}
                    {day.topText && <Text className='day-top-text'>{day.topText}</Text>}
                    {/* 原有日期数字 */}
                    <Text className='num'>{day.day}</Text>
                    {/* 原有今日标签 */}
                    {day.isToday && <Text className='tag'>今天</Text>}
                    {/* 新增：日期下方文字 */}
                    {day.bottomText && <Text className='day-bottom-text'>{day.bottomText}</Text>}
                  </View>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>

        <View className='footer'>
          <View className='btn-clear' onClick={() => setSelecting('start')}>
            <Text>重新选择</Text>
          </View>
          <View 
            className='btn-confirm' 
            onClick={() => onConfirm({ start: tempStart, end: tempEnd })}
          >
            <Text>确定</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

// 修改：生成月份天数，支持自定义上下文字
function generateDays(month: dayjs.Dayjs, getDayExtraText?: Props['getDayExtraText']): DayItem[] {
  const days: DayItem[] = []
  const startOfMonth = month.startOf('month')
  const endOfMonth = month.endOf('month')
  const startWeekday = startOfMonth.day()

  // 前置空白
  for (let i = 0; i < startWeekday; i++) {
    days.push({ day: '', date: '', isToday: false, disabled: true })
  }

  // 日期
  const today = dayjs().format('YYYY-MM-DD')
  for (let i = 1; i <= endOfMonth.date(); i++) {
    const date = startOfMonth.date(i).format('YYYY-MM-DD')
    // 获取自定义上下文字
    const extraText = getDayExtraText?.(date) || {}
    days.push({
      day: i,
      date,
      isToday: date === today,
      disabled: dayjs(date).isBefore(today, 'day'),
      topText: extraText.top,
      bottomText: extraText.bottom
    })
  }

  return days
}