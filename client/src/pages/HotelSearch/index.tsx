import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import SearchBanner from '../../components/HotelSearch/SearchBanner'
import SearchCardTabbar from '../../components/HotelSearch/SearchCardTabbar'
import '../../styles/HotelSearch.scss'

export default function HotelSearch() {
  return (
    <View className='index-page'>
      {/* Banner */}
      <SearchBanner />
      {/* 搜索卡片 */}
      <SearchCardTabbar />
    </View>
  )
}