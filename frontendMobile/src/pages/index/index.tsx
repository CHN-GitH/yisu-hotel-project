import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import SearchBanner from '../../components/SearchBanner'
import SearchCard from '../../components/SearchCard'
import '../../styles/index.scss'

export default function Index() {
  return (
    <View className='index-page'>
      {/* Banner */}
      <SearchBanner />
      {/* 搜索卡片 */}
      <SearchCard />
    </View>
  )
}