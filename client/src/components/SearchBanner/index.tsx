// 酒店查询页 - Banner
import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import '../../styles/HotelSearch.scss'

export default function SearchBanner() {
  return (
    <Swiper
        className='banner'
        autoplay={true}
        interval={3000}
        duration={100}
        circular={true}
      >
        <SwiperItem>
          <>
            <Image
              src='https://picsum.photos/750/300?random=1' 
              mode='aspectFill'
              className='banner-img'
            />
            <View className='banner-text banner-text-title'>
              <Text>酒店</Text>
              <Text className='banner-text-red'>7折</Text>
              <Text>起</Text>
            </View>
            <Text className='banner-text banner-text-left'>资质说明</Text>
            <Text className='banner-text banner-text-right'>宠物友好酒店</Text>
          </>
        </SwiperItem>
        <SwiperItem>
          <>
            <Image
              src='https://picsum.photos/750/300?random=2' 
              mode='aspectFill'
              className='banner-img'
            />
            <View className='banner-text banner-text-title'>
              <Text className='banner-text-orange'>住宿</Text>
              <Text className='banner-text-red'>不要钱</Text>
            </View>
            <Text className='banner-text banner-text-left'>资质说明</Text>
          </>
        </SwiperItem>
        <SwiperItem>
          <>
            <Image
              src='https://picsum.photos/750/300?random=3'
              mode='aspectFill'
              className='banner-img'
            />
            <Text className='banner-text banner-text-left'>资质说明</Text>
          </>
        </SwiperItem>
        <SwiperItem>
          <>
            <Image
              src='https://picsum.photos/750/300?random=4'
              mode='aspectFill'
              className='banner-img'
            />
            <Text className='banner-text banner-text-left'>资质说明</Text>
          </>
        </SwiperItem>
    </Swiper>
  )
}