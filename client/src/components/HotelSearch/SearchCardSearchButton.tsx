import { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import '../../styles/HotelSearch.scss'

export default function SearchCardSearchButton() {
  // 搜索
  const handleSearch = () => {
    Taro.navigateTo({
      url: '/pages/HotelList/index'
    })
  }

  return (
    <View className='search-row'>
      <View className='search-btn' onClick={handleSearch}>
        <Text>查询</Text>
      </View>
    </View>
  )
};