import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import { TriangleDown, Location } from '@nutui/icons-react-taro'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setCity } from '../../store/slices/searchSlice'
import '../../styles/HotelSearch.scss'

export default function SearchCardChineseCity() {
  const dispatch = useAppDispatch()
  const { city } = useAppSelector(state => state.search)
  // const [keyword, setLocalKeyword] = useState('')

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

  return (
    <>
      <View className='search-row'>
        <Text className='search-city' onClick={handleCityClick}>
          {city}
          <TriangleDown size={15} style={{ marginLeft: '0.25rem' }} />
        </Text>
        <Input
          className='search-city-input'
          placeholder=' 位置/品牌/酒店'
          onClick={handleCityClick}
          // value={keyword}
          // onInput={(e) => setLocalKeyword(e.detail.value)}
        />
        <Location className='search-city-location' onClick={(e) => { e.stopPropagation(); handleLocate() }} />
      </View>
    </>
  )
}