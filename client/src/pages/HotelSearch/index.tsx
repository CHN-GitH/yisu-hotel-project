import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import SearchBanner from '../../components/SearchBanner'
import SearchCard from '../../components/SearchCard'
import '../../styles/HotelSearch.scss'

export default function HotelSearch() {
  return (
    <View className='index-page'>
      {/* Banner */}
      <SearchBanner />
      {/* 搜索卡片 */}
      <SearchCard />
    </View>
  )
}