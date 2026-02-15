import { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import dayjs from 'dayjs'
import './index.scss'

interface Props {
  visible: boolean
  startDate?: string
  endDate?: string
  onConfirm: (dates: { start: string; end: string }) => void
  onClose: () => void
}

export default function Calendar({
  visible,
  startDate,
  endDate,
  onConfirm,
  onClose
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
        days: generateDays(month)
      })
    }
    return result
  }, [])

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

        <ScrollView className='body' scrollY>
          {months.map(m => (
            <View key={`${m.year}-${m.month}`} className='month'>
              <Text className='month-title'>{m.year}年{m.month}月</Text>
              <View className='weekdays'>
                {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                  <Text key={d} className='weekday'>{d}</Text>
                ))}
              </View>
              <View className='days'>
                {m.days.map((day, idx) => (
                  <View
                    key={idx}
                    className={getDayClass(day.date, day.isToday, day.disabled)}
                    onClick={() => handleDayClick(day.date, day.disabled)}
                  >
                    <Text className='num'>{day.day}</Text>
                    {day.isToday && <Text className='tag'>今天</Text>}
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
          <View className='btn-confirm' onClick={() => onConfirm({ start: tempStart, end: tempEnd })}>
            <Text>确定</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

// 生成月份天数
function generateDays(month: dayjs.Dayjs) {
  const days = []
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
    days.push({
      day: i,
      date,
      isToday: date === today,
      disabled: dayjs(date).isBefore(today, 'day')
    })
  }

  return days
}