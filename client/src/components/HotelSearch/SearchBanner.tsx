// src\components\HotelSearch\SearchBanner.tsx
// 酒店查询页 - Banner
import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import bannerData from '../../assets/HotelSearchBanner.json'
import '../../styles/HotelSearch.scss'

interface BannerItem {
  houseid: number
  housename: string
  housepic: string
}

export default function SearchBanner() {
  const handleBannerClick = (houseid: number) => {
    Taro.navigateTo({
      url: `/pages/HotelDetail/index?id=${houseid}`
    })
  }

  return (
    <Swiper
      className='banner'
      autoplay={true}
      interval={3000}
      duration={100}
      circular={true}
    >
      {bannerData.banner.map((item: BannerItem) => (
        <SwiperItem key={item.houseid}>
          <View 
            className='banner-item'
            onClick={() => handleBannerClick(item.houseid)}
          >
            <Image
              src={item.housepic.trim()}
              mode='aspectFill'
              className='banner-img'
            />
            <Text className='banner-text'>资质说明</Text>
          </View>
        </SwiperItem>
      ))}
    </Swiper>
  )
}