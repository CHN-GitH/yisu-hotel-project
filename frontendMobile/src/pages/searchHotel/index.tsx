import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, Input, ScrollView } from '@tarojs/components'
import SearchHotelCalendar from '../../components/searchHotel'
import dayjs from 'dayjs'
import './index.scss'

// 热门标签
const HOT_TAGS = ['免费停车场', '上海浦东国际机场', '上海虹桥国际机场']

// 获取星期
function getWeekDay(date: string) {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return days[dayjs(date).day()]
}

function Index() {
  return (
    <View className='index-page'>
      <SearchHotelCalendar />
    </View>
  )
}

export default Index