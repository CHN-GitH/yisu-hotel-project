import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input, ScrollView } from '@tarojs/components'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setCity, setDates, setKeyword } from '../../store/slices/searchSlice'
import Calendar from '../Calendar'
import { QUICK_TAGS } from '../../config/constants'
import dayjs from 'dayjs'
import '../../styles/HotelSearch.scss'

export default function SearchCard() {
  const dispatch = useAppDispatch()
  const { city, checkIn, checkOut, nights } = useAppSelector(state => state.search)
  const [showCalendar, setShowCalendar] = useState(false)
  const [keyword, setLocalKeyword] = useState('')

  const handleCityClick = () => {
    // 简化处理，实际可跳转到城市选择页
    const cities = ['上海', '北京', '广州', '深圳', '杭州', '成都']
    Taro.showActionSheet({
      itemList: cities,
      success: (res) => {
        dispatch(setCity(cities[res.tapIndex]))
      }
    })
  }

  const handleLocate = () => {
    Taro.getLocation({
      type: 'gcj02',
      success: () => {
        Taro.showToast({ title: '定位成功', icon: 'success' })
      },
      fail: () => {
        Taro.showToast({ title: '定位失败', icon: 'none' })
      }
    })
  }

  const handleDateConfirm = (dates: { start: string; end: string }) => {
    dispatch(setDates({ checkIn: dates.start, checkOut: dates.end }))
    setShowCalendar(false)
  }

  const handleSearch = () => {
    dispatch(setKeyword(keyword))
    Taro.navigateTo({ url: '/pages/HotelList/index' })
  }

  const handleTagClick = (tag: string) => {
    dispatch(setKeyword(tag))
    Taro.navigateTo({ url: '/pages/HotelList/index' })
  }

  const getWeekDay = (date: string) => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return days[dayjs(date).day()]
  }

  return (
    <View className='index-page'>
      <View className='search-card'>
        {/* 目的地 */}
        <View className='search-row' onClick={handleCityClick}>
          <View className='row-right'>
            <Text className='value'>{city}</Text>
            <Input
              className='keyword-input'
              placeholder='位置/品牌/酒店'
              value={keyword}
              onInput={(e) => setLocalKeyword(e.detail.value)}
            />
            <Text className='action' onClick={(e) => { e.stopPropagation(); handleLocate() }}>
              定位
            </Text>
          </View>
        </View>

        {/* 日期 */}
        <View className='search-row' onClick={() => setShowCalendar(true)}>
          <View className='row-right'>
            <View className='date-range'>
              <Text className='date'>{dayjs(checkIn).format('M月D日')}</Text>
              <Text className='week'>{getWeekDay(checkIn)}</Text>
              <Text className='separator'>至</Text>
              <Text className='date'>{dayjs(checkOut).format('M月D日')}</Text>
              <Text className='week'>{getWeekDay(checkOut)}</Text>
              <Text className='nights'>共{nights}晚</Text>
            </View>
          </View>
        </View>

        {/* 关键词 */}
        <View className='search-row'>
          <View className='row-left'>
            <Text className='icon'>🔍</Text>
            <Text className='label'>关键词</Text>
          </View>
          
        </View>

        {/* 搜索按钮 */}
        <View className='search-btn' onClick={handleSearch}>
          <Text>查询酒店</Text>
        </View>
      </View>

      {/* 快捷标签 */}
      <View className='quick-tags'>
        <Text className='section-title'>快捷筛选</Text>
        <ScrollView className='tags-scroll' scrollX>
          {QUICK_TAGS.map(tag => (
            <View key={tag} className='tag' onClick={() => handleTagClick(tag)}>
              {tag}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 日历弹窗 */}
      <Calendar
        visible={showCalendar}
        startDate={checkIn}
        endDate={checkOut}
        onConfirm={handleDateConfirm}
        onClose={() => setShowCalendar(false)}
      />
    </View>
  )
}